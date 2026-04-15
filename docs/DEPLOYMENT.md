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
- `PRODUCTION_API_URL`

## Required Worker secrets (backend)

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `RESEND_API_KEY`
- `ADMIN_NOTIFICATION_EMAIL`
- `RESEND_FROM` (optional)
