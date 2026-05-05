import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import {
  LayoutDashboard, CalendarDays, Scissors,
  Clock, Settings, LogOut, Zap, X
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/services', icon: Scissors, label: 'Services' },
  { to: '/availability', icon: Clock, label: 'Availability' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const initials = user?.businessName
    ?.split(' ').map(w => w[0]).join('')
    .toUpperCase().slice(0, 2) || 'BK'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    // close sidebar on mobile after navigation
    if (window.innerWidth < 1024) onClose?.()
  }

  const SidebarContent = () => (
    <aside className='w-64 h-full flex flex-col flex-shrink-0 border-r
      border-[var(--border-color)]'
      style={{ background: 'var(--bg-sidebar)' }}
    >
      {/* Logo + close button on mobile */}
      <div className='px-5 pt-6 pb-5 flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 bg-accent rounded-xl flex items-center
            justify-center shadow-sm'>
            <Zap size={15} className='text-white' />
          </div>
          <span className='text-[var(--text-primary)] font-semibold
            text-base tracking-tight'>
            BookEase
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className='lg:hidden w-7 h-7 flex items-center justify-center
            rounded-lg text-[var(--text-muted)]
            hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-2)] transition-all'
        >
          <X size={16} />
        </button>
      </div>

      {/* Business card */}
      <div className='mx-3 mb-4 p-3 rounded-xl bg-[var(--bg-surface-2)]
        border border-[var(--border-color)]'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-accent rounded-xl flex items-center
            justify-center text-xs font-bold text-white flex-shrink-0'>
            {initials}
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
              {user?.businessName || 'My Business'}
            </p>
            <p className='text-xs text-[var(--text-muted)] truncate'>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <p className='px-5 mb-2 text-xs font-semibold uppercase tracking-wider
        text-[var(--text-muted)]'>
        Menu
      </p>

      {/* Nav */}
      <nav className='flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-accent text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-lg flex items-center
                  justify-center flex-shrink-0 transition-all duration-150
                  ${isActive ? 'bg-white/20' : 'bg-[var(--bg-surface-3)]'}`}>
                  <Icon size={15} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className='px-3 py-4 border-t border-[var(--border-color)]'>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-[var(--text-secondary)]
            hover:bg-red-500/10 hover:text-red-400
            transition-all duration-150 w-full group'
        >
          <div className='w-7 h-7 rounded-lg flex items-center justify-center
            bg-[var(--bg-surface-3)] group-hover:bg-red-500/20
            transition-all duration-150 flex-shrink-0'>
            <LogOut size={15} />
          </div>
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop — always visible */}
      <div className='hidden lg:flex h-screen'>
        <SidebarContent />
      </div>

      {/* Mobile — slide in drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm
              z-40 transition-opacity duration-200'
            onClick={onClose}
          />
          {/* Drawer */}
          <div className='lg:hidden fixed inset-y-0 left-0 z-50 flex
            transition-transform duration-300'>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}