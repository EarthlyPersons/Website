import { useEffect, useState } from 'react'
import AnnouncementBanner from '../shared/AnnouncementBanner'

type SettingsPayload = {
  acceptingNewClients?: boolean
  bannerMessage?: string
}

function apiBase(): string {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
}

export default function BannerGate() {
  const [payload, setPayload] = useState<SettingsPayload | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    void fetch(`${apiBase()}/api/settings`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SettingsPayload | null) => {
        setPayload(data ?? { acceptingNewClients: true, bannerMessage: '' })
      })
      .catch(() => {
        setPayload({ acceptingNewClients: true, bannerMessage: '' })
      })
    return () => controller.abort()
  }, [])

  const accepting = payload?.acceptingNewClients !== false
  const message = (payload?.bannerMessage ?? '').trim()
  const visible = accepting && message.length > 0

  return <AnnouncementBanner message={message} visible={visible} />
}
