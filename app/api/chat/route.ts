import { NextResponse } from 'next/server'
import { isConfigured, db } from '@/lib/supabase'
import { MessageSchema } from '@/lib/validation'
import getDB from '@/lib/db'

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
  return NextResponse.json({ messages: local.data.messages ?? [] })
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

    const { text, from_login, to_login } = parsed.data

    if (isConfigured) {
      const { data, error } = await db
        .from('messages')
        .insert({ text, from_login, to_login: to_login ?? null })
        .select()
        .single()
      if (error) return NextResponse.json({ erro: 'Erro ao enviar mensagem' }, { status: 500 })
      return NextResponse.json({ ok: true, message: data })
    }

    const local = await getDB()
    const newMsg = {
      id: crypto.randomUUID(),
      text,
      from_login,
      to_login: to_login ?? null,
      created_at: new Date().toISOString(),
    }
    local.data.messages.push(newMsg as typeof local.data.messages[0])
    await local.write()
    return NextResponse.json({ ok: true, message: newMsg })
  } catch {
    return NextResponse.json({ erro: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
