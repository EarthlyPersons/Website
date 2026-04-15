import { z } from 'zod'

export const enquiryValidator = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  referralSource: z.enum(['google_search', 'social_media', 'word_of_mouth', 'baatn_directory', 'bacp_directory', 'other']),
})

export type EnquiryInput = z.infer<typeof enquiryValidator>