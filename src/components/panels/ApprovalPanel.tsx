'use client'
// ─────────────────────────────────────────────
//  ApprovalPanel — aprovação de eventos (gestão)
// ─────────────────────────────────────────────
import { useState } from 'react'
import { eventsApi } from '@/src/services/api'
import { CATEGORY_META } from '@/src/types'
import type { CalendarEvent, User, EventCategory } from '@/src/types'

interface Props {
  events: CalendarEvent[]
  user: User | null
  onRefresh: () => void
}

export default function ApprovalPanel({ events, user, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [motivos, setMotivos]     = useState<Record<string, string>>({})

  const pending = events.filter(ev => ev.status === 'pending')

  if (user?.papel !== 'gestao') return null

  if (pending.length === 0) {
    return (
      <Card>
        <CardHeader icon="✅" title="Aprovações" />
        <p className="text-xs text-slate-400">Nenhum evento pendente.</p>
      </Card>
    )
  }

  async function action(id: string, status: 'approved' | 'rejected') {
    setLoadingId(id)
    try {
      await eventsApi.approve(id, {
        status,
        aprovadoPor: user!.login,
        motivo: motivos[id] ?? '',
      })
      onRefresh()
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <CardHeader icon="⏳" title="Pendentes de Aprovação" />
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {pending.length}
        </span>
      </div>

      <div className="space-y-3">
        {pending.map(ev => {
          const meta = CATEGORY_META[ev.category as EventCategory] ?? CATEGORY_META.blue
          const isLoading = loadingId === ev.id

          return (
            <div key={ev.id} className="border border-slate-100 rounded-xl p-3">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: meta.hex }} />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-800 truncate">{ev.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    {ev.autor_login ? ` · ${ev.autor_login}` : ''}
                  </div>
                  {ev.nota && <div className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.nota}</div>}
                </div>
              </div>

              <input
                placeholder="Motivo (opcional)..."
                value={motivos[ev.id] ?? ''}
                onChange={e => setMotivos(m => ({ ...m, [ev.id]: e.target.value }))}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg mb-2
                           focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => action(ev.id, 'approved')}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white
                             bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  ✓ Aprovar
                </button>
                <button
                  onClick={() => action(ev.id, 'rejected')}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white
                             bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  ✕ Rejeitar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Utilitários internos ──────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      {children}
    </div>
  )
}

function CardHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base" aria-hidden="true">{icon}</span>
      <h3 className="font-bold text-sm text-slate-800">{title}</h3>
    </div>
  )
}
