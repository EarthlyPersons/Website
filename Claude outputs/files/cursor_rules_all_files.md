# ============================================================
# FILE: .cursor/rules/01_architecture.mdc
# ============================================================
---
description: Enforces modular component architecture and TypeScript discipline
globs: ["client/src/**/*.tsx", "client/src/**/*.ts", "server/src/**/*.ts"]
alwaysApply: true
---

# Architecture Rules

## Component Boundaries
- One responsibility per component. If a component does two visual things, split it.
- Props interfaces must be explicitly typed. No inline type literals on the component signature.
- Co-locate component-specific hooks in the same directory with a `use` prefix.
- Barrel exports (`index.ts`) are allowed at the directory level for cleaner imports.

## File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts` or co-located with component
- Constants: `SCREAMING_SNAKE_CASE` for values, `camelCase.ts` for the file

## Import Order (enforced by ESLint)
1. React and React ecosystem
2. Third-party libraries
3. Internal aliases (`@/`)
4. Relative imports (`./`, `../`)
5. Type imports (last, using `import type`)

## State Management
- Component-local state: `useState`, `useReducer`
- Cross-component shared state: Zustand store in `client/src/hooks/`
- Server state / async: React Query (if added) or native `useEffect` with loading states
- No prop drilling beyond 2 levels — use context or Zustand

## Routing
- All routes defined in `client/src/App.tsx`
- Nested layouts via `<Outlet />` pattern
- Route-level code splitting via `React.lazy` + `Suspense`
- 404 fallback route always present

## Error Handling
- All async operations have try/catch
- User-facing errors show a warm, plain-language message — not stack traces
- Network errors in forms: "Something went wrong — please try again, or email me directly."

# ============================================================
# FILE: .cursor/rules/02_styling.mdc
# ============================================================
---
description: Enforces Nature-Calming colour palette and design tokens
globs: ["client/src/**/*.tsx", "client/src/**/*.css"]
alwaysApply: true
---

# Styling Rules

## Tailwind Usage
- ONLY use colour tokens from `tailwind.config.ts`. The custom palette is:
  emerald, sage, mint, lavender, calm-blue, cream, grey-soft, grey-deep
- Default Tailwind colours (slate, stone, green-500, etc.) are FORBIDDEN.
- Exception: `white`, `black`, `transparent` are allowed.

## Spacing & Layout
- Use Tailwind spacing scale consistently.
- Section padding: `py-16 md:py-24`
- Container max-width: `max-w-5xl mx-auto px-4 sm:px-6`
- Cards: `rounded-2xl` (soft corners, never sharp)
- Shadows: `shadow-sm` or `shadow-md` — never `shadow-xl` or `shadow-2xl`

## Typography Classes
- Hero headings: `font-display text-4xl md:text-6xl text-grey-deep`
- Section headings: `font-display text-2xl md:text-3xl text-grey-deep`
- Body: `font-body text-base text-grey-soft leading-relaxed`
- Quotes: `font-quote text-xl md:text-2xl italic text-emerald`
- Labels/UI: `font-body text-sm font-medium text-grey-deep`

## Buttons
- Primary CTA: `bg-emerald text-white hover:bg-emerald/90 rounded-full px-8 py-3`
- Secondary: `border border-emerald text-emerald hover:bg-mint/30 rounded-full px-8 py-3`
- Never use square buttons (`rounded-none`) — this is a warm, soft design.

## Imagery
- Hero: St Lucian Pitons or sea imagery — full-bleed with soft overlay
- Overlay pattern: `bg-gradient-to-b from-transparent to-cream/60`
- All `<img>` tags: `object-cover` with explicit `width` and `height`
- Lazy loading: `loading="lazy"` on all below-fold images

## Animation
- Use Framer Motion for page transitions and scroll reveals.
- Duration: 0.4–0.6s. Easing: `ease-out`.
- Respect `prefers-reduced-motion` — wrap animations in a check.
- Scroll reveals: fade-up (`y: 20 → 0, opacity: 0 → 1`)

## Forbidden Patterns
- No dark backgrounds on main content areas
- No red colour anywhere (trauma-sensitive — avoid alarm associations)
- No flashing or rapid animations
- No full-caps body copy (accessibility)

# ============================================================
# FILE: .cursor/rules/03_voice_and_copy.mdc
# ============================================================
---
description: Enforces first-person empathetic voice for all placeholder copy
globs: ["client/src/**/*.tsx"]
alwaysApply: true
---

# Voice & Copy Rules

## First-Person Frame
- Practitioner speaks as "I". Client addressed as "you".
- Copy must feel like a warm letter to a brave, overwhelmed person.
- Every CTA button text should feel like a gentle invitation, not a command.

## CTA Button Copy (approved list)
- "Take the next step"
- "Reach out today"
- "Book a free consultation"
- "Get in touch"
- "I'm ready to reach out"
- "Start your journey"
- FORBIDDEN: "Submit", "Click here", "Sign up", "Buy now"

## Section Headings (approved style)
- Conversational, not corporate.
- "How I can help" not "Services Offered"
- "A little about me" not "Practitioner Biography"
- "What to expect" not "Service Delivery Information"
- "Let's talk" not "Contact Us"

## Quotes Component Rules
- Source always credited: `— Author Name`
- Font: `font-quote` (Cormorant Garamond italic)
- Never paraphrase quotes. Use exact text.
- Approved quotes:
  1. "The wound is the place where the light enters you." — Rumi
  2. "You may not control all the events that happen to you, but you can decide not to be reduced by them." — Maya Angelou
  3. "Grief can be the garden of compassion. If you keep your heart open through everything, your pain can become your greatest ally in your life's search for love and wisdom." — Rumi
  4. "Healing is remembering without reopening the wound." — Teju Cole
  5. "Unhealed trauma acts like a rock thrown into a pond; it causes ripples that move outward, affecting many other bodies over time." — Resmaa Menakem

## Sensitive Topic Language
- "Domestic abuse" not "domestic violence" (person-first, less alarming)
- "Living with fibromyalgia" not "fibromyalgia sufferer"
- "Navigating grief" not "dealing with death"
- "Sexual abuse" — always with care; prefix with "support for" in headings
- Never use the word "crazy", "broken", "damaged", "dysfunctional" anywhere.

# ============================================================
# FILE: .cursor/rules/04_security.mdc
# ============================================================
---
description: Security rules for all code generation
globs: ["client/src/**", "server/src/**"]
alwaysApply: true
---

# Security Rules

## Client-Side
- No Firebase Firestore SDK imported in client. All data goes via Worker API.
- No secrets in `VITE_` env vars — only the API base URL.
- All form fields sanitized with Zod before submission.
- Honeypot field named `website` (CSS hidden) on all forms.
- `dangerouslySetInnerHTML` is BANNED. Zero exceptions.
- All external links: `rel="noopener noreferrer"` and `target="_blank"`.

## Server-Side (Worker)
- Every request to `/api/enquiry` validated against Zod schema BEFORE any processing.
- Rate limit: 5 requests / IP / 15 minutes via CF Rate Limiting.
- IP logged only in transient CF cache — not written to Firestore.
- Firestore write only after sanitization pass.
- CORS: allow only the production domain + localhost in development.
- No stack traces in API error responses — return generic messages to client.
- All Firestore document IDs: `crypto.randomUUID()` — never user-provided.

## Firestore
- Public writes: NEVER. All writes are server-to-server (Worker → Firestore via Admin SDK).
- Public reads: NEVER. No client-side Firestore reads.
- Rules file (`firestore.rules`) must deny all by default and explicitly open only
  what is needed for the admin panel.

## Headers
- CSP, HSTS, X-Frame-Options, X-Content-Type-Options all set in `_headers`.
- Referrer-Policy: `strict-origin-when-cross-origin`
- Permissions-Policy: disable camera, microphone, geolocation.

# ============================================================
# FILE: .cursor/rules/05_crisis_footer.mdc
# ============================================================
---
description: Mandates CrisisFooter on every route without exception
globs: ["client/src/**/*.tsx"]
alwaysApply: true
---

# Crisis Footer Rules

## Non-Negotiable Placement
The `<CrisisFooter />` component:
1. Is imported in the shared `<Layout />` component.
2. Renders ABOVE `<Footer />`, BELOW all page content.
3. Cannot be wrapped in any conditional rendering logic.
4. Cannot be removed or hidden on any route.
5. Must appear on the 404 / error boundary page.
6. Must be the first thing a screen reader encounters after main content
   (ARIA landmark: `<aside role="complementary" aria-label="Crisis support information">`).

## Phone Numbers (always exact, always tel: links)
- Samaritans: 116 123 → `<a href="tel:116123">`
- Emergency: 999 → `<a href="tel:999">`
- NHS Mental Health (111): `<a href="tel:111">`

## Styling Constraints
- Background: `bg-sage/20` — soft, not alarming
- Text: `text-grey-deep`
- Icon: Lucide `Heart` or `Leaf`, colour `text-emerald`, size `16`
- Never use red, never use ALL CAPS, never use words like "EMERGENCY" in large type.
