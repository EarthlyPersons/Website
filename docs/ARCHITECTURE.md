# Architecture

## Monorepo structure

- `client/` - React app, built and served by frontend Worker assets binding
- `server/` - Hono API Worker for `/api/*`
- `shared/` - shared types/interfaces

## Runtime topology

- Browser -> frontend Worker (`healing-practice-web`)
- Browser -> backend Worker (`healing-practice-api`) for API routes
- Backend Worker -> Firestore + Resend APIs

## Deployment model

Both frontend and backend deploy as Cloudflare Workers.
