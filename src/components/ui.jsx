export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${className}`}>
      {children}
    </div>
  )
}

export function KpiCard({ label, value, sub }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-medium tracking-wide uppercase text-slate-400">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold text-ink-900">
        {value}
      </div>
      <div className="mt-1 text-xs text-ink-600">{sub}</div>
    </Card>
  )
}

const statusStyles = {
  Approved: 'bg-teal-100 text-teal-700',
  Delivered: 'bg-teal-100 text-teal-700',
  Complete: 'bg-teal-100 text-teal-700',
  Active: 'bg-teal-100 text-teal-700',
  Pending: 'bg-amber-100 text-amber-600',
  'Under Review': 'bg-blue-100 text-blue-700',
  Submitted: 'bg-indigo-100 text-indigo-700',
  'In Transit': 'bg-amber-100 text-amber-600',
  Partial: 'bg-amber-100 text-amber-600',
  'Expiring soon': 'bg-amber-100 text-amber-600',
  Amended: 'bg-amber-100 text-amber-600',
  Rejected: 'bg-red-100 text-red-600',
  Expired: 'bg-red-100 text-red-600',
  Delayed: 'bg-red-100 text-red-600',
}

const priorityStyles = {
  Urgent: 'bg-red-100 text-red-600',
  High: 'bg-amber-100 text-amber-600',
  Normal: 'bg-slate-100 text-ink-600',
}

export function StatusBadge({ status }) {
  const cls = statusStyles[status] || 'bg-slate-100 text-ink-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const cls = priorityStyles[priority] || 'bg-slate-100 text-ink-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {priority}
    </span>
  )
}

export function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((c) => (
              <th
                key={c}
                className="text-left font-medium text-xs tracking-wide uppercase text-slate-400 px-5 py-3 whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  )
}

export function Td({ children, mono = false, className = '' }) {
  return (
    <td
      className={`px-5 py-3.5 text-ink-900 whitespace-nowrap ${
        mono ? 'font-mono text-xs' : ''
      } ${className}`}
    >
      {children}
    </td>
  )
}
