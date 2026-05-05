import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Bookings from './pages/dashboard/Bookings'
import Services from './pages/dashboard/Services'
import Availability from './pages/dashboard/Availability'
import Settings from './pages/dashboard/Settings'
import PublicBooking from './pages/booking/PublicBooking'
import ProtectedRoute from './components/shared/ProtectedRoute'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/book/:businessId' element={<PublicBooking />} />

        {/* Protected dashboard routes */}
        <Route path='/' element={<ProtectedRoute />}>
          <Route index element={<Navigate to='/dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='bookings' element={<Bookings />} />
          <Route path='services' element={<Services />} />
          <Route path='availability' element={<Availability />} />
          <Route path='settings' element={<Settings />} />
        </Route>

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Router>
  )
}