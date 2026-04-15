import QuoteComponent from '../components/shared/QuoteComponent'
import BookingButton from '../components/shared/BookingButton'
import SectionWrapper from '../components/shared/SectionWrapper'

export default function About() {
  return (
    <>
      <SectionWrapper>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-grey-deep mb-6">
              A little about me
            </h1>
            <p className="font-body text-base text-grey-soft leading-relaxed mb-4">
              I work as an online psychotherapeutic counsellor for adults (18+). My practice is
              built around safety, consent, and respect for the pace your nervous system can manage.
            </p>
            <p className="font-body text-base text-grey-soft leading-relaxed mb-4">
              I am committed to LGBTQ+ affirming care and to honouring the strengths that have
              carried you this far. You are not a problem to fix. You are a person responding to
              what has happened in your life.
            </p>
            <p className="font-body text-base text-grey-soft leading-relaxed">
              I am a registered BAATN member and an MBACP member. Memberships are part of how I stay
              accountable to ethical practice and ongoing learning.
            </p>
          </div>
          <div className="rounded-2xl bg-mint/30 p-8">
            <p className="font-body text-sm font-medium text-grey-deep mb-2">A note on photos</p>
            <p className="font-body text-sm text-grey-soft leading-relaxed">
              A professional portrait can be added here when you are ready. For now, this space is
              kept simple so the focus stays on what matters: how it feels to reach out.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-mint/20">
        <h2 className="font-display text-2xl md:text-3xl text-grey-deep mb-6">How I work</h2>
        <p className="font-body text-base text-grey-soft leading-relaxed mb-4">
          I work online, which means you can meet from a place that feels safest for you. Sessions
          are conversational, grounded, and paced with attention to overwhelm. We go gently,
          especially where trauma is present.
        </p>
        <p className="font-body text-base text-grey-soft leading-relaxed">
          I will not rush you into disclosure. Trust is something we build together, in small,
          repeatable steps.
        </p>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="font-display text-2xl md:text-3xl text-grey-deep mb-6">Who I work with</h2>
        <ul className="font-body text-base text-grey-soft space-y-3 leading-relaxed list-disc pl-5">
          <li>Adults navigating anxiety, low mood, and burnout</li>
          <li>People living with the impact of trauma and shame</li>
          <li>Support around grief, change, and identity</li>
          <li>Domestic abuse recovery (gentle pacing, safety first)</li>
        </ul>
      </SectionWrapper>

      <SectionWrapper className="bg-cream">
        <QuoteComponent
          text="You may not control all the events that happen to you, but you can decide not to be reduced by them."
          author="Maya Angelou"
          variant="default"
        />
        <div className="text-center mt-8">
          <BookingButton />
        </div>
      </SectionWrapper>
    </>
  )
}
