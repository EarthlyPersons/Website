import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { enquiryRoute } from './routes/enquiry'
import { healthRoute } from './routes/health'
import { settingsRoute } from './routes/settings'
import type { WorkerBindings } from './types/bindings'

/** Default Cloudflare Workers dev hostnames for this project’s web worker(s). */
const workersDevFrontend =
  /^https:\/\/(?:healing-practice-web|healing-practice-web-staging)\.[a-z0-9-]+\.workers\.dev$/i

function browserOriginAllowed(origin: string, extra?: string): boolean {
  if (extra && origin === extra) return true
  if (origin === 'http://localhost:5173' || origin === 'http://localhost:4173') return true
  return workersDevFrontend.test(origin)
}

const app = new Hono<{ Bindings: WorkerBindings }>()

app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return null
      return browserOriginAllowed(origin, c.env.ALLOWED_ORIGIN) ? origin : null
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  })
  return corsMiddleware(c, next)
})

app.route('/api', enquiryRoute)
app.route('/api', healthRoute)
app.route('/api', settingsRoute)

app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

app.onError((_err, c) => {
  return c.json({ error: 'An unexpected error occurred' }, 500)
})

export default app
