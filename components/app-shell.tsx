'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="app-ambient-gradient pointer-events-none absolute inset-0" aria-hidden="true" />
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          'relative flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl lg:hidden relative">
          <div className="pointer-events-none absolute inset-0 opacity-100" style={{ background: 'var(--gradient-header)' }} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative z-10 shrink-0 border border-border/70 bg-background/70"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative z-10 min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Product Manager
            </p>
            <span className="truncate text-base font-semibold tracking-tight text-foreground">
              Product Ops
            </span>
          </div>
        </header>
        <main className="relative flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-90" style={{ background: 'var(--gradient-header)' }} />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
