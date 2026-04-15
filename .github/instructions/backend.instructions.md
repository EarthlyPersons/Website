---
applyTo: 'server/src/**/*.ts'
---

# Backend Instructions

- Validate `/api/enquiry` input with Zod before processing.
- Keep responses safe for users (no stack traces or raw internal errors).
- Enforce rate limiting and sanitize persisted strings.
- Persist enquiry data server-side only; never expose Firestore write paths publicly.
- Maintain strict CORS allowlist behavior for production + localhost development.
- Keep Cloudflare Worker bindings typed and avoid secret leakage.
