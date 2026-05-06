import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import Sidebar from './Sidebar.jsx'
import TopBar from './Topbar.jsx'

export default function ProtectedRoute() {
  const { token } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!token) return <Navigate to='/login' replace />

  return (
    <div
      className='flex h-screen overflow-hidden'
      style={{ background: 'var(--bg)' }}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex flex-col flex-1 overflow-hidden min-w-0'>
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className='flex-1 overflow-y-auto p-4 lg:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}