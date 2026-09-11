'use client'
// ─────────────────────────────────────────────
//  useAuth — autenticação e sessão do usuário
// ─────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  // Valida sessão ao montar
  const validate = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await authApi.validate()
      if (res.ok && res.user) {
        setState({ user: res.user, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
        router.push('/login')
      }
    } catch {
      setState({ user: null, loading: false, error: 'Falha ao validar sessão' })
      router.push('/login')
    }
  }, [router])

  useEffect(() => { validate() }, [validate])

  const login = useCallback(
    async (payload: LoginPayload) => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        const res = await authApi.login(payload)
        if (res.ok && res.user) {
          setState({ user: res.user, loading: false, error: null })
          router.push('/dashboard')
        } else {
          setState({ user: null, loading: false, error: res.erro ?? 'Credenciais inválidas' })
        }
      } catch (err: any) {
        setState({ user: null, loading: false, error: err?.json?.erro ?? 'Sem conexão com o servidor' })
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => null)
    setState({ user: null, loading: false, error: null })
    router.push('/login')
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
