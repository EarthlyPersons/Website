import { Hono } from 'hono'
import { z } from 'zod'
import { sanitizeString } from '../middleware/sanitize'
import { writeEnquiryToFirestore } from '../lib/firestore'
import { sendNotificationEmail } from '../lib/email'
import type { WorkerBindings } from '../types/bindings'

export const enquiryRoute = new Hono<{ Bindings: WorkerBindings }>()

const EnquirySchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100, 'Name is too long').trim(),
  email: z.string().email('Please enter a valid email address').max(254).toLowerCase().trim(),
  message: z
    .string()
    .min(10, 'Please write a short message')
    .max(2000, 'Message is too long — please keep it under 2000 characters')
    .trim(),
  referralSource: z.enum([
    'google_search',
    'social_media',
    'word_of_mouth',
    'baatn_directory',
    'bacp_directory',
    'other',
  ]),
  website: z.string().optional(),
})

enquiryRoute.post('/enquiry', async (c) => {
  if (c.env.RATE_LIMITER) {
    const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
    const { success } = await c.env.RATE_LIMITER.limit({ key: ip })
    if (!success) {
      return c.json(
        { error: 'Too many requests — please wait a few minutes before trying again.' },
        429
      )
    }
  }

  let rawBody: unknown
  try {
    rawBody = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request format.' }, 400)
  }

  const result = EnquirySchema.safeParse(rawBody)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    return c.json({ error: 'Validation failed', fieldErrors }, 422)
  }

  const data = result.data

  const isSpam = typeof data.website === 'string' && data.website.trim().length > 0
  const honeypotTriggered = isSpam

  const sanitized = {
    name: sanitizeString(data.name),
    email: data.email,
    message: sanitizeString(data.message),
    referralSource: data.referralSource,
  }

  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  const ipHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
  const ipHash = Array.from(new Uint8Array(ipHashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const userAgent = (c.req.header('user-agent') ?? '').substring(0, 200)
  const id = crypto.randomUUID()

  try {
    await writeEnquiryToFirestore(
      {
        id,
        ...sanitized,
        honeypotTriggered,
        ipHash,
        userAgent,
        status: 'new',
        adminNotes: '',
      },
      c.env
    )
  } catch {
    return c.json({ error: 'Something went wrong — please try again, or email me directly.' }, 500)
  }

  if (!isSpam) {
    try {
      await sendNotificationEmail(sanitized, c.env)
    } catch {
      // Email failure is non-fatal — enquiry is saved
    }
  }

  return c.json(
    {
      success: true,
      message: "Thank you for reaching out. I'll be in touch within 2 working days.",
    },
    201
  )
})
