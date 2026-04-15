/**
 * Cloudflare Worker bindings used by the Hono app.
 * Secrets are set via Wrangler; optional bindings may be absent in local dev.
 */
export interface RateLimitOutcome {
  success: boolean
}

export interface RateLimiter {
  limit(input: { key: string }): Promise<RateLimitOutcome>
}

export type WorkerBindings = {
  ENVIRONMENT: string
  /** Optional extra browser origin (e.g. custom domain). workers.dev frontends are allowed by default in CORS. */
  ALLOWED_ORIGIN?: string
  /** Set via Wrangler secrets / vars when Firestore persistence is enabled */
  FIREBASE_PROJECT_ID?: string
  FIREBASE_CLIENT_EMAIL?: string
  FIREBASE_PRIVATE_KEY?: string
  RESEND_API_KEY?: string
  ADMIN_NOTIFICATION_EMAIL?: string
  RESEND_FROM?: string
  RATE_LIMITER?: RateLimiter
}
