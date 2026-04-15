import BookingButton from '../../shared/BookingButton'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-cream to-mint py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-display mb-6">
          Where healing begins with safety and compassion
        </h1>
        <p className="text-xl text-grey-soft mb-8 max-w-2xl mx-auto">
          I provide psychotherapeutic counselling for adults 18+, creating a safe space for trauma-sensitive, LGBTQ+ affirming care.
        </p>
        <BookingButton />
      </div>
    </section>
  )
}