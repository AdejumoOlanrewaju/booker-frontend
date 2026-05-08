import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Zap, Mail, Lock, Building2, Phone } from 'lucide-react'
import api from '../../api/axios'
import useAuthStore from '../../store/useAuthStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      const res = await api.post('/auth/register', {
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        phone: data.phone
      })
      login(res.data, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4 py-10'
      style={{ background: 'var(--bg)' }}
    >
      <div className='w-full max-w-md'>

        {/* Logo */}
        <div className='flex flex-col items-center mb-8'>
          <div className='w-12 h-12 bg-accent rounded-2xl flex items-center 
            justify-center shadow-lg mb-4'>
            <Zap size={22} className='text-white' />
          </div>
          <h1 className='text-2xl font-semibold text-[var(--text-primary)] 
            tracking-tight'>
            Booker
          </h1>
          <p className='text-sm text-[var(--text-muted)] mt-1'>
            Set up your booking system in minutes
          </p>
        </div>

        {/* Card */}
        <div
          className='rounded-2xl border border-[var(--border-color)] p-7'
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>
              Create your account
            </h2>
            <p className='text-sm text-[var(--text-muted)] mt-0.5'>
              Free to start, no credit card required
            </p>
          </div>

          {error && (
            <div className='mb-5 px-4 py-3 bg-red-500/10 border 
              border-red-500/20 rounded-xl text-sm text-red-400
              flex items-center gap-2'>
              <svg viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4 flex-shrink-0'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd'/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Input
              label='Business name'
              type='text'
              placeholder='Glow Up Salon'
              icon={Building2}
              error={errors.businessName?.message}
              {...register('businessName', {
                required: 'Business name is required',
                minLength: { value: 2, message: 'At least 2 characters' }
              })}
            />

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
              label='Phone number'
              type='tel'
              placeholder='08012345678'
              icon={Phone}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Enter a valid number' }
              })}
            />

            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              icon={Lock}
              hint='At least 6 characters'
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' }
              })}
            />

            <Input
              label='Confirm password'
              type='password'
              placeholder='••••••••'
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: val =>
                  val === watch('password') || 'Passwords do not match'
              })}
            />

            <Button
              type='button'
              loading={loading}
              className='w-full mt-1'
              size='lg'
            >
              Create account
            </Button>
          </form>

          <p className='text-center text-sm text-[var(--text-muted)] mt-5'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-accent hover:text-accent-hover font-medium 
                transition-colors'
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className='text-center text-xs text-[var(--text-muted)] mt-5'>
          By creating an account you agree to our terms of service
        </p>
      </div>
    </div>
  )
}