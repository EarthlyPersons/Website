# [Practice Name] — Full Architect Design Specification
**Version:** 1.0.0 | **Role:** Lead Full-Stack Architect Handoff to Cursor

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| **Practice Name** | [Practice Name] |
| **Tagline** | "Where healing begins with safety and compassion" |
| **Service** | Psychotherapeutic Counselling — Online Only |
| **Audience** | Adults 18+, trauma-sensitive, LGBTQ+ affirming, marginalised-group inclusive |
| **Deployment** | Cloudflare Pages (frontend) + Cloudflare Workers (backend API) |
| **Repo Structure** | Monorepo — `/client` + `/server` at root |

---

## 2. FULL TECH STACK

### Frontend (`/client`)
| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite 5 | Fast HMR, ESM-native, ideal for CF Pages |
| Language | TypeScript (strict) | Type safety across the full stack |
| Styling | Tailwind CSS v3 + shadcn/ui | Utility-first + accessible component primitives |
| Routing | React Router v6 | File-based-style routing with nested layouts |
| Forms | React Hook Form + Zod | Client-side validation aligned with server schema |
| State | Zustand | Lightweight global state (banner toggle, etc.) |
| Animation | Framer Motion | Smooth, accessible transitions |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Fonts | Google Fonts (self-hosted via `fontsource`) | Privacy-first, GDPR compliant |

### Backend (`/server`)
| Layer | Choice | Reason |
|---|---|---|
| Runtime | Cloudflare Workers (Hono.js) | Edge-native, low-latency, zero cold starts |
| Language | TypeScript | Shared types with client |
| Validation | Zod | Schema validation before any DB write |
| Email | Resend (or SendGrid fallback) | Transactional email on enquiry submission |
| Rate Limiting | CF Workers Rate Limiting API | Built-in, no extra infra |

### Auth & Database
| Layer | Choice |
|---|---|
| Auth | Firebase Auth (email/password for admin panel only) |
| Database | Firestore (enquiries, settings) |
| Storage | Cloudflare R2 (future: image uploads) |

### DevOps / Infrastructure
| Layer | Choice |
|---|---|
| CI/CD | GitHub Actions |
| Deployment | Wrangler CLI (CF Pages + Workers) |
| Secrets | Cloudflare Worker Secrets + GitHub Actions Secrets |
| Linting | ESLint + Prettier |
| Testing | Vitest (unit) + Playwright (e2e) |
| Pre-commit | Husky + lint-staged |

---

## 3. MONOREPO DIRECTORY STRUCTURE

```
root/
├── .cursor/                        # Cursor AI instruction files
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
│   │   ├── index.html              # Hardened HTML
│   │   ├── robots.txt
│   │   ├── manifest.json
│   │   ├── sitemap.xml
│   │   └── _headers                # CF Pages security headers
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn primitives (auto-generated)
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
│   │   │       │   ├── HeroSection.tsx
│   │   │       │   ├── WelcomeIntro.tsx
│   │   │       │   ├── SupportAreas.tsx
│   │   │       │   ├── NextStepsCTA.tsx
│   │   │       │   └── CrisisStatement.tsx
│   │   │       ├── about/
│   │   │       │   ├── ProBio.tsx
│   │   │       │   ├── MyApproach.tsx
│   │   │       │   ├── Philosophy.tsx
│   │   │       │   └── WhoIWorkWith.tsx
│   │   │       ├── services/
│   │   │       │   ├── WhatIOffer.tsx
│   │   │       │   ├── WhatToExpect.tsx
│   │   │       │   ├── FeesTabs.tsx
│   │   │       │   └── FAQAccordion.tsx
│   │   │       └── contact/
│   │   │           └── EnquiryForm.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/
│   │   │   ├── useEnquiryForm.ts
│   │   │   └── useBannerStore.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── validators.ts       # Zod schemas (shared-safe copy)
│   │   │   └── constants.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
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
│   │   │   └── validators.ts       # Authoritative Zod schemas
│   │   └── index.ts
│   ├── wrangler.toml
│   ├── tsconfig.json
│   └── .env.example
├── shared/
│   └── types/
│       └── enquiry.ts              # Shared TS types only (no runtime deps)
├── firestore.rules
├── .cursorrules
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── package.json                    # Root — workspace + deploy scripts
└── README.md
```

---

## 4. COLOUR PALETTE (Design Tokens)

These are the authoritative tokens. Every component must use these — no hardcoded hex values.

```css
/* globals.css — CSS Custom Properties */
:root {
  /* Primary Brand */
  --color-emerald:      #2F6F4F;
  --color-sage:         #8FAF97;
  --color-mint:         #C7D9CC;

  /* Spiritual Accents */
  --color-lavender:     #B7A8CC;
  --color-calm-blue:    #7FA7C6;

  /* Neutrals */
  --color-cream:        #F7F5F2;
  --color-grey-soft:    #6D6D6D;
  --color-grey-deep:    #3F4448;

  /* Semantic */
  --color-background:   var(--color-cream);
  --color-text-primary: var(--color-grey-deep);
  --color-text-muted:   var(--color-grey-soft);
  --color-accent:       var(--color-emerald);
  --color-accent-soft:  var(--color-sage);
  --color-border:       var(--color-mint);
}
```

### Tailwind Extension
```ts
// tailwind.config.ts
colors: {
  emerald:    '#2F6F4F',
  sage:       '#8FAF97',
  mint:       '#C7D9CC',
  lavender:   '#B7A8CC',
  'calm-blue':'#7FA7C6',
  cream:      '#F7F5F2',
  'grey-soft':'#6D6D6D',
  'grey-deep':'#3F4448',
}
```

---

## 5. TYPOGRAPHY

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Hero | `Playfair Display` | 400, 700 | Soulful, editorial warmth |
| Body | `DM Sans` | 300, 400, 500 | Clean, accessible, readable |
| Quote | `Cormorant Garamond` | 400i | Elegant italic for Rumi/Angelou quotes |
| UI / Labels | `DM Sans` | 500 | Consistent with body |

Self-host via `@fontsource/playfair-display`, `@fontsource/dm-sans`, `@fontsource/cormorant-garamond`.

---

## 6. PAGE ROUTE MAP

| Path | Component | Purpose |
|---|---|---|
| `/` | `Home.tsx` | Hero, welcome, support areas, CTA, crisis statement |
| `/about` | `About.tsx` | Bio, approach, philosophy, who I work with |
| `/services` | `Services.tsx` | Offer, fees tabs, FAQ accordion, next steps |
| `/contact` | `Contact.tsx` | Enquiry form |
| `*` | `NotFound.tsx` | Gentle 404 with navigation back |

All routes wrapped in shared `<Layout>` which includes `<Navbar>`, `<Footer>`, and `<CrisisFooter>`.
