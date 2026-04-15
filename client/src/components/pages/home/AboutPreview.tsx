import { Link } from 'react-router-dom'
import QuoteComponent from '../../shared/QuoteComponent'

export default function AboutPreview() {
  return (
    <section className="py-16 md:py-24 bg-mint/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display mb-6">About Me</h2>
            <p className="text-grey-soft mb-6">
              I am a qualified psychotherapeutic counsellor with years of experience helping
              individuals navigate life's challenges. My approach is compassionate, non-judgmental,
              and tailored to each person's unique journey.
            </p>
            <Link to="/about" className="text-emerald hover:underline">
              Read more about my background
            </Link>
          </div>
          <div>
            <QuoteComponent
              text="Grief can be the garden of compassion. If you keep your heart open through everything, your pain can become your greatest ally in your life's search for love and wisdom."
              author="Rumi"
              variant="subtle"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
