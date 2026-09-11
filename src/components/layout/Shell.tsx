'use client'
// ─────────────────────────────────────────────
//  Shell — wrapper principal do layout
//  Gerencia o estado do drawer mobile via Context
// ─────────────────────────────────────────────
import { createContext, useContext, useState } from 'react'
import type { Papel } from '@/src/types'

// ── Context ───────────────────────────────────
interface ShellContextValue {
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const ShellContext = createContext<ShellContextValue>({
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function useShell() {
  return useContext(ShellContext)
}

// ── Componente ────────────────────────────────
interface Props {
  children: React.ReactNode
  role?: Papel
}

export default function Shell({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ShellContext.Provider
      value={{
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {/* Overlay mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fadeIn"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex h-screen overflow-hidden bg-slate-50">
        {children}
      </div>
    </ShellContext.Provider>
  )
}
