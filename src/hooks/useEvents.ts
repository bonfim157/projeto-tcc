'use client'
// ─────────────────────────────────────────────
//  useEvents — listagem, criação e aprovação
// ─────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react'
import { eventsApi } from '@/src/services/api'
import type { CalendarEvent, CreateEventPayload, ApproveEventPayload } from '@/src/types'

interface EventsState {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
}

export function useEvents() {
  const [state, setState] = useState<EventsState>({
    events: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await eventsApi.list()
      setState({ events: res.events ?? [], loading: false, error: null })
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err?.message ?? 'Erro ao carregar eventos' }))
    }
  }, [])

  useEffect(() => { load() }, [load])

  const createEvent = useCallback(
    async (payload: CreateEventPayload) => {
      const res = await eventsApi.create(payload)
      await load()
      return res
    },
    [load],
  )

  const approveEvent = useCallback(
    async (id: string, payload: ApproveEventPayload) => {
      const res = await eventsApi.approve(id, payload)
      await load()
      return res
    },
    [load],
  )

  const removeEvent = useCallback(
    async (id: string) => {
      const res = await eventsApi.remove(id)
      await load()
      return res
    },
    [load],
  )

  return {
    events: state.events,
    loading: state.loading,
    error: state.error,
    reload: load,
    createEvent,
    approveEvent,
    removeEvent,
  }
}
