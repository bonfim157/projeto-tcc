'use client'
// ─────────────────────────────────────────────
//  Login — seleção de perfil + formulário
// ─────────────────────────────────────────────
import { useState } from 'react'
import { useAuth } from '@/src/hooks/useAuth'
import type { Papel } from '@/src/types'

// ── Temas por papel ───────────────────────────
const THEMES = {
  professor: {
    bg:       '#0d1117',
    accent:   '#1e3a8a',
    label:    'Professor',
    sublabel: 'Acesso para Docentes e Educadores',
    hint:     'Use as credenciais fornecidas pela instituição.',
    demo:     { login: 'prof.rafael', senha: 'prof123' },
  },
  gestao: {
    bg:       '#0b0618',
    accent:   '#4c1d95',
    label:    'Gestão',
    sublabel: 'Acesso Administrativo e de Direção',
    hint:     'Área restrita. Acesso apenas a gestores credenciados.',
    demo:     { login: 'gestao.escola', senha: 'gestao123' },
  },
  aluno: {
    bg:       '#052e16',
    accent:   '#16a34a',
    label:    'Aluno',
    sublabel: 'Acesso para Estudantes',
    hint:     'Bem-vindo! Entre com seu login de estudante.',
    demo:     { login: 'aluno.joao', senha: 'aluno123' },
  },
} as const

const ROLE_CARDS: { papel: Papel; icon: string; desc: string; border: string }[] = [
  { papel: 'professor', icon: '🎓', desc: 'Docentes e\nEducadores',   border: '#1e3a8a' },
  { papel: 'gestao',    icon: '🏛️', desc: 'Administração\ne Direção', border: '#4c1d95' },
  { papel: 'aluno',     icon: '📖', desc: 'Alunos e\nEstudantes',     border: '#16a34a' },
]

export default function LoginPage() {
  const { login: doLogin, loading, error } = useAuth()

  const [papel, setPapel]     = useState<Papel | null>(null)
  const [visible, setVisible] = useState(true)
  const [loginVal, setLogin]  = useState('')
  const [senha, setSenha]     = useState('')

  const theme = papel ? THEMES[papel] : null

  function fade(fn: () => void) {
    setVisible(false)
    setTimeout(() => { fn(); setVisible(true) }, 180)
  }

  function selectRole(p: Papel) {
    fade(() => {
      setPapel(p)
      setLogin(THEMES[p].demo.login)
      setSenha(THEMES[p].demo.senha)
    })
  }

  function back() {
    fade(() => { setPapel(null); setLogin(''); setSenha('') })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doLogin({ login: loginVal, senha })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300"
      style={{ background: theme?.bg ?? '#08090c' }}
    >
      <div
        className="flex flex-col items-center w-full"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {!papel ? (
          /* ── Seleção de perfil ── */
          <>
            <div className="mb-12 text-center">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Portal Escolar
              </p>
              <h1 className="text-4xl font-black text-white tracking-tight">EduCalendário</h1>
              <p className="text-white/40 text-sm mt-2">Selecione seu perfil de acesso</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
              {ROLE_CARDS.map(({ papel: p, icon, desc, border }) => (
                <button
                  key={p}
                  onClick={() => selectRole(p)}
                  className="flex-1 flex flex-col items-center gap-4 px-6 py-8 rounded-2xl
                             text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = border
                    el.style.background  = `${border}22`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.background  = 'rgba(255,255,255,0.04)'
                  }}
                >
                  <span className="text-4xl" aria-hidden="true">{icon}</span>
                  <div className="text-center">
                    <div className="font-bold text-base" style={{ color: border }}>
                      {p === 'professor' ? 'Professor' : p === 'gestao' ? 'Gestão' : 'Aluno'}
                    </div>
                    <div className="text-white/45 text-xs mt-1 whitespace-pre-line leading-relaxed">
                      {desc}
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-4 py-1.5 rounded-full"
                    style={{ background: `${border}30`, color: border }}
                  >
                    Acessar →
                  </span>
                </button>
              ))}
            </div>

            <p className="text-white/20 text-xs mt-12">EduCalendário — Portal de Comunicação Escolar</p>
          </>
        ) : (
          /* ── Formulário ── */
          <div className="w-full max-w-sm">
            <button
              onClick={back}
              className="flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/90
                         transition-colors"
              style={{ minHeight: '44px' }}
            >
              ← Trocar perfil
            </button>

            <div className="mb-7">
              <h1 className="text-[1.75rem] font-black tracking-tight text-white leading-tight">
                EduCalendário
              </h1>
              <p className="mt-1.5 text-sm text-white/40">{theme!.sublabel}</p>
            </div>

            <div className="rounded-2xl p-7 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full" style={{ background: theme!.accent }} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {theme!.label}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Login">
                  <input
                    value={loginVal}
                    onChange={e => setLogin(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': theme!.accent } as React.CSSProperties}
                  />
                </Field>

                <Field label="Senha">
                  <input
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': theme!.accent } as React.CSSProperties}
                  />
                </Field>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-white text-sm mt-2
                             transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: loading ? '#94a3b8' : theme!.accent, minHeight: '44px' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-400 mt-5 leading-relaxed">{theme!.hint}</p>
            </div>

            <p className="text-center text-xs mt-6 text-white/20">EduCalendário — Portal Escolar</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
