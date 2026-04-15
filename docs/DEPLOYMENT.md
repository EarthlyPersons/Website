# Deployment Runbook

## Production

- `npm run deploy:frontend`
- `npm run deploy:backend`
- or `npm run deploy`

## Staging

- `npm run deploy:frontend:staging`
- `npm run deploy:backend:staging`
- or `npm run deploy:staging`

## Required GitHub secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `PRODUCTION_API_URL` (full `https://…` API Worker URL; passed as `VITE_API_URL` during `scripts/deploy.mjs`)

Local deploys can use the same values in `.env.deploy` (see `.env.deploy.example` in the repo root).

## Required Worker secrets (backend)

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `RESEND_API_KEY`
- `ADMIN_NOTIFICATION_EMAIL`
- `RESEND_FROM` (optional)
