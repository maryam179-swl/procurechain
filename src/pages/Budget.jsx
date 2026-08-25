import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import {
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, PieChart,
  Plus, Search, Filter, Pencil, Trash2, Save, X, ChevronRight,
  ArrowRightLeft, Building2, ShieldAlert, BarChart3, Layers
} from 'lucide-react'

// ─── Status Badges ─────────────────────────────────────
const BUDGET_STATUS = {
  Healthy: 'bg-teal-100 text-teal-700 border border-teal-200',
  'Near Limit': 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold',
  'Over Budget': 'bg-rose-100 text-rose-700 border border-rose-200 font-bold animate-pulse',
}

function BudgetStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${BUDGET_STATUS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ─── Utilization Bar ───────────────────────────────────
function UtilizationBar({ pct }) {
  const score = Math.min(Math.max(pct || 0, 0), 120)
  const color = score > 100 ? 'bg-rose-500' : score >= 85 ? 'bg-amber-500' : 'bg-teal-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[50px] overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className="text-xs font-mono font-bold text-slate-700">{pct}%</span>
    </div>
  )
}

// ─── Main Budget Component ─────────────────────────────
export default function Budget() {
  const [budgets, setBudgets] = useState([])
  const [stats, setStats] = useState({ total_allocated: 0, total_spent: 0, total_remaining: 0, average_utilization: 0, over_budget_count: 0, total_departments_count: 0 })
  const [chartData, setChartData] = useState([])
  const [departmentsList, setDepartmentsList] = useState([])
  const [loading, setLoading] = useState(true)

  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReallocateModal, setShowReallocateModal] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState(null)

  // Create Form
  const [createForm, setCreateForm] = useState({
    dept: '',
    fiscal_year: '2026',
    quarter: 'Annual',
    allocated_budget: '',
    notes: '',
  })
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Edit Form
  const [editForm, setEditForm] = useState({
    id: '',
    dept: '',
    fiscal_year: '2026',
    quarter: 'Annual',
    allocated_budget: '',
    spent_amount: '',
    committed_amount: '',
    notes: '',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // Reallocate Form
  const [reallocateForm, setReallocateForm] = useState({
    id: '',
    from_category: '',
    to_category: '',
    amount: '',
    notes: '',
  })
  const [submittingReallocate, setSubmittingReallocate] = useState(false)

  // ─── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterDept !== 'All') params.append('dept', filterDept)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [bRes, sRes, cRes, dRes] = await Promise.all([
        fetch(`/api/budgets?${params}`),
        fetch('/api/budgets/stats'),
        fetch('/api/budgets/department-spending'),
        fetch('/api/departments'),
      ])

      const [bJson, sJson, cJson, dJson] = await Promise.all([
        bRes.json(), sRes.json(), cRes.json(), dRes.json()
      ])

      if (bJson.success) setBudgets(bJson.data)
      if (sJson.success) setStats(sJson.data)
      if (cJson.success) setChartData(cJson.data)
      if (dJson.success) setDepartmentsList(dJson.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const refreshDetail = async (id) => {
    try {
      const res = await fetch(`/api/budgets/${id}`)
      const json = await res.json()
      if (json.success) setSelectedBudget(json.data)
    } catch (err) {}
  }

  useEffect(() => { fetchAll() }, [filterDept, filterStatus, searchTerm])

  // ─── Create Budget ───────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!createForm.dept || !createForm.allocated_budget) {
      alert('Department and Allocated Budget amount are required.')
      return
    }
    setSubmittingCreate(true)
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({ dept: '', fiscal_year: '2026', quarter: 'Annual', allocated_budget: '', notes: '' })
        fetchAll()
      } else alert(json.error || 'Failed to allocate budget')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingCreate(false)
    }
  }

  // ─── Open Edit Modal ─────────────────────────────────
  const openEditModal = (bdg) => {
    setEditForm({
      id: bdg.id,
      dept: bdg.dept,
      fiscal_year: bdg.fiscal_year || '2026',
      quarter: bdg.quarter || 'Annual',
      allocated_budget: bdg.allocated_budget !== undefined ? bdg.allocated_budget : '',
      spent_amount: bdg.spent_amount !== undefined ? bdg.spent_amount : '',
      committed_amount: bdg.committed_amount !== undefined ? bdg.committed_amount : '',
      notes: bdg.notes || '',
    })
    setShowEditModal(true)
  }

  // ─── Save Edit Changes ───────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id || !editForm.allocated_budget) {
      alert('Allocated Budget amount is required.')
      return
    }
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/budgets/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
        if (selectedBudget && selectedBudget.id === editForm.id) {
          await refreshDetail(editForm.id)
        }
      } else alert(json.error || 'Failed to update budget')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ─── Open Reallocate Modal ───────────────────────────
  const openReallocateModal = (bdg) => {
    const cats = bdg.category_allocations || []
    setReallocateForm({
      id: bdg.id,
      from_category: cats.length > 0 ? cats[0].category : '',
      to_category: cats.length > 1 ? cats[1].category : '',
      amount: '',
      notes: '',
    })
    setShowReallocateModal(true)
  }

  // ─── Submit Reallocate ───────────────────────────────
  const handleReallocateSubmit = async (e) => {
    e.preventDefault()
    if (!reallocateForm.from_category || !reallocateForm.to_category || !reallocateForm.amount) {
      alert('From Category, To Category, and Amount are required.')
      return
    }
    setSubmittingReallocate(true)
    try {
      const res = await fetch(`/api/budgets/${reallocateForm.id}/reallocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reallocateForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowReallocateModal(false)
        fetchAll()
        if (selectedBudget && selectedBudget.id === reallocateForm.id) {
          await refreshDetail(reallocateForm.id)
        }
      } else alert(json.error || 'Failed to reallocate funds')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingReallocate(false)
    }
  }

  // ─── Delete Budget ───────────────────────────────────
  const handleDeleteBudget = async (id) => {
    if (!window.confirm(`Delete budget record ${id}?`)) return
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        if (selectedBudget?.id === id) setSelectedBudget(null)
        fetchAll()
      } else alert(json.error || 'Failed to delete budget')
    } catch (err) {
      alert('Error deleting budget.')
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Department Budget Management"
        subtitle="Manage department and project budget allocations, track utilization, and reallocate funds"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* ── Control Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search department, budget ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departmentsList.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Healthy">Healthy (&lt;85%)</option>
                <option value="Near Limit">Near Limit (85-100%)</option>
                <option value="Over Budget">Over Budget (&gt;100%)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Allocate Department Budget
          </button>
        </div>

        {/* ── Stats Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Allocated Budget', val: `$${(stats.total_allocated || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-blue-500" /> },
            { label: 'Total Spent & Committed', val: `$${((stats.total_spent || 0) + (stats.total_committed || 0)).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-teal-500" /> },
            { label: 'Remaining Available', val: `$${(stats.total_remaining || 0).toLocaleString()}`, icon: <CheckCircle2 className="w-5 h-5 text-teal-600" /> },
            { label: 'Over-Budget Depts', val: stats.over_budget_count, icon: <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" /> },
          ].map((s) => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-xl font-bold text-slate-900">{s.val}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Department Spending Bar Chart ── */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Department Budget vs Spending ($k)</h3>
              <p className="text-xs text-slate-500">Visual comparison of allocated budget vs actual committed expenditure per department</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="k" />
              <Tooltip formatter={(v) => [`$${v}k`]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="allocated" name="Allocated Budget ($k)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="spent" name="Spent & Committed ($k)" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* ── Budgets Table ── */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading budget allocations...</div>
          ) : budgets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No department budgets found. Allocate one to get started.</div>
          ) : (
            <Table columns={['Budget ID', 'Department', 'Fiscal Term', 'Allocated ($)', 'Spent & Committed ($)', 'Remaining ($)', 'Utilization', 'Status', 'Actions']}>
              {budgets.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{b.id}</Td>
                  <Td className="font-medium text-slate-900">
                    <div>{b.dept}</div>
                    <div className="text-[11px] text-slate-400 font-mono font-normal">Code: {b.code}</div>
                  </Td>
                  <Td className="text-xs text-slate-600 font-mono">FY{b.fiscal_year} · {b.quarter}</Td>
                  <Td mono className="font-bold text-slate-900 text-xs">${(b.allocated_budget || 0).toLocaleString()}</Td>
                  <Td mono className="text-xs font-semibold text-slate-700">${((b.spent_amount || 0) + (b.committed_amount || 0)).toLocaleString()}</Td>
                  <Td mono className={`text-xs font-bold ${b.remaining_budget < 0 ? 'text-rose-600' : 'text-teal-700'}`}>
                    ${(b.remaining_budget || 0).toLocaleString()}
                  </Td>
                  <Td className="w-36"><UtilizationBar pct={b.utilization_pct} /></Td>
                  <Td><BudgetStatusBadge status={b.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBudget(b)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openReallocateModal(b)}
                        title="Reallocate / Transfer Funds"
                        className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(b)}
                        title="Edit Budget Allocation"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(b.id)}
                        title="Delete Budget Record"
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

      </div>

      {/* ════════════════════════════════════════════════
          MODAL 1: Allocate New Department Budget
      ════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Allocate Department Budget</h3>
                  <p className="text-xs text-slate-500">Set fiscal year budget limits and operational funds</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department <span className="text-red-500">*</span></label>
                <select
                  required
                  value={createForm.dept}
                  onChange={e => setCreateForm({ ...createForm, dept: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                >
                  <option value="">Select department...</option>
                  {departmentsList.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fiscal Year</label>
                  <select
                    value={createForm.fiscal_year}
                    onChange={e => setCreateForm({ ...createForm, fiscal_year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quarter / Term</label>
                  <select
                    value={createForm.quarter}
                    onChange={e => setCreateForm({ ...createForm, quarter: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="Annual">Annual (Full Year)</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Allocated Budget ($) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 150000"
                  value={createForm.allocated_budget}
                  onChange={e => setCreateForm({ ...createForm, allocated_budget: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Allocation Notes & Justification</label>
                <textarea
                  rows={2}
                  placeholder="Budget notes or capex justification..."
                  value={createForm.notes}
                  onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingCreate} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50">
                  {submittingCreate ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Budget Detail Drawer
      ════════════════════════════════════════════════ */}
      {selectedBudget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{selectedBudget.id}</span>
                  <BudgetStatusBadge status={selectedBudget.status} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{selectedBudget.dept} Department Budget</h3>
                <p className="text-xs text-slate-500 mt-0.5">FY{selectedBudget.fiscal_year} · Term: {selectedBudget.quarter}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openReallocateModal(selectedBudget)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Reallocate
                </button>
                <button
                  onClick={() => openEditModal(selectedBudget)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setSelectedBudget(null)}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Allocated</span>
                  <span className="text-sm font-bold text-slate-900">${(selectedBudget.allocated_budget || 0).toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Spent</span>
                  <span className="text-xs font-mono font-bold text-slate-900">${(selectedBudget.spent_amount || 0).toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Committed POs</span>
                  <span className="text-xs font-mono font-bold text-slate-900">${(selectedBudget.committed_amount || 0).toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Remaining</span>
                  <span className={`text-xs font-mono font-bold ${selectedBudget.remaining_budget < 0 ? 'text-rose-600' : 'text-teal-700'}`}>
                    ${(selectedBudget.remaining_budget || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Category Allocations Breakdown</span>
                <div className="space-y-2">
                  {(selectedBudget.category_allocations || []).map((cat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{cat.category}</div>
                        <div className="text-[11px] text-slate-500">Allocated: ${(cat.allocated || 0).toLocaleString()}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">Spent: ${(cat.spent || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-900 block mb-1">Allocation Notes</span>
                <p className="text-xs text-slate-600">{selectedBudget.notes || 'No special notes.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 3: Edit Budget Allocation Modal
      ════════════════════════════════════════════════ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Budget Allocation ({editForm.id})</h3>
                  <p className="text-xs text-slate-500">{editForm.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Allocated Budget ($) <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="number"
                    value={editForm.allocated_budget}
                    onChange={e => setEditForm({ ...editForm, allocated_budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Spent Amount ($)</label>
                  <input
                    type="number"
                    value={editForm.spent_amount}
                    onChange={e => setEditForm({ ...editForm, spent_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Committed POs ($)</label>
                  <input
                    type="number"
                    value={editForm.committed_amount}
                    onChange={e => setEditForm({ ...editForm, committed_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              {/* Prominent Save Changes Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingEdit} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  {submittingEdit ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 4: Reallocate / Transfer Funds Modal
      ════════════════════════════════════════════════ */}
      {showReallocateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Reallocate Budget Funds</h3>
              </div>
              <button onClick={() => setShowReallocateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleReallocateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">From Category <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Source category"
                  value={reallocateForm.from_category}
                  onChange={e => setReallocateForm({ ...reallocateForm, from_category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">To Category <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Target category"
                  value={reallocateForm.to_category}
                  onChange={e => setReallocateForm({ ...reallocateForm, to_category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Amount to Transfer ($) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  placeholder="10000"
                  value={reallocateForm.amount}
                  onChange={e => setReallocateForm({ ...reallocateForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowReallocateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingReallocate} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50">
                  {submittingReallocate ? 'Transferring...' : 'Transfer Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
