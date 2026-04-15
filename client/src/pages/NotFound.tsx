import { Link } from 'react-router-dom'
import SectionWrapper from '../components/shared/SectionWrapper'

export default function NotFound() {
  return (
    <SectionWrapper>
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl text-grey-deep mb-4">Page not found</h1>
        <p className="font-body text-lg text-grey-soft leading-relaxed mb-8">
          That link does not lead anywhere on this site. If you were looking for support, you have
          not done anything wrong — sometimes pages move, or a link gets mistyped.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-emerald px-8 py-3 font-body text-cream hover:bg-emerald/90 transition-colors"
        >
          Take the next step
        </Link>
      </div>
    </SectionWrapper>
  )
}
