'use client'
// ─────────────────────────────────────────────
//  useAuth — autenticação e sessão do usuário
// ─────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/src/services/api'
import type { User, LoginPayload } from '@/src/types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const router   = useRouter()
  const pathname = usePathname()

  // Valida sessão ao montar — não redireciona se já estamos na página de login
  const validate = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await authApi.validate()
      if (res.ok && res.user) {
        setState({ user: res.user, loading: false, error: null })
        // Se validou com sucesso e está no login, redireciona pro dashboard
        if (pathname === '/login') {
          router.replace('/dashboard')
        }
      } else {
        setState({ user: null, loading: false, error: null })
        // Só redireciona se NÃO está na página de login
        if (pathname !== '/login') {
          router.replace('/login')
        }
      }
    } catch {
      setState({ user: null, loading: false, error: null })
      if (pathname !== '/login') {
        router.replace('/login')
      }
    }
  }, [router, pathname])

  useEffect(() => { validate() }, [validate])

  const login = useCallback(
    async (payload: LoginPayload) => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        const res = await authApi.login(payload)
        if (res.ok && res.user) {
          setState({ user: res.user, loading: false, error: null })
          router.replace('/dashboard')
        } else {
          setState({ user: null, loading: false, error: res.erro ?? 'Credenciais inválidas' })
        }
      } catch (err: unknown) {
        const msg = (err as { json?: { erro?: string } })?.json?.erro ?? 'Sem conexão com o servidor'
        setState({ user: null, loading: false, error: msg })
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => null)
    setState({ user: null, loading: false, error: null })
    router.replace('/login')
  }, [router])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    validate,
  }
}
