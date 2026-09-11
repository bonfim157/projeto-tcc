'use client'
// ─────────────────────────────────────────────
//  WeekView — vista semanal do calendário
//  Exibe 7 colunas com os dias da semana atual
// ─────────────────────────────────────────────
import { useMemo } from 'react'
import { CATEGORY_META } from '@/src/types'
import type { CalendarEvent, User, EventCategory } from '@/src/types'

const DAYS_LONG  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function todayISO(): string {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function dateISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  weekStart: Date       // domingo que inicia a semana
  events: CalendarEvent[]
  user: User | null
  onDayClick?: (date: string) => void
}

export default function WeekView({ weekStart, events, user, onDayClick }: Props) {
  const today = todayISO()
  const canCreate = user?.papel === 'professor' || user?.papel === 'gestao'

  // 7 dias da semana a partir de weekStart
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      return {
        date: dateISO(d),
        dayOfWeek: i,
        dayNum: d.getDate(),
        label: DAYS_LONG[i],
      }
    })
  }, [weekStart])

  function visibleEvents(date: string): CalendarEvent[] {
    const evs = events.filter(ev => ev.date === date)
    if (user?.papel === 'aluno') return evs.filter(ev => ev.status === 'approved')
    return evs
  }

  // Range da semana para exibição
  const first = days[0]
  const last  = days[6]
  const weekLabel = (() => {
    const f = new Date(first.date + 'T12:00:00')
    const l = new Date(last.date + 'T12:00:00')
    const fmtDay = (d: Date) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    return `${fmtDay(f)} — ${fmtDay(l)}`
  })()

  return (
    <div className="flex flex-col h-full">
      {/* Indicador da semana */}
      <div className="text-xs text-slate-400 font-semibold mb-3 px-1">{weekLabel}</div>

      {/* Cabeçalho dos dias */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {days.map(d => {
          const isToday = d.date === today
          return (
            <div
              key={d.date}
              className={`flex flex-col items-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                ${isToday
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-slate-400'}`}
            >
              <span className="hidden sm:block">{d.label}</span>
              <span className="sm:hidden">{d.label[0]}</span>
              <span
                className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-sm
                  ${isToday
                    ? 'bg-[var(--accent)] text-white shadow-[0_0_0_2px_var(--accent)]'
                    : 'text-slate-600'}`}
              >
                {d.dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Colunas dos dias */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1">
        {days.map(d => {
          const evs = visibleEvents(d.date)
          const isToday = d.date === today

          return (
            <div
              key={d.date}
              onClick={() => canCreate && onDayClick?.(d.date)}
              className={[
                'rounded-lg p-1.5 md:p-2 flex flex-col gap-1 border transition-all',
                'min-h-[120px] md:min-h-[200px] group relative',
                isToday
                  ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5 shadow-[0_0_0_2px_var(--accent)]'
                  : 'border-slate-100 bg-white hover:border-[var(--accent)]/30 hover:shadow-sm',
                canCreate ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              {/* Eventos do dia */}
              {evs.length === 0 ? (
                <span className="text-[10px] text-slate-300 mt-auto mx-auto select-none">—</span>
              ) : (
                evs.map(ev => {
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
                      {ev.status === 'pending' && <span className="shrink-0 text-[9px]">⏳</span>}
                      <span className="font-semibold truncate">{ev.title}</span>
                    </div>
                  )
                })
              )}

              {/* Botão + no hover */}
              {canCreate && (
                <button
                  onClick={e => { e.stopPropagation(); onDayClick?.(d.date) }}
                  className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full
                             bg-[var(--accent)] text-white text-xs font-bold
                             flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity
                             focus:opacity-100 focus:outline-none"
                  aria-label={`Adicionar evento`}
                >
                  +
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
