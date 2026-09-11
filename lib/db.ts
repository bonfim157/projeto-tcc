// ─────────────────────────────────────────────
//  lib/db.ts — banco de dados local (JSON)
//  Fallback usado quando Supabase não está configurado.
//  Baseado em lowdb v7 com tipagem estrita.
// ─────────────────────────────────────────────
import path from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// ── Schema ────────────────────────────────────
export interface DBUser {
  id: string
  login: string
  nome: string
  papel: 'professor' | 'aluno' | 'gestao'
  senha_hash: string
}

export interface DBEvent {
  id: string
  date: string
  title: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  nota: string | null
  autor_login: string | null
}

export interface DBMessage {
  id: string
  text: string
  from_login: string
  created_at: string
}

export interface DBSchedule {
  id: string
  turma: string
  dia: number
  slot: number
  disciplina: string
}

export interface DBSchema {
  users: DBUser[]
  events: DBEvent[]
  messages: DBMessage[]
  schedules: DBSchedule[]
}

// ── Instância singleton ───────────────────────
const FILE = path.join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile<DBSchema>(FILE)
const DEFAULTS: DBSchema = { users: [], events: [], messages: [], schedules: [] }
const lowdb = new Low<DBSchema>(adapter, DEFAULTS)

let _initialized = false

export async function getDB(): Promise<Low<DBSchema>> {
  if (!_initialized) {
    await lowdb.read()
    // Garantir que todas as coleções existam
    lowdb.data ??= DEFAULTS
    lowdb.data.users    ??= []
    lowdb.data.events   ??= []
    lowdb.data.messages ??= []
    lowdb.data.schedules ??= []
    _initialized = true
  } else {
    await lowdb.read()
  }
  return lowdb
}

export default getDB
