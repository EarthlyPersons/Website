# ============================================================
# FILE: README.md
# ============================================================

```markdown
# [Practice Name] — Website

> *"Where healing begins with safety and compassion"*

A trauma-sensitive psychotherapeutic counselling website built with care,
accessibility, and security at its core.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend API | Cloudflare Workers (Hono.js) |
| Auth | Firebase Auth (admin only) |
| Database | Firestore |
| Deployment | Cloudflare Pages + Workers |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account
- Firebase project

### Installation

```bash
git clone https://github.com/your-org/practice-name-website.git
cd practice-name-website
npm install
```

### Environment Variables

Copy `.env.example` files in both `client/` and `server/` and fill in values:

```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.dev.vars
```

### Development

```bash
# Run both client and server locally
npm run dev

# Client only (http://localhost:5173)
npm run dev:client

# Worker only (http://localhost:8787)
npm run dev:server
```

### Deploying

```bash
# Deploy everything to production
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy client only
npm run deploy:client

# Deploy worker only
npm run deploy:worker
```

### Worker Secrets

Set secrets via Wrangler (not in .env files):

```bash
npm run wrangler:secret:set FIREBASE_PRIVATE_KEY
npm run wrangler:secret:set RESEND_API_KEY
npm run wrangler:secret:set ADMIN_NOTIFICATION_EMAIL
```

---

## Project Structure

```
├── client/          # React + Vite frontend
├── server/          # Cloudflare Worker API (Hono.js)
├── shared/          # Shared TypeScript types only
├── .cursor/         # Cursor AI instruction files
├── .github/         # CI/CD and GitHub templates
├── firestore.rules  # Firestore security rules
└── .cursorrules     # Root cursor enforcement rules
```

---

## Design System

This project uses a strictly enforced **Nature-Calming** palette:

| Token | Hex | Use |
|---|---|---|
| `emerald` | `#2F6F4F` | Primary brand, CTAs |
| `sage` | `#8FAF97` | Accents, borders |
| `mint` | `#C7D9CC` | Backgrounds, subtle fills |
| `lavender` | `#B7A8CC` | Spiritual accents (sparingly) |
| `calm-blue` | `#7FA7C6` | Spiritual accents (sparingly) |
| `cream` | `#F7F5F2` | Main background |
| `grey-soft` | `#6D6D6D` | Body text |
| `grey-deep` | `#3F4448` | Headings, emphasis |

**No hardcoded hex values in component files.**

---

## Safety & Accessibility

- **Crisis Footer** appears on every single route without exception.
- All colour combinations meet WCAG AA contrast ratios.
- All interactive elements have accessible labels.
- `prefers-reduced-motion` is respected throughout.
- Trauma-sensitive language guidelines enforced via `.cursorrules`.

---

## Memberships

This practice is a registered **BAATN** and **MBACP** member.

---

## Contributing

See [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) for
the required checklist before submitting any PR.

All contributions must pass `npm run lint` and `npm run typecheck`.

---

## License

Private — all rights reserved. Not open source.
```

---

# ============================================================
# FILE: .github/ISSUE_TEMPLATE/bug_report.md
# ============================================================

```markdown
---
name: Bug report
about: Something isn't working as expected
title: '[Bug] '
labels: bug
assignees: ''
---

## What happened?
<!-- A clear description of the bug -->

## Steps to reproduce
1.
2.
3.

## Expected behaviour
<!-- What should have happened? -->

## Screenshots
<!-- If applicable -->

## Environment
- Browser:
- OS:
- Device (mobile/desktop):

## Sensitivity note
<!-- Does this bug affect any crisis-related content or forms?
     If yes, mark this issue as PRIORITY. -->
- [ ] This affects crisis footer or crisis contact information
- [ ] This affects the contact/enquiry form
- [ ] This is a security concern
```

---

# ============================================================
# FILE: .github/ISSUE_TEMPLATE/feature_request.md
# ============================================================

```markdown
---
name: Feature request
about: Suggest an improvement or new feature
title: '[Feature] '
labels: enhancement
assignees: ''
---

## What would you like to see?
<!-- A clear description of the feature -->

## Why is this needed?
<!-- How does it serve the practice or potential clients? -->

## Does this affect vulnerable users?
<!-- Consider whether this change could impact someone in distress visiting the site -->
- [ ] Yes — requires trauma-sensitive review before implementing
- [ ] No

## Acceptance criteria
- [ ]
- [ ]
- [ ]
```

---

# ============================================================
# SETUP CHECKLIST — Run through this before first deploy
# ============================================================

```markdown
## Pre-Deploy Checklist

### Cloudflare
- [ ] CF account created, Pages project created (`practice-name-client`)
- [ ] CF Worker created and named correctly
- [ ] Custom domain added to CF Pages
- [ ] API subdomain (`api.practicename.co.uk`) routed to Worker
- [ ] Worker secrets set via `wrangler secret put`
- [ ] Rate limiting namespace created and ID added to `wrangler.toml`

### Firebase
- [ ] Firebase project created
- [ ] Firestore database created (region: `europe-west2` for UK)
- [ ] Firestore rules deployed: `firebase deploy --only firestore:rules`
- [ ] Service account created with Firestore write access
- [ ] Service account JSON credentials extracted, private key set as Worker secret
- [ ] Admin user created in Firebase Auth
- [ ] Custom admin claim set on admin user

### Email
- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] API key set as Worker secret

### GitHub
- [ ] Repository created (private)
- [ ] Secrets added to GitHub Actions:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `PRODUCTION_API_URL`
  - `STAGING_API_URL`
- [ ] Branch protection on `main`: require PR + CI pass
- [ ] Dependabot enabled

### Content
- [ ] Replace all `[Practice Name]` placeholders
- [ ] Replace all `practicename.co.uk` with real domain
- [ ] Replace all `your-github-username` in CODEOWNERS
- [ ] Pitons / St Lucia hero images sourced and optimised (WebP, ≤200KB)
- [ ] OG image created (`/og-image.jpg`, 1200×630)
- [ ] Favicon SVG created
- [ ] Professional bio written
- [ ] Session fees confirmed and added to FeesTabs
- [ ] BAATN and MBACP member logos obtained (with permission)
- [ ] Sitemap `lastmod` dates updated

### Legal / Compliance
- [ ] Privacy Policy page written and linked in footer
- [ ] GDPR consent wording reviewed by practitioner
- [ ] ICO registration confirmed (if required)
- [ ] Cookie policy reviewed (no cookies used by default — confirm)
```
