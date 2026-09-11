import { NextResponse } from 'next/server'
import { isConfigured, db } from '@/lib/supabase'
import { MessageSchema } from '@/lib/validation'
import getDB from '@/lib/db'

// Normaliza mensagem do DB para o formato esperado pelo cliente.
// Compatível com campos legados (from, createdAt) e novos (from_login, created_at).
function normalizeMessage(msg: Record<string, unknown>) {
  return {
    id:         msg['id'] as string,
    text:       msg['text'] as string,
    from_login: (msg['from_login'] ?? msg['from']) as string,
    created_at: (msg['created_at'] ?? msg['createdAt']) as string,
  }
}

export async function GET() {
  if (isConfigured) {
    const { data, error } = await db
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) return NextResponse.json({ erro: 'Erro ao buscar mensagens' }, { status: 500 })
    return NextResponse.json({ messages: data ?? [] })
  }

  const local = await getDB()
  const messages = (local.data.messages ?? []).map(m =>
    normalizeMessage(m as unknown as Record<string, unknown>)
  )
  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = MessageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { erro: 'Dados inválidos', detalhes: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { text, from_login } = parsed.data

    if (isConfigured) {
      const { data, error } = await db
        .from('messages')
        .insert({ text, from_login })
        .select()
        .single()
      if (error) return NextResponse.json({ erro: 'Erro ao enviar mensagem' }, { status: 500 })
      return NextResponse.json({ ok: true, message: data })
    }

    const local = await getDB()
    const newMsg = {
      id:         crypto.randomUUID(),
      text,
      from_login,
      created_at: new Date().toISOString(),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    local.data.messages.push(newMsg as any)
    await local.write()
    return NextResponse.json({ ok: true, message: newMsg })
  } catch {
    return NextResponse.json({ erro: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
