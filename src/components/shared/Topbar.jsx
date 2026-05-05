import { Sun, Moon, Bell, Menu } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useThemeStore from '../../store/useThemeStore'

export default function TopBar({ onMenuClick }) {
  const { user } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  const initials = user?.businessName
    ?.split(' ').map(w => w[0]).join('')
    .toUpperCase().slice(0, 2) || 'BK'

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header
      className='h-14 border-b border-[var(--border-color)] px-4 lg:px-6
        flex items-center justify-between flex-shrink-0'
      style={{ background: 'var(--bg-sidebar)' }}
    >
      <div className='flex items-center gap-3'>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className='lg:hidden w-8 h-8 rounded-xl flex items-center
            justify-center bg-[var(--bg-surface-2)]
            border border-[var(--border-color)]
            text-[var(--text-muted)] hover:text-[var(--text-primary)]
            transition-all duration-150'
        >
          <Menu size={16} />
        </button>

        <div className='hidden sm:block'>
          <p className='text-sm text-[var(--text-secondary)]'>
            {greeting()},{' '}
            <span className='text-[var(--text-primary)] font-medium'>
              {user?.businessName}
            </span>
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className='w-8 h-8 rounded-xl flex items-center justify-center
            bg-[var(--bg-surface-2)] border border-[var(--border-color)]
            text-[var(--text-muted)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-3)] transition-all duration-150'
          title={isDark ? 'Switch to light' : 'Switch to dark'}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button
          className='w-8 h-8 rounded-xl flex items-center justify-center
            bg-[var(--bg-surface-2)] border border-[var(--border-color)]
            text-[var(--text-muted)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-3)] transition-all duration-150
            relative'
        >
          <Bell size={15} />
          <span className='absolute top-1.5 right-1.5 w-1.5 h-1.5
            bg-accent rounded-full' />
        </button>

        {/* Avatar */}
        <div className='w-8 h-8 bg-accent rounded-xl flex items-center
          justify-center text-xs font-bold text-white'>
          {initials}
        </div>
      </div>
    </header>
  )
}