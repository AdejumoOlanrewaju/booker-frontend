import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Copy, Check } from 'lucide-react'
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
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(bookingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='flex flex-col gap-6'>

      {/* Header */}
      <div>
        <h1 className='text-xl font-semibold text-white'>Settings</h1>
        <p className='text-sm text-slate-400 mt-0.5'>
          Manage your business profile
        </p>
      </div>

      {/* Booking link */}
      <Card>
        <h2 className='text-sm font-semibold text-white mb-1'>
          Your booking link
        </h2>
        <p className='text-xs text-slate-500 mb-4'>
          Share this link with your customers so they can book appointments
        </p>
        <div className='flex items-center gap-2'>
          <div className='flex-1 px-3 py-2.5 bg-surface-2 border border-border
            rounded-lg text-sm text-slate-400 truncate font-mono'>
            {bookingLink}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={copyLink}
            className='flex items-center gap-2 flex-shrink-0'
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </Card>

      {/* Business profile */}
      <Card>
        <h2 className='text-sm font-semibold text-white mb-5'>
          Business profile
        </h2>

        {error && (
          <div className='mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20
            rounded-lg text-sm text-red-400'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Business name'
              placeholder='Glow Up Salon'
              error={errors.businessName?.message}
              {...register('businessName', {
                required: 'Business name is required'
              })}
            />
            <Input
              label='Phone number'
              placeholder='08012345678'
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
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required'
            })}
          />

          <Input
            label='Address'
            placeholder='123 Main Street, Lagos'
            {...register('address')}
          />

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-slate-300'>
              Business description
            </label>
            <textarea
              placeholder='Tell customers what your business does...'
              rows={3}
              className='w-full px-3 py-2.5 rounded-lg text-sm bg-surface
                border border-border text-slate-200
                placeholder:text-slate-500 resize-none
                focus:outline-none focus:ring-2 focus:ring-accent
                focus:border-transparent transition-all duration-150'
              {...register('description')}
            />
          </div>

          <div className='flex justify-end mt-2'>
            <Button
              type='submit'
              loading={loading}
              variant={saved ? 'success' : 'primary'}
            >
              {saved ? 'Saved!' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}