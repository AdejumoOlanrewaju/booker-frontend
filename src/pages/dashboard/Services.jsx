import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Scissors } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

function ServiceModal({ service, onClose, onSaved }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditing = !!service

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: service || {}
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      if (isEditing) {
        await api.put(`/services/${service._id}`, data)
      } else {
        await api.post('/services', data)
      }
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
          w-full sm:max-w-md p-5 sm:p-6'
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Handle bar for mobile bottom sheet feel */}
        <div className='w-10 h-1 rounded-full bg-[var(--bg-surface-3)] 
          mx-auto mb-4 sm:hidden' />

        <div className='flex items-center justify-between mb-5 sm:mb-6'>
          <div>
            <h2 className='text-base font-semibold text-[var(--text-primary)]'>
              {isEditing ? 'Edit service' : 'Add service'}
            </h2>
            <p className='text-xs text-[var(--text-muted)] mt-0.5'>
              {isEditing
                ? 'Update your service details'
                : 'Add a new service to your business'
              }
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
            border-red-500/20 rounded-xl text-sm text-red-400 
            flex items-center gap-2'>
            <X size={14} className='flex-shrink-0' />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Input
            label='Service name'
            placeholder='e.g. Haircut'
            error={errors.name?.message}
            {...register('name', { required: 'Service name is required' })}
          />
          <Input
            label='Description'
            placeholder='Brief description of the service'
            error={errors.description?.message}
            {...register('description')}
          />
          <div className='grid grid-cols-2 gap-3'>
            <Input
              label='Duration (mins)'
              type='number'
              placeholder='30'
              error={errors.duration?.message}
              {...register('duration', {
                required: 'Required',
                min: { value: 5, message: 'Min 5 mins' }
              })}
            />
            <Input
              label='Price (₦)'
              type='number'
              placeholder='5000'
              error={errors.price?.message}
              {...register('price', {
                required: 'Required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
          </div>
          <div className='flex gap-3 mt-1'>
            <Button type='button' variant='outline' className='flex-1' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' loading={loading} className='flex-1'>
              {isEditing ? 'Save changes' : 'Add service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await api.get('/services')
      setServices(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      setDeleting(id)
      await api.delete(`/services/${id}`)
      fetchServices()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>

      {/* Header */}
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-lg sm:text-xl font-semibold text-[var(--text-primary)]'>
            Services
          </h1>
          <p className='text-sm text-[var(--text-muted)] mt-0.5'>
            Manage the services you offer
          </p>
        </div>
        <Button
          onClick={() => { setEditingService(null); setModalOpen(true) }}
          className='flex items-center gap-1.5 flex-shrink-0'
          size='sm'
        >
          <Plus size={14} />
          <span className='hidden sm:inline'>Add service</span>
          <span className='sm:hidden'>Add</span>
        </Button>
      </div>

      <Card padding={false}>
        {loading ? (
          <div className='flex items-center justify-center h-48'>
            <div className='w-6 h-6 border-2 border-accent 
              border-t-transparent rounded-full animate-spin' />
          </div>
        ) : services.length === 0 ? (
          <div className='px-5 py-16 text-center'>
            <div className='w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] 
              flex items-center justify-center mx-auto mb-3'>
              <Scissors size={20} className='text-[var(--text-muted)]' />
            </div>
            <p className='text-sm text-[var(--text-muted)] mb-4'>
              No services yet — add your first one
            </p>
            <Button
              onClick={() => { setEditingService(null); setModalOpen(true) }}
              className='flex items-center gap-2 mx-auto'
              size='sm'
            >
              <Plus size={14} />
              Add service
            </Button>
          </div>
        ) : (
          <div className='divide-y divide-[var(--border-color)]'>
            {services.map((service) => (
              <div
                key={service._id}
                className='px-4 sm:px-5 py-4 flex items-center 
                  justify-between gap-3
                  hover:bg-[var(--bg-surface-2)] transition-colors duration-100'
              >
                <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl 
                    bg-accent/10 flex items-center justify-center flex-shrink-0'>
                    <Scissors size={15} className='text-accent' />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='text-sm font-medium text-[var(--text-primary)]'>
                        {service.name}
                      </p>
                      <Badge
                        status={service.isActive ? 'active' : 'inactive'}
                        label={service.isActive ? 'Active' : 'Inactive'}
                      />
                    </div>
                    {service.description && (
                      <p className='text-xs text-[var(--text-muted)] 
                        mt-0.5 truncate hidden sm:block'>
                        {service.description}
                      </p>
                    )}
                    <div className='flex items-center gap-3 mt-1'>
                      <span className='text-xs text-[var(--text-muted)]'>
                        ⏱ {service.duration} mins
                      </span>
                      <span className='text-xs font-medium text-[var(--text-secondary)]'>
                        ₦{service.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-1 flex-shrink-0'>
                  <button
                    onClick={() => { setEditingService(service); setModalOpen(true) }}
                    className='w-8 h-8 flex items-center justify-center
                      rounded-xl text-[var(--text-muted)] 
                      hover:text-[var(--text-primary)]
                      hover:bg-[var(--bg-surface-3)] transition-all'
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    disabled={deleting === service._id}
                    className='w-8 h-8 flex items-center justify-center
                      rounded-xl text-[var(--text-muted)] 
                      hover:text-red-400 hover:bg-red-500/10 
                      transition-all disabled:opacity-50'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => setModalOpen(false)}
          onSaved={fetchServices}
        />
      )}
    </div>
  )
}