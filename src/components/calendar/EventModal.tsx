'use client'
// ─────────────────────────────────────────────
//  EventModal — modal de criação de evento
//  Bottom-sheet no mobile, centered no desktop
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { CATEGORY_META } from '@/src/types'
import type { User, EventCategory } from '@/src/types'
import { eventsApi } from '@/src/services/api'
import Spinner from '@/src/components/ui/Spinner'

interface Props {
  date: string
  user: User | null
  onClose: () => void
  onCreated: () => void
}

const CATEGORIES = Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]

export default function EventModal({ date, user, onClose, onCreated }: Props) {
  const [title, setTitle]       = useState('')
  const [category, setCategory] = useState<EventCategory>('blue')
  const [nota, setNota]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState('')
  const [shake, setShake]       = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  // Fechar com Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Focar o título ao abrir
  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const dateFmt = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 420)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setErro('Informe um título.')
      triggerShake()
      return
    }
    setErro('')
    setLoading(true)
    try {
      await eventsApi.create({
        date,
        title: title.trim(),
        category,
        nota: nota.trim() || undefined,
        autor_login: user?.login,
      })
      onCreated()
    } catch (err: unknown) {
      const msg = (err as { json?: { erro?: string } })?.json?.erro ?? 'Erro ao criar evento'
      setErro(msg)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Overlay com blur */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Criar novo evento"
    >
      {/* Card — bottom-sheet mobile, centralizado desktop */}
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl
                   shadow-[0_20px_60px_rgba(0,0,0,.3)] animate-fadeSlideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="p-6 pt-4 sm:pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Novo Evento</h2>
              <p className="text-sm text-slate-400 capitalize mt-0.5">{dateFmt}</p>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full
                         hover:bg-slate-100 text-slate-400 transition-colors text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Título</label>
              <input
                ref={titleRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Prova de Matemática"
                required
                maxLength={200}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            {/* Categoria — grid 3×2 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white
                               transition-all active:scale-95"
                    style={{
                      background: meta.hex,
                      opacity: category === key ? 1 : 0.55,
                      boxShadow: category === key
                        ? `0 0 0 2px white, 0 0 0 4px ${meta.hex}`
                        : 'none',
                      minHeight: '44px',
                    }}
                  >
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Observações{' '}
                <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={nota}
                onChange={e => setNota(e.target.value)}
                placeholder="Detalhes do evento..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            {/* Aviso para professor */}
            {user?.papel === 'professor' && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                ⏳ Seu evento ficará pendente até a gestão aprovar.
              </p>
            )}

            {/* Erro com shake */}
            {erro && (
              <div className={`text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 ${shake ? 'animate-shake' : ''}`}>
                {erro}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg text-sm font-semibold text-slate-600
                           bg-slate-100 hover:bg-slate-200 transition-colors"
                style={{ minHeight: '44px' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg text-sm font-bold text-white transition-all
                           disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', minHeight: '44px' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Salvando...
                  </>
                ) : (
                  'Criar Evento'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
