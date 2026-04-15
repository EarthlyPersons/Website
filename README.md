# Healing Practice - Counselling Website

A trauma-sensitive, LGBTQ+ affirming counselling website built with React, Vite, TypeScript, and Cloudflare.

## Tech Stack

- **Frontend**: React 18 + Vite 5 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Cloudflare Workers + Hono.js
- **Database**: Firestore
- **Deployment**: Cloudflare Pages + Workers

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```
   This runs both client (http://localhost:5173) and server concurrently.

3. **Or run individually**:
   ```bash
   npm run dev:client  # Client only
   npm run dev:server  # Server only
   ```

## Project Structure

```
/
├── client/          # React frontend
├── server/          # Cloudflare Workers API
├── shared/          # Shared types
├── .github/         # CI/CD workflows
└── .cursor/         # AI assistant rules
```

## Scripts

- `npm run build` - Build all workspaces
- `npm run lint` - Lint all code
- `npm run typecheck` - Type check all code
- `npm run test` - Run tests
- `npm run deploy` - Deploy to production

## Features

- Responsive design with Tailwind CSS
- Trauma-sensitive copy and design
- Crisis footer with emergency contacts
- Contact form with honeypot protection
- Rate limiting and input sanitization
- SEO optimized with proper meta tags

## Security

- CSP headers configured
- Honeypot field for spam prevention
- Rate limiting on API
- Input validation with Zod
- No client-side Firestore access

## Deployment

Deploy to Cloudflare Pages and Workers using the provided GitHub Actions workflows.

Set the following secrets in your repository:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- Firebase and Resend API keys for the Worker