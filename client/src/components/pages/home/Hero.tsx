import BookingButton from '../../shared/BookingButton'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald to-sage py-20 text-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-display mb-6 text-cream">
          Where healing begins with safety and compassion
        </h1>
        <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto font-body leading-relaxed">
          I provide psychotherapeutic counselling for adults 18+, creating a safe space for
          trauma-sensitive, LGBTQ+ affirming care.
        </p>
        <BookingButton className="bg-cream text-emerald hover:bg-cream/90" />
      </div>
    </section>
  )
}
