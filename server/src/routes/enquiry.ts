import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { EnquiryDocument, ReferralSource } from '../../../shared/types/enquiry'

const enquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  referralSource: z.enum(['google_search', 'social_media', 'word_of_mouth', 'baatn_directory', 'bacp_directory', 'other']),
  website: z.string().optional(), // honeypot
})

const app = new Hono()

app.post('/', zValidator('json', enquirySchema), async (c) => {
  const body = c.req.valid('json')

  // Check honeypot
  if (body.website) {
    return c.json({ success: true }) // Pretend success for bots
  }

  // Here we would save to Firestore and send email
  // Placeholder response
  return c.json({ success: true, message: 'Enquiry submitted successfully' })
})

export default app