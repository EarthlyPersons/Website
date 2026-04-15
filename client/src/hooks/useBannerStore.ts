import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BannerState {
  dismissed: boolean
  dismiss: () => void
  reset: () => void
}

export const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
      reset: () => set({ dismissed: false }),
    }),
    {
      name: 'announcement-banner',
    }
  )
)
