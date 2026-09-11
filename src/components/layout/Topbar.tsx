'use client'
// ─────────────────────────────────────────────
//  Topbar — barra superior com menu hambúrguer
// ─────────────────────────────────────────────
import { useShell } from './Shell'
import type { User } from '@/src/types'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  user: User | null
}

export default function Topbar({ user }: Props) {
  const { openDrawer } = useShell()
  const now = new Date()
  const dataLabel = `${MESES[now.getMonth()]} ${now.getFullYear()}`

  return (
    <header className="h-16 shrink-0 flex items-center px-4 md:px-6 gap-3
                       border-b border-slate-100 bg-white">
      {/* Hambúrguer — mobile only */}
      <button
        onClick={openDrawer}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                   text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Título dinâmico */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          EduCalendário
        </p>
        <h1 className="text-base font-extrabold text-slate-800 truncate">{dataLabel}</h1>
      </div>

      {/* Avatar do usuário */}
      {user && (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center
                     text-sm font-bold text-white shrink-0"
          style={{ background: 'var(--accent)' }}
          title={user.nome}
          aria-label={`Usuário: ${user.nome}`}
        >
          {user.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
      )}
    </header>
  )
}
