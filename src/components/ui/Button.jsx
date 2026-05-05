export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const base = `inline-flex items-center justify-center font-medium rounded-xl 
    transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer select-none`

  const variants = {
    primary: `bg-accent hover:bg-accent-hover text-white 
      shadow-sm hover:shadow-md active:scale-[0.98]`,
    ghost: `bg-transparent hover:bg-[var(--bg-surface-2)] 
      text-[var(--text-secondary)] hover:text-[var(--text-primary)]`,
    danger: `bg-red-500 hover:bg-red-600 text-white 
      shadow-sm active:scale-[0.98]`,
    outline: `border border-[var(--border-color)] hover:bg-[var(--bg-surface-2)] 
      text-[var(--text-secondary)] hover:text-[var(--text-primary)]`,
    success: `bg-emerald-500 hover:bg-emerald-600 text-white 
      shadow-sm active:scale-[0.98]`,
    soft: `bg-accent-soft text-accent hover:bg-accent hover:text-white`,
  }

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
    xl: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className='flex items-center gap-2'>
          <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
            <circle className='opacity-25' cx='12' cy='12' r='10'
              stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor'
              d='M4 12a8 8 0 018-8v8z' />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  )
}