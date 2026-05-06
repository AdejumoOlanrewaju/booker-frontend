import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Copy, Check, Link2, Building2, Mail, Phone, MapPin, FileText } from 'lucide-react'
import api from '../../api/axios'
import useAuthStore from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Settings() {
  const { user, login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const bookingLink = `${window.location.origin}/book/${user?._id}`

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me')
        reset({
          businessName: res.data.businessName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          description: res.data.description,
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      const res = await api.put('/auth/business', data)
      login(res.data, localStorage.getItem('token'))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(bookingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const initials = user?.businessName
    ?.split(' ').map(w => w[0]).join('')
    .toUpperCase().slice(0, 2) || 'BK'

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>

      {/* Header */}
      <div>
        <h1 className='text-lg sm:text-xl font-semibold text-[var(--text-primary)]'>
          Settings
        </h1>
        <p className='text-sm text-[var(--text-muted)] mt-0.5'>
          Manage your business profile
        </p>
      </div>

      {/* Business identity card */}
      <Card>
        <div className='flex items-center gap-4'>
          <div className='w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl 
            flex items-center justify-center text-lg sm:text-xl 
            font-bold text-white flex-shrink-0 shadow-sm'>
            {initials}
          </div>
          <div className='min-w-0'>
            <p className='text-base sm:text-lg font-semibold 
              text-[var(--text-primary)] truncate'>
              {user?.businessName}
            </p>
            <p className='text-sm text-[var(--text-muted)] truncate mt-0.5'>
              {user?.email}
            </p>
            <div className='flex items-center gap-1.5 mt-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
              <span className='text-xs text-emerald-400 font-medium'>
                Active
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking link */}
      <Card>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-9 h-9 rounded-xl bg-accent/10 flex items-center 
            justify-center flex-shrink-0'>
            <Link2 size={16} className='text-accent' />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Booking link
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Share with customers to accept bookings
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex-1 px-3 py-2.5 rounded-xl text-sm 
            font-mono truncate border border-[var(--border-color)]
            bg-[var(--bg-surface-2)] text-[var(--text-muted)]
            min-w-0'>
            {bookingLink}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={copyLink}
            className='flex items-center gap-1.5 flex-shrink-0'
          >
            {copied
              ? <Check size={13} className='text-emerald-400' />
              : <Copy size={13} />
            }
            <span className='hidden sm:inline'>
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </Button>
        </div>

        {copied && (
          <p className='text-xs text-emerald-400 mt-2 flex items-center gap-1'>
            <Check size={11} />
            Link copied to clipboard
          </p>
        )}
      </Card>

      {/* Business profile form */}
      <Card>
        <div className='flex items-center gap-3 mb-5 sm:mb-6'>
          <div className='w-9 h-9 rounded-xl bg-accent/10 flex items-center 
            justify-center flex-shrink-0'>
            <Building2 size={16} className='text-accent' />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Business profile
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Update your business information
            </p>
          </div>
        </div>

        {error && (
          <div className='mb-5 px-4 py-3 bg-red-500/10 border 
            border-red-500/20 rounded-xl text-sm text-red-400 
            flex items-center gap-2'>
            <span className='flex-shrink-0'>✕</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

          {/* Business name + phone — stacked on mobile, 2 col on sm+ */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              label='Business name'
              placeholder='Glow Up Salon'
              icon={Building2}
              error={errors.businessName?.message}
              {...register('businessName', {
                required: 'Business name is required'
              })}
            />
            <Input
              label='Phone number'
              placeholder='08012345678'
              icon={Phone}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required'
              })}
            />
          </div>

          <Input
            label='Email address'
            type='email'
            placeholder='you@business.com'
            icon={Mail}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email'
              }
            })}
          />

          <Input
            label='Business address'
            placeholder='123 Main Street, Lagos'
            icon={MapPin}
            {...register('address')}
          />

          {/* Textarea — manually styled with CSS vars */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-[var(--text-secondary)]'>
              <span className='flex items-center gap-1.5'>
                <FileText size={13} className='text-[var(--text-muted)]' />
                Business description
              </span>
            </label>
            <textarea
              placeholder='Tell customers what your business does...'
              rows={3}
              className='w-full px-3 py-2.5 rounded-xl text-sm resize-none
                border border-[var(--border-color)]
                bg-[var(--bg-surface-2)]
                text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)]
                focus:outline-none focus:ring-2 focus:ring-accent/50
                focus:border-accent
                transition-all duration-150'
              {...register('description')}
            />
          </div>

          {/* Divider */}
          <div className='border-t border-[var(--border-color)] pt-4 mt-1
            flex flex-col sm:flex-row sm:items-center 
            sm:justify-between gap-3'>
            <p className='text-xs text-[var(--text-muted)]'>
              Changes will be reflected on your public booking page
            </p>
            <Button
              type='submit'
              loading={loading}
              variant={saved ? 'success' : 'primary'}
              className='w-full sm:w-auto'
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger zone */}
      <Card>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-9 h-9 rounded-xl bg-red-500/10 flex items-center 
            justify-center flex-shrink-0'>
            <span className='text-red-400 text-sm font-bold'>!</span>
          </div>
          <div>
            <h2 className='text-sm font-semibold text-[var(--text-primary)]'>
              Danger zone
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Irreversible actions
            </p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center 
          sm:justify-between gap-3 p-4 rounded-xl border 
          border-red-500/20 bg-red-500/5'>
          <div>
            <p className='text-sm font-medium text-[var(--text-primary)]'>
              Delete account
            </p>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant='danger'
            size='sm'
            className='w-full sm:w-auto flex-shrink-0'
            onClick={() => window.confirm('Are you sure? This cannot be undone.')}
          >
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  )
}