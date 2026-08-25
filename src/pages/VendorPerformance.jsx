import { useState, useEffect } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import {
  TrendingUp, Award, AlertTriangle, ShieldCheck, Clock, CheckCircle2,
  XCircle, Plus, Search, Filter, Pencil, Trash2, Save, X, ChevronRight,
  BarChart3, FileWarning, DollarSign, Activity,
} from 'lucide-react'

// ─── Severity Badges ───────────────────────────────────
const SEVERITY_COLORS = {
  Low: 'bg-blue-100 text-blue-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
  Critical: 'bg-red-600 text-white font-bold',
}

function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_COLORS[severity] || 'bg-slate-100 text-slate-500'}`}>
      {severity}
    </span>
  )
}

// ─── Complaint Status Badges ────────────────────────────
const COMPLAINT_STATUS = {
  Open: 'bg-amber-100 text-amber-700',
  'In Investigation': 'bg-purple-100 text-purple-700',
  Resolved: 'bg-teal-100 text-teal-700',
  Escalated: 'bg-red-100 text-red-600',
}

function ComplaintStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${COMPLAINT_STATUS[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}

// ─── Main Vendor Performance Component ─────────────────
export default function VendorPerformance() {
  const [radarData, setRadarData] = useState([])
  const [rankings, setRankings] = useState([])
  const [complaints, setComplaints] = useState([])
  const [vendorsList, setVendorsList] = useState([])
  const [riskMatrix, setRiskMatrix] = useState([])
  const [loading, setLoading] = useState(true)

  const [filterSeverity, setFilterSeverity] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Log Complaint Modal
  const [showLogModal, setShowLogModal] = useState(false)
  const [logForm, setLogForm] = useState({
    vendor_id: '',
    issue_type: 'Late Delivery',
    severity: 'Medium',
    description: '',
    logged_by: 'Quality Inspector',
    resolution_notes: '',
  })
  const [submittingLog, setSubmittingLog] = useState(false)

  // Edit Complaint Modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    vendor_id: '',
    vendor_name: '',
    issue_type: 'Late Delivery',
    severity: 'Medium',
    status: 'Open',
    description: '',
    resolution_notes: '',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  const issueTypes = ['Late Delivery', 'Defective Quality', 'Pricing Variance', 'SLA Breach', 'Contract Non-compliance']

  // ─── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterSeverity !== 'All') params.append('severity', filterSeverity)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [rRes, kRes, cRes, vRes, riskRes] = await Promise.all([
        fetch('/api/performance/radar'),
        fetch('/api/performance/rankings'),
        fetch(`/api/performance/complaints?${params}`),
        fetch('/api/vendors'),
        fetch('/api/analytics/risk-matrix'),
      ])

      const [rJson, kJson, cJson, vJson, riskJson] = await Promise.all([
        rRes.json(), kRes.json(), cRes.json(), vRes.json(), riskRes.json()
      ])

      if (rJson.success) setRadarData(rJson.data)
      if (kJson.success) setRankings(kJson.data)
      if (cJson.success) setComplaints(cJson.data)
      if (vJson.success) setVendorsList(vJson.data)
      if (riskJson.success) setRiskMatrix(riskJson.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [filterSeverity, filterStatus, searchTerm])

  // ─── Log New Complaint ───────────────────────────────
  const handleLogComplaint = async (e) => {
    e.preventDefault()
    if (!logForm.vendor_id || !logForm.issue_type) {
      alert('Vendor and Issue Type are required.')
      return
    }
    setSubmittingLog(true)
    try {
      const res = await fetch('/api/performance/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowLogModal(false)
        setLogForm({
          vendor_id: '',
          issue_type: 'Late Delivery',
          severity: 'Medium',
          description: '',
          logged_by: 'Quality Inspector',
          resolution_notes: '',
        })
        fetchAll()
      } else alert(json.error || 'Failed to log complaint')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingLog(false)
    }
  }

  // ─── Open Edit Complaint Modal ───────────────────────
  const openEditModal = (cmp) => {
    setEditForm({
      id: cmp.id,
      vendor_id: cmp.vendor_id,
      vendor_name: cmp.vendor_name,
      issue_type: cmp.issue_type || 'Late Delivery',
      severity: cmp.severity || 'Medium',
      status: cmp.status || 'Open',
      description: cmp.description || '',
      resolution_notes: cmp.resolution_notes || '',
    })
    setShowEditModal(true)
  }

  // ─── Save Edit Complaint ──────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id) return
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/performance/complaints/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
      } else alert(json.error || 'Failed to update complaint')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ─── Delete Complaint ────────────────────────────────
  const handleDeleteComplaint = async (id) => {
    if (!window.confirm(`Delete complaint ${id}?`)) return
    try {
      const res = await fetch(`/api/performance/complaints/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) fetchAll()
      else alert(json.error || 'Failed to delete complaint')
    } catch (err) {
      alert('Error deleting complaint.')
    }
  }

  const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length

  return (
    <div className="pb-12">
      <Header
        title="Vendor Performance Dashboard"
        subtitle="Evaluate vendor delivery times, quality scores, cost efficiency, contract compliance, and complaint histories"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* ── 5 Core Performance Dimensions Banner ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Delivery Time', val: `${radarData.find(r => r.name === 'Delivery Time')?.value || 88}%`, sub: 'On-Time Rate', icon: <Clock className="w-5 h-5 text-teal-500" /> },
            { label: 'Quality Score', val: `${radarData.find(r => r.name === 'Quality Score')?.value || 90}%`, sub: 'Pass Rate', icon: <ShieldCheck className="w-5 h-5 text-blue-500" /> },
            { label: 'Cost Efficiency', val: `${radarData.find(r => r.name === 'Cost Efficiency')?.value || 86}%`, sub: 'Price Savings', icon: <DollarSign className="w-5 h-5 text-amber-500" /> },
            { label: 'Contract Compliance', val: `${radarData.find(r => r.name === 'Contract Compliance')?.value || 87}%`, sub: 'T&C SLA Adherence', icon: <Award className="w-5 h-5 text-indigo-500" /> },
            { label: 'Open Complaints', val: openComplaintsCount, sub: 'Incidents Pending', icon: <FileWarning className="w-5 h-5 text-rose-500" /> },
          ].map((d) => (
            <Card key={d.label} className="p-4 flex items-center gap-3">
              {d.icon}
              <div>
                <div className="text-xl font-bold text-slate-900">{d.val}</div>
                <div className="text-[11px] font-semibold text-slate-800">{d.label}</div>
                <div className="text-[10px] text-slate-400">{d.sub}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Scorecard Radar Chart & Leaderboard Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Radar Chart Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Performance Scorecard Radar</h3>
                <p className="text-xs text-slate-500">Cross-dimensional metrics evaluation across active vendor portfolio</p>
              </div>
              <span className="text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md">
                Benchmark: 85%
              </span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip formatter={(v) => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Rankings Leaderboard Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Top Vendor Performance Rankings</h3>
                <p className="text-xs text-slate-500">Ranked by composite score algorithm across delivery, quality & compliance</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>

            <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
              {rankings.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    i === 0 ? 'bg-amber-400 text-white' :
                    i === 1 ? 'bg-slate-300 text-slate-800' :
                    i === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{v.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{v.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${v.score >= 90 ? 'bg-teal-500' : v.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${v.score}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{v.category}</span>
                      <span>Delivery: {v.delivery_score}% · Quality: {v.quality_score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Bonus Challenge: Dynamic Vendor Risk Scoring Matrix ── */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Vendor Risk Scoring Matrix (Bonus Challenge)</h3>
                <p className="text-xs text-slate-500">Evaluates tax filer status, contract coverage, delivery reliability, and open complaints</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              300 Vendors Evaluated
            </span>
          </div>

          <Table columns={['Vendor Name', 'Category', 'Tax Filer Status', 'Active Contract', 'Delivery SLA', 'Risk Score', 'Risk Level']}>
            {riskMatrix.map((r) => (
              <tr key={r.vendor_id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-medium text-slate-900">{r.name}</Td>
                <Td className="text-slate-600">{r.category}</Td>
                <Td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                    r.tax_filer_status === 'Active Filer' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 font-bold'
                  }`}>
                    {r.tax_filer_status}
                  </span>
                </Td>
                <Td>
                  {r.has_active_contract ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Active MSA</span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center gap-1 text-xs"><AlertTriangle className="w-3.5 h-3.5" /> No Contract</span>
                  )}
                </Td>
                <Td className="font-mono text-xs text-slate-700">{r.on_time_rate}%</Td>
                <Td className="font-mono font-bold text-slate-900 text-xs">{r.risk_score} / 100</Td>
                <Td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    r.risk_level === 'High Risk' ? 'bg-rose-100 text-rose-700' :
                    r.risk_level === 'Medium Risk' ? 'bg-amber-100 text-amber-700' :
                    'bg-teal-100 text-teal-700'
                  }`}>
                    {r.risk_level}
                  </span>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* ── Complaint & Incident History Engine ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Complaint & SLA Incident History</h3>
                <p className="text-xs text-slate-500">Track delivery delays, defect reports, SLA breaches, and resolution logs</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search complaint, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Investigation">In Investigation</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button
                onClick={() => setShowLogModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Log Incident
              </button>
            </div>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading incident history...</div>
            ) : complaints.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No complaints or SLA breaches recorded.</div>
            ) : (
              <Table columns={['CMP ID', 'Vendor', 'Issue Type', 'Severity', 'Description', 'Logged By', 'Status', 'Actions']}>
                {complaints.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50 transition-colors">
                    <Td mono className="font-semibold text-slate-900">{cmp.id}</Td>
                    <Td className="font-medium text-slate-900">{cmp.vendor_name}</Td>
                    <Td className="text-xs text-slate-700 font-semibold">{cmp.issue_type}</Td>
                    <Td><SeverityBadge severity={cmp.severity} /></Td>
                    <Td className="max-w-[220px] truncate text-slate-600 text-xs">{cmp.description}</Td>
                    <Td className="text-xs text-slate-500">{cmp.logged_by}</Td>
                    <Td><ComplaintStatusBadge status={cmp.status} /></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(cmp)}
                          title="Edit Incident & Resolution"
                          className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(cmp.id)}
                          title="Delete Incident Record"
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

      </div>

      {/* ════════════════════════════════════════════════
          MODAL 1: Log New Incident Complaint
      ════════════════════════════════════════════════ */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <FileWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log Vendor Incident / Complaint</h3>
                  <p className="text-xs text-slate-500">Record delivery delays, quality defects, or SLA breaches</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogComplaint} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Vendor <span className="text-red-500">*</span></label>
                <select
                  required
                  value={logForm.vendor_id}
                  onChange={(e) => setLogForm({ ...logForm, vendor_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                >
                  <option value="">Select vendor...</option>
                  {vendorsList.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Issue Type</label>
                  <select
                    value={logForm.issue_type}
                    onChange={(e) => setLogForm({ ...logForm, issue_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {issueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Severity</label>
                  <select
                    value={logForm.severity}
                    onChange={(e) => setLogForm({ ...logForm, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Incident Description <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the incident, order delays, or defective quantity..."
                  value={logForm.description}
                  onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Logged By</label>
                <input
                  type="text"
                  value={logForm.logged_by}
                  onChange={(e) => setLogForm({ ...logForm, logged_by: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resolution / Action Plan</label>
                <textarea
                  rows={2}
                  placeholder="Initial notes on agreed resolution..."
                  value={logForm.resolution_notes}
                  onChange={(e) => setLogForm({ ...logForm, resolution_notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingLog} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50">
                  {submittingLog ? 'Logging...' : 'Log Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Edit Incident & Resolution Modal
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
                  <h3 className="text-base font-bold text-slate-900">Edit Incident ({editForm.id})</h3>
                  <p className="text-xs text-slate-500">{editForm.vendor_name}</p>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">Issue Type</label>
                  <select
                    value={editForm.issue_type}
                    onChange={(e) => setEditForm({ ...editForm, issue_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    {issueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Severity</label>
                  <select
                    value={editForm.severity}
                    onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    {['Open', 'In Investigation', 'Resolved', 'Escalated'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resolution Logs & Disciplinary Actions</label>
                <textarea
                  rows={3}
                  placeholder="Record resolution details, replacement dates, or penalty notes..."
                  value={editForm.resolution_notes}
                  onChange={(e) => setEditForm({ ...editForm, resolution_notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
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
    </div>
  )
}
