import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Search, ChevronUp, ChevronDown, CalendarDays } from 'lucide-react'
import api from '../../api/axios'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const statusOptions = ['all', 'pending', 'confirmed', 'cancelled', 'completed']

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [globalFilter, setGlobalFilter] = useState('')
  const [updating, setUpdating] = useState({ id: null, action: null })

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const res = await api.get(`/bookings${params}`)
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [statusFilter])

  const updateStatus = async (id, status) => {
    try {
      setUpdating({ id, action: status })
      await api.put(`/bookings/${id}/status`, { status })
      fetchBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating({ id: null, action: null })
    }
  }

  const columns = [
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: ({ row }) => (
        <div className='flex items-center gap-2 sm:gap-3'>
          <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-accent/10 
            flex items-center justify-center flex-shrink-0'>
            <span className='text-xs font-semibold text-accent'>
              {row.original.customerName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
              {row.original.customerName}
            </p>
            <p className='text-xs text-[var(--text-muted)] truncate hidden sm:block'>
              {row.original.customerEmail}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Service',
      accessorKey: 'service',
      cell: ({ row }) => (
        <div>
          <p className='text-sm text-[var(--text-secondary)] truncate max-w-[120px]'>
            {row.original.service?.name}
          </p>
          <p className='text-xs text-[var(--text-muted)]'>
            ₦{row.original.service?.price?.toLocaleString()}
          </p>
        </div>
      )
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
      // Hide on mobile — show in card view instead
      cell: ({ row }) => (
        <div className='hidden sm:block'>
          <p className='text-sm text-[var(--text-secondary)]'>
            {new Date(row.original.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
          <p className='text-xs text-[var(--text-muted)]'>
            {row.original.startTime} — {row.original.endTime}
          </p>
        </div>
      )
    },
    {
      header: 'Ref',
      accessorKey: 'reference',
      cell: ({ getValue }) => (
        <span className='text-xs font-mono px-2 py-1 rounded-lg hidden md:inline-block
          bg-[var(--bg-surface-2)] text-[var(--text-muted)]'>
          {getValue()}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => <Badge status={getValue()} />
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const { status, _id } = row.original
        return (
          <div className='flex items-center gap-1 sm:gap-1.5'>
            {status === 'pending' && (
              <Button
                size='sm'
                variant='success'
                loading={updating.id === _id && updating.action === 'confirmed'}
                onClick={() => updateStatus(_id, 'confirmed')}
              >
                Confirm
              </Button>
            )}
            {status === 'confirmed' && (
              <Button
                size='sm'
                variant='soft'
                loading={updating.id === _id && updating.action === 'completed'}
                onClick={() => updateStatus(_id, 'completed')}
              >
                <span className='hidden sm:inline'>Complete</span>
                <span className='sm:hidden'>Done</span>
              </Button>
            )}
            {(status === 'pending' || status === 'confirmed') && (
              <Button
                size='sm'
                variant='danger'
                loading={updating.id === _id && updating.action === 'cancelled'}
                onClick={() => updateStatus(_id, 'cancelled')}
              >
                <span className='hidden sm:inline'>Cancel</span>
                <span className='sm:hidden'>✕</span>
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data: bookings,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>

      {/* Header */}
      <div>
        <h1 className='text-lg sm:text-xl font-semibold text-[var(--text-primary)]'>
          Bookings
        </h1>
        <p className='text-sm text-[var(--text-muted)] mt-0.5'>
          Manage all your appointments
        </p>
      </div>

      <Card padding={false}>

        {/* Filters — stacked on mobile */}
        <div className='px-4 sm:px-5 py-3.5 sm:py-4 border-b 
          border-[var(--border-color)] flex flex-col sm:flex-row 
          sm:items-center gap-3'>

          {/* Search */}
          <div className='relative flex-1 sm:flex-none'>
            <Search size={14} className='absolute left-3 top-1/2 
              -translate-y-1/2 text-[var(--text-muted)]' />
            <input
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search bookings...'
              className='pl-9 pr-4 py-2 rounded-xl text-sm w-full sm:w-52
                bg-[var(--bg-surface-2)] border border-[var(--border-color)]
                text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                focus:outline-none focus:ring-2 focus:ring-accent/50
                focus:border-accent transition-all duration-150'
            />
          </div>

          {/* Status tabs — scrollable on mobile */}
          <div className='flex items-center gap-1 overflow-x-auto 
            scrollbar-none pb-0.5 sm:pb-0'>
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium 
                  capitalize transition-all duration-150 whitespace-nowrap
                  flex-shrink-0
                  ${statusFilter === s
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-secondary)]'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table — horizontally scrollable on mobile */}
        {loading ? (
          <div className='flex items-center justify-center h-48'>
            <div className='w-6 h-6 border-2 border-accent 
              border-t-transparent rounded-full animate-spin' />
          </div>
        ) : bookings.length === 0 ? (
          <div className='px-5 py-16 text-center'>
            <div className='w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] 
              flex items-center justify-center mx-auto mb-3'>
              <CalendarDays size={20} className='text-[var(--text-muted)]' />
            </div>
            <p className='text-sm text-[var(--text-muted)]'>No bookings found</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[500px]'>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}
                    className='border-b border-[var(--border-color)]'>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className='px-4 sm:px-5 py-3 text-left text-xs 
                          font-semibold text-[var(--text-muted)] uppercase 
                          tracking-wider cursor-pointer 
                          hover:text-[var(--text-secondary)] 
                          transition-colors select-none'
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className='flex items-center gap-1'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === 'asc' &&
                            <ChevronUp size={12} className='text-accent' />}
                          {header.column.getIsSorted() === 'desc' &&
                            <ChevronDown size={12} className='text-accent' />}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='divide-y divide-[var(--border-color)]'>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}
                    className='hover:bg-[var(--bg-surface-2)] 
                      transition-colors duration-100'>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='px-4 sm:px-5 py-3 sm:py-3.5'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && bookings.length > 0 && (
          <div className='px-4 sm:px-5 py-3 border-t border-[var(--border-color)]'>
            <p className='text-xs text-[var(--text-muted)]'>
              {table.getFilteredRowModel().rows.length} booking
              {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}