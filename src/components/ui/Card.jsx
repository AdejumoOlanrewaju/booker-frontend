export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--bg-surface)] border border-[var(--border-color)] 
        rounded-2xl transition-all duration-150
        ${padding ? 'p-5' : ''}
        ${hover ? 'hover:border-accent/40 hover:shadow-md cursor-pointer hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ boxShadow: 'var(--shadow)' }}
    >
      {children}
    </div>
  )
}