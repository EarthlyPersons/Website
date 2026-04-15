interface AnnouncementBannerProps {
  message: string
  isVisible: boolean
}

export default function AnnouncementBanner({ message, isVisible }: AnnouncementBannerProps) {
  if (!isVisible) return null

  return (
    <div className="bg-emerald text-cream py-3 text-center">
      <p className="text-sm">{message}</p>
    </div>
  )
}