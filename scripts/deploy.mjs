/**
 * Deploy Workers for production or staging with the right client API URL and server vars.
 *
 * Usage:
 *   node scripts/deploy.mjs [production|staging] [--frontend-only|--backend-only]
 *
 * Client build needs the API origin. Provide either:
 *   - VITE_API_URL or DEPLOY_API_URL (full URL, no trailing slash), or
 *   - CLOUDFLARE_WORKERS_DEV_SUBDOMAIN (middle label from *.workers.dev, same for prod/staging)
 *
 * Sources (later overrides earlier except process.env always wins):
 *   process.env → Website/.env.deploy → allowlisted keys from server/.dev.vars
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const DEV_VARS_ALLOWLIST = new Set([
  'CLOUDFLARE_WORKERS_DEV_SUBDOMAIN',
  'VITE_API_URL',
  'DEPLOY_API_URL',
])

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  const raw = readFileSync(filePath, 'utf8')
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const equalsIdx = trimmed.indexOf('=')
    if (equalsIdx <= 0) continue
    const key = trimmed.slice(0, equalsIdx).trim()
    let value = trimmed.slice(equalsIdx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

function pickAllowlisted(source) {
  const out = {}
  for (const key of DEV_VARS_ALLOWLIST) {
    const v = source[key]
    if (v != null && String(v).trim() !== '') out[key] = String(v).trim()
  }
  return out
}

function getenv(key, fileLayers) {
  const pe = process.env[key]
  if (pe != null && String(pe).trim() !== '') return String(pe).trim()
  for (const layer of fileLayers) {
    const v = layer[key]
    if (v != null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, '')
}

function resolveApiUrl(target, fileLayers) {
  const direct = getenv('VITE_API_URL', fileLayers) || getenv('DEPLOY_API_URL', fileLayers)
  if (direct) return stripTrailingSlash(direct)

  const sub = getenv('CLOUDFLARE_WORKERS_DEV_SUBDOMAIN', fileLayers)
  if (!sub) {
    console.error(`Missing API URL for the client build.

Set one of:
  • VITE_API_URL or DEPLOY_API_URL — full base URL of the API worker (https://…, no trailing slash)
  • CLOUDFLARE_WORKERS_DEV_SUBDOMAIN — the account segment from workers.dev (e.g. in
    https://healing-practice-api.<subdomain>.workers.dev)

Put values in Website/.env.deploy (see .env.deploy.example), allowlisted keys in server/.dev.vars,
or export variables before running deploy.
`)
    process.exit(1)
  }

  const workerName =
    target === 'staging' ? 'healing-practice-api-staging' : 'healing-practice-api'
  return stripTrailingSlash(`https://${workerName}.${sub}.workers.dev`)
}

function sh(cmd, extraEnv = {}) {
  execSync(cmd, {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  })
}

const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Deploy Cloudflare Workers (frontend + backend).

Usage:
  node scripts/deploy.mjs [production|staging] [--frontend-only|--backend-only]

Default target is production. Order when deploying both: backend first, then frontend.

Client bundle (VITE_API_URL) is resolved from (highest priority first):
  process.env → .env.deploy → allowlisted entries in server/.dev.vars

Allowlisted .dev.vars keys: ${[...DEV_VARS_ALLOWLIST].join(', ')}

Wrangler secrets are not changed by this script; set them with npm run wrangler:secret:set (per env).
`)
  process.exit(0)
}

const flags = new Set(args.filter((a) => a.startsWith('--')))
const positional = args.filter((a) => !a.startsWith('--'))
const target = positional[0] === 'staging' ? 'staging' : 'production'
const wranglerEnv = target === 'staging' ? 'staging' : 'production'

const frontendOnly = flags.has('--frontend-only')
const backendOnly = flags.has('--backend-only')

if (frontendOnly && backendOnly) {
  console.error('Use at most one of --frontend-only or --backend-only.')
  process.exit(1)
}

const deployFile = parseEnvFile(resolve(rootDir, '.env.deploy'))
const devVarsLayer = pickAllowlisted(parseEnvFile(resolve(rootDir, 'server/.dev.vars')))
const fileLayers = [deployFile, devVarsLayer]

const apiUrl = !backendOnly ? resolveApiUrl(target, fileLayers) : ''

console.log(`[deploy] target=${target} wranglerEnv=${wranglerEnv}`)

if (!frontendOnly) {
  console.log('[deploy] backend: build + wrangler deploy')
  sh('npm run build:server')
  sh(`npx wrangler deploy --config server/wrangler.toml --env ${wranglerEnv}`)
}

if (!backendOnly) {
  console.log(`[deploy] frontend: build (VITE_API_URL=${apiUrl}) + wrangler deploy`)
  sh('npm run build:client', { VITE_API_URL: apiUrl })
  sh(`npx wrangler deploy --config client/wrangler.toml --env ${wranglerEnv}`)
}

console.log('[deploy] done')
