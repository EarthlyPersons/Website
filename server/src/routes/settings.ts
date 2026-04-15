import { Hono } from 'hono'
import { getSiteSettings } from '../lib/firestore'
import type { WorkerBindings } from '../types/bindings'

export const settingsRoute = new Hono<{ Bindings: WorkerBindings }>()

settingsRoute.get('/settings', async (c) => {
  try {
    const settings = await getSiteSettings(c.env)
    return c.json(settings)
  } catch {
    return c.json({ acceptingNewClients: true, bannerMessage: '' })
  }
})
