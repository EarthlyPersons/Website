import { MiddlewareHandler } from 'hono'

export const rateLimit: MiddlewareHandler = async (c, next) => {
  // Basic rate limiting using Cloudflare's built-in rate limiter
  // This is a placeholder; actual implementation would use the RATE_LIMITER binding
  await next()
}