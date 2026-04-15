# ============================================================
# FILE: .cursorrules  (root of monorepo)
# ============================================================
# This is the PRIMARY enforcement file. All cursor prompts
# in this project must conform to these rules BEFORE generating
# any code. Rules are non-negotiable.
# ============================================================

## IDENTITY
You are building a trauma-sensitive psychotherapeutic counselling website.
The practitioner serves vulnerable adults. Every word, every pixel, every
interaction carries weight. Treat this with the care of a clinical environment
AND the warmth of a trusted friend.

---

## RULE 1 — MODULAR COMPONENT ARCHITECTURE

### Enforcement
- Every visible UI element is its own `.tsx` component file.
- No component file exceeds 200 lines. If it does, split it.
- Components live in `client/src/components/` under semantic subdirs:
  `layout/`, `shared/`, `pages/{pagename}/`
- All page-level components are assembled in `client/src/pages/`
  by importing modular sub-components — never inline.
- All shadcn/ui primitives live in `client/src/components/ui/` (auto-generated).
  Do not hand-write shadcn primitives. Use `npx shadcn-ui@latest add [component]`.
- Every component must have a TypeScript interface for its props.
- No `any` types. `unknown` is acceptable only with a type guard.
- Every component is exported as a **named export** (no default exports
  except for pages in `src/pages/`).

### Component Template
```tsx
// client/src/components/shared/ExampleComponent.tsx
import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ExampleComponentProps {
  className?: string
  // ... typed props
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  className,
  ...props
}) => {
  return (
    <section className={cn('', className)}>
      {/* content */}
    </section>
  )
}
```

---

## RULE 2 — STRICT COLOUR PALETTE ADHERENCE

### Enforcement
- **NEVER** use hardcoded hex values in component files.
- **ALWAYS** use Tailwind colour tokens defined in `tailwind.config.ts`:
  `bg-emerald`, `text-sage`, `border-mint`, `bg-cream`, `text-grey-deep`, etc.
- Accent primary = `emerald` (#2F6F4F)
- Background = `cream` (#F7F5F2)
- Body text = `grey-deep` (#3F4448)
- Muted text = `grey-soft` (#6D6D6D)
- Soft accents: `lavender`, `calm-blue` (use sparingly, for decorative/quote elements)
- No dark mode implementation (this is a calm, light-first design).
- Gradient use: only `from-emerald to-sage` or `from-cream to-mint` — never arbitrary.

### Forbidden Patterns
```tsx
// ❌ NEVER
style={{ color: '#2F6F4F' }}
className="bg-green-500"
className="text-purple-400"

// ✅ ALWAYS
className="text-emerald"
className="bg-cream"
className="border-mint"
```

---

## RULE 3 — FIRST-PERSON EMPATHETIC VOICE

### Enforcement
All placeholder and example copy must follow these rules:
- Write as the practitioner speaking directly to a potential client.
- Use "I" (practitioner) and "you" (client). Never "the therapist" or "the client".
- Imagine the reader is feeling overwhelmed but has found the courage to reach out.
- Language must be warm, grounded, plain. No clinical jargon.
- Sentences should be short. Paragraphs max 3 sentences.
- Never use: "utilize", "facilitate", "leverage", "optimal", "robust"
  in user-facing copy.
- Crisis information must always be specific, direct, and never alarming
  in tone — calm and caring, never panicked.

### Voice Examples
```
❌ "This practice facilitates therapeutic interventions for adults
    experiencing complex trauma presentations."

✅ "I'm here to walk alongside you — wherever you're starting from.
    You don't have to have it all figured out to reach out."

❌ "In the event of a mental health crisis, please contact emergency services."

✅ "If you're in crisis right now, please know that help is available.
    The Samaritans are there 24/7 — call 116 123 (free, any time)."
```

---

## RULE 4 — SECURITY

### Enforcement
- **All user input** goes through Zod validation — client side (UX)
  AND server side (authoritative). Server validation is the source of truth.
- **No Firebase SDK in client for Firestore writes.** All writes go through
  the Cloudflare Worker API endpoint, never directly from the browser.
- Firebase Auth is for the admin panel only. It is not exposed to public routes.
- All environment variables prefixed `VITE_` in client — only non-secret
  values (e.g. API base URL). Never expose Firebase service account keys to client.
- Content Security Policy is set via `_headers` and must be reviewed on
  every new external dependency added.
- All form submissions include a honeypot field (CSS-hidden, validated server-side).
- Rate limiting is enforced on the Worker — 5 requests per IP per 15 minutes
  on the `/api/enquiry` endpoint.
- HTML entity-encode all user-submitted data before Firestore write.
- No `dangerouslySetInnerHTML` anywhere in the codebase.

---

## RULE 5 — CRISIS FOOTER (MANDATORY ON ALL ROUTES)

### Enforcement
- The `<CrisisFooter />` component is rendered on **every route**, always,
  without exception. It cannot be conditionally hidden.
- It appears ABOVE the main `<Footer />` component.
- It must render even on the 404 page.
- It must never be collapsible or dismissible.

### Content (exact copy — do not alter tone)
```
If you're in crisis right now, please reach out for immediate support.
You are not alone.

• Samaritans — 116 123 (free, 24/7, any time, any reason)
• Emergency — 999
• NHS Mental Health Crisis Line — 111 (select Mental Health option)
```

### Component Spec
- Background: `bg-sage/20` (very soft, not alarming red)
- Border top: `border-t-2 border-sage`
- Text: `text-grey-deep`
- Icon: a small heart or leaf icon (Lucide) for warmth
- Links: phone numbers are `<a href="tel:...">` for mobile tap-to-call
- Font size: `text-sm`
- Padding: `py-6 px-4`

---

## GENERAL RULES

- Run `npm run lint` and `npm run typecheck` before marking any task done.
- No `console.log` in production code. Use a structured logger or remove.
- Accessibility: all interactive elements have `aria-label` or visible label.
  Images have descriptive `alt` text. Colour contrast meets WCAG AA minimum.
- Every new route added must be reflected in `sitemap.xml` and React Router config.
- Git commits follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`.

# ============================================================
# END OF .cursorrules
# ============================================================
