// ─────────────────────────────────────────────
//  Spinner — indicador de loading inline
// ─────────────────────────────────────────────
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const SIZES = {
  sm: 'w-3 h-3 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
}

export default function Spinner({ size = 'md', color = 'white', className = '' }: Props) {
  return (
    <span
      className={`inline-block rounded-full animate-spin ${SIZES[size]} ${className}`}
      style={{
        borderColor: `${color}30`,
        borderTopColor: color,
      }}
      role="status"
      aria-label="Carregando..."
    />
  )
}
