import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Compartilha a mesma lógica de obter o secret que auth/login
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET não configurado para produção')
    }
    return 'dev_secret_change_me_minimum_32_chars'
  }
  return secret
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') ?? ''
    const token  = cookie
      .split(';')
      .map(s => s.trim())
      .find(s => s.startsWith('token='))
      ?.slice('token='.length)

    if (!token) return NextResponse.json({ ok: false }, { status: 401 })

    const payload = jwt.verify(token, getJwtSecret()) as {
      login: string; papel: string; nome: string
    }

    return NextResponse.json({
      ok: true,
      user: { login: payload.login, nome: payload.nome, papel: payload.papel },
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
