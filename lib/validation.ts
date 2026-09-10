import { z } from 'zod'
import { inputValidation } from './security-config'

// ============================================
// 🛡️ VALIDAÇÃO COM SANITIZAÇÃO
// ============================================

/**
 * Sanitiza input baseado no tipo
 */
function sanitizeInput(value: unknown, type: keyof typeof inputValidation.maxLengths): unknown {
  if (typeof value !== 'string') return value

  let sanitized = value.trim()

  if (inputValidation.sanitization.normalizeWhitespace) {
    sanitized = sanitized.replace(/\s+/g, ' ')
  }

  // Limitar tamanho máximo
  const maxLength = inputValidation.maxLengths[type]
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  // Sanitização específica por tipo
  switch (type) {
    case 'username':
      sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '')
      break

    case 'eventDescription':
    case 'chatMessage':
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
      break

    case 'date':
      if (!inputValidation.patterns.date.test(sanitized)) {
        throw new Error('Formato de data inválido')
      }
      break
  }

  return sanitized
}

/**
 * Schema base com transformação de sanitização — compatível com Zod v4
 */
function createSanitizedSchema<T extends z.ZodTypeAny>(
  schema: T,
  fieldName: keyof typeof inputValidation.maxLengths
) {
  return schema.transform((value: unknown) => {
    return sanitizeInput(value, fieldName)
  })
}

// ============================================
// 🚪 AUTENTICAÇÃO
// ============================================

export const LoginSchema = z.object({
  login: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(inputValidation.maxLengths.username, `Máximo ${inputValidation.maxLengths.username} caracteres`)
    .regex(inputValidation.patterns.username, 'Apenas letras, números, ., _, -')
    .transform((v) => sanitizeInput(v, 'username') as string),
  senha: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .max(inputValidation.maxLengths.password, `Máximo ${inputValidation.maxLengths.password} caracteres`),
})

// ============================================
// 📅 EVENTOS
// ============================================

export const EventSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD')
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Data inválida'),

  title: z.string()
    .min(1, 'Título obrigatório')
    .max(inputValidation.maxLengths.eventTitle, `Máximo ${inputValidation.maxLengths.eventTitle} caracteres`)
    .transform((v) => sanitizeInput(v, 'eventTitle') as string),

  category: z.enum(['red', 'yellow', 'green', 'blue', 'purple', 'orange']),

  hora: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Formato: HH:MM')
    .optional()
    .nullable(),

  local: z.string()
    .max(200, 'Máximo 200 caracteres')
    .optional()
    .nullable()
    .transform((v) => v ? sanitizeInput(v, 'eventTitle') as string : v),

  nota: z.string()
    .max(inputValidation.maxLengths.eventDescription, `Máximo ${inputValidation.maxLengths.eventDescription} caracteres`)
    .optional()
    .nullable()
    .transform((v) => v ? sanitizeInput(v, 'eventDescription') as string : v),

  autor_login: z.string().optional(),

  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// ============================================
// ✅ APROVAÇÃO
// ============================================

export const ApproveSchema = z.object({
  status: z.enum(['approved', 'rejected']),

  aprovadoPor: z.string()
    .min(1, 'Aprovador obrigatório')
    .optional(),

  motivo: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable()
    .transform((v) => v ? sanitizeInput(v, 'eventDescription') as string : v),

  reviewed_at: z.string().optional(),
}).refine((data) => {
  if (data.status === 'rejected' && (!data.motivo || data.motivo.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Motivo é obrigatório para rejeição',
  path: ['motivo'],
})

// ============================================
// 💬 MENSAGENS
// ============================================

export const MessageSchema = z.object({
  text: z.string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(inputValidation.maxLengths.chatMessage, `Máximo ${inputValidation.maxLengths.chatMessage} caracteres`)
    .transform((v) => sanitizeInput(v, 'chatMessage') as string),

  from_login: z.string()
    .min(1, 'Remetente obrigatório')
    .max(inputValidation.maxLengths.username, `Máximo ${inputValidation.maxLengths.username} caracteres`),

  to_login: z.string()
    .max(inputValidation.maxLengths.username, `Máximo ${inputValidation.maxLengths.username} caracteres`)
    .optional()
    .nullable(),

  is_edited: z.boolean().optional().default(false),
  edited_at: z.string().optional().nullable(),
  replied_to: z.string().optional().nullable(),
})

// ============================================
// 👤 USUÁRIOS
// ============================================

export const UserSchema = z.object({
  login: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(inputValidation.maxLengths.username, `Máximo ${inputValidation.maxLengths.username} caracteres`)
    .regex(inputValidation.patterns.username, 'Apenas letras, números, ., _, -')
    .transform((v) => sanitizeInput(v, 'username') as string),

  nome: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apenas letras e espaços')
    .transform((v) => sanitizeInput(v, 'username') as string),

  papel: z.enum(['professor', 'aluno', 'gestao']),

  email: z.string()
    .email('Email inválido')
    .max(255, 'Máximo 255 caracteres')
    .optional()
    .nullable(),

  telefone: z.string()
    .max(20, 'Máximo 20 caracteres')
    .optional()
    .nullable(),
})

// ============================================
// 🛠️ UTILITÁRIOS
// ============================================

export async function validateAndSanitize<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const result = await schema.safeParseAsync(data)

    if (!result.success) {
      const errors = result.error.issues.map(err =>
        `${err.path.join('.')}: ${err.message}`
      )
      return { success: false, errors }
    }

    return { success: true, data: result.data }
  } catch {
    return {
      success: false,
      errors: ['Erro interno de validação'],
    }
  }
}

export function withValidation<T>(
  schema: z.ZodType<T>,
  handler: (data: T, req: Request) => Promise<Response>
) {
  return async function (req: Request) {
    try {
      const body = await req.json().catch(() => null)
      const validation = await validateAndSanitize(schema, body)

      if (!validation.success) {
        return new Response(
          JSON.stringify({ error: 'Dados inválidos', details: validation.errors }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return handler(validation.data, req)
    } catch (error) {
      console.error('Validation middleware error:', error)
      return new Response(
        JSON.stringify({ error: 'Erro interno do servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}

// ============================================
// 📋 TIPOS EXPORTADOS
// ============================================

export type LoginData = z.infer<typeof LoginSchema>
export type EventData = z.infer<typeof EventSchema>
export type ApproveData = z.infer<typeof ApproveSchema>
export type MessageData = z.infer<typeof MessageSchema>
export type UserData = z.infer<typeof UserSchema>
