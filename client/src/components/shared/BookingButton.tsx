import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

interface BookingButtonProps {
  className?: string
}

export default function BookingButton({ className = '' }: BookingButtonProps) {
  return (
    <Link
      to="/contact"
      className={`inline-flex items-center space-x-2 rounded-full bg-emerald text-cream px-8 py-3 font-body hover:bg-emerald/90 transition-colors ${className}`}
    >
      <Calendar className="h-5 w-5" />
      <span>Take the next step</span>
    </Link>
  )
}
