import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-grey-deep text-cream py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-lg text-cream">Healing Practice</p>
          <p className="mt-2 font-body text-xs text-cream/60 leading-relaxed">
            Where healing begins with safety and compassion.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="space-y-2 font-body text-sm text-cream/80">
            <li>
              <Link to="/" className="hover:text-cream transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-cream transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-cream transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream transition-colors">
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-body text-xs text-cream/60 tracking-wide mb-2">Memberships</p>
          <div className="space-y-1 font-body text-sm text-cream/80">
            <p>Registered BAATN Member</p>
            <p>MBACP Member</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-cream/10">
        <p className="font-body text-xs text-cream/40 text-center">
          &copy; {currentYear} Healing Practice. All rights reserved. |{' '}
          <Link to="/privacy" className="underline hover:text-cream/70">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  )
}
