import BookingButton from '../../shared/BookingButton'

export default function ContactCTA() {
  return (
    <section className="py-16 md:py-24 bg-emerald text-cream text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-display mb-6">Ready to Begin Your Journey?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          I'm here to support you with compassion and expertise. Reach out today to take the first step towards healing.
        </p>
        <BookingButton className="bg-cream text-emerald hover:bg-cream/90" />
      </div>
    </section>
  )
}