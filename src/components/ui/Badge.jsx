const variants = {
  pending: {
    dot: 'bg-yellow-400',
    style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  },
  confirmed: {
    dot: 'bg-emerald-400',
    style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  cancelled: {
    dot: 'bg-red-400',
    style: 'bg-red-500/10 text-red-400 border-red-500/20'
  },
  completed: {
    dot: 'bg-blue-400',
    style: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  active: {
    dot: 'bg-emerald-400',
    style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  inactive: {
    dot: 'bg-slate-400',
    style: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  },
}

export default function Badge({ status, label, dot = true }) {
  const variant = variants[status] || variants.inactive

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      text-xs font-medium rounded-full border
      ${variant.style}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant.dot}`} />
      )}
      {label || status}
    </span>
  )
}