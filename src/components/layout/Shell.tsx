'use client'
// ─────────────────────────────────────────────
//  Shell — wrapper principal do layout
//  Aplica data-role no container para ativar
//  o tema de acento correto via CSS custom props
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

export default function Shell({ children, role }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ShellContext.Provider
      value={{
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {/* Overlay mobile do drawer da sidebar */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fadeIn"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* data-role ativa as CSS custom properties de --accent no globals.css */}
      <div
        className="flex h-screen overflow-hidden bg-slate-50"
        data-role={role ?? undefined}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
}
