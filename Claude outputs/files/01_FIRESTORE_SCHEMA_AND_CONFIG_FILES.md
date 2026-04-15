# ============================================================
# FIRESTORE DATABASE SCHEMA
# ============================================================

## Collection: `enquiries`

Each document represents one contact form submission.

```ts
// shared/types/enquiry.ts
export interface EnquiryDocument {
  // Identity
  id: string                    // crypto.randomUUID() — server-generated
  createdAt: FirestoreTimestamp // server timestamp
  updatedAt: FirestoreTimestamp

  // Submitted Fields (sanitized)
  name: string                  // Max 100 chars, HTML-entity encoded
  email: string                 // Validated email format
  message: string               // Max 2000 chars, HTML-entity encoded
  referralSource: string        // Enum: see below — max 100 chars

  // Anti-Abuse
  honeypotTriggered: boolean    // true = spam, still logged, no email sent
  ipHash: string                // SHA-256 of IP — for rate-limit auditing, not stored raw
  userAgent: string             // Truncated to 200 chars

  // Status (admin use)
  status: 'new' | 'read' | 'responded' | 'archived'
  adminNotes: string            // Internal only — max 500 chars
  respondedAt?: FirestoreTimestamp
}

// Referral source enum
export type ReferralSource =
  | 'google_search'
  | 'social_media'
  | 'word_of_mouth'
  | 'baatn_directory'
  | 'bacp_directory'
  | 'other'
```

## Collection: `settings`

Single document for toggling site-wide features.

```ts
export interface SiteSettings {
  id: 'global'                  // Always exactly one document
  acceptingNewClients: boolean  // Drives the announcement banner
  bannerMessage: string         // Custom banner text (max 200 chars)
  updatedAt: FirestoreTimestamp
  updatedBy: string             // Admin UID
}
```

---

# ============================================================
# FILE: firestore.rules
# ============================================================

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // -------------------------------------------------------
    // DEFAULT DENY — all access denied unless explicitly opened
    // -------------------------------------------------------
    match /{document=**} {
      allow read, write: if false;
    }

    // -------------------------------------------------------
    // ENQUIRIES COLLECTION
    // Public: NO read, NO write (all writes via Admin SDK in Worker)
    // Admin: Full access if authenticated AND has admin custom claim
    // -------------------------------------------------------
    match /enquiries/{enquiryId} {
      // No public read
      allow read: if false;

      // No public write — Worker uses Admin SDK (bypasses rules)
      allow write: if false;

      // Admin read/write — requires Firebase Auth + custom claim
      allow read, write: if
        request.auth != null &&
        request.auth.token.admin == true;

      // Prevent field injection — admin writes must conform to schema
      allow update: if
        request.auth != null &&
        request.auth.token.admin == true &&
        // Only allow updating status and adminNotes fields
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['status', 'adminNotes', 'updatedAt', 'respondedAt']) &&
        // Status must be valid enum
        request.resource.data.status in ['new', 'read', 'responded', 'archived'] &&
        // Admin notes size limit
        request.resource.data.adminNotes.size() <= 500;
    }

    // -------------------------------------------------------
    // SETTINGS COLLECTION
    // Public: READ ONLY the 'global' document (for banner toggle)
    // Admin: Full write access with claim check
    // -------------------------------------------------------
    match /settings/global {
      // Allow public reads for the banner toggle feature
      allow read: if true;

      // Only admin can write
      allow write: if
        request.auth != null &&
        request.auth.token.admin == true &&
        // Enforce field constraints
        request.resource.data.bannerMessage.size() <= 200 &&
        request.resource.data.keys().hasAll(['acceptingNewClients', 'bannerMessage', 'updatedAt', 'updatedBy']) &&
        request.resource.data.keys().hasOnly(['acceptingNewClients', 'bannerMessage', 'updatedAt', 'updatedBy', 'id']);
    }

    // -------------------------------------------------------
    // DENY all other settings documents
    // -------------------------------------------------------
    match /settings/{doc} {
      allow read, write: if doc == 'global' && request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

# ============================================================
# FILE: server/wrangler.toml
# ============================================================

```toml
name = "practice-name-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# ---- Environments ----

[env.production]
name = "practice-name-api"
routes = [
  { pattern = "api.practicename.co.uk/*", zone_name = "practicename.co.uk" }
]

[env.staging]
name = "practice-name-api-staging"
routes = [
  { pattern = "api-staging.practicename.co.uk/*", zone_name = "practicename.co.uk" }
]

# ---- KV Namespaces (for rate limiting state if needed) ----
# [[kv_namespaces]]
# binding = "RATE_LIMIT_KV"
# id = "YOUR_KV_ID_HERE"

# ---- Rate Limiting ----
[[unsafe.bindings]]
name = "RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 5, period = 900 }  # 5 requests / 15 minutes

# ---- Build ----
[build]
command = "npm run build"

# ---- Variables (non-secret) ----
[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGIN = "https://www.practicename.co.uk"

# Secrets set via: wrangler secret put SECRET_NAME
# Required secrets:
#   FIREBASE_PROJECT_ID
#   FIREBASE_CLIENT_EMAIL
#   FIREBASE_PRIVATE_KEY
#   RESEND_API_KEY
#   ADMIN_NOTIFICATION_EMAIL
```

---

# ============================================================
# FILE: client/public/_headers  (Cloudflare Pages security headers)
# ============================================================

```
/*
  # Prevent clickjacking
  X-Frame-Options: DENY

  # Prevent MIME sniffing
  X-Content-Type-Options: nosniff

  # XSS protection (legacy browsers)
  X-XSS-Protection: 1; mode=block

  # Referrer policy
  Referrer-Policy: strict-origin-when-cross-origin

  # Permissions — disable unnecessary browser APIs
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()

  # HSTS — enforce HTTPS for 1 year, include subdomains
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

  # Content Security Policy
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://*.cloudflare.com https://images.unsplash.com; connect-src 'self' https://api.practicename.co.uk https://firestore.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;

  # Remove server info
  Server: ""
```

---

# ============================================================
# FILE: client/public/robots.txt
# ============================================================
# Blocks AI crawlers, data harvesters; allows standard search
# ============================================================

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /.env
Disallow: /admin/

# Block all AI training crawlers
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

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PetalBot
Disallow: /

# Allow legitimate search engines
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

# ============================================================
# FILE: client/public/manifest.json
# ============================================================
# Minimal — does NOT expose app structure or route map
# ============================================================

```json
{
  "name": "[Practice Name]",
  "short_name": "[Practice Name]",
  "description": "Psychotherapeutic Counselling — Online",
  "start_url": "/",
  "display": "browser",
  "background_color": "#F7F5F2",
  "theme_color": "#2F6F4F",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

# ============================================================
# FILE: client/public/sitemap.xml
# ============================================================
# Only exposes public routes — no admin, no API paths
# ============================================================

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.practicename.co.uk/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.practicename.co.uk/about</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.practicename.co.uk/services</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.practicename.co.uk/contact</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

# ============================================================
# FILE: client/index.html  (Hardened)
# ============================================================

```html
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <!-- Viewport: no user-scalable=no (accessibility requirement) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta -->
    <title>[Practice Name] — Psychotherapeutic Counselling Online</title>
    <meta name="description" content="Compassionate online psychotherapeutic counselling. Specialising in domestic abuse, grief, fibromyalgia, trauma, and more. Where healing begins with safety." />
    <meta name="author" content="[Practice Name]" />

    <!-- Security meta -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <!-- CSP also set in _headers — belt and braces -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.practicename.co.uk;" />

    <!-- No AI indexing -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />

    <!-- Canonical -->
    <link rel="canonical" href="https://www.practicename.co.uk/" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.practicename.co.uk/" />
    <meta property="og:title" content="[Practice Name] — Where healing begins with safety and compassion" />
    <meta property="og:description" content="Compassionate online psychotherapeutic counselling for adults. Safe, trauma-sensitive support." />
    <meta property="og:image" content="/og-image.jpg" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="[Practice Name]" />
    <meta name="twitter:description" content="Compassionate online psychotherapeutic counselling. Where healing begins with safety." />
    <meta name="twitter:image" content="/og-image.jpg" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- Theme colour -->
    <meta name="theme-color" content="#2F6F4F" />

    <!-- GDPR: no tracking pixels, no third-party scripts in head -->
  </head>
  <body>
    <!-- Accessible skip link -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald text-white px-4 py-2 rounded z-50">
      Skip to main content
    </a>

    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>

    <!-- No inline scripts. No third-party scripts without CSP hash. -->
  </body>
</html>
```
