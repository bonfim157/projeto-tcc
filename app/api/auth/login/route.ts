import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isConfigured, db } from '@/lib/supabase'
import { LoginSchema } from '@/lib/validation'
import getDB from '@/lib/db'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

// ── JWT Secret — lazy, avaliado no request-time ──
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET não configurado para produção')
    }
    console.warn('⚠️  JWT_SECRET não configurado. Configure .env.local para produção.')
    return 'dev_secret_change_me_minimum_32_chars'
  }
  if (secret.length < 32) {
    console.warn('⚠️  JWT_SECRET muito curto. Use pelo menos 32 caracteres.')
  }
  return secret
}

// ── Handler ───────────────────────────────────
export async function POST(req: Request) {
  try {
    // Validação de entrada
    const body = await req.json().catch(() => null)
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { erro: 'Dados inválidos', detalhes: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { login, senha } = parsed.data

    // Rate limiting (5 tentativas em 15min por IP + login)
    const clientIP  = getClientIP(req)
    const rateLimit = checkRateLimit(`login:${clientIP}:${login}`, 15 * 60 * 1000, 5)
    if (rateLimit.exceeded) {
      return NextResponse.json(
        { erro: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit':     '5',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'Retry-After':           Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Buscar usuário
    let userRecord: { login: string; nome: string; papel: string; hash: string } | null = null

    if (isConfigured) {
      const { data, error } = await db
        .from('users')
        .select('login, nome, papel, senha_hash')
        .eq('login', login)
        .single()
      if (!error && data?.senha_hash) {
        userRecord = { login: data.login, nome: data.nome, papel: data.papel, hash: data.senha_hash }
      }
    } else {
      const local = await getDB()
      const u = local.data.users.find(u => u.login === login)
      if (u) userRecord = { login: u.login, nome: u.nome, papel: u.papel, hash: u.senha_hash }
    }

    if (!userRecord) {
      return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 401 })
    }

    const ok = await bcrypt.compare(senha, userRecord.hash)
    if (!ok) {
      return NextResponse.json({ erro: 'Senha inválida' }, { status: 401 })
    }

    // Gerar JWT
    const JWT_SECRET = getJwtSecret()
    const token = jwt.sign(
      {
        login: userRecord.login,
        papel: userRecord.papel,
        nome:  userRecord.nome,
        iss: 'eduportal-api',
        aud: 'eduportal-web',
        sub: userRecord.login,
      },
      JWT_SECRET,
      { expiresIn: '8h', algorithm: 'HS256' },
    )

    const isProd = process.env.NODE_ENV === 'production'
    const cookie = [
      `token=${token}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${8 * 3600}`,
      'SameSite=Lax',
      ...(isProd ? ['Secure'] : []),
    ].join('; ')

    const res = NextResponse.json({
      ok: true,
      user: { login: userRecord.login, nome: userRecord.nome, papel: userRecord.papel },
    })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('Erro no login:', err)
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 })
  }
}
