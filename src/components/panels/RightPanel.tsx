'use client'
// ─────────────────────────────────────────────
//  RightPanel — painel lateral direito
//  Desktop: sidebar fixa | Mobile: bottom-sheet
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react'
import ApprovalPanel from './ApprovalPanel'
import ChatPanel from './ChatPanel'
import { scheduleApi } from '@/src/services/api'
import { CATEGORY_META } from '@/src/types'
import type { CalendarEvent, User, EventCategory, Schedule } from '@/src/types'

interface Props {
  user: User | null
  events: CalendarEvent[]
  onRefresh: () => void
}

type Tab = 'overview' | 'horarios'

export default function RightPanel({ user, events, onRefresh }: Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    scheduleApi.list().then(r => setSchedules(r.schedules ?? [])).catch(() => {})
  }, [])

  // Fechar com Escape no mobile
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const upcoming = [...events]
    .filter(ev => user?.papel === 'aluno' ? ev.status === 'approved' : true)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(ev => ev.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 5)

  const content = (
    <>
      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-white px-2 pt-3 shrink-0">
        {(['overview', 'horarios'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ minHeight: '44px' }}
            className={`flex-1 text-xs font-bold pb-2.5 border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === 'overview' ? '📋 Visão Geral' : '📊 Horários'}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' ? (
          <>
            <ApprovalPanel events={events} user={user} onRefresh={onRefresh} />

            {/* Próximos eventos */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base" aria-hidden="true">📅</span>
                <h3 className="font-bold text-sm text-slate-800">Próximos Eventos</h3>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum evento cadastrado.</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map(ev => {
                    const meta = CATEGORY_META[ev.category as EventCategory] ?? CATEGORY_META.blue
                    return (
                      <li key={ev.id} className="flex items-start gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: meta.hex }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">{ev.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            {ev.status === 'pending' && (
                              <span className="text-amber-500 font-semibold">· pendente</span>
                            )}
                            {ev.status === 'rejected' && (
                              <span className="text-red-500 font-semibold">· rejeitado</span>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <ChatPanel user={user} />
          </>
        ) : (
          <ScheduleView schedules={schedules} user={user} onRefresh={() =>
            scheduleApi.list().then(r => setSchedules(r.schedules ?? [])).catch(() => {})
          } />
        )}
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop ── */}
      <aside className="hidden md:flex flex-col w-80 shrink-0 h-full border-l border-slate-100 bg-slate-50/50">
        {content}
      </aside>

      {/* ── Mobile: FAB + bottom-sheet ── */}
      <div className="md:hidden">
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full shadow-lg
                       bg-[var(--accent)] text-white text-2xl
                       flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Abrir painel de informações"
          >
            📋
          </button>
        )}

        {mobileOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/40 animate-fadeIn"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            {/* Bottom-sheet com slideInUp */}
            <div
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col
                         bg-slate-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)]
                         animate-slideInUp"
              style={{ maxHeight: '80vh' }}
              role="dialog"
              aria-modal="true"
              aria-label="Painel lateral"
            >
              {/* Handle visual de arraste */}
              <div className="flex flex-col items-center px-4 pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300 mb-2" />
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full
                               text-slate-400 hover:bg-slate-200 transition-colors"
                    aria-label="Fechar painel"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {content}
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ── Horários ──────────────────────────────────
function ScheduleView({
  schedules,
  user,
}: {
  schedules: Schedule[]
  user: User | null
  onRefresh: () => void
}) {
  const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <span className="text-2xl mb-2 block" aria-hidden="true">📊</span>
        <p className="text-xs text-slate-400">Nenhum horário cadastrado.</p>
        {user?.papel === 'gestao' && (
          <p className="text-[11px] text-slate-300 mt-1">
            Adicione horários pelo painel de gestão.
          </p>
        )}
      </div>
    )
  }

  const byTurma = schedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    acc[s.turma] = [...(acc[s.turma] ?? []), s]
    return acc
  }, {})

  return (
    <div className="space-y-3">
      {Object.entries(byTurma).map(([turma, items]) => (
        <div key={turma} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🏫</span>
            {turma}
          </h4>
          <ul className="space-y-1.5">
            {items
              .sort((a, b) => a.dia - b.dia || a.slot - b.slot)
              .map(s => (
                <li key={s.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold w-16 text-slate-400 shrink-0">{DIAS[s.dia]}</span>
                  <span className="bg-slate-100 rounded px-2 py-0.5 shrink-0">{s.slot}º</span>
                  <span className="truncate">{s.disciplina}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
