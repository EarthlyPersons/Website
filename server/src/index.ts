import { Hono } from 'hono'
import { cors } from './middleware/cors'
import { rateLimit } from './middleware/rateLimit'
import { sanitize } from './middleware/sanitize'
import enquiryRoute from './routes/enquiry'
import healthRoute from './routes/health'

const app = new Hono()

// Middleware
app.use('*', cors)
app.use('*', rateLimit)
app.use('*', sanitize)

// Routes
app.route('/enquiry', enquiryRoute)
app.route('/health', healthRoute)

export default app