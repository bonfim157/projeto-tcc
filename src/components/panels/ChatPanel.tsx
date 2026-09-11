'use client'
// ─────────────────────────────────────────────
//  ChatPanel — chat em tempo real (polling 5s)
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/src/hooks/useChat'
import type { User } from '@/src/types'

interface Props {
  user: User | null
}

export default function ChatPanel({ user }: Props) {
  const { messages, sending, sendMessage } = useChat(user)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para o final quando chegam novas mensagens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await sendMessage(text)
    setText('')
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col" style={{ height: 320 }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <span className="text-base" aria-hidden="true">💬</span>
        <h3 className="font-bold text-sm text-slate-800">Chat</h3>
        <span className="ml-auto text-[10px] text-slate-400">atualiza a cada 5s</span>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1" role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className="text-xs text-slate-400 text-center pt-6">Sem mensagens ainda.</p>
        )}
        {messages.map(msg => {
          const isMe = msg.from_login === user?.login
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {!isMe && (
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.from_login}</span>
              )}
              <div
                className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-xs ${
                  isMe ? 'text-white rounded-tr-sm' : 'text-slate-800 bg-slate-100 rounded-tl-sm'
                }`}
                style={{ background: isMe ? 'var(--accent)' : undefined }}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-300 mt-0.5 px-1">
                {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 mt-3 shrink-0">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Mensagem..."
          aria-label="Mensagem de chat"
          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-3 py-2 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
          aria-label="Enviar mensagem"
        >
          {sending ? '…' : '↑'}
        </button>
      </form>
    </div>
  )
}
