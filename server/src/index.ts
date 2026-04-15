import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { enquiryRoute } from './routes/enquiry'
import { healthRoute } from './routes/health'
import { settingsRoute } from './routes/settings'
import type { WorkerBindings } from './types/bindings'

const app = new Hono<{ Bindings: WorkerBindings }>()

app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      const allowed = [
        c.env.ALLOWED_ORIGIN,
        'http://localhost:5173',
        'http://localhost:4173',
        'https://healingpractice.co.uk',
        'https://www.healingpractice.co.uk',
      ].filter(Boolean) as string[]
      if (!origin) return null
      return allowed.includes(origin) ? origin : null
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
