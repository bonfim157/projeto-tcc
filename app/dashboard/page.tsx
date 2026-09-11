'use client'
// ─────────────────────────────────────────────
//  Dashboard — página principal do sistema
//  Aplica data-role no Shell para ativar o tema
// ─────────────────────────────────────────────
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/src/hooks/useAuth'
import { useEvents } from '@/src/hooks/useEvents'
import { Shell, Sidebar, Topbar } from '@/src/components/layout'
import { Calendar } from '@/src/components/calendar'
import { RightPanel } from '@/src/components/panels'

// ── Skeleton de carregamento ──────────────────
function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 shrink-0 h-full flex-col gap-4 p-4 bg-slate-200">
        <div className="h-12 rounded-xl bg-slate-300/60 animate-pulse" />
        <div className="h-12 rounded-xl bg-slate-300/60 animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-slate-300/60 animate-pulse" />
        ))}
      </div>
      {/* Conteúdo skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 shrink-0 bg-white border-b border-slate-100 animate-pulse" />
        <div className="flex-1 p-6 grid grid-cols-7 gap-2 content-start">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Inner (depende de searchParams — precisa de Suspense) ──
function DashboardInner() {
  const searchParams = useSearchParams()
  const activeView   = searchParams.get('view') ?? undefined

  const { user, loading: authLoading, logout } = useAuth()
  const { events, reload }                      = useEvents()

  if (authLoading) return <DashboardSkeleton />

  return (
    // role passado para Shell que aplica data-role e ativa --accent correto
    <Shell role={user?.papel}>
      <Sidebar user={user} activeView={activeView} onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={user} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Calendar events={events} user={user} onEventCreated={reload} />
          <RightPanel user={user} events={events} onRefresh={reload} />
        </div>
      </div>
    </Shell>
  )
}

// ── Export ────────────────────────────────────
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardInner />
    </Suspense>
  )
}
