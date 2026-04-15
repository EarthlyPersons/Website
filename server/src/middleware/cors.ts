import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://healingpractice.co.uk',
      'https://www.healingpractice.co.uk'
    ]
    return allowedOrigins.includes(origin) ? origin : false
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})