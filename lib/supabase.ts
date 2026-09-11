// ─────────────────────────────────────────────
//  lib/supabase.ts — cliente Supabase
//  • Server (service role) para as API routes
//  • Browser (anon key) para uso no client se necessário
// ─────────────────────────────────────────────
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Verifica se as variáveis de ambiente foram definidas
export const isConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Cliente server-side (service role) ────────
let _serverClient: SupabaseClient | null = null

export function getServerClient(): SupabaseClient {
  if (_serverClient) return _serverClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase não configurado. Adicione NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local',
    )
  }

  _serverClient = createClient(url, key, {
    auth: { persistSession: false },
  })

  return _serverClient
}

// ── Atalho ergonômico para routes ─────────────
//  Uso: const { data, error } = await db.from('events').select('*')
export const db = {
  from: (...args: Parameters<SupabaseClient['from']>) =>
    getServerClient().from(...args),
}
