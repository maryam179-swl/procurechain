import { useState, useEffect } from 'react'
import { Download, Building2 } from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts'
import Header from '../components/Header'
import { Card, KpiCard, StatusBadge, PriorityBadge, Table, Td } from '../components/ui'
import {
  kpis, spendByCategory, budgetUtilization, departmentSpending,
  monthlySpendTrend, topVendors, requisitions,
} from '../data'

const PIE_COLORS = ['#0b1b33', '#b98a2e', '#0e7c6b', '#c2731c', '#475066', '#8a96a8']

export default function Dashboard() {
  const [liveRequisitions, setLiveRequisitions] = useState(requisitions)

  useEffect(() => {
    fetch('/api/requisitions')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setLiveRequisitions(json.data)
      })
      .catch(err => console.error(err))
  }, [])

  const utilData = [
    { name: 'Used', value: budgetUtilization.used },
    { name: 'Remaining', value: budgetUtilization.remaining },
  ]

  const handleExport = (format) => {
    window.open(`http://localhost:5000/api/analytics/export?format=${format}`, '_blank')
  }

  return (
    <div>
      <Header
        title="Analytics Dashboard"
        subtitle="Real-time procurement performance across 45 departments ($250M Annual Budget)"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Enterprise Context Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
              <Building2 className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Global Enterprise Org (Multi-Tenant SaaS)</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">Tenant ID: ORG-88402</span>
              </div>
              <p className="text-xs text-slate-400">45 Active Departments • 300 Vetted Vendors • 18 Warehouses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('json')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Power BI (JSON)
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gold-600 hover:bg-gold-500 text-slate-950 rounded-lg transition-colors font-semibold shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV Dataset
            </button>
          </div>
        </div>
        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  Procurement Spend by Category
                </h3>
                <p className="text-xs text-ink-600">Last 12 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlySpendTrend} margin={{ left: -18, right: 10 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b98a2e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#b98a2e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eaeef4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8a96a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8a96a8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`$${v}M`, 'Spend']}
                  contentStyle={{ borderRadius: 8, borderColor: '#dce2ec', fontSize: 13 }}
                />
                <Area type="monotone" dataKey="spend" stroke="#b98a2e" strokeWidth={2} fill="url(#spendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">
              Budget Utilization
            </h3>
            <div className="flex items-center justify-center py-2">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={utilData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={78}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                  >
                    <Cell fill="#b98a2e" />
                    <Cell fill="#eaeef4" />
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gold-600" />
                <span className="text-ink-600">Used</span>
                <span className="font-semibold text-ink-900">{budgetUtilization.used}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="text-ink-600">Remaining</span>
                <span className="font-semibold text-ink-900">{budgetUtilization.remaining}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">
              Spend by Category
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={spendByCategory} dataKey="value" nameKey="name" outerRadius={85}>
                  {spendByCategory.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-ink-600">
              {spendByCategory.map((c, i) => (
                <li key={c.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {c.name}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">
              Department Spending
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={departmentSpending} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#eaeef4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#8a96a8' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fontSize: 11, fill: '#475066' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(v) => [`$${v}M`]} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="value" fill="#0b1b33" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-4">
              Top Vendor Rankings
            </h3>
            <ul className="space-y-3">
              {topVendors.map((v, i) => (
                <li key={v.name} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 w-4">{i + 1}</span>
                  <span className="flex-1 text-sm text-ink-900 truncate">{v.name}</span>
                  <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gold-600 rounded-full"
                      style={{ width: `${v.score}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-ink-600 w-8 text-right">{v.score}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recent requisitions table */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <h3 className="font-display text-lg font-semibold text-ink-900">
              Recent Purchase Requisitions
            </h3>
          </div>
          <Table columns={['Req ID', 'Item / Description', 'Department', 'Priority', 'Status', 'Requested By']}>
            {liveRequisitions.slice(0, 10).map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <Td mono>{r.id}</Td>
                <Td>{r.item}</Td>
                <Td className="text-ink-600 font-normal">{r.dept}</Td>
                <Td><PriorityBadge priority={r.priority} /></Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td className="text-ink-600 font-normal">{r.requestedBy}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  )
}
