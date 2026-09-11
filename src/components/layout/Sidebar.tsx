'use client'
// ─────────────────────────────────────────────
//  Sidebar — navegação lateral
//  Desktop: static (fluxo normal) | Mobile: drawer fixed
// ─────────────────────────────────────────────
import { useRouter } from 'next/navigation'
import { useShell } from './Shell'
import type { User } from '@/src/types'

// ── Dados de navegação ────────────────────────
const NAV_BASE = [
  { icon: '🗓️', label: 'Calendário', href: '/dashboard' },
  { icon: '💬', label: 'Chat',       href: '/dashboard?view=chat' },
  { icon: '📊', label: 'Horários',   href: '/dashboard?view=horarios' },
] as const

const NAV_GESTAO = { icon: '⏳', label: 'Aprovações', href: '/dashboard?view=aprovacoes' } as const

const PAPEL_LABEL: Record<string, string> = {
  professor: 'Professor',
  aluno: 'Aluno',
  gestao: 'Gestão',
}

// ── Props ─────────────────────────────────────
interface Props {
  user: User | null
  activeView?: string
  onLogout: () => void
}

export default function Sidebar({ user, activeView, onLogout }: Props) {
  const router = useRouter()
  const { drawerOpen, closeDrawer } = useShell()

  const initials = user
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('')
    : '—'

  const navItems =
    user?.papel === 'gestao' ? [...NAV_BASE, NAV_GESTAO] : NAV_BASE

  function navigate(href: string) {
    router.push(href)
    closeDrawer()
  }

  return (
    <>
      {/* ── Desktop: sidebar estática no fluxo normal ── */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 h-full text-white z-10"
        style={{ background: 'var(--accent)' }}
        aria-label="Menu de navegação"
      >
        <SidebarContent
          user={user}
          initials={initials}
          navItems={navItems}
          activeView={activeView}
          navigate={navigate}
          onLogout={onLogout}
          showClose={false}
          onClose={closeDrawer}
        />
      </aside>

      {/* ── Mobile: drawer fixed que desliza da esquerda ── */}
      <aside
        className={[
          'md:hidden flex flex-col w-64 shrink-0 h-full text-white z-50',
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-material',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ background: 'var(--accent)' }}
        aria-label="Menu de navegação"
        aria-hidden={!drawerOpen}
      >
        <SidebarContent
          user={user}
          initials={initials}
          navItems={navItems}
          activeView={activeView}
          navigate={navigate}
          onLogout={onLogout}
          showClose
          onClose={closeDrawer}
        />
      </aside>
    </>
  )
}

// ── Conteúdo compartilhado ──────────────────
interface ContentProps {
  user: User | null
  initials: string
  navItems: readonly { icon: string; label: string; href: string }[]
  activeView?: string
  navigate: (href: string) => void
  onLogout: () => void
  showClose: boolean
  onClose: () => void
}

function SidebarContent({
  user, initials, navItems, activeView, navigate, onLogout, showClose, onClose,
}: ContentProps) {
  return (
    <>
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">📚</span>
          <div>
            <div className="font-extrabold text-sm leading-tight">EduCalendário</div>
            <div className="text-white/35 text-[11px]">Portal Escolar</div>
          </div>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Usuário */}
      <div className="px-5 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{user?.nome ?? '—'}</div>
            <div className="text-white/60 text-xs">
              {user ? PAPEL_LABEL[user.papel] : '—'}
            </div>
          </div>
          <div
            className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0"
            title="Online"
          />
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Principal">
        {navItems.map((item, idx) => {
          const isActive = activeView
            ? item.href.includes(`view=${activeView}`)
            : item.href === '/dashboard'

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-3 rounded-xl text-sm font-medium
                         transition-all duration-150 text-left
                         hover:bg-white/15 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-white/40
                         animate-stagger"
              style={{
                minHeight: '44px',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                boxShadow: isActive ? 'inset 3px 0 0 rgba(255,255,255,0.7)' : 'none',
                animationDelay: `${idx * 40}ms`,
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 rounded-xl text-sm font-medium
                     text-white/65 hover:text-white hover:bg-white/10
                     transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
          style={{ minHeight: '44px' }}
        >
          <span aria-hidden="true">🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </>
  )
}
