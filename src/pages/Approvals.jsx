import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, Table, Td, PriorityBadge } from '../components/ui'
import { approvalQueue as initialApprovals, approvalStats as initialStats } from '../data'
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, ShieldAlert,
  Search, Filter, UserCheck, ChevronRight, X, ArrowUpRight,
  TrendingUp, Award, Layers, DollarSign, FileText, CornerUpLeft,
  Pencil, Trash2, Save,
} from 'lucide-react'

// ─── Status Badges ─────────────────────────────────────
const APP_STATUS = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-teal-100 text-teal-700',
  Rejected: 'bg-red-100 text-red-600',
  Escalated: 'bg-purple-100 text-purple-700 border border-purple-200',
  'Revision Requested': 'bg-blue-100 text-blue-700',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${APP_STATUS[status] || 'bg-slate-100 text-slate-500'}`}>
      {status === 'Escalated' && <AlertTriangle className="w-3 h-3 mr-1 text-purple-600" />}
      {status}
    </span>
  )
}

// ─── Stage Badges ──────────────────────────────────────
const STAGE_COLORS = {
  'Dept Manager': 'bg-blue-50 text-blue-700 border-blue-200',
  'Finance': 'bg-amber-50 text-amber-700 border-amber-200',
  'Procurement': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'CEO': 'bg-rose-50 text-rose-700 border-rose-200',
}

function StageBadge({ stage }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STAGE_COLORS[stage] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {stage}
    </span>
  )
}

// ─── Main Approvals Component ──────────────────────────
export default function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals)
  const [stats, setStats] = useState(initialStats)
  const [loading, setLoading] = useState(false)

  const [filterStage, setFilterStage] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Detail & Action Modal
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionForm, setActionForm] = useState({
    action: 'Approve',
    approver_name: 'Department Head',
    remarks: '',
  })
  const [submittingAction, setSubmittingAction] = useState(false)
  const [escalating, setEscalating] = useState(false)

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    department: '',
    requested_by: '',
    amount: '',
    priority: 'Normal',
    current_stage: 'Dept Manager',
    status: 'Pending',
    updated_by: 'Procurement Specialist',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // Rejection modal
  const [rejectionModalItem, setRejectionModalItem] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submittingRejection, setSubmittingRejection] = useState(false)

  const stagesList = ['Dept Manager', 'Finance', 'Procurement', 'CEO']
  const statusList = ['Pending', 'Approved', 'Rejected', 'Escalated', 'Revision Requested']

  // ─── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStage !== 'All') params.append('stage', filterStage)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [aRes, sRes] = await Promise.all([
        fetch(`/api/approvals?${params}`),
        fetch('/api/approvals/stats'),
      ])
      if (aRes.ok) {
        const aJ = await aRes.json()
        if (aJ.success && aJ.data && aJ.data.length > 0) setApprovals(aJ.data)
      }
      if (sRes.ok) {
        const sJ = await sRes.json()
        if (sJ.success && sJ.data) setStats(sJ.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetail = async (id) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/approvals/${id}`)
      const json = await res.json()
      if (json.success) setSelectedItem(json.data)
    } catch (err) {
    } finally {
      setDetailLoading(false)
    }
  }

  const refreshDetail = async (id) => {
    const res = await fetch(`/api/approvals/${id}`)
    const json = await res.json()
    if (json.success) setSelectedItem(json.data)
  }

  useEffect(() => { fetchAll() }, [filterStage, filterStatus, searchTerm])

  // ─── Open Edit Modal ─────────────────────────────────
  const openEditModal = (item) => {
    setEditForm({
      id: item.id,
      title: item.title || '',
      department: item.department || '',
      requested_by: item.requested_by || '',
      amount: item.amount || '',
      priority: item.priority || 'Normal',
      current_stage: item.current_stage || 'Dept Manager',
      status: item.status || 'Pending',
      rejection_reason: item.rejection_reason || '',
    })
    setShowEditModal(true)
  }

  // ─── Save Edit Changes ───────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id || !editForm.title) {
      alert('Title is required.')
      return
    }
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/approvals/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
        if (selectedItem && selectedItem.id === editForm.id) {
          await refreshDetail(editForm.id)
        }
      } else alert(json.error || 'Failed to update approval item')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ─── Delete Approval Workflow ────────────────────────
  const handleDeleteApproval = async (id) => {
    if (!window.confirm(`Delete approval workflow ${id}?`)) return
    try {
      const res = await fetch(`/api/approvals/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        if (selectedItem?.id === id) setSelectedItem(null)
        fetchAll()
      } else alert(json.error || 'Failed to delete approval item')
    } catch (err) {
      alert('Error deleting approval item.')
    }
  }

  // ─── Submit Action (Approve / Reject / Revision) ─────
  const handleAction = async (item, actionType, customRemarks = null, customApprover = null) => {
    const remarksToUse = customRemarks !== null ? customRemarks : actionForm.remarks
    const approverToUse = customApprover !== null ? customApprover : actionForm.approver_name

    if (actionType === 'Reject' && (!remarksToUse || remarksToUse.trim() === '')) {
      alert('Mandatory rejection remarks/reasons are required.')
      return
    }

    if (item.id === selectedItem?.id) setSubmittingAction(true)

    try {
      const res = await fetch(`/api/approvals/${item.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          stage: item.current_stage,
          approver_name: approverToUse,
          remarks: remarksToUse,
        }),
      })
      const json = await res.json()
      if (json.success) {
        if (rejectionModalItem) {
          setRejectionModalItem(null)
          setRejectionReason('')
        }
        setActionForm({ action: 'Approve', approver_name: 'Department Head', remarks: '' })
        fetchAll()
        if (selectedItem && selectedItem.id === item.id) {
          await refreshDetail(item.id)
        }
      } else alert(json.error || 'Action failed')
    } catch (err) {
      alert('Error submitting action.')
    } finally {
      setSubmittingAction(false)
    }
  }

  // ─── Auto/Manual Escalation ─────────────────────────
  const handleEscalate = async (item) => {
    setEscalating(true)
    try {
      const res = await fetch(`/api/approvals/${item.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'SLA timeout exceeded (24h+). Auto-escalated to higher tier.',
          escalated_by: 'Auto Escalation Engine',
        }),
      })
      const json = await res.json()
      if (json.success) {
        fetchAll()
        if (selectedItem && selectedItem.id === item.id) {
          await refreshDetail(item.id)
        }
      } else alert(json.error)
    } catch (err) {
    } finally {
      setEscalating(false)
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Approval Workflow"
        subtitle="Multi-level sign-offs with threshold routing, auto-escalation, and rejection workflows"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* ── Threshold Hierarchy Diagram ── */}
        <Card className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Multi-Level Approval Hierarchy & Thresholds
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated routing engine passes requests through sequential tiers based on expenditure value</p>
            </div>
            <span className="text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-1 rounded-full">
              SLA Threshold: 24 Hours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            {[
              { title: 'Dept Manager', threshold: '> $0', desc: 'Initial departmental budget & necessity verification', color: 'border-blue-500/40 bg-blue-500/10' },
              { title: 'Finance', threshold: '> $5,000', desc: 'GL allocation, cashflow & tax compliance verification', color: 'border-amber-500/40 bg-amber-500/10' },
              { title: 'Procurement', threshold: '> $20,000', desc: 'Vendor selection, RFQ biddings & contract terms check', color: 'border-indigo-500/40 bg-indigo-500/10' },
              { title: 'CEO Approval', threshold: '> $50,000', desc: 'Executive board & high-value capital expenditure authorization', color: 'border-rose-500/40 bg-rose-500/10' },
            ].map((step, idx) => (
              <div key={step.title} className={`rounded-xl border p-3.5 relative ${step.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{idx + 1}. {step.title}</span>
                  <span className="text-[11px] font-mono font-semibold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">{step.threshold}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Stats Overview Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending Sign-offs', value: stats.total_pending, icon: <Clock className="w-5 h-5 text-amber-500" /> },
            { label: 'Value Awaiting Approval', value: `$${(stats.pending_value || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-blue-500" /> },
            { label: 'Escalated SLA Alerts', value: stats.total_escalated, icon: <AlertTriangle className="w-5 h-5 text-purple-500" /> },
            { label: 'CEO Sign-offs Required', value: stats.ceo_pending, icon: <Award className="w-5 h-5 text-rose-500" /> },
          ].map((s) => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Control Filter Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requirement, ID or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Stages</option>
                {stagesList.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                {statusList.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Approval Queue Table ── */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading approval queue...</div>
          ) : approvals.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No approval requests match your filter criteria.</div>
          ) : (
            <Table columns={['App ID', 'Requirement / Title', 'Type', 'Amount', 'Dept', 'Current Stage', 'Status', 'Actions']}>
              {approvals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{item.id}</Td>
                  <Td className="max-w-[200px] truncate text-slate-900 font-medium">
                    <div>{item.title}</div>
                    <div className="text-[11px] text-slate-400">Target: {item.target_id} · {item.requested_by}</div>
                  </Td>
                  <Td className="text-xs text-slate-600">{item.target_type}</Td>
                  <Td className="font-mono text-slate-900 font-bold">
                    ${Number(item.amount || 0).toLocaleString()}
                  </Td>
                  <Td className="text-xs text-slate-600">{item.department}</Td>
                  <Td><StageBadge stage={item.current_stage} /></Td>
                  <Td><StatusBadge status={item.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedItem(null); fetchDetail(item.id) }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Review <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit Approval Workflow"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteApproval(item.id)}
                        title="Delete Approval Workflow"
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {item.status !== 'Approved' && item.status !== 'Rejected' && (
                        <>
                          <button
                            onClick={() => handleAction(item, 'Approve', 'Approved via quick action.', `${item.current_stage} Signoff`)}
                            title="Quick Approve"
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded cursor-pointer ml-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setRejectionModalItem(item)
                              setRejectionReason('')
                            }}
                            title="Quick Reject"
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      {/* ════════════════════════════════════════════════
          MODAL 1: Detail & Multi-Stage Review Drawer
      ════════════════════════════════════════════════ */}
      {(selectedItem !== null || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">{selectedItem?.id || '...'}</span>
                  {selectedItem && <StatusBadge status={selectedItem.status} />}
                  {selectedItem && <StageBadge stage={selectedItem.current_stage} />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{selectedItem?.title || 'Loading...'}</h3>
                {selectedItem && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requested by {selectedItem.requested_by} ({selectedItem.department}) · Target: {selectedItem.target_id}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedItem && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedItem)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteApproval(selectedItem.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {detailLoading ? (
                <div className="py-12 text-center text-slate-400 text-sm">Loading workflow execution plan...</div>
              ) : selectedItem ? (
                <>
                  {/* Financial & Metadata Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Amount</div>
                      <div className="text-base font-bold font-mono text-slate-900">${Number(selectedItem.amount || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Priority</div>
                      <div className="mt-0.5"><PriorityBadge priority={selectedItem.priority} /></div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Overdue Status</div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        {selectedItem.overdue ? (
                          <span className="text-purple-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-purple-600" /> Overdue (24h+)
                          </span>
                        ) : 'Normal (Within SLA)'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Required Stages</div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">{selectedItem.required_stages?.length || 0} Tier Sign-offs</div>
                    </div>
                  </div>

                  {/* Rejection Alert Banner if Rejected */}
                  {selectedItem.status === 'Rejected' && selectedItem.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-red-900 uppercase">Workflow Rejected</div>
                        <div className="text-xs text-red-800 mt-0.5 leading-relaxed">{selectedItem.rejection_reason}</div>
                      </div>
                    </div>
                  )}

                  {/* Multi-Stage Trail Visualizer */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      Multi-Tier Approval Trail
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.approval_trail?.map((trail, idx) => (
                        <div
                          key={trail.stage + idx}
                          className={`border rounded-xl p-4 flex items-start justify-between gap-4 transition-colors ${
                            trail.status === 'Approved' ? 'bg-teal-50/40 border-teal-200' :
                            trail.status === 'Rejected' ? 'bg-red-50/40 border-red-200' :
                            trail.status === 'Escalated' ? 'bg-purple-50/40 border-purple-200' :
                            trail.stage === selectedItem.current_stage ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20' :
                            'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full mt-0.5 ${
                              trail.status === 'Approved' ? 'bg-teal-500 text-white' :
                              trail.status === 'Rejected' ? 'bg-red-500 text-white' :
                              trail.status === 'Escalated' ? 'bg-purple-600 text-white' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {trail.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> :
                               trail.status === 'Rejected' ? <XCircle className="w-4 h-4" /> :
                               trail.status === 'Escalated' ? <AlertTriangle className="w-4 h-4" /> :
                               <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{trail.stage}</span>
                                <StatusBadge status={trail.status} />
                              </div>
                              {trail.approver && (
                                <div className="text-xs text-slate-600 mt-0.5 font-medium">Signed by: {trail.approver}</div>
                              )}
                              {trail.remarks && (
                                <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">"{trail.remarks}"</p>
                              )}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 shrink-0 text-right">
                            {trail.timestamp ? new Date(trail.timestamp).toLocaleString() : 'Awaiting Sign-off'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approver Action Panel */}
                  {selectedItem.status !== 'Approved' && selectedItem.status !== 'Rejected' && (
                    <div className="border border-blue-200 bg-blue-50/30 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Execute Approval Action ({selectedItem.current_stage})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Approver Name / Title</label>
                          <input
                            type="text"
                            value={actionForm.approver_name}
                            onChange={(e) => setActionForm({ ...actionForm, approver_name: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Action Type</label>
                          <select
                            value={actionForm.action}
                            onChange={(e) => setActionForm({ ...actionForm, action: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                          >
                            <option value="Approve">Approve Request</option>
                            <option value="Reject">Reject Request</option>
                            <option value="Request Revision">Request Revision</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Approval Remarks / Reason {actionForm.action === 'Reject' && <span className="text-red-500">* (Mandatory for Rejection)</span>}
                        </label>
                        <textarea
                          rows={2}
                          placeholder={actionForm.action === 'Reject' ? 'Provide mandatory reason for rejection...' : 'Optional approval notes...'}
                          value={actionForm.remarks}
                          onChange={(e) => setActionForm({ ...actionForm, remarks: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => handleEscalate(selectedItem)}
                          disabled={escalating}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {escalating ? 'Escalating...' : 'Trigger SLA Escalation'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={submittingAction}
                            onClick={() => handleAction(selectedItem, actionForm.action)}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer transition-colors shadow-xs ${
                              actionForm.action === 'Approve' ? 'bg-teal-600 hover:bg-teal-700' :
                              actionForm.action === 'Reject' ? 'bg-red-600 hover:bg-red-700' :
                              'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {submittingAction ? 'Processing...' : `Confirm ${actionForm.action}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">Failed to load workflow details.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Edit Approval Workflow Modal
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
                  <h3 className="text-lg font-semibold text-slate-900">Edit Approval Workflow ({editForm.id})</h3>
                  <p className="text-xs text-slate-500">Update title, amount, current stage, or status</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Requirement / Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {['Low', 'Normal', 'High', 'Urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Current Stage</label>
                  <select
                    value={editForm.current_stage}
                    onChange={(e) => setEditForm({ ...editForm, current_stage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {stagesList.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Overall Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {statusList.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Requested By</label>
                <input
                  type="text"
                  value={editForm.requested_by}
                  onChange={(e) => setEditForm({ ...editForm, requested_by: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {editForm.status === 'Rejected' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rejection Reason</label>
                  <textarea
                    rows={2}
                    value={editForm.rejection_reason}
                    onChange={(e) => setEditForm({ ...editForm, rejection_reason: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              )}

              {/* Prominent Save Changes Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {submittingEdit ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 3: Mandatory Rejection Reason Modal
      ════════════════════════════════════════════════ */}
      {rejectionModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reject Approval Request</h3>
                  <p className="text-xs text-slate-500">{rejectionModalItem.title}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectionModalItem(null)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mandatory Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="State clear grounds for rejection (budget limit, missing spec, re-tender requirement)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingRejection}
                onClick={async () => {
                  setSubmittingRejection(true)
                  await handleAction(rejectionModalItem, 'Reject', rejectionReason, `${rejectionModalItem.current_stage} Signoff`)
                  setSubmittingRejection(false)
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                {submittingRejection ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
