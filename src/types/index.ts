// ─────────────────────────────────────────────
//  EduCalendário — Tipagens centralizadas
// ─────────────────────────────────────────────

// ── Usuário ───────────────────────────────────
export type Papel = 'professor' | 'aluno' | 'gestao'

export interface User {
  login: string
  nome: string
  papel: Papel
}

// ── Eventos ───────────────────────────────────
export type EventStatus = 'pending' | 'approved' | 'rejected'

export type EventCategory =
  | 'red'    // Urgente
  | 'yellow' // Avaliação
  | 'green'  // Atividade
  | 'blue'   // Informativo
  | 'purple' // Cultural
  | 'orange' // Outros

export interface CalendarEvent {
  id: string
  date: string          // ISO YYYY-MM-DD
  title: string
  category: EventCategory
  status: EventStatus
  nota?: string | null
  autor_login?: string | null
}

export interface CreateEventPayload {
  date: string
  title: string
  category: EventCategory
  nota?: string
  autor_login?: string
}

export interface ApproveEventPayload {
  status: 'approved' | 'rejected'
  aprovadoPor: string
  motivo?: string
}

// ── Mensagens de Chat ──────────────────────────
export interface ChatMessage {
  id: string
  text: string
  from_login: string
  created_at: string
}

export interface SendMessagePayload {
  text: string
  from_login: string
}

// ── Horários ──────────────────────────────────
export interface Schedule {
  id: string
  turma: string
  dia: number       // 0=Dom … 6=Sáb
  slot: number      // 1-based horário
  disciplina: string
}

// ── Auth ──────────────────────────────────────
export interface LoginPayload {
  login: string
  senha: string
}

export interface AuthResponse {
  ok: boolean
  user?: User
  erro?: string
}

// ── API response helpers ──────────────────────
export interface ApiOk<T = unknown> {
  ok: true
  data?: T
}

export interface ApiError {
  ok: false
  erro: string
  detalhes?: unknown
}

export type ApiResult<T = unknown> = ApiOk<T> | ApiError

// ── Categorias — lookup util ──────────────────
export const CATEGORY_META: Record<
  EventCategory,
  { label: string; light: string; dark: string; hex: string }
> = {
  red:    { label: 'Urgente',     light: '#FEE2E2', dark: '#991B1B', hex: '#dc2626' },
  yellow: { label: 'Avaliação',   light: '#FEF3C7', dark: '#92400E', hex: '#d97706' },
  green:  { label: 'Atividade',   light: '#D1FAE5', dark: '#065F46', hex: '#16a34a' },
  blue:   { label: 'Informativo', light: '#DBEAFE', dark: '#1E40AF', hex: '#1a73e8' },
  purple: { label: 'Cultural',    light: '#EDE9FE', dark: '#5B21B6', hex: '#7c3aed' },
  orange: { label: 'Outros',      light: '#FFEDD5', dark: '#9A3412', hex: '#ea580c' },
}
