'use client'
// ─────────────────────────────────────────────
//  Calendar — grade mensal + vista semanal
// ─────────────────────────────────────────────
import { useMemo, useState } from 'react'
import { CATEGORY_META } from '@/src/types'
import type { CalendarEvent, User, EventCategory } from '@/src/types'
import EventModal from './EventModal'
import WeekView from './WeekView'

// ── Constantes ────────────────────────────────
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DAYS_LONG  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DAYS_SHORT = ['D',   'S',   'T',   'Q',   'Q',   'S',   'S']

type ViewMode = 'month' | 'week'

function todayISO(): string {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function dateISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Retorna o domingo da semana que contém a data */
function getWeekStart(d: Date): Date {
  const date = new Date(d)
  date.setDate(d.getDate() - d.getDay())
  date.setHours(0, 0, 0, 0)
  return date
}

// ── Props ─────────────────────────────────────
interface Props {
  events: CalendarEvent[]
  user: User | null
  onEventCreated: () => void
}

// ── Componente principal ──────────────────────
export default function Calendar({ events, user, onEventCreated }: Props) {
  const today = todayISO()

  // Estado de navegação
  const [view, setView]         = useState<ViewMode>('month')
  const [year, setYear]         = useState(new Date().getFullYear())
  const [month, setMonth]       = useState(new Date().getMonth())
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

  // Estado de interação
  const [modalDate, setModal]   = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const canCreate = user?.papel === 'professor' || user?.papel === 'gestao'

  // ── Navegação ─────────────────────────────
  function goToday() {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setWeekStart(getWeekStart(now))
  }

  function prevPeriod() {
    if (view === 'month') {
      if (month === 0) { setMonth(11); setYear(y => y - 1) }
      else setMonth(m => m - 1)
    } else {
      setWeekStart(w => {
        const d = new Date(w)
        d.setDate(d.getDate() - 7)
        return d
      })
    }
  }

  function nextPeriod() {
    if (view === 'month') {
      if (month === 11) { setMonth(0); setYear(y => y + 1) }
      else setMonth(m => m + 1)
    } else {
      setWeekStart(w => {
        const d = new Date(w)
        d.setDate(d.getDate() + 7)
        return d
      })
    }
  }

  // Título do período
  const periodTitle = view === 'month'
    ? `${MONTHS[month]} ${year}`
    : (() => {
        const end = new Date(weekStart)
        end.setDate(weekStart.getDate() + 6)
        const fmtShort = (d: Date) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
        return `${fmtShort(weekStart)} – ${fmtShort(end)}`
      })()

  // Células do mês
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    return [
      ...Array<null>(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => ({
        day: i + 1,
        date: dateISO(year, month, i + 1),
      })),
    ]
  }, [year, month])

  // Filtrar eventos visíveis por papel
  function visibleEvents(date: string): CalendarEvent[] {
    const evs = events.filter(ev => ev.date === date)
    if (user?.papel === 'aluno') return evs.filter(ev => ev.status === 'approved')
    return evs
  }

  const monthTotal = events.filter(ev => {
    const d = new Date(ev.date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        {/* Navegação de período */}
        <div className="flex items-center gap-2">
          <NavBtn onClick={prevPeriod} label={view === 'month' ? 'Mês anterior' : 'Semana anterior'}>‹</NavBtn>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 min-w-[14rem] text-center">
            {periodTitle}
          </h2>
          <NavBtn onClick={nextPeriod} label={view === 'month' ? 'Próximo mês' : 'Próxima semana'}>›</NavBtn>
        </div>

        {/* Ações à direita */}
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          {/* Alternar vista */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setView('month')}
              className={`text-xs px-3 py-1.5 font-semibold transition-colors ${
                view === 'month'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setView('week')}
              className={`text-xs px-3 py-1.5 font-semibold transition-colors ${
                view === 'week'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Hoje */}
          <button
            onClick={goToday}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500
                       hover:bg-slate-100 transition-colors"
          >
            Hoje
          </button>

          {/* Novo Evento */}
          {canCreate && (
            <button
              onClick={() => setModal(today)}
              className="rounded-lg font-bold bg-[var(--accent)] text-white
                         hover:opacity-90 active:scale-95 transition-all shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50
                         w-11 h-11 flex items-center justify-center text-xl
                         sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:text-sm"
              aria-label="Novo evento"
            >
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ Novo Evento</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Vista Mensal ── */}
      {view === 'month' && (
        <>
          {/* Cabeçalho dias */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {DAYS_LONG.map((d, i) => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1.5">
                <span className="sm:hidden">{DAYS_SHORT[i]}</span>
                <span className="hidden sm:inline">{d}</span>
              </div>
            ))}
          </div>

          {/* Grade */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} className="min-h-16 sm:min-h-24" />

              const evs = visibleEvents(cell.date)
              const isToday = cell.date === today
              const isExp   = expanded === cell.date

              return (
                <div
                  key={cell.date}
                  onClick={() => canCreate && setModal(cell.date)}
                  className={[
                    'min-h-16 sm:min-h-24 rounded-lg p-1.5 md:p-2',
                    'relative group border transition-all',
                    isToday
                      ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5 shadow-[0_0_0_2px_var(--accent)]'
                      : 'border-slate-100 bg-white hover:border-[var(--accent)]/30 hover:shadow-sm',
                    canCreate ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  {/* Número do dia + badge */}
                  <div className="relative inline-block">
                    <span className={`text-xs font-bold block mb-1 ${
                      isToday ? 'text-[var(--accent)] font-extrabold' : 'text-slate-400'
                    }`}>
                      {cell.day}
                    </span>
                    {evs.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px]
                                       font-bold flex items-center justify-center bg-[var(--accent)] text-white shadow-sm">
                        {evs.length}
                      </span>
                    )}
                  </div>

                  {/* Eventos */}
                  {evs.length > 0 && (
                    <EventList
                      events={evs}
                      date={cell.date}
                      expanded={isExp}
                      onToggle={() => setExpanded(isExp ? null : cell.date)}
                    />
                  )}

                  {/* Botão + hover */}
                  {canCreate && (
                    <button
                      onClick={e => { e.stopPropagation(); setModal(cell.date) }}
                      className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full
                                 bg-[var(--accent)] text-white text-xs font-bold
                                 flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity
                                 focus:opacity-100 focus:outline-none"
                      aria-label={`Adicionar evento em ${cell.day}/${month + 1}`}
                    >
                      +
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
            {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: meta.light, border: `1px solid ${meta.dark}` }}
                />
                <span>{meta.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>⏳</span>
              <span>Pendente de aprovação</span>
            </div>
          </div>

          {/* Contador */}
          <div className="mt-3 text-sm text-slate-400">
            Total este mês:{' '}
            <span className="font-semibold text-slate-700">{monthTotal}</span>
          </div>
        </>
      )}

      {/* ── Vista Semanal ── */}
      {view === 'week' && (
        <WeekView
          weekStart={weekStart}
          events={events}
          user={user}
          onDayClick={date => canCreate && setModal(date)}
        />
      )}

      {/* Modal */}
      {modalDate && canCreate && (
        <EventModal
          date={modalDate}
          user={user}
          onClose={() => setModal(null)}
          onCreated={() => { setModal(null); setExpanded(null); onEventCreated() }}
        />
      )}
    </div>
  )
}

// ── Sub-componentes ───────────────────────────
function NavBtn({
  onClick, label, children,
}: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center font-bold
                 text-slate-400 hover:text-slate-700 hover:bg-slate-100
                 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
    >
      {children}
    </button>
  )
}

function EventList({
  events, date, expanded, onToggle,
}: { events: CalendarEvent[]; date: string; expanded: boolean; onToggle: () => void }) {
  const MAX = 2
  return (
    <div className="mt-1 space-y-0.5">
      {events.slice(0, expanded ? undefined : MAX).map(ev => {
        const meta = CATEGORY_META[ev.category as EventCategory] ?? CATEGORY_META.blue
        return (
          <div
            key={ev.id}
            className="text-[11px] px-1.5 py-0.5 rounded truncate flex items-center gap-1"
            style={{
              background: meta.light,
              color: meta.dark,
              opacity: ev.status === 'pending' ? 0.7 : 1,
            }}
            title={ev.title + (ev.nota ? '\n' + ev.nota : '')}
          >
            {ev.status === 'pending' && <span className="shrink-0">⏳</span>}
            <span className="font-semibold truncate">{ev.title}</span>
          </div>
        )
      })}
      {events.length > MAX && (
        <button
          onClick={e => { e.stopPropagation(); onToggle() }}
          className="text-[11px] text-slate-400 hover:text-slate-600 w-full text-left px-1 py-0.5 rounded hover:bg-slate-100"
        >
          {expanded ? '↑ menos' : `+${events.length - MAX} mais`}
        </button>
      )}
    </div>
  )
}
