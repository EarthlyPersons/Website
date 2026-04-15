# Healing Practice AI Instructions (VS Code)

This repository builds a trauma-sensitive psychotherapeutic counselling website.
Every word, every pixel, and every interaction should feel safe, warm, and calm.

## Non-negotiables

- Use modular TypeScript components; avoid `any` and avoid long monolithic files.
- Keep Tailwind styling within approved palette tokens:
  `emerald`, `sage`, `mint`, `lavender`, `calm-blue`, `cream`, `grey-soft`, `grey-deep`.
- No red alert styling in UX copy or component design.
- Write first-person practitioner voice ("I") and client-centered voice ("you").
- CTA language must be gentle ("Take the next step", "Reach out today", "I'm ready to reach out").
- Do not use `dangerouslySetInnerHTML`.
- Client does not access Firestore directly; data flows through Worker API.
- Validate form input with Zod on both client and server.
- Crisis footer is mandatory on all routes, including 404.
- Deployment target is Cloudflare Workers for frontend and backend (no Pages deploy flow).

## Security and platform

- Frontend and backend are both Cloudflare Workers.
- Frontend Worker is responsible for response security headers.
- API errors must be user-safe (no stack traces in responses).
- Firestore writes are server-side only; public Firestore writes must remain denied.
