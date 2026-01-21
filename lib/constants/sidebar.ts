/**
 * Sidebar component constants
 */

import { Home, Package, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/owners', label: 'Owners', icon: Users },
] as const

export const USER = {
  firstName: 'Abdul',
  lastName: 'Rehman',
  email: 'abdul.rehman@gmail.com',
} as const

export const SIDEBAR_CONSTANTS = {
  COLLAPSE_STORAGE_KEY: 'product-ops-sidebar-collapsed',
} as const
