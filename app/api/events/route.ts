import { NextResponse } from 'next/server'
import { isConfigured, db } from '@/lib/supabase'
import { EventSchema } from '@/lib/validation'
import getDB, { type DBEvent } from '@/lib/db'

// Normaliza evento do DB para o formato esperado pelo cliente.
// Compatível com campos legados (cat, autor) e campos novos (category, autor_login).
function normalizeEvent(ev: DBEvent & Record<string, unknown>) {
  return {
    id:          ev.id,
    date:        ev.date,
    title:       ev.title,
    category:    (ev.category ?? ev['cat'] ?? 'blue') as string,
    status:      ev.status ?? 'pending',
    nota:        ev.nota ?? null,
    autor_login: (ev.autor_login ?? ev['autor'] ?? null) as string | null,
  }
}

export async function GET() {
  if (isConfigured) {
    const { data, error } = await db
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (error) return NextResponse.json({ erro: 'Erro ao buscar eventos' }, { status: 500 })
    return NextResponse.json({ events: data ?? [] })
  }

  const local = await getDB()
  const events = (local.data.events ?? [])
    .map(ev => normalizeEvent(ev as DBEvent & Record<string, unknown>))
    .sort((a, b) => a.date.localeCompare(b.date))
  return NextResponse.json({ events })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { erro: 'Dados inválidos', detalhes: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { date, title, category, nota, autor_login } = parsed.data

    if (isConfigured) {
      const { data, error } = await db
        .from('events')
        .insert({ date, title, category, nota: nota ?? null, autor_login: autor_login ?? null, status: 'pending' })
        .select()
        .single()
      if (error) return NextResponse.json({ erro: 'Erro ao criar evento' }, { status: 500 })
      return NextResponse.json({ ok: true, event: data })
    }

    const local = await getDB()
    const newEvent = {
      id: crypto.randomUUID(),
      date, title, category,
      nota: nota ?? null,
      autor_login: autor_login ?? null,
      status: 'pending' as const,
    }
    local.data.events.push(newEvent)
    await local.write()
    return NextResponse.json({ ok: true, event: normalizeEvent(newEvent) })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar evento' }, { status: 500 })
  }
}
