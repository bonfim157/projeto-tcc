'use client'
// ─────────────────────────────────────────────
//  Topbar — barra superior do dashboard
// ─────────────────────────────────────────────
import { useShell } from './Shell'
import type { User } from '@/src/types'

const PAPEL_LABEL: Record<string, string> = {
  professor: 'Professor',
  aluno: 'Aluno',
  gestao: 'Gestão',
}

interface Props {
  user: User | null
}

export default function Topbar({ user }: Props) {
  const { openDrawer } = useShell()

  const initials = user
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('')
    : '?'

  return (
    <header className="h-14 shrink-0 flex items-center px-4 md:px-5 gap-3
                       border-b border-slate-100 bg-white">
      {/* Hambúrguer — mobile only */}
      <button
        onClick={openDrawer}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                   text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Nome do sistema */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="hidden md:block text-lg" aria-hidden="true">📚</span>
        <span className="font-extrabold text-sm text-slate-700 truncate">EduCalendário</span>
        {user && (
          <span
            className="hidden sm:block text-[11px] font-semibold px-2 py-0.5 rounded-full ml-1"
            style={{ background: 'var(--accent)', color: 'white', opacity: 0.9 }}
          >
            {PAPEL_LABEL[user.papel]}
          </span>
        )}
      </div>

      {/* Avatar do usuário */}
      {user && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center
                     text-xs font-bold text-white shrink-0 cursor-default"
          style={{ background: 'var(--accent)' }}
          title={`${user.nome} · ${PAPEL_LABEL[user.papel]}`}
          aria-label={`Usuário: ${user.nome}`}
        >
          {initials}
        </div>
      )}
    </header>
  )
}
