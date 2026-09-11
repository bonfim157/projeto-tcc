// ─────────────────────────────────────────────
//  Badge — badge de contagem / status
// ─────────────────────────────────────────────
interface Props {
  children: React.ReactNode
  variant?: 'accent' | 'amber' | 'green' | 'red' | 'slate'
  className?: string
}

const VARIANTS = {
  accent: 'bg-[var(--accent)] text-white',
  amber:  'bg-amber-100 text-amber-700',
  green:  'bg-emerald-100 text-emerald-700',
  red:    'bg-red-100 text-red-700',
  slate:  'bg-slate-100 text-slate-600',
}

export default function Badge({ children, variant = 'accent', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full
        text-[10px] font-bold px-2 py-0.5 min-w-[1.25rem]
        ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
