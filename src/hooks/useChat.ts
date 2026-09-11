'use client'
// ─────────────────────────────────────────────
//  useChat — mensagens em tempo real (polling)
// ─────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react'
import { chatApi } from '@/src/services/api'
import type { ChatMessage, User } from '@/src/types'

const POLL_INTERVAL_MS = 5_000

export function useChat(user: User | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await chatApi.list()
      setMessages(res.messages ?? [])
    } catch {
      // falha silenciosa no polling — mantém mensagens antigas
    }
  }, [])

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [load])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !user) return
      setSending(true)
      setError(null)
      try {
        await chatApi.send({ text: text.trim(), from_login: user.login })
        await load()
      } catch (err: any) {
        setError(err?.json?.erro ?? 'Erro ao enviar mensagem')
      } finally {
        setSending(false)
      }
    },
    [user, load],
  )

  return { messages, sending, error, sendMessage, reload: load }
}
