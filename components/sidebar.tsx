'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Package,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_ITEMS, USER, SIDEBAR_CONSTANTS } from '@/lib/constants/sidebar'

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0).toUpperCase()
  const last = lastName.trim().charAt(0).toUpperCase()
  return first && last ? `${first}${last}` : '?'
}

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem(SIDEBAR_CONSTANTS.COLLAPSE_STORAGE_KEY)
    const nextCollapsed = stored === 'true'
    setCollapsed(nextCollapsed)
    onCollapsedChange?.(nextCollapsed)
  }, [onCollapsedChange])

  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem(SIDEBAR_CONSTANTS.COLLAPSE_STORAGE_KEY, String(collapsed))
    onCollapsedChange?.(collapsed)
  }, [collapsed, mounted, onCollapsedChange])

  useEffect(() => {
    const node = sidebarRef.current
    if (!node) return
    node.style.setProperty('--sidebar-cursor-x', '50%')
    node.style.setProperty('--sidebar-cursor-y', '20%')

    const updateCursorGlow = (event: MouseEvent) => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
      frameRef.current = window.requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        node.style.setProperty('--sidebar-cursor-x', `${x}px`)
        node.style.setProperty('--sidebar-cursor-y', `${y}px`)
      })
    }

    const resetCursorGlow = () => {
      node.style.setProperty('--sidebar-cursor-x', '50%')
      node.style.setProperty('--sidebar-cursor-y', '20%')
    }

    node.addEventListener('mousemove', updateCursorGlow)
    node.addEventListener('mouseleave', resetCursorGlow)
    return () => {
      node.removeEventListener('mousemove', updateCursorGlow)
      node.removeEventListener('mouseleave', resetCursorGlow)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const initials = useMemo(
    () => getInitials(USER.firstName, USER.lastName),
    [],
  )
  const displayName = `${USER.firstName} ${USER.lastName}`

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'sidebar-cursor-glow fixed left-0 top-0 z-50 isolate flex h-screen flex-col overflow-hidden border-r border-sidebar-border sidebar-gradient shadow-sidebar backdrop-blur-xl',
        'w-64 transition-[width,transform] duration-300 ease-in-out',
        collapsed ? 'lg:w-[72px]' : 'lg:w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-border/80',
          collapsed ? 'justify-center px-3' : 'gap-3 px-4',
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl btn-primary-gradient shadow-primary-glow">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div
          className={cn(
            'min-w-0 overflow-hidden transition-all duration-300',
            collapsed ? 'max-w-0 translate-x-2 opacity-0' : 'max-w-[180px] translate-x-0 opacity-100',
          )}
        >
          <p className="truncate text-sm font-medium text-sidebar-foreground/55">
            Product Manager
          </p>
          <p className="truncate text-base font-semibold tracking-tight text-sidebar-foreground">
            Product Ops
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-clip py-5" aria-label="Primary navigation">
        <ul className={cn('space-y-1.5 transition-[padding] duration-300', collapsed ? 'px-2' : 'px-3')}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onMobileClose}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'group relative flex items-center overflow-visible rounded-2xl text-sm font-medium transition-all duration-200',
                    collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-3',
                    isActive
                      ? 'nav-active-gradient text-white shadow-primary-glow'
                      : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full transition-opacity duration-200',
                      isActive ? 'bg-accent opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                      isActive ? 'text-white' : 'text-sidebar-foreground/65 group-hover:text-sidebar-accent-foreground',
                    )}
                  />
                  <span
                    className={cn(
                      'overflow-hidden whitespace-nowrap transition-all duration-300',
                      collapsed ? 'max-w-0 translate-x-1 opacity-0' : 'max-w-[160px] translate-x-0 opacity-100',
                    )}
                  >
                    {label}
                  </span>
                  {collapsed ? (
                    <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 -translate-y-1/2 rounded-xl border border-sidebar-border bg-card px-2.5 py-1.5 text-xs font-medium text-card-foreground opacity-0 shadow-elevated transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                      {label}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={cn('pb-2', collapsed ? 'px-2' : 'px-3')}>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'group flex h-10 w-full items-center justify-center rounded-2xl border border-sidebar-border/80 bg-sidebar/60 text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
            {collapsed ? (
              <ChevronRight
                className={cn(
                  'absolute h-4 w-4 transition-all duration-300 ease-out',
                  'group-hover:translate-x-1 group-hover:opacity-80'
                )}
              />
            ) : (
              <ChevronLeft
                className={cn(
                  'absolute h-4 w-4 transition-all duration-300 ease-out',
                  'animate-pulse group-hover:-translate-x-1 group-hover:opacity-80'
                )}
              />
            )}
          </span>
        </button>
      </div>

      <div className={cn('border-t border-sidebar-border/80', collapsed ? 'px-2 py-3' : 'p-4')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex w-full items-center rounded-2xl border border-transparent bg-sidebar/50 px-2 py-2.5 text-left transition-colors duration-200 hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/40',
                collapsed ? 'justify-center' : 'gap-3',
              )}
              title={collapsed ? displayName : undefined}
              aria-label="Open user menu"
            >
              <Avatar className="h-10 w-10 shrink-0 ring-1 ring-sidebar-border ring-offset-2 ring-offset-sidebar">
                <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'min-w-0 flex-1 overflow-hidden transition-all duration-300',
                  collapsed ? 'max-w-0 translate-x-1 opacity-0' : 'max-w-[156px] translate-x-0 opacity-100',
                )}
              >
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/55">{USER.email}</p>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-sidebar-foreground/45 transition-all duration-300',
                  collapsed ? 'max-w-0 opacity-0' : 'max-w-6 opacity-100',
                )}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? 'center' : 'start'}
            side="top"
            sideOffset={10}
            className="w-60"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-muted-foreground">{USER.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="cursor-pointer"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {}}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              aria-label="Log out"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,255,127,0.12),transparent_32%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 sidebar-cursor-glow-layer transition-opacity duration-300" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(12,151,98,0.08))]" />
    </aside>
  )
}
