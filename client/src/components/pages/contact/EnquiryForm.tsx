import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '../../../lib/utils'

const REFERRAL_VALUES = [
  'google_search',
  'social_media',
  'word_of_mouth',
  'baatn_directory',
  'bacp_directory',
  'other',
] as const

type ReferralValue = (typeof REFERRAL_VALUES)[number]

function isReferralValue(value: string): value is ReferralValue {
  return (REFERRAL_VALUES as readonly string[]).includes(value)
}

const EnquiryFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Please write a short message')
    .max(2000, 'Please keep your message under 2000 characters'),
  referralSource: z
    .string()
    .refine(isReferralValue, { message: 'Please select how you heard about me' }),
  website: z.string().optional(),
})

type EnquiryFormData = z.infer<typeof EnquiryFormSchema>

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

function apiBase(): string {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
}

export default function EnquiryForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(EnquiryFormSchema),
  })

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitState('submitting')
    try {
      const response = await fetch(`${apiBase()}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(json.error ?? 'Submission failed')
      }

      setSubmitState('success')
      setServerMessage(json.message ?? "Thank you — I'll be in touch soon.")
      reset()
    } catch {
      setSubmitState('error')
      setServerMessage('Something went wrong — please try again, or email me directly.')
    }
  }

  if (submitState === 'success') {
    return (
      <div role="status" aria-live="polite" className="bg-mint/30 rounded-2xl p-8 text-center">
        <p className="font-display text-xl text-grey-deep">{serverMessage}</p>
        <p className="mt-2 font-body text-sm text-grey-soft">
          Taking this step takes courage. I look forward to connecting with you.
        </p>
      </div>
    )
  }

  const fieldClass =
    'mt-1 w-full rounded-2xl border border-mint bg-cream px-4 py-3 font-body text-grey-deep shadow-sm focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/30'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-label="Enquiry form"
    >
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label htmlFor="name" className="font-body text-sm font-medium text-grey-deep">
          Your name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={cn(fieldClass, errors.name && 'border-emerald ring-2 ring-emerald/20')}
          {...register('name')}
        />
        {errors.name ? (
          <p id="name-error" role="alert" className="mt-1 text-xs text-emerald">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="font-body text-sm font-medium text-grey-deep">
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn(fieldClass, errors.email && 'border-emerald ring-2 ring-emerald/20')}
          {...register('email')}
        />
        {errors.email ? (
          <p id="email-error" role="alert" className="mt-1 text-xs text-emerald">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="referralSource" className="font-body text-sm font-medium text-grey-deep">
          How did you hear about me? <span aria-hidden="true">*</span>
        </label>
        <select
          id="referralSource"
          aria-required="true"
          aria-invalid={errors.referralSource ? 'true' : 'false'}
          className={cn(
            fieldClass,
            errors.referralSource && 'border-emerald ring-2 ring-emerald/20'
          )}
          defaultValue=""
          {...register('referralSource')}
        >
          <option value="" disabled>
            Please select&hellip;
          </option>
          <option value="google_search">Google Search</option>
          <option value="social_media">Social Media</option>
          <option value="word_of_mouth">Word of Mouth</option>
          <option value="baatn_directory">BAATN Directory</option>
          <option value="bacp_directory">BACP Directory</option>
          <option value="other">Other</option>
        </select>
        {errors.referralSource ? (
          <p role="alert" className="mt-1 text-xs text-emerald">
            {errors.referralSource.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="font-body text-sm font-medium text-grey-deep">
          Your message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          placeholder="You don't need to have the right words. Just share a little about what's brought you here, and we'll take it from there."
          className={cn(
            fieldClass,
            'resize-none',
            errors.message && 'border-emerald ring-2 ring-emerald/20'
          )}
          {...register('message')}
        />
        {errors.message ? (
          <p id="message-error" role="alert" className="mt-1 text-xs text-emerald">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <p className="font-body text-xs text-grey-soft leading-relaxed">
        By using this form you consent to the storage and handling of your data by this website.
        Your information is kept securely and will only be used to respond to your enquiry. It will
        never be shared with third parties.
      </p>

      {submitState === 'error' ? (
        <p role="alert" className="font-body text-sm text-emerald">
          {serverMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="w-full rounded-full bg-emerald px-8 py-3 font-body text-cream transition-colors hover:bg-emerald/90 disabled:cursor-not-allowed disabled:opacity-70"
        aria-busy={submitState === 'submitting'}
      >
        {submitState === 'submitting' ? 'Sending…' : "I'm ready to reach out"}
      </button>
    </form>
  )
}
