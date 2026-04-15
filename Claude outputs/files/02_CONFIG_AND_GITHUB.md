# ============================================================
# FILE: package.json  (ROOT — monorepo workspace)
# ============================================================

```json
{
  "name": "practice-name-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "client",
    "server",
    "shared"
  ],
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build:shared && npm run build:client && npm run build:server",
    "build:shared": "npm run build --workspace=shared",
    "build:client": "npm run build --workspace=client",
    "build:server": "npm run build --workspace=server",
    "lint": "npm run lint --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:e2e": "playwright test",
    "format": "prettier --write \"**/*.{ts,tsx,json,md,css}\" --ignore-path .gitignore",
    "prepare": "husky",

    "deploy": "npm run deploy:client && npm run deploy:worker",
    "deploy:client": "npm run build:client && wrangler pages deploy client/dist --project-name=practice-name-client --branch=main",
    "deploy:worker": "npm run build:server && wrangler deploy --config server/wrangler.toml --env production",

    "deploy:staging": "npm run deploy:client:staging && npm run deploy:worker:staging",
    "deploy:client:staging": "npm run build:client && wrangler pages deploy client/dist --project-name=practice-name-client --branch=staging",
    "deploy:worker:staging": "npm run build:server && wrangler deploy --config server/wrangler.toml --env staging",

    "preview:client": "npm run preview --workspace=client",
    "wrangler:tail": "wrangler tail --config server/wrangler.toml --env production",
    "wrangler:secret:set": "wrangler secret put --config server/wrangler.toml",
    "wrangler:kv:list": "wrangler kv namespace list --config server/wrangler.toml"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "concurrently": "^9.0.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0",
    "prettier": "^3.3.0",
    "wrangler": "^3.78.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

---

# ============================================================
# FILE: client/vite.config.ts
# ============================================================

```ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,         // No sourcemaps in production build
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
          },
        },
      },
    },
    // Prevent Vite from exposing env vars not prefixed VITE_
    envPrefix: 'VITE_',
  }
})
```

---

# ============================================================
# FILE: client/tailwind.config.ts
# ============================================================

```ts
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: false,
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand — Nature-Calming Palette
        emerald:      '#2F6F4F',
        sage:         '#8FAF97',
        mint:         '#C7D9CC',
        // Spiritual Accents
        lavender:     '#B7A8CC',
        'calm-blue':  '#7FA7C6',
        // Neutrals
        cream:        '#F7F5F2',
        'grey-soft':  '#6D6D6D',
        'grey-deep':  '#3F4448',
      },
      fontFamily: {
        display: ['Playfair Display', ...fontFamily.serif],
        body:    ['DM Sans', ...fontFamily.sans],
        quote:   ['Cormorant Garamond', ...fontFamily.serif],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      typography: (theme: (arg: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.grey-deep'),
            'h1,h2,h3,h4': {
              fontFamily: 'Playfair Display, serif',
              color: theme('colors.grey-deep'),
            },
            a: {
              color: theme('colors.emerald'),
              '&:hover': { color: theme('colors.sage') },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
```

---

# ============================================================
# FILE: client/tsconfig.json
# ============================================================

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

# ============================================================
# FILE: server/tsconfig.json
# ============================================================

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "types": ["@cloudflare/workers-types"],
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

# ============================================================
# FILE: .eslintrc.cjs  (root)
# ============================================================

```js
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./client/tsconfig.json', './server/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'jsx-a11y'],
  rules: {
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-script-url': 'error',

    // TypeScript discipline
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // React
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/img-redundant-alt': 'error',

    // Forbidden patterns
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}
```

---

# ============================================================
# FILE: .prettierrc
# ============================================================

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

# ============================================================
# FILE: .gitignore
# ============================================================

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.output/

# Environment files — NEVER commit these
.env
.env.local
.env.*.local
.dev.vars         # Wrangler local secrets

# Cloudflare / Wrangler
.wrangler/

# Firebase
.firebase/
firebase-debug.log

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/settings.json
.idea/

# Testing
coverage/
playwright-report/
test-results/

# Logs
*.log
npm-debug.log*
```

---

# ============================================================
# FILE: .github/workflows/ci.yml
# ============================================================

```yaml
name: CI

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

jobs:
  lint-and-typecheck:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build:client
      - name: Run Playwright
        run: npm run test:e2e
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
```

---

# ============================================================
# FILE: .github/workflows/deploy-pages.yml
# ============================================================

```yaml
name: Deploy — Cloudflare Pages

on:
  push:
    branches: [main]
    paths: ['client/**', 'shared/**']

jobs:
  deploy-pages:
    name: Deploy Client to CF Pages
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:client
        env:
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy client/dist --project-name=practice-name-client --branch=main
```

---

# ============================================================
# FILE: .github/workflows/deploy-worker.yml
# ============================================================

```yaml
name: Deploy — Cloudflare Worker

on:
  push:
    branches: [main]
    paths: ['server/**', 'shared/**']

jobs:
  deploy-worker:
    name: Deploy API Worker
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:server
      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --config server/wrangler.toml --env production
```

---

# ============================================================
# FILE: .github/PULL_REQUEST_TEMPLATE.md
# ============================================================

```markdown
## What does this PR do?
<!-- Brief description of changes -->

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Content/copy update
- [ ] Security fix
- [ ] Chore / dependency update

## Checklist
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] No hardcoded hex values in component files
- [ ] No `dangerouslySetInnerHTML` added
- [ ] All new copy follows first-person empathetic voice
- [ ] `<CrisisFooter />` still renders on all routes
- [ ] Accessibility: all new interactive elements have labels
- [ ] Sensitive content reviewed for trauma-sensitive language
- [ ] `_headers` CSP updated if new external resource added

## Screenshots (if UI change)
<!-- Add before/after screenshots -->

## Notes for reviewer
<!-- Anything else the reviewer should know -->
```

---

# ============================================================
# FILE: .github/dependabot.yml
# ============================================================

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
    ignore:
      # Major version bumps require manual review
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "github-actions"
```

---

# ============================================================
# FILE: .github/CODEOWNERS
# ============================================================

```
# All files — practitioner (or lead dev) must approve PRs
* @your-github-username

# Security-sensitive files require explicit review
firestore.rules @your-github-username
client/public/_headers @your-github-username
client/public/robots.txt @your-github-username
server/src/middleware/ @your-github-username
```
