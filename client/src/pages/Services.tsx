import { useState } from 'react'
import QuoteComponent from '../components/shared/QuoteComponent'
import BookingButton from '../components/shared/BookingButton'
import SectionWrapper from '../components/shared/SectionWrapper'

const feeTabs = [
  {
    id: 'fees',
    label: 'Fees',
    body: 'My standard session fee is £55 for a 50-minute online session. If you are unsure whether ongoing counselling is right for you, we can discuss what would feel supportive as a first step.',
  },
  {
    id: 'cancellations',
    label: 'Cancellations',
    body: 'If you need to cancel or reschedule, please give at least 48 hours notice where possible. Late cancellations may be charged at the full session rate, because that time is held for you.',
  },
  {
    id: 'reduced',
    label: 'Reduced rate',
    body: 'I keep a small number of reduced-fee spaces for people who need them. If cost is a barrier, you are welcome to ask what is available. There is no shame in naming what you can manage.',
  },
] as const

const faqs = [
  {
    q: 'What is online counselling like?',
    a: 'We meet over a secure video call. You choose a private space where you can speak without being overheard, and we build a steady rhythm from week to week.',
  },
  {
    q: 'What happens in a first session?',
    a: 'We focus on safety and context. You can share as much or as little as you want. There is no pressure to tell your whole story in one go.',
  },
  {
    q: 'How long will I need counselling?',
    a: 'That depends on what you are carrying and what you want from our work together. Some people come for a focused period; others prefer longer-term support.',
  },
  {
    q: 'Do you work with trauma?',
    a: 'Yes, with care. Trauma work is paced carefully, with attention to grounding and choice. You can pause or slow down at any point.',
  },
  {
    q: 'Is what I say confidential?',
    a: 'Confidentiality is essential to counselling. There are legal exceptions (for example, risk of serious harm), and I will explain these clearly before we begin.',
  },
  {
    q: 'What if I am not sure counselling is right for me?',
    a: 'That uncertainty is welcome. We can explore what you need, what feels scary, and what might help you feel safer deciding your next step.',
  },
] as const

export default function Services() {
  const [activeTab, setActiveTab] = useState<(typeof feeTabs)[number]['id']>('fees')

  return (
    <>
      <SectionWrapper>
        <h1 className="font-display text-3xl md:text-4xl text-grey-deep text-center mb-6">
          How I can help
        </h1>
        <p className="font-body text-lg text-grey-soft text-center max-w-3xl mx-auto leading-relaxed">
          I offer one-to-one psychotherapeutic counselling online. My approach is trauma-sensitive,
          relationship-based, and grounded in respect for your autonomy.
        </p>
      </SectionWrapper>

      <SectionWrapper className="bg-mint/20">
        <h2 className="font-display text-2xl md:text-3xl text-grey-deep mb-6">What to expect</h2>
        <p className="font-body text-base text-grey-soft leading-relaxed mb-4">
          Sessions are 50 minutes. We begin with what matters most for you today. Sometimes that
          means talking, sometimes it means slowing down, noticing your body, or finding language
          for something that has felt hard to name.
        </p>
        <p className="font-body text-base text-grey-soft leading-relaxed">
          You are always allowed to ask questions about how we work. Transparency helps safety grow.
        </p>
      </SectionWrapper>

      <SectionWrapper>
        <QuoteComponent
          text="Healing is remembering without reopening the wound."
          author="Teju Cole"
          variant="hero"
        />
      </SectionWrapper>

      <SectionWrapper className="bg-cream">
        <h2 className="font-display text-2xl md:text-3xl text-grey-deep text-center mb-8">
          Practical details
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {feeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald text-cream'
                  : 'border border-emerald text-emerald hover:bg-mint/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-mint/20 p-8">
          <p className="font-body text-base text-grey-soft leading-relaxed">
            {feeTabs.find((t) => t.id === activeTab)?.body}
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="font-display text-2xl md:text-3xl text-grey-deep mb-6">
          Questions people often ask
        </h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-mint bg-cream p-4 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer font-body text-sm font-medium text-grey-deep list-none [&::-webkit-details-marker]:hidden">
                <span className="block pr-6">{item.q}</span>
              </summary>
              <p className="mt-3 font-body text-sm text-grey-soft leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-mint/20">
        <QuoteComponent
          text="Unhealed trauma acts like a rock thrown into a pond; it causes ripples that move outward, affecting many other bodies over time."
          author="Resmaa Menakem"
          variant="subtle"
        />
        <div className="text-center mt-8">
          <BookingButton />
        </div>
      </SectionWrapper>
    </>
  )
}
