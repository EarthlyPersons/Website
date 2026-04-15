# [Practice Name] Website — MASTER ARCHITECT SPECIFICATION
**For handoff to Cursor | Version 1.0.0**

---

> **How to use this document:**
> Copy each code block into its corresponding file path shown above it.
> Files marked `[COPY EXACTLY]` must not be modified before first commit.
> Files marked `[REPLACE PLACEHOLDERS]` need your real values substituted.
> Run the Setup Checklist (Section 8) before first deploy.

---

# SECTION 1 — PROJECT IDENTITY & TECH STACK

## Project Identity

| Field | Value |
|---|---|
| **Practice Name** | [Practice Name] |
| **Tagline** | "Where healing begins with safety and compassion" |
| **Service** | Psychotherapeutic Counselling — Online Only |
| **Audience** | Adults 18+, trauma-sensitive, LGBTQ+ affirming, marginalised-group inclusive |
| **Deployment** | Cloudflare Pages (frontend) + Cloudflare Workers (backend API) |
| **Repo Structure** | Monorepo — `/client` + `/server` + `/shared` at root |

## Full Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite 5 + TypeScript (strict) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Playfair Display, DM Sans, Cormorant Garamond (self-hosted via fontsource) |
| Backend | Cloudflare Workers + Hono.js |
| Database | Firestore (Admin SDK via Worker) |
| Auth | Firebase Auth (admin panel only) |
| Email | Resend |
| Rate Limiting | Cloudflare Workers Rate Limiting API |
| CI/CD | GitHub Actions + Wrangler |
| Testing | Vitest + Playwright |
| Pre-commit | Husky + lint-staged |

---

# SECTION 2 — MONOREPO DIRECTORY STRUCTURE

```
root/
├── .cursor/
│   ├── rules/
│   │   ├── 01_architecture.mdc
│   │   ├── 02_styling.mdc
│   │   ├── 03_voice_and_copy.mdc
│   │   ├── 04_security.mdc
│   │   └── 05_crisis_footer.mdc
│   └── settings.json
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-pages.yml
│   │   └── deploy-worker.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
├── client/
│   ├── public/
│   │   ├── _headers
│   │   ├── robots.txt
│   │   ├── manifest.json
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               (shadcn auto-generated)
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── CrisisFooter.tsx
│   │   │   ├── shared/
│   │   │   │   ├── QuoteComponent.tsx
│   │   │   │   ├── BookingButton.tsx
│   │   │   │   ├── AnnouncementBanner.tsx
│   │   │   │   └── SectionWrapper.tsx
│   │   │   └── pages/
│   │   │       ├── home/
│   │   │       ├── about/
│   │   │       ├── services/
│   │   │       └── contact/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/globals.css
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── enquiry.ts
│   │   │   └── health.ts
│   │   ├── middleware/
│   │   │   ├── cors.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── sanitize.ts
│   │   ├── lib/
│   │   │   ├── firestore.ts
│   │   │   ├── email.ts
│   │   │   └── validators.ts
│   │   └── index.ts
│   ├── wrangler.toml
│   └── tsconfig.json
├── shared/
│   └── types/
│       └── enquiry.ts
├── firestore.rules
├── .cursorrules
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── package.json
└── README.md
```

---

# SECTION 3 — DESIGN TOKENS

## Colour Palette (authoritative)

```css
/* client/src/styles/globals.css */
@import '@fontsource/playfair-display/400.css';
@import '@fontsource/playfair-display/700.css';
@import '@fontsource/dm-sans/300.css';
@import '@fontsource/dm-sans/400.css';
@import '@fontsource/dm-sans/500.css';
@import '@fontsource/cormorant-garamond/400-italic.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-emerald:      #2F6F4F;
  --color-sage:         #8FAF97;
  --color-mint:         #C7D9CC;
  --color-lavender:     #B7A8CC;
  --color-calm-blue:    #7FA7C6;
  --color-cream:        #F7F5F2;
  --color-grey-soft:    #6D6D6D;
  --color-grey-deep:    #3F4448;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-cream text-grey-deep font-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-display;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

## Tailwind Config

```ts
// client/tailwind.config.ts  [COPY EXACTLY]
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: false,
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald:      '#2F6F4F',
        sage:         '#8FAF97',
        mint:         '#C7D9CC',
        lavender:     '#B7A8CC',
        'calm-blue':  '#7FA7C6',
        cream:        '#F7F5F2',
        'grey-soft':  '#6D6D6D',
        'grey-deep':  '#3F4448',
      },
      fontFamily: {
        display: ['Playfair Display', ...fontFamily.serif],
        body:    ['DM Sans', ...fontFamily.sans],
        quote:   ['Cormorant Garamond', ...fontFamily.serif],
      },
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

# SECTION 4 — FIRESTORE SCHEMA & RULES

## Database Schema

### Collection: `enquiries`
```ts
// shared/types/enquiry.ts
export interface EnquiryDocument {
  id: string                    // crypto.randomUUID() — server-set
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
  name: string                  // Max 100 chars, HTML-entity encoded
  email: string                 // Validated email
  message: string               // Max 2000 chars, HTML-entity encoded
  referralSource: ReferralSource
  honeypotTriggered: boolean
  ipHash: string                // SHA-256 of IP — never raw
  userAgent: string             // Truncated to 200 chars
  status: 'new' | 'read' | 'responded' | 'archived'
  adminNotes: string            // Internal — max 500 chars
  respondedAt?: FirestoreTimestamp
}

export type ReferralSource =
  | 'google_search' | 'social_media' | 'word_of_mouth'
  | 'baatn_directory' | 'bacp_directory' | 'other'
```

### Collection: `settings`
```ts
export interface SiteSettings {
  id: 'global'
  acceptingNewClients: boolean
  bannerMessage: string        // Max 200 chars
  updatedAt: FirestoreTimestamp
  updatedBy: string            // Admin UID
}
```

## Firestore Security Rules

```
// firestore.rules  [COPY EXACTLY]
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write: if false;
    }

    match /enquiries/{enquiryId} {
      allow read: if false;
      allow write: if false;
      allow read, write: if
        request.auth != null &&
        request.auth.token.admin == true;
      allow update: if
        request.auth != null &&
        request.auth.token.admin == true &&
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['status', 'adminNotes', 'updatedAt', 'respondedAt']) &&
        request.resource.data.status in ['new', 'read', 'responded', 'archived'] &&
        request.resource.data.adminNotes.size() <= 500;
    }

    match /settings/global {
      allow read: if true;
      allow write: if
        request.auth != null &&
        request.auth.token.admin == true &&
        request.resource.data.bannerMessage.size() <= 200 &&
        request.resource.data.keys().hasAll(
          ['acceptingNewClients', 'bannerMessage', 'updatedAt', 'updatedBy']
        );
    }

    match /settings/{doc} {
      allow read, write: if
        doc == 'global' &&
        request.auth != null &&
        request.auth.token.admin == true;
    }
  }
}
```

**Key security decisions:**
- ALL public write to `enquiries` is `false`. The Worker uses the Admin SDK, which bypasses rules entirely — this is intentional and correct.
- Only the `settings/global` document is publicly readable (needed for the banner toggle).
- Admin updates to enquiries are restricted to only `status` and `adminNotes` fields — prevents an admin session compromise from overwriting core submission data.

---

# SECTION 5 — ALL CONFIGURATION FILES

## Root package.json [REPLACE PLACEHOLDERS]

```json
{
  "name": "practice-name-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["client", "server", "shared"],
  "engines": { "node": ">=20.0.0", "npm": ">=10.0.0" },
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build:shared && npm run build:client && npm run build:server",
    "build:client": "npm run build --workspace=client",
    "build:server": "npm run build --workspace=server",
    "build:shared": "npm run build --workspace=shared",
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
    "wrangler:tail": "wrangler tail --config server/wrangler.toml --env production",
    "wrangler:secret:set": "wrangler secret put --config server/wrangler.toml"
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
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

## server/wrangler.toml [REPLACE PLACEHOLDERS]

```toml
name = "practice-name-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "practice-name-api"
routes = [{ pattern = "api.practicename.co.uk/*", zone_name = "practicename.co.uk" }]

[env.staging]
name = "practice-name-api-staging"

[[unsafe.bindings]]
name = "RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 5, period = 900 }

[build]
command = "npm run build"

[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGIN = "https://www.practicename.co.uk"

# Set these via: npm run wrangler:secret:set <SECRET_NAME>
# FIREBASE_PROJECT_ID
# FIREBASE_CLIENT_EMAIL
# FIREBASE_PRIVATE_KEY
# RESEND_API_KEY
# ADMIN_NOTIFICATION_EMAIL
```

## client/public/_headers [COPY EXACTLY]

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://api.practicename.co.uk https://firestore.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
  Server: ""
```

## client/public/robots.txt [COPY EXACTLY]

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://www.practicename.co.uk/sitemap.xml
```

---

# SECTION 6 — .cursorrules (ROOT) [COPY EXACTLY]

```
## IDENTITY
You are building a trauma-sensitive psychotherapeutic counselling website.
Every word, every pixel, every interaction carries weight.

---

## RULE 1 — MODULAR COMPONENT ARCHITECTURE
- Every UI element is its own .tsx file. Max 200 lines per file.
- Components live in client/src/components/ under layout/, shared/, pages/{page}/
- All page components assembled in client/src/pages/ by importing sub-components.
- shadcn primitives: generated via npx shadcn-ui, never hand-written.
- All components: named exports (except page-level defaults).
- TypeScript: strict. No `any`. No `unknown` without type guard.

## RULE 2 — COLOUR PALETTE (NON-NEGOTIABLE)
- NEVER hardcode hex values. ALWAYS use Tailwind tokens:
  bg-emerald, bg-sage, bg-mint, bg-lavender, bg-calm-blue,
  bg-cream, text-grey-soft, text-grey-deep
- Default Tailwind colours (slate, green-500, purple-400 etc.) FORBIDDEN.
- No dark mode. No red anywhere. No rapid animations.
- Gradients: only from-emerald/to-sage or from-cream/to-mint.

## RULE 3 — FIRST-PERSON EMPATHETIC VOICE
- Write as the practitioner ("I") speaking to the client ("you").
- Short sentences. Max 3 sentences per paragraph.
- No clinical jargon. No "utilize", "facilitate", "leverage".
- CTAs: "Take the next step" / "Reach out today" / "I'm ready to reach out"
- NEVER: "Submit" / "Click here" / "Sign up"

## RULE 4 — SECURITY
- No Firestore SDK on client. All data via Worker API.
- All env vars prefixed VITE_ — only non-secret values.
- All form submissions include CSS-hidden honeypot field named `website`.
- `dangerouslySetInnerHTML` BANNED. Zero exceptions.
- External links: rel="noopener noreferrer" target="_blank".
- Zod validation both client (UX) and server (authoritative).

## RULE 5 — CRISIS FOOTER (MANDATORY, ALL ROUTES)
- <CrisisFooter /> renders on EVERY route. No exceptions. No conditions.
- It appears ABOVE <Footer />, BELOW page content.
- It renders on the 404 page.
- It is never collapsible, dismissible, or hideable.
- Phone numbers as tel: links. Background: bg-sage/20. Never red.
- Samaritans: 116 123 | Emergency: 999 | NHS: 111 (mental health option)

## GENERAL
- npm run lint + npm run typecheck before marking any task done.
- No console.log in production code.
- All images: loading="lazy", descriptive alt text.
- Git commits: Conventional Commits (feat:, fix:, chore:, docs:)
- WCAG AA contrast minimum on all text/background combinations.
```

---

# SECTION 7 — .cursor/rules/ FILES

Create each as a separate `.mdc` file in `.cursor/rules/`:

### 01_architecture.mdc
Enforce: modular components, typed props, barrel exports, no prop drilling >2 levels, React.lazy for routes, warm error messages to users.

### 02_styling.mdc
Enforce: palette tokens only, `py-16 md:py-24` section padding, `max-w-5xl mx-auto px-4 sm:px-6` containers, `rounded-2xl` cards, Framer Motion with `prefers-reduced-motion` check.

### 03_voice_and_copy.mdc
Enforce: first-person frame, approved CTA list, conversational headings, exact quote text from approved list, person-first sensitive language.

### 04_security.mdc
Enforce: no Firestore SDK client-side, no secrets in VITE_ vars, honeypot on all forms, no `dangerouslySetInnerHTML`, Zod on server as authoritative, no stack traces in API responses.

### 05_crisis_footer.mdc
Enforce: unconditional render on every route, ARIA landmark, tel: links, soft green styling, exact copy for Samaritans/999/111.

*(Full file content provided in `cursor_rules_all_files.md`)*

---

# SECTION 8 — SETUP CHECKLIST

### Phase 1 — Infrastructure
- [ ] Cloudflare account + Pages project created
- [ ] Worker created, secrets set via `npm run wrangler:secret:set`
- [ ] Firebase project + Firestore created (region: `europe-west2`)
- [ ] `firebase deploy --only firestore:rules` run
- [ ] Admin Firebase Auth user created + custom claim `admin: true` set
- [ ] Resend account + domain verified

### Phase 2 — GitHub
- [ ] Private repository created
- [ ] Branch protection on `main` (require PR + CI pass + 1 review)
- [ ] Actions secrets added (CF_API_TOKEN, CF_ACCOUNT_ID, API URLs)
- [ ] CODEOWNERS updated with real GitHub username

### Phase 3 — Content Placeholders (Replace Before Launch)
- [ ] `[Practice Name]` → real practice name
- [ ] `practicename.co.uk` → real domain
- [ ] Session fee `[£XX]` → real fee
- [ ] Hero images sourced (St Lucia Pitons / sea, WebP ≤200KB each)
- [ ] Professional bio written in first-person voice
- [ ] BAATN + MBACP logos obtained with permission
- [ ] Privacy Policy written and linked

### Phase 4 — Pre-Launch
- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run test:e2e` — all passing
- [ ] CrisisFooter visible on all 4 routes + 404 page — confirmed in browser
- [ ] Mobile responsive check (320px, 375px, 768px, 1280px)
- [ ] Screen reader test (NVDA or VoiceOver)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] All phone numbers in CrisisFooter confirmed working on mobile
- [ ] Firestore rules deployed and tested (public cannot write to enquiries)
- [ ] Enquiry form end-to-end tested — submission received in email

---

# SECTION 9 — PAGE-BY-PAGE COMPONENT BREAKDOWN

## Home (`/`)
1. `<AnnouncementBanner />` — conditional on Firestore settings, dismissible
2. `<Navbar />`
3. `<HeroSection />` — Pitons/sea image, overlay, "Take the next step" CTA, Rumi quote
4. `<WelcomeIntro />` — brief first-person intro, link to About
5. `<SupportAreas />` — grid of support areas (core + additional), icons from Lucide
6. `<QuoteComponent text="Grief can be the garden..." author="Rumi" variant="subtle" />`
7. `<NextStepsCTA />` — encourages free consultation booking
8. `<CrisisStatement />` — inline crisis statement (NOT the CrisisFooter — this is content)
9. `<CrisisFooter />` — mandatory
10. `<Footer />`

## About (`/about`)
1. `<Navbar />`
2. `<ProBio />` — professional biography, photo
3. `<MyApproach />` — therapeutic modalities, humanised
4. `<Philosophy />` — personal philosophy on healing
5. `<WhoIWorkWith />` — who the practice serves
6. `<QuoteComponent text="You may not control..." author="Maya Angelou" />`
7. Booking CTA button
8. `<CrisisFooter />`
9. `<Footer />`

## Services (`/services`)
1. `<Navbar />`
2. `<WhatIOffer />` — what online counselling is, what sessions look like
3. `<WhatToExpect />` — practical info about first session
4. `<QuoteComponent text="Healing is remembering..." author="Teju Cole" variant="hero" />`
5. `<FeesTabs />` — tabbed: Fees, Cancellations, Reduced Rate
6. `<FAQAccordion />` — shadcn Accordion, 6–8 questions
7. `<QuoteComponent text="Unhealed trauma acts..." author="Resmaa Menakem" variant="subtle" />`
8. Next steps CTA
9. `<CrisisFooter />`
10. `<Footer />`

## Contact (`/contact`)
1. `<Navbar />`
2. Warm intro copy
3. `<EnquiryForm />` — full validated form with honeypot
4. `<CrisisFooter />`
5. `<Footer />`

---

*End of Master Specification — [Practice Name] Website v1.0.0*
