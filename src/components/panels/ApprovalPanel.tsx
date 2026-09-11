'use client'
// ─────────────────────────────────────────────
//  ApprovalPanel — aprovação de eventos (gestão)
//  Motivo é obrigatório para rejeição.
// ─────────────────────────────────────────────
import { useState } from 'react'
import { eventsApi } from '@/src/services/api'
import { CATEGORY_META } from '@/src/types'
import type { CalendarEvent, User, EventCategory } from '@/src/types'
import Spinner from '@/src/components/ui/Spinner'
import Badge from '@/src/components/ui/Badge'

interface Props {
  events: CalendarEvent[]
  user: User | null
  onRefresh: () => void
}

export default function ApprovalPanel({ events, user, onRefresh }: Props) {
  const [loadingId, setLoadingId]   = useState<string | null>(null)
  const [motivos, setMotivos]       = useState<Record<string, string>>({})
  const [motivoErro, setMotivoErro] = useState<Record<string, boolean>>({})

  const pending = events.filter(ev => ev.status === 'pending')

  // Só exibe para gestão
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
    // Motivo obrigatório para rejeição
    if (status === 'rejected' && !motivos[id]?.trim()) {
      setMotivoErro(m => ({ ...m, [id]: true }))
      return
    }
    setMotivoErro(m => ({ ...m, [id]: false }))
    setLoadingId(id)
    try {
      await eventsApi.approve(id, {
        status,
        aprovadoPor: user!.login,
        motivo: motivos[id]?.trim() ?? '',
      })
      // Limpar motivo após ação
      setMotivos(m => { const n = { ...m }; delete n[id]; return n })
      onRefresh()
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <CardHeader icon="⏳" title="Pendentes de Aprovação" />
        <Badge variant="amber">{pending.length}</Badge>
      </div>

      <div className="space-y-3">
        {pending.map(ev => {
          const meta = CATEGORY_META[ev.category as EventCategory] ?? CATEGORY_META.blue
          const isLoading = loadingId === ev.id
          const hasErro   = !!motivoErro[ev.id]

          return (
            <div key={ev.id} className="border border-slate-100 rounded-xl p-3">
              {/* Info do evento */}
              <div className="flex items-start gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: meta.hex }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-800 truncate">{ev.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    {ev.autor_login ? ` · ${ev.autor_login}` : ''}
                  </div>
                  {ev.nota && (
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.nota}</div>
                  )}
                </div>
              </div>

              {/* Input de motivo */}
              <div className="mb-2">
                <input
                  placeholder={hasErro ? 'Motivo obrigatório para rejeitar...' : 'Motivo (opcional para aprovar)...'}
                  value={motivos[ev.id] ?? ''}
                  onChange={e => {
                    setMotivos(m => ({ ...m, [ev.id]: e.target.value }))
                    if (e.target.value.trim()) {
                      setMotivoErro(m => ({ ...m, [ev.id]: false }))
                    }
                  }}
                  className={`w-full text-xs px-2.5 py-1.5 border rounded-lg
                    focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all
                    ${hasErro
                      ? 'border-red-400 bg-red-50 placeholder-red-400'
                      : 'border-slate-200'}`}
                />
                {hasErro && (
                  <p className="text-[11px] text-red-500 mt-1 animate-fadeSlideDown">
                    Informe o motivo antes de rejeitar.
                  </p>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => action(ev.id, 'approved')}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white
                             bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50
                             transition-colors flex items-center justify-center gap-1"
                >
                  {isLoading ? <Spinner size="sm" /> : '✓'}
                  Aprovar
                </button>
                <button
                  onClick={() => action(ev.id, 'rejected')}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white
                             bg-red-500 hover:bg-red-600 disabled:opacity-50
                             transition-colors flex items-center justify-center gap-1"
                >
                  {isLoading ? <Spinner size="sm" /> : '✕'}
                  Rejeitar
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
