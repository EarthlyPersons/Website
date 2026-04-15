import type { WorkerBindings } from '../types/bindings'

type EnquiryEmailPayload = {
  name: string
  email: string
  message: string
  referralSource: string
}

export async function sendNotificationEmail(
  data: EnquiryEmailPayload,
  env: WorkerBindings
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.ADMIN_NOTIFICATION_EMAIL) {
    throw new Error('Email is not configured')
  }

  const from = env.RESEND_FROM?.trim() || 'Healing Practice <onboarding@resend.dev>'

  const text = [
    'New website enquiry',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Referral: ${data.referralSource}`,
    '',
    'Message:',
    data.message,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [env.ADMIN_NOTIFICATION_EMAIL],
      reply_to: data.email,
      subject: `New enquiry from ${data.name}`,
      text,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Resend error: ${res.status} ${errText}`)
  }
}
