import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CheckCircle, ChevronLeft, Zap, Clock, Wallet } from 'lucide-react'
import api from '../../api/axios'

// ── Date picker style overrides ───────────────────────
const DatePickerStyles = () => (
  <style>{`
    .rdp-wrap { width: 100% }
    .react-datepicker {
      background: #0f172a !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 16px !important;
      font-family: inherit !important;
      width: 100% !important;
      overflow: hidden !important;
      box-shadow: 0 25px 50px rgba(0,0,0,0.4) !important;
    }
    .react-datepicker__month-container { width: 100% !important; }
    .react-datepicker__header {
      background: #0f172a !important;
      border-bottom: 1px solid rgba(255,255,255,0.06) !important;
      padding: 16px 0 10px !important;
    }
    .react-datepicker__current-month {
      color: #f1f5f9 !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      letter-spacing: -0.3px !important;
    }
    .react-datepicker__navigation {
      top: 14px !important;
    }
    .react-datepicker__navigation-icon::before {
      border-color: #475569 !important;
      border-width: 2px 2px 0 0 !important;
      width: 7px !important;
      height: 7px !important;
    }
    .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
      border-color: #f1f5f9 !important;
    }
    .react-datepicker__day-names {
      margin-top: 6px !important;
    }
    .react-datepicker__day-name {
      color: #475569 !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      width: 2.4rem !important;
    }
    .react-datepicker__day {
      color: #cbd5e1 !important;
      border-radius: 10px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      width: 2.4rem !important;
      line-height: 2.4rem !important;
      margin: 2px !important;
      transition: all 0.15s !important;
    }
    .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
      background: rgba(83,70,220,0.2) !important;
      color: #a5b4fc !important;
    }
    .react-datepicker__day--selected {
      background: #5346dc !important;
      color: white !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(83,70,220,0.4) !important;
    }
    .react-datepicker__day--keyboard-selected {
      background: rgba(83,70,220,0.3) !important;
      color: #a5b4fc !important;
    }
    .react-datepicker__day--disabled {
      color: #1e293b !important;
      cursor: not-allowed !important;
    }
    .react-datepicker__day--today:not(.react-datepicker__day--selected) {
      color: #818cf8 !important;
      font-weight: 700 !important;
    }
    .react-datepicker__month {
      padding: 8px !important;
    }
    .react-datepicker__triangle { display: none !important; }
  `}</style>
)

// ── Progress steps ────────────────────────────────────
function Progress({ step }) {
  const steps = ['Service', 'Date & Time', 'Details', 'Payment']
  const current = ['service', 'datetime', 'details', 'payment', 'confirmation']
    .indexOf(step)

  if (step === 'confirmation') return null

  return (
    <div className='flex items-center justify-center mb-10 px-4'>
      {steps.map((label, i) => (
        <div key={label} className='flex items-center'>
          <div className='flex flex-col items-center gap-1.5'>
            <div className={`w-8 h-8 rounded-full flex items-center
              justify-center text-xs font-semibold transition-all duration-300
              ${i < current
                ? 'bg-[#5346dc] text-white'
                : i === current
                  ? 'bg-[#5346dc] text-white ring-4 ring-[#5346dc]/20'
                  : 'bg-white/5 text-slate-600 border border-white/5'
              }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium tracking-wide
              transition-colors hidden sm:block
              ${i === current ? 'text-slate-300' : 'text-slate-600'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-14 h-px mx-1 sm:mx-2 mb-4
              transition-all duration-500
              ${i < current ? 'bg-[#5346dc]' : 'bg-white/5'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1 — Service ──────────────────────────────────
function ServiceStep({ services, onSelect }) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='mb-3'>
        <h2 className='text-2xl font-bold text-white tracking-tight'>
          Choose a service
        </h2>
        <p className='text-slate-400 text-sm mt-1'>
          Select what you'd like to book today
        </p>
      </div>

      {services.map((service) => (
        <button
          key={service._id}
          onClick={() => onSelect(service)}
          className='group w-full text-left px-5 py-5 rounded-2xl
            border border-white/5 bg-white/3
            hover:border-[#5346dc]/40 hover:bg-[#5346dc]/5
            transition-all duration-200 relative overflow-hidden'
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-300'
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(83,70,220,0.08) 0%, transparent 60%)'
            }}
          />
          <div className='relative flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <p className='text-base font-semibold text-white mb-1.5'>
                {service.name}
              </p>
              {service.description && (
                <p className='text-sm text-slate-400 leading-relaxed mb-3'>
                  {service.description}
                </p>
              )}
              <span className='inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-xl text-xs font-medium text-slate-400
                border border-white/5'
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <Clock size={11} />
                {service.duration} minutes
              </span>
            </div>
            <div className='flex-shrink-0 text-right'>
              <p className='text-xl font-bold text-[#818cf8]'>
                ₦{service.price?.toLocaleString()}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Step 2 — Date & Time ──────────────────────────────
function DateTimeStep({ business, service, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [message, setMessage] = useState('')

  const fetchSlots = async (date) => {
    try {
      setLoadingSlots(true)
      setSlots([])
      setSelectedSlot(null)
      setMessage('')
      const formatted = date.toISOString().split('T')[0]
      const res = await api.get(
        `/availability/slots/${business._id}/${formatted}/${service._id}`
      )
      setSlots(res.data.slots || [])
      if (res.data.message) setMessage(res.data.message)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    fetchSlots(date)
  }

  const isOpenDay = (date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday']
    const openDays = business.workingHours
      ?.filter(d => d.isOpen)
      .map(d => dayNames.indexOf(d.day))
    return openDays?.includes(date.getDay()) ?? true
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight'>
          Pick a date & time
        </h2>
        <p className='text-slate-400 text-sm mt-1'>
          {service.name} · {service.duration} mins
        </p>
      </div>

      {/* Date picker */}
      <div>
        <DatePickerStyles />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          filterDate={isOpenDay}
          inline
        />
      </div>

      {/* Slots */}
      {selectedDate && (
        <div>
          <p className='text-sm font-semibold text-slate-300 mb-3'>
            Available times
          </p>

          {loadingSlots ? (
            <div className='flex items-center justify-center py-8'>
              <div className='w-5 h-5 border-2 border-[#5346dc]
                border-t-transparent rounded-full animate-spin' />
            </div>
          ) : message ? (
            <p className='text-sm text-slate-500 text-center py-6'>
              {message}
            </p>
          ) : slots.length === 0 ? (
            <p className='text-sm text-slate-500 text-center py-6'>
              No available slots on this date
            </p>
          ) : (
            <div className='grid grid-cols-4 gap-2'>
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  disabled={!slot.isAvailable}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-semibold
                    transition-all duration-150
                    ${!slot.isAvailable
                      ? 'text-slate-700 cursor-not-allowed border border-white/3'
                      : selectedSlot?.startTime === slot.startTime
                        ? 'bg-[#5346dc] text-white shadow-lg shadow-[#5346dc]/30'
                        : 'border border-white/5 text-slate-300 hover:border-[#5346dc]/40 hover:text-white'
                    }`}
                  style={{
                    background: !slot.isAvailable
                      ? 'rgba(255,255,255,0.01)'
                      : selectedSlot?.startTime === slot.startTime
                        ? undefined
                        : 'rgba(255,255,255,0.02)'
                  }}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        disabled={!selectedDate || !selectedSlot}
        onClick={() => onSelect({
          date: selectedDate.toISOString().split('T')[0],
          slot: selectedSlot
        })}
        className='w-full py-4 bg-[#5346dc] hover:bg-[#4338ca] text-white
          font-semibold rounded-2xl transition-all duration-150
          disabled:opacity-20 disabled:cursor-not-allowed text-base
          shadow-lg shadow-[#5346dc]/20 hover:shadow-[#5346dc]/30'
      >
        Continue
      </button>
    </div>
  )
}

// ── Step 3 — Details ──────────────────────────────────
function DetailsStep({ onSubmit, loading }) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = 'Name is required'
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      e.customerEmail = 'Enter a valid email'
    if (!form.customerPhone.trim()) e.customerPhone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const fields = [
    { name: 'customerName', label: 'Full name',
      type: 'text', placeholder: 'John Doe' },
    { name: 'customerEmail', label: 'Email address',
      type: 'email', placeholder: 'john@example.com' },
    { name: 'customerPhone', label: 'Phone number',
      type: 'tel', placeholder: '08012345678' },
  ]

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(form) }}
      className='flex flex-col gap-5'
    >
      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight'>
          Your details
        </h2>
        <p className='text-slate-400 text-sm mt-1'>
          We'll send your confirmation here
        </p>
      </div>

      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name} className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-300'>
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={e => setForm({ ...form, [name]: e.target.value })}
            className='w-full px-4 py-3.5 rounded-2xl text-base
              border border-white/5 text-slate-200
              placeholder:text-slate-600 transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-[#5346dc]/50
              focus:border-[#5346dc]/50'
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
          {errors[name] && (
            <span className='text-xs text-red-400 flex items-center gap-1'>
              {errors[name]}
            </span>
          )}
        </div>
      ))}

      <button
        type='submit'
        disabled={loading}
        className='w-full py-4 bg-[#5346dc] hover:bg-[#4338ca] text-white
          font-semibold rounded-2xl transition-all duration-150
          disabled:opacity-50 text-base mt-2
          shadow-lg shadow-[#5346dc]/20 flex items-center justify-center gap-2'
      >
        {loading
          ? <div className='w-5 h-5 border-2 border-white/30
              border-t-white rounded-full animate-spin' />
          : 'Continue to payment'
        }
      </button>
    </form>
  )
}

// ── Step 4 — Payment ──────────────────────────────────
function PaymentStep({ booking, service, datetime, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: booking.customerEmail,
      amount: service.price * 100,
      ref: `BK-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: booking.customerName },
          { display_name: 'Phone',
            variable_name: 'phone',
            value: booking.customerPhone },
          { display_name: 'Service',
            variable_name: 'service',
            value: service.name },
        ]
      },
      callback: (response) => {
        setLoading(false)
        onSuccess(response)
      },
      onClose: () => {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  const summaryRows = [
    { label: 'Service', value: service.name },
    { label: 'Duration', value: `${service.duration} mins` },
    { label: 'Date', value: new Date(datetime.date)
      .toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long'
      })
    },
    { label: 'Time', value: datetime.slot.startTime },
    { label: 'Customer', value: booking.customerName },
  ]

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight'>
          Payment
        </h2>
        <p className='text-slate-400 text-sm mt-1'>
          Secure checkout via Paystack
        </p>
      </div>

      {/* Summary */}
      <div className='rounded-2xl overflow-hidden border border-white/5'
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className='px-5 py-3.5 border-b border-white/5'>
          <p className='text-xs font-bold text-slate-500 uppercase
            tracking-widest'>
            Order Summary
          </p>
        </div>
        <div className='px-5 py-4 flex flex-col gap-3.5'>
          {summaryRows.map(({ label, value }) => (
            <div key={label} className='flex justify-between items-start gap-4'>
              <span className='text-sm text-slate-500 flex-shrink-0'>
                {label}
              </span>
              <span className='text-sm text-slate-200 text-right'>
                {value}
              </span>
            </div>
          ))}
          <div className='pt-3.5 mt-0.5 border-t border-white/5
            flex justify-between items-center'>
            <span className='text-base font-bold text-white'>Total</span>
            <span className='text-2xl font-bold text-[#818cf8]'>
              ₦{service.price?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className='w-full py-4 bg-[#5346dc] hover:bg-[#4338ca] text-white
          font-semibold rounded-2xl transition-all duration-150
          disabled:opacity-60 text-base
          shadow-lg shadow-[#5346dc]/20 flex items-center
          justify-center gap-2.5'
      >
        {loading ? (
          <>
            <div className='w-5 h-5 border-2 border-white/30
              border-t-white rounded-full animate-spin' />
            Opening checkout...
          </>
        ) : (
          <>
            <Wallet size={18} />
            Pay ₦{service.price?.toLocaleString()}
          </>
        )}
      </button>

      <button
        onClick={onBack}
        className='flex items-center justify-center gap-1.5 text-sm
          text-slate-600 hover:text-slate-400 transition-colors'
      >
        <ChevronLeft size={14} />
        Go back
      </button>
    </div>
  )
}

// ── Step 5 — Confirmation ─────────────────────────────
function ConfirmationStep({ booking }) {
  const details = [
    { label: 'Reference', value: booking?.reference, accent: true, mono: true },
    { label: 'Service', value: booking?.service?.name },
    {
      label: 'Date',
      value: booking?.date
        ? new Date(booking.date).toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long'
          })
        : ''
    },
    { label: 'Time', value: booking?.startTime },
    { label: 'Name', value: booking?.customerName },
  ]

  return (
    <div className='flex flex-col items-center text-center gap-6 py-4'>
      {/* Icon */}
      <div className='relative'>
        <div className='w-20 h-20 rounded-full flex items-center justify-center'
          style={{ background: 'rgba(16,185,129,0.1)' }}>
          <CheckCircle size={38} className='text-emerald-400' />
        </div>
        <div className='absolute inset-0 rounded-full animate-ping'
          style={{ background: 'rgba(16,185,129,0.06)' }} />
      </div>

      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight mb-2'>
          You're all booked!
        </h2>
        <p className='text-slate-400 text-sm leading-relaxed max-w-xs mx-auto'>
          Your appointment is confirmed. A summary has been
          sent to your email and WhatsApp.
        </p>
      </div>

      {/* Details card */}
      <div className='w-full rounded-2xl overflow-hidden border border-white/5'
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className='px-5 py-3 border-b border-white/5'>
          <p className='text-xs font-bold text-slate-500 uppercase
            tracking-widest text-left'>
            Booking Details
          </p>
        </div>
        <div className='px-5 py-4 flex flex-col gap-3.5'>
          {details.map(({ label, value, accent, mono }) => (
            <div key={label} className='flex justify-between items-center'>
              <span className='text-sm text-slate-500'>{label}</span>
              <span className={`text-sm text-right
                ${accent ? 'text-[#818cf8]' : 'text-slate-200'}
                ${mono ? 'font-mono' : 'font-medium'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className='text-xs text-slate-600 leading-relaxed'>
        To cancel, contact the business with your reference number
      </p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────
export default function PublicBooking() {
  const { businessId } = useParams()
  const [step, setStep] = useState('service')
  const [business, setBusiness] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [selectedService, setSelectedService] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [createdBooking, setCreatedBooking] = useState(null)

  const STEPS = ['service', 'datetime', 'details', 'payment', 'confirmation']

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const [hoursRes, servicesRes] = await Promise.all([
          api.get(`/availability/hours/${businessId}`),
          api.get(`/services/public/${businessId}`)
        ])
        setBusiness(hoursRes.data)
        setServices(servicesRes.data)
      } catch {
        setError('Business not found')
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [businessId])

  const goBack = () => {
    const i = STEPS.indexOf(step)
    if (i > 0) setStep(STEPS[i - 1])
  }

  const handlePaymentSuccess = async (reference) => {
    try {
      setSubmitting(true)
      const res = await api.post('/bookings', {
        businessId,
        serviceId: selectedService._id,
        ...customerDetails,
        date: selectedDateTime.date,
        startTime: selectedDateTime.slot.startTime,
        paystackReference: reference.reference
      })
      setCreatedBooking(res.data)
      setStep('confirmation')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'
        style={{ background: '#030712' }}>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-2 border-[#5346dc]
            border-t-transparent rounded-full animate-spin' />
          <p className='text-sm text-slate-500'>Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !createdBooking) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'
        style={{ background: '#030712' }}>
        <div className='text-center'>
          <p className='text-lg font-bold text-white mb-2'>Not found</p>
          <p className='text-slate-500 text-sm'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen' style={{ background: '#030712' }}>

      {/* Background effects */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px]
          h-[400px] rounded-full blur-3xl'
          style={{ background: 'radial-gradient(ellipse, rgba(83,70,220,0.12) 0%, transparent 70%)' }}
        />
        <div className='absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl'
          style={{ background: 'radial-gradient(ellipse, rgba(129,140,248,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className='relative max-w-lg mx-auto px-4 py-10 pb-20'>

        {/* Header */}
        <div className='flex items-center justify-center gap-2 mb-12'>
          <div className='w-7 h-7 bg-[#5346dc] rounded-lg flex items-center
            justify-center'>
            <Zap size={13} className='text-white' />
          </div>
          <span className='text-slate-400 font-medium text-sm'>BookEase</span>
        </div>

        {/* Business info */}
        <div className='text-center mb-10'>
          <div className='w-16 h-16 rounded-2xl flex items-center justify-center
            mx-auto mb-4 text-white font-bold text-2xl'
            style={{
              background: 'linear-gradient(135deg, #5346dc 0%, #818cf8 100%)',
              boxShadow: '0 8px 32px rgba(83,70,220,0.3)'
            }}>
            {business?.businessName?.[0]?.toUpperCase()}
          </div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            {business?.businessName}
          </h1>
          <p className='text-slate-500 text-sm mt-1.5'>
            Book an appointment online
          </p>
        </div>

        {/* Progress */}
        <Progress step={step} />

        {/* Back */}
        {step !== 'service' && step !== 'confirmation' && (
          <button
            onClick={goBack}
            className='flex items-center gap-1.5 text-sm text-slate-600
              hover:text-slate-300 transition-colors mb-6 group'
          >
            <ChevronLeft size={15} className='group-hover:-translate-x-0.5
              transition-transform duration-150' />
            Back
          </button>
        )}

        {/* Card */}
        <div className='rounded-3xl p-7 border border-white/5'
          style={{
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}>

          {submitting ? (
            <div className='flex flex-col items-center gap-4 py-14'>
              <div className='w-10 h-10 border-2 border-[#5346dc]
                border-t-transparent rounded-full animate-spin' />
              <p className='text-slate-500 text-sm'>
                Confirming your booking...
              </p>
            </div>
          ) : (
            <>
              {step === 'service' && (
                <ServiceStep
                  services={services}
                  onSelect={(s) => {
                    setSelectedService(s)
                    setStep('datetime')
                  }}
                />
              )}
              {step === 'datetime' && (
                <DateTimeStep
                  business={business}
                  service={selectedService}
                  onSelect={(dt) => {
                    setSelectedDateTime(dt)
                    setStep('details')
                  }}
                />
              )}
              {step === 'details' && (
                <DetailsStep
                  onSubmit={(d) => {
                    setCustomerDetails(d)
                    setStep('payment')
                  }}
                  loading={submitting}
                />
              )}
              {step === 'payment' && (
                <PaymentStep
                  booking={customerDetails}
                  service={selectedService}
                  datetime={selectedDateTime}
                  onSuccess={handlePaymentSuccess}
                  onBack={goBack}
                />
              )}
              {step === 'confirmation' && (
                <ConfirmationStep booking={createdBooking} />
              )}
            </>
          )}
        </div>

        <p className='text-center text-xs text-slate-700 mt-8'>
          Powered by BookEase
        </p>
      </div>
    </div>
  )
}