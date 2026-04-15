import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { navItems } from '../../navigation'

export default function Navbar() {
  return (
    <nav className="bg-cream border-b border-mint/40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-emerald" />
            <span className="font-display text-xl">Healing Practice</span>
          </Link>
          <div className="space-x-6">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="text-grey-deep hover:text-emerald">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
