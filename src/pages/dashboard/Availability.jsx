import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Clock } from 'lucide-react'
import api from '../../api/axios'
import useAuthStore from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const TIME_SLOTS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_SLOTS.push(
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    )
  }
}

const selectClass = `bg-[var(--bg-surface-2)] border border-[var(--border-color)] 
  rounded-xl text-sm text-[var(--text-secondary)] px-2.5 py-1.5
  focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
  transition-all duration-150`

function BlockDateModal({ onClose, onSaved }) {
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await api.post('/availability', { date, reason })
      onSaved()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex
      items-end sm:items-center justify-center z-50 p-0 sm:px-4'>
      <div
        className='rounded-t-2xl sm:rounded-2xl border border-[var(--border-color)] 
          w-full sm:max-w-sm p-5 sm:p-6'
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Mobile handle */}
        <div className='w-10 h-1 rounded-full bg-[var(--bg-surface-3)] 
          mx-auto mb-4 sm:hidden' />

        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-base font-semibold text-[var(--text-primary)]'>
              Block a date
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Customers can't book on this date
            </p>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-xl flex items-center justify-center
              text-[var(--text-muted)] hover:text-[var(--text-primary)]
              hover:bg-[var(--bg-surface-2)] transition-all'
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className='mb-4 px-4 py-3 bg-red-500/10 border 
            border-red-500/20 rounded-xl text-sm text-red-400'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--text-secondary)]'>
              Date
            </label>
            <input
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className={selectClass}
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--text-secondary)]'>
              Reason
              <span className='text-[var(--text-muted)] font-normal ml-1'>
                (optional)
              </span>
            </label>
            <input
              type='text'
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder='Holiday, vacation...'
              className={`${selectClass} placeholder:text-[var(--text-muted)]`}
            />
          </div>
          <div className='flex gap-3 mt-1'>
            <Button type='button' variant='outline' className='flex-1' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' loading={loading} className='flex-1'>
              Block date
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Availability() {
  const { user } = useAuthStore()
  const [workingHours, setWorkingHours] = useState([])
  const [bufferTime, setBufferTime] = useState(10)
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [saved, setSaved] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [hoursRes, blockedRes] = await Promise.all([
        api.get('/auth/me'),
        api.get(`/availability/public/${user?._id}`)
      ])
      setWorkingHours(hoursRes.data.workingHours)
      setBufferTime(hoursRes.data.bufferTime)
      setBlockedDates(blockedRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const updateDay = (index, field, value) => {
    setWorkingHours(prev => prev.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    ))
  }

  const saveHours = async () => {
    try {
      setSaving(true)
      await api.put('/availability/hours', { workingHours, bufferTime })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteBlockedDate = async (id) => {
    try {
      setDeleting(id)
      await api.delete(`/availability/${id}`)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-6 h-6 border-2 border-accent 
          border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>

      {/* Header */}
      <div>
        <h1 className='text-lg sm:text-xl font-semibold text-[var(--text-primary)]'>
          Availability
        </h1>
        <p className='text-sm text-[var(--text-muted)] mt-0.5'>
          Set your working hours and block dates off
        </p>
      </div>

      {/* Working hours */}
      <Card>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Working hours
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              When customers can book
            </p>
          </div>
          <Button
            size='sm'
            loading={saving}
            onClick={saveHours}
            variant={saved ? 'success' : 'primary'}
          >
            {saved ? '✓ Saved' : 'Save'}
          </Button>
        </div>

        <div className='flex flex-col gap-1.5'>
          {workingHours.map((day, index) => (
            <div
              key={day.day}
              className={`flex items-center gap-3 py-3 px-3 sm:px-4 rounded-xl
                transition-all duration-150
                ${day.isOpen ? 'bg-[var(--bg-surface-2)]' : 'opacity-60'}`}
            >
              {/* Toggle */}
              <button
                onClick={() => updateDay(index, 'isOpen', !day.isOpen)}
                className={`flex-shrink-0 rounded-full transition-all duration-200
                  flex items-center relative
                  ${day.isOpen ? 'bg-accent' : 'bg-[var(--bg-surface-3)]'}`}
                style={{ width: '40px', height: '22px' }}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-sm
                    transition-all duration-200 absolute
                    ${day.isOpen ? 'left-[22px]' : 'left-[3px]'}`}
                />
              </button>

              {/* Day name */}
              <span className={`text-sm capitalize flex-shrink-0 font-medium
                w-16 sm:w-24
                ${day.isOpen
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
                }`}>
                {/* Show abbreviated on mobile */}
                <span className='sm:hidden'>
                  {day.day.slice(0, 3)}
                </span>
                <span className='hidden sm:inline'>
                  {day.day}
                </span>
              </span>

              {day.isOpen ? (
                <div className='flex items-center gap-1.5 sm:gap-2 flex-1 
                  flex-wrap sm:flex-nowrap'>
                  <select
                    value={day.openTime}
                    onChange={e => updateDay(index, 'openTime', e.target.value)}
                    className={`${selectClass} flex-1 sm:flex-none`}
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className='text-[var(--text-muted)] text-xs'>to</span>
                  <select
                    value={day.closeTime}
                    onChange={e => updateDay(index, 'closeTime', e.target.value)}
                    className={`${selectClass} flex-1 sm:flex-none`}
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className='text-sm text-[var(--text-muted)] flex-1'>
                  Closed
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Buffer time */}
        <div className='mt-4 pt-4 border-t border-[var(--border-color)] 
          flex items-center justify-between gap-4'>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-[var(--text-primary)]'>
              Buffer time
            </p>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Gap between appointments
            </p>
          </div>
          <select
            value={bufferTime}
            onChange={e => setBufferTime(Number(e.target.value))}
            className={`${selectClass} flex-shrink-0`}
          >
            {[0, 5, 10, 15, 20, 30].map(t => (
              <option key={t} value={t}>{t} mins</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Blocked dates */}
      <Card padding={false}>
        <div className='px-4 sm:px-5 py-4 border-b border-[var(--border-color)] 
          flex items-center justify-between gap-3'>
          <div>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Blocked dates
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5 hidden sm:block'>
              Dates unavailable for booking
            </p>
          </div>
          <Button
            size='sm'
            onClick={() => setModalOpen(true)}
            className='flex items-center gap-1.5 flex-shrink-0'
          >
            <Plus size={13} />
            <span className='hidden sm:inline'>Block date</span>
            <span className='sm:hidden'>Block</span>
          </Button>
        </div>

        {blockedDates.length === 0 ? (
          <div className='px-5 py-12 text-center'>
            <div className='w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] 
              flex items-center justify-center mx-auto mb-3'>
              <Clock size={20} className='text-[var(--text-muted)]' />
            </div>
            <p className='text-sm text-[var(--text-muted)]'>No blocked dates</p>
          </div>
        ) : (
          <div className='divide-y divide-[var(--border-color)]'>
            {blockedDates.map((blocked) => (
              <div
                key={blocked._id}
                className='px-4 sm:px-5 py-3.5 sm:py-4 flex items-center 
                  justify-between gap-3
                  hover:bg-[var(--bg-surface-2)] transition-colors duration-100'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-9 h-9 rounded-xl bg-red-500/10 
                    flex items-center justify-center flex-shrink-0'>
                    <span className='text-xs font-bold text-red-400'>
                      {new Date(blocked.date).getDate()}
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                      {/* Short format on mobile */}
                      <span className='sm:hidden'>
                        {new Date(blocked.date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <span className='hidden sm:inline'>
                        {new Date(blocked.date).toLocaleDateString('en-GB', {
                          weekday: 'long', day: 'numeric',
                          month: 'long', year: 'numeric'
                        })}
                      </span>
                    </p>
                    {blocked.reason && (
                      <p className='text-xs text-[var(--text-muted)] mt-0.5 truncate'>
                        {blocked.reason}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteBlockedDate(blocked._id)}
                  disabled={deleting === blocked._id}
                  className='w-8 h-8 flex items-center justify-center
                    rounded-xl text-[var(--text-muted)] flex-shrink-0
                    hover:text-red-400 hover:bg-red-500/10
                    transition-all disabled:opacity-50'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen && (
        <BlockDateModal
          onClose={() => setModalOpen(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  )
}