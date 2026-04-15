import type { ComponentType } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

export type NavItem = {
  to: string
  label: string
}

export type AppRoute = {
  path: string
  component: ComponentType
}

export const navItems: NavItem[] = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export const appRoutes: AppRoute[] = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/services', component: Services },
  { path: '/contact', component: Contact },
  { path: '/privacy', component: Privacy },
  { path: '*', component: NotFound },
]
