// ─────────────────────────────────────────────
//  EduCalendário — Camada de serviços (API)
//  Toda chamada fetch do cliente passa por aqui.
// ─────────────────────────────────────────────
import type {
  AuthResponse,
  LoginPayload,
  CalendarEvent,
  CreateEventPayload,
  ApproveEventPayload,
  ChatMessage,
  SendMessagePayload,
  Schedule,
} from '@/src/types'

// ── helpers ──────────────────────────────────
async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(json.erro ?? 'Erro na requisição'), { status: res.status, json })
  return json as T
}

// ── Auth ──────────────────────────────────────
export const authApi = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  validate: () =>
    request<AuthResponse>('/api/auth/validate'),

  logout: () =>
    request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
}

// ── Events ────────────────────────────────────
export const eventsApi = {
  list: () =>
    request<{ events: CalendarEvent[] }>('/api/events'),

  create: (payload: CreateEventPayload) =>
    request<{ ok: boolean; event: CalendarEvent }>('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  approve: (id: string, payload: ApproveEventPayload) =>
    request<{ ok: boolean }>(`/api/events/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ ok: boolean }>(`/api/events/${id}`, { method: 'DELETE' }),
}

// ── Chat ──────────────────────────────────────
export const chatApi = {
  list: () =>
    request<{ messages: ChatMessage[] }>('/api/chat'),

  send: (payload: SendMessagePayload) =>
    request<{ ok: boolean }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// ── Schedule ──────────────────────────────────
export const scheduleApi = {
  list: () =>
    request<{ schedules: Schedule[] }>('/api/schedule'),
}
