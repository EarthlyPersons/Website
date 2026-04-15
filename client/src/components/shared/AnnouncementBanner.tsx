import { X } from 'lucide-react'
import { useBannerStore } from '../../hooks/useBannerStore'
import { cn } from '../../lib/utils'

interface AnnouncementBannerProps {
  message: string
  visible: boolean
}

export default function AnnouncementBanner({ message, visible }: AnnouncementBannerProps) {
  const { dismissed, dismiss } = useBannerStore()

  if (!visible || dismissed) return null

  return (
    <div
      role="banner"
      aria-live="polite"
      className={cn(
        'bg-emerald text-cream py-2 px-4 text-center text-sm font-body',
        'flex items-center justify-center gap-4'
      )}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 text-cream/70 hover:text-cream transition-colors"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
