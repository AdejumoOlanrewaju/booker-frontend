import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  type = 'text',
  placeholder,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className='flex flex-col gap-1.5'>
      {label && (
        <label className='text-sm font-medium text-[var(--text-secondary)]'>
          {label}
        </label>
      )}
      <div className='relative'>
        {Icon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 
            text-[var(--text-muted)]'>
            <Icon size={15} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full py-2.5 rounded-xl text-sm
            bg-[var(--bg-surface-2)] border
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-accent/50 
            focus:border-accent
            transition-all duration-150
            ${Icon ? 'pl-9 pr-3' : 'px-3'}
            ${error
              ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
              : 'border-[var(--border-color)]'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className='text-xs text-red-400 flex items-center gap-1'>
          <svg viewBox='0 0 20 20' fill='currentColor' className='w-3 h-3'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd'/>
          </svg>
          {error}
        </span>
      )}
      {hint && !error && (
        <span className='text-xs text-[var(--text-muted)]'>{hint}</span>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input