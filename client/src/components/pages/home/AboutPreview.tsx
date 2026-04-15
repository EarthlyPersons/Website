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
              I am a qualified psychotherapeutic counsellor with years of experience helping individuals navigate life's challenges. My approach is compassionate, non-judgmental, and tailored to each person's unique journey.
            </p>
            <Link to="/about" className="text-emerald hover:underline">Read more about my background</Link>
          </div>
          <div>
            <QuoteComponent
              quote="The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed."
              author="Carl Jung"
            />
          </div>
        </div>
      </div>
    </section>
  )
}