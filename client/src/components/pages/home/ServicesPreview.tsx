import { Link } from 'react-router-dom'

export default function ServicesPreview() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-display text-center mb-12">My Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Individual Counselling</h3>
            <p className="text-grey-soft">One-on-one sessions tailored to your needs.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Trauma-Informed Care</h3>
            <p className="text-grey-soft">Sensitive approach to healing from trauma.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Online Sessions</h3>
            <p className="text-grey-soft">Convenient, secure online counselling.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/services" className="text-emerald hover:underline">Learn more about my services</Link>
        </div>
      </div>
    </section>
  )
}