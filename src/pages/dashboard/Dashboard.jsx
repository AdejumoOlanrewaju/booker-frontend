import { useEffect, useState } from 'react'
import { CalendarDays, TrendingUp, XCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

function StatCard({ icon: Icon, label, value, color, subtext }) {
  return (
    <Card className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider'>
          {label}
        </p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={17} className='text-white' />
        </div>
      </div>
      <div>
        <p className='text-2xl font-semibold text-[var(--text-primary)] tracking-tight'>
          {value}
        </p>
        {subtext && (
          <p className='text-xs text-[var(--text-muted)] mt-0.5'>{subtext}</p>
        )}
      </div>
    </Card>
  )
}

function Spinner() {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin' />
    </div>
  )
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, bookingsRes] = await Promise.all([
          api.get('/bookings/analytics'),
          api.get('/bookings?limit=5')
        ])
        console.log("Analytics data: ", analyticsRes.data)
        setAnalytics(analyticsRes.data)
        setBookings(bookingsRes.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>

      {/* Header */}
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-lg sm:text-xl font-semibold text-[var(--text-primary)]'>
            Dashboard
          </h1>
          <p className='text-sm text-[var(--text-muted)] mt-0.5'>
            Here's what's happening this month
          </p>
        </div>
        <Link
          to='/bookings'
          className='flex items-center gap-1.5 text-xs font-medium 
            text-accent hover:text-accent-hover transition-colors whitespace-nowrap'
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Stat cards — 2 cols on mobile, 4 on xl */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'>
        <StatCard
          icon={CalendarDays}
          label='Total bookings'
          value={analytics?.total ?? 0}
          color='bg-accent'
          subtext='All time'
        />
        <StatCard
          icon={TrendingUp}
          label='Revenue'
          value={`₦${(analytics?.revenue ?? 0).toLocaleString()}`}
          color='bg-emerald-500'
          subtext='This month'
        />
        <StatCard
          icon={Clock}
          label='Pending'
          value={analytics?.pending ?? 0}
          color='bg-yellow-500'
          subtext='Awaiting confirmation'
        />
        <StatCard
          icon={XCircle}
          label='Cancelled'
          value={analytics?.cancelled ?? 0}
          color='bg-red-500'
          subtext={`${analytics?.cancellationRate ?? 0}% rate`}
        />
      </div>

      {/* Main content — stacked on mobile, 2 col on xl */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>

        {/* Recent bookings — full width on mobile */}
        <Card padding={false} className='xl:col-span-2'>
          <div className='px-4 sm:px-5 py-4 border-b border-[var(--border-color)] 
            flex items-center justify-between'>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Recent Bookings
            </h2>
            <Link
              to='/bookings'
              className='text-xs text-accent hover:text-accent-hover 
                transition-colors font-medium'
            >
              See all
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className='px-5 py-12 text-center'>
              <div className='w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] 
                flex items-center justify-center mx-auto mb-3'>
                <CalendarDays size={20} className='text-[var(--text-muted)]' />
              </div>
              <p className='text-sm text-[var(--text-muted)]'>No bookings yet</p>
              <p className='text-xs text-[var(--text-muted)] mt-1'>
                Share your booking link to get started
              </p>
            </div>
          ) : (
            <div className='divide-y divide-[var(--border-color)]'>
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className='px-4 sm:px-5 py-3.5 flex items-center 
                    justify-between gap-3
                    hover:bg-[var(--bg-surface-2)] transition-colors duration-100'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-8 h-8 rounded-xl bg-accent/10 flex 
                      items-center justify-center flex-shrink-0'>
                      <span className='text-xs font-semibold text-accent'>
                        {booking.customerName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                        {booking.customerName}
                      </p>
                      <p className='text-xs text-[var(--text-muted)] truncate'>
                        {booking.service?.name} · {booking.startTime}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                    <p className='text-xs text-[var(--text-muted)] hidden sm:block'>
                      {new Date(booking.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <Badge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Summary panel — stacked below on mobile */}
        <div className='flex flex-col gap-4'>

          {analytics?.mostBooked && (
            <Card className='flex flex-col gap-2'>
              <p className='text-xs font-medium text-[var(--text-muted)] 
                uppercase tracking-wider'>
                Top Service
              </p>
              <p className='text-base font-semibold text-[var(--text-primary)]'>
                {analytics.mostBooked}
              </p>
              <div className='w-full h-1.5 rounded-full bg-[var(--bg-surface-2)]'>
                <div
                  className='h-1.5 rounded-full bg-accent transition-all duration-500'
                  style={{ width: `${100 - (analytics.cancellationRate || 0)}%` }}
                />
              </div>
              <p className='text-xs text-[var(--text-muted)]'>
                {analytics.cancellationRate ?? 0}% cancellation rate
              </p>
            </Card>
          )}

          <Card className='flex flex-col gap-3'>
            <p className='text-xs font-medium text-[var(--text-muted)] 
              uppercase tracking-wider'>
              Quick Stats
            </p>
            {[
              { label: 'Confirmed', value: analytics?.confirmed ?? 0, color: 'bg-emerald-500' },
              { label: 'Completed', value: analytics?.completed ?? 0, color: 'bg-blue-500' },
              { label: 'Pending', value: analytics?.pending ?? 0, color: 'bg-yellow-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className='text-sm text-[var(--text-secondary)]'>{label}</span>
                </div>
                <span className='text-sm font-semibold text-[var(--text-primary)]'>
                  {value}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}