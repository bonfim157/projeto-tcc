/**
 * 🏫 Utilitários Multi-Tenant - EduPortal Platform
 * 
 * Funções e tipos para trabalhar com arquitetura multi-tenant
 */

import { isConfigured, db as supabase } from './supabase'
import getDB from './db'

// ============================================
// 📊 TIPOS DE DADOS
// ============================================

export interface Escola {
  id: string
  nome: string
  slug: string
  cnpj?: string
  endereco?: any
  contato?: any
  config?: any
  ativo: boolean
  plano: string
  limite_usuarios: number
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  email: string
  nome: string
  avatar_url?: string
  telefone?: string
  data_nascimento?: string
  ativo: boolean
  verified: boolean
  mfa_enabled: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface EscolaUsuario {
  id: string
  escola_id: string
  usuario_id: string
  papel: 'aluno' | 'professor' | 'gestor' | 'admin'
  matricula?: string
  departamento?: string
  cargo?: string
  ativo: boolean
  convite_token?: string
  convite_enviado_em?: string
  convite_aceito_em?: string
  created_at: string
  updated_at: string
}

export interface Modulo {
  id: string
  nome: string
  slug: string
  descricao?: string
  versao: string
  cor_tema: string
  icone?: string
  ordem: number
  ativo: boolean
  publico: boolean
  premium: boolean
  created_at: string
  updated_at: string
}

export interface Permissao {
  id: string
  escola_usuario_id: string
  modulo_id: string
  nivel_acesso: 'leitura' | 'escrita' | 'moderacao' | 'administracao'
  escopo?: any
  concedido_por?: string
  concedido_em: string
  expira_em?: string
  revogado_em?: string
}

export interface EventoCalendario {
  id: string
  escola_id: string
  data: string
  titulo: string
  descricao?: string
  categoria: string
  cor_hex?: string
  hora_inicio?: string
  hora_fim?: string
  local?: string
  recorrente: boolean
  recorrencia?: any
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  autor_id?: string
  aprovado_por?: string
  aprovado_em?: string
  motivo_rejeicao?: string
  visibilidade: 'public' | 'private' | 'role_based'
  anexos?: any
  metadata?: any
  created_at: string
  updated_at: string
}

// ============================================
// 🛠️ UTILITÁRIOS DE TENANT
// ============================================

/**
 * Obtém a escola atual do contexto
 */
export async function getEscolaAtual(escolaSlug?: string): Promise<Escola | null> {
  if (!isConfigured) {
    // Em desenvolvimento, retornar escola padrão
    return {
      id: 'dev-escola-padrao',
      nome: 'Escola de Desenvolvimento',
      slug: 'dev-escola',
      ativo: true,
      plano: 'free',
      limite_usuarios: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    if (escolaSlug) {
      const { data, error } = await supabase
        .from('platform.escolas')
        .select('*')
        .eq('slug', escolaSlug)
        .eq('ativo', true)
        .single()

      if (error) {
        console.error('Erro ao obter escola por slug:', error)
        return null
      }

      return data
    }

    // Se não especificada, tentar obter do contexto (cookie, header, etc.)
    // Implementação básica - em produção usar middleware
    return null
  } catch (error) {
    console.error('Erro inesperado ao obter escola:', error)
    return null
  }
}

/**
 * Obtém o usuário atual no contexto multi-tenant
 */
export async function getUsuarioAtualComEscola(
  usuarioId: string,
  escolaId: string
): Promise<{ usuario: Usuario; escolaUsuario: EscolaUsuario } | null> {
  if (!isConfigured) {
    // Em desenvolvimento, retornar dados mock
    return {
      usuario: {
        id: usuarioId,
        email: 'dev@escola.local',
        nome: 'Usuário Dev',
        ativo: true,
        verified: true,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      escolaUsuario: {
        id: 'dev-escola-usuario',
        escola_id: escolaId,
        usuario_id: usuarioId,
        papel: 'professor',
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }

  try {
    // Buscar usuário e associação com escola
    const [usuarioResult, escolaUsuarioResult] = await Promise.all([
      supabase
        .from('platform.usuarios')
        .select('*')
        .eq('id', usuarioId)
        .eq('ativo', true)
        .single(),
      supabase
        .from('platform.escola_usuarios')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('escola_id', escolaId)
        .eq('ativo', true)
        .single(),
    ])

    if (usuarioResult.error || escolaUsuarioResult.error) {
      console.error('Erro ao obter usuário multi-tenant:', {
        usuarioError: usuarioResult.error,
        escolaUsuarioError: escolaUsuarioResult.error,
      })
      return null
    }

    return {
      usuario: usuarioResult.data,
      escolaUsuario: escolaUsuarioResult.data,
    }
  } catch (error) {
    console.error('Erro inesperado ao obter usuário multi-tenant:', error)
    return null
  }
}

/**
 * Verifica permissões do usuário em um módulo
 */
export async function verificarPermissao(
  escolaUsuarioId: string,
  moduloSlug: string,
  nivelRequerido: Permissao['nivel_acesso']
): Promise<{ temPermissao: boolean; permissao?: Permissao }> {
  if (!isConfigured) {
    // Em desenvolvimento, permitir tudo
    return { temPermissao: true }
  }

  try {
    const { data: permissao, error } = await supabase
      .from('platform.permissoes')
      .select('*, modulo:modulos!inner(slug)')
      .eq('escola_usuario_id', escolaUsuarioId)
      .eq('modulos.slug', moduloSlug)
      .is('revogado_em', null)
      .or(`expira_em.is.null,expira_em.gt.${new Date().toISOString()}`)
      .maybeSingle()

    if (error) {
      console.error('Erro ao verificar permissão:', error)
      return { temPermissao: false }
    }

    if (!permissao) {
      return { temPermissao: false }
    }

    // Mapear níveis de acesso para hierarquia
    const nivelHierarquia: Record<string, number> = {
      leitura: 1,
      escrita: 2,
      moderacao: 3,
      administracao: 4,
    }

    const temPermissao =
      nivelHierarquia[permissao.nivel_acesso] >= nivelHierarquia[nivelRequerido]

    return { temPermissao, permissao }
  } catch (error) {
    console.error('Erro inesperado ao verificar permissão:', error)
    return { temPermissao: false }
  }
}

/**
 * Obtém módulos instalados para uma escola
 */
export async function getModulosInstalados(
  escolaId: string
): Promise<Modulo[]> {
  if (!isConfigured) {
    // Em desenvolvimento, retornar módulos padrão
    return [
      {
        id: 'modulo-calendario',
        nome: 'Calendário Escolar',
        slug: 'calendario',
        descricao: 'Sistema de calendário e eventos escolares',
        versao: '1.0.0',
        cor_tema: '#1E40AF',
        icone: '📅',
        ordem: 1,
        ativo: true,
        publico: true,
        premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  try {
    const { data, error } = await supabase
      .from('platform.escola_modulos')
      .select('modulo:modulos(*)')
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('modulo.ordem')

    if (error) {
      console.error('Erro ao obter módulos instalados:', error)
      return []
    }

    return data.map(item => item.modulo) as unknown as Modulo[]
  } catch (error) {
    console.error('Erro inesperado ao obter módulos:', error)
    return []
  }
}

// ============================================
// 📅 OPERAÇÕES DE CALENDÁRIO (Multi-tenant)
// ============================================

/**
 * Obtém eventos de calendário para uma escola
 */
export async function getEventosCalendario(
  escolaId: string,
  options: {
    dataInicio?: string
    dataFim?: string
    categoria?: string
    status?: EventoCalendario['status']
    autorId?: string
    visibilidade?: EventoCalendario['visibilidade']
    limit?: number
    offset?: number
  } = {}
): Promise<EventoCalendario[]> {
  const {
    dataInicio,
    dataFim,
    categoria,
    status,
    autorId,
    visibilidade,
    limit = 100,
    offset = 0,
  } = options

  if (!isConfigured) {
    // Em desenvolvimento, usar lowdb
    const db = await getDB()
    const eventos = (db.data?.events as any[]) || []
    
    return eventos.map(evento => ({
      id: evento.id,
      escola_id: escolaId,
      data: evento.date,
      titulo: evento.title,
      descricao: evento.nota,
      categoria: evento.category,
      status: evento.status,
      autor_id: evento.autor_login,
      visibilidade: 'public',
      recorrente: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }

  try {
    let query = supabase
      .from('modulo_calendario.eventos')
      .select('*')
      .eq('escola_id', escolaId)
      .eq('deleted_at', null)
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (dataInicio) {
      query = query.gte('data', dataInicio)
    }
    if (dataFim) {
      query = query.lte('data', dataFim)
    }
    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (autorId) {
      query = query.eq('autor_id', autorId)
    }
    if (visibilidade) {
      query = query.eq('visibilidade', visibilidade)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao obter eventos de calendário:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Erro inesperado ao obter eventos:', error)
    return []
  }
}

/**
 * Cria um novo evento de calendário
 */
export async function criarEventoCalendario(
  escolaId: string,
  evento: Omit<EventoCalendario, 'id' | 'escola_id' | 'created_at' | 'updated_at'>
): Promise<EventoCalendario | null> {
  if (!isConfigured) {
    // Em desenvolvimento, usar lowdb
    const db = await getDB()
    const newId = `event-${Date.now()}`
    
    const novoEvento = {
      id: newId,
      escola_id: escolaId,
      ...evento,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!db.data?.events) {
      db.data!.events = []
    }
    db.data!.events.push({
      id: newId,
      date: evento.data,
      title: evento.titulo,
      category: evento.categoria,
      status: (evento.status || 'pending') as 'approved' | 'rejected' | 'pending',
      nota: evento.descricao ?? null,
      autor_login: evento.autor_id ?? null,
    })
    
    await db.write()
    return novoEvento
  }

  try {
    const { data, error } = await supabase
      .from('modulo_calendario.eventos')
      .insert({
        escola_id: escolaId,
        ...evento,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar evento de calendário:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro inesperado ao criar evento:', error)
    return null
  }
}

/**
 * Atualiza um evento de calendário
 */
export async function atualizarEventoCalendario(
  eventoId: string,
  escolaId: string,
  updates: Partial<Omit<EventoCalendario, 'id' | 'escola_id' | 'created_at' | 'updated_at'>>
): Promise<EventoCalendario | null> {
  if (!isConfigured) {
    // Em desenvolvimento, usar lowdb
    const db = await getDB()
    const eventos = (db.data?.events as any[]) || []
    const eventoIndex = eventos.findIndex(e => e.id === eventoId)
    
    if (eventoIndex === -1) return null
    
    eventos[eventoIndex] = {
      ...eventos[eventoIndex],
      ...Object.fromEntries(
        Object.entries(updates).map(([key, value]) => {
          // Mapear campos novos para antigos
          const fieldMap: Record<string, string> = {
            titulo: 'title',
            descricao: 'nota',
            data: 'date',
            categoria: 'category',
            status: 'status',
            autor_id: 'autor_login',
          }
          return [fieldMap[key] || key, value]
        })
      ),
    }
    
    await db.write()
    
    // Retornar evento no formato novo
    const evento = eventos[eventoIndex]
    return {
      id: evento.id,
      escola_id: escolaId,
      data: evento.date,
      titulo: evento.title,
      descricao: evento.nota,
      categoria: evento.category,
      status: evento.status,
      autor_id: evento.autor_login,
      visibilidade: 'public',
      recorrente: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    const { data, error } = await supabase
      .from('modulo_calendario.eventos')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventoId)
      .eq('escola_id', escolaId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar evento de calendário:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro inesperado ao atualizar evento:', error)
    return null
  }
}

// ============================================
// 🔐 MIDDLEWARE MULTI-TENANT
// ============================================

/**
 * Middleware para extrair e validar contexto multi-tenant
 */
export async function withMultiTenant(
  req: Request,
  next: (context: {
    escola: Escola
    usuario: Usuario
    escolaUsuario: EscolaUsuario
    permissoes: Record<string, Permissao>
  }) => Promise<Response>
): Promise<Response> {
  try {
    // Extrair escola do subdomínio ou header
    const hostname = req.headers.get('host') || ''
    const escolaSlug = extractEscolaSlugFromHost(hostname)
    
    // Extrair token de autenticação
    const token = extractTokenFromRequest(req)
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verificar token e obter usuário
    const usuarioInfo = await verificarToken(token)
    if (!usuarioInfo) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter escola
    const escola = await getEscolaAtual(escolaSlug || usuarioInfo.escolaSlug)
    if (!escola) {
      return new Response(
        JSON.stringify({ error: 'Escola não encontrada ou inativa' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter usuário e associação com escola
    const usuarioComEscola = await getUsuarioAtualComEscola(
      usuarioInfo.usuarioId,
      escola.id
    )
    
    if (!usuarioComEscola) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado na escola' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter permissões do usuário
    const modulos = await getModulosInstalados(escola.id)
    const permissoes: Record<string, Permissao> = {}
    
    for (const modulo of modulos) {
      const permissao = await verificarPermissao(
        usuarioComEscola.escolaUsuario.id,
        modulo.slug,
        'leitura'
      )
      if (permissao.permissao) {
        permissoes[modulo.slug] = permissao.permissao
      }
    }

    // Executar handler com contexto
    return await next({
      escola,
      usuario: usuarioComEscola.usuario,
      escolaUsuario: usuarioComEscola.escolaUsuario,
      permissoes,
    })
  } catch (error) {
    console.error('Erro no middleware multi-tenant:', error)
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ============================================
// 🛠️ FUNÇÕES AUXILIARES
// ============================================

function extractEscolaSlugFromHost(hostname: string): string | null {
  // Exemplo: escola-slug.educalendario.com → escola-slug
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }
  return null
}

function extractTokenFromRequest(req: Request): string | null {
  // Tentar extrair de Authorization header
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Tentar extrair de cookie
  const cookieHeader = req.headers.get('Cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const tokenCookie = cookies.find(c => c.startsWith('token='))
    if (tokenCookie) {
      return tokenCookie.substring(6)
    }
  }
  
  return null
}

async function verificarToken(token: string): Promise<{ usuarioId: string; escolaSlug?: string } | null> {
  // Implementação básica - em produção usar JWT
  try {
    // Simples verificação para desenvolvimento
    return {
      usuarioId: 'dev-user-id',
      escolaSlug: 'dev-escola',
    }
  } catch (error) {
    return null
  }
}

// ============================================
// ============================================
// 📋 EXPORTAÇÕES (funções e tipos já exportados nas declarações acima)
// ============================================
