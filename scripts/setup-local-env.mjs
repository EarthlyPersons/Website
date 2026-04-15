import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checkMode = process.argv.includes('--check')

const mappings = [
  {
    template: resolve(rootDir, 'client/.env.example'),
    target: resolve(rootDir, 'client/.env.local'),
    required: false,
  },
  {
    template: resolve(rootDir, 'server/.dev.vars.example'),
    target: resolve(rootDir, 'server/.dev.vars'),
    required: true,
  },
]

let createdCount = 0

function parseEnvFile(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const equalsIdx = trimmed.indexOf('=')
    if (equalsIdx <= 0) continue
    const key = trimmed.slice(0, equalsIdx).trim()
    const value = trimmed.slice(equalsIdx + 1).trim()
    out[key] = value
  }
  return out
}

function isMissingEnvValue(value) {
  if (!value) return true
  const normalized = value.replace(/^['"]|['"]$/g, '').trim()
  if (!normalized) return true
  if (normalized.includes('...')) return true
  return false
}

for (const file of mappings) {
  if (!existsSync(file.template)) {
    const prefix = file.required ? 'ERROR' : 'WARN'
    console.log(`[${prefix}] Missing template: ${file.template}`)
    if (file.required) process.exitCode = 1
    continue
  }

  if (existsSync(file.target)) {
    console.log(`[SKIP] Already exists: ${file.target}`)
    continue
  }

  if (checkMode) {
    console.log(`[MISSING] ${file.target}`)
    if (file.required) process.exitCode = 1
    continue
  }

  copyFileSync(file.template, file.target)
  createdCount += 1
  console.log(`[CREATE] ${file.target}`)
}

const requiredValuesByFile = [
  {
    path: resolve(rootDir, 'server/.dev.vars'),
    keys: ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'],
  },
]

const recommendedValuesByFile = [
  {
    path: resolve(rootDir, 'server/.dev.vars'),
    keys: ['RESEND_API_KEY', 'ADMIN_NOTIFICATION_EMAIL'],
  },
]

let missingRequiredCount = 0

for (const spec of requiredValuesByFile) {
  if (!existsSync(spec.path)) continue
  const env = parseEnvFile(spec.path)
  for (const key of spec.keys) {
    if (isMissingEnvValue(env[key])) {
      missingRequiredCount += 1
      console.log(`[ERROR] Missing required value in ${spec.path}: ${key}`)
    }
  }
}

for (const spec of recommendedValuesByFile) {
  if (!existsSync(spec.path)) continue
  const env = parseEnvFile(spec.path)
  for (const key of spec.keys) {
    if (isMissingEnvValue(env[key])) {
      console.log(`[WARN] Recommended value is empty in ${spec.path}: ${key}`)
    }
  }
}

if (checkMode) {
  if (process.exitCode || missingRequiredCount > 0) {
    process.exitCode = 1
    console.log('\nLocal env check failed.')
  } else {
    console.log('\nLocal env check passed.')
  }
} else {
  if (missingRequiredCount > 0) {
    process.exitCode = 1
  }
  console.log('')
  console.log(`Setup complete. Created ${createdCount} file(s).`)
  console.log('Next step: fill in values in:')
  console.log('- client/.env.local')
  console.log('- server/.dev.vars')
}
