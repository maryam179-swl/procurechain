import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import {
  FileText, Plus, Search, Filter, Calendar, Clock, AlertTriangle,
  CheckCircle2, XCircle, RefreshCw, Paperclip, ShieldCheck, DollarSign,
  Pencil, Trash2, Save, X, ChevronRight, Download, Upload, FileCheck
} from 'lucide-react'

// ─── Status Badges ─────────────────────────────────────
const CONTRACT_STATUS = {
  Active: 'bg-teal-100 text-teal-700 border border-teal-200',
  'Expiring Soon': 'bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse',
  Expired: 'bg-rose-100 text-rose-700 border border-rose-200 font-semibold',
  Renewed: 'bg-blue-100 text-blue-700 border border-blue-200',
  Terminated: 'bg-slate-100 text-slate-500 border border-slate-200',
}

function ContractStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CONTRACT_STATUS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ─── Main Contracts Component ──────────────────────────
export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [stats, setStats] = useState({ total_contracts: 0, active_contracts: 0, expiring_soon: 0, expired_contracts: 0, total_contract_value: 0 })
  const [vendorsList, setVendorsList] = useState([])
  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [drawerTab, setDrawerTab] = useState('overview')

  // Create Form
  const [createForm, setCreateForm] = useState({
    vendor_id: '',
    title: '',
    contract_type: 'Master Services Agreement',
    contract_value: '',
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
    renewal_date: new Date(Date.now() + 86400000 * 335).toISOString().split('T')[0],
    auto_renew: true,
    compliance_documents: ['ISO Certificate', 'NDA Agreement', 'Tax Filer Compliance'],
    notes: '',
  })
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Edit Form
  const [editForm, setEditForm] = useState({
    id: '',
    vendor_id: '',
    vendor_name: '',
    title: '',
    contract_type: 'Master Services Agreement',
    contract_value: '',
    start_date: '',
    expiry_date: '',
    renewal_date: '',
    auto_renew: true,
    status: 'Active',
    compliance_documents: [],
    notes: '',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // Renew Form
  const [renewForm, setRenewForm] = useState({
    id: '',
    new_expiry_date: '',
    renewed_by: 'Legal Team',
    notes: 'Standard 1-year contract extension executed.',
  })
  const [submittingRenew, setSubmittingRenew] = useState(false)

  const contractTypesList = [
    'Master Services Agreement',
    'Service Level Agreement (SLA)',
    'Annual Maintenance Contract (AMC)',
    'Non-Disclosure Agreement (NDA)',
    'Supply Contract',
  ]

  const availableComplianceDocs = [
    'ISO Certificate',
    'NDA Agreement',
    'Tax Filer Compliance',
    'SLA Matrix Schedule',
    'Data Protection & Privacy Policy',
    'HSE Safety Clearance',
  ]

  // ─── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (filterType !== 'All') params.append('type', filterType)
      if (searchTerm) params.append('search', searchTerm)

      const [cRes, sRes, vRes] = await Promise.all([
        fetch(`/api/contracts?${params}`),
        fetch('/api/contracts/stats'),
        fetch('/api/vendors'),
      ])

      const [cJson, sJson, vJson] = await Promise.all([
        cRes.json(), sRes.json(), vRes.json()
      ])

      if (cJson.success) setContracts(cJson.data)
      if (sJson.success) setStats(sJson.data)
      if (vJson.success) setVendorsList(vJson.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const refreshDetail = async (id) => {
    try {
      const res = await fetch(`/api/contracts/${id}`)
      const json = await res.json()
      if (json.success) setSelectedContract(json.data)
    } catch (err) {}
  }

  useEffect(() => { fetchAll() }, [filterStatus, filterType, searchTerm])

  // ─── Create Contract ─────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!createForm.vendor_id || !createForm.title) {
      alert('Vendor and Contract Title are required.')
      return
    }
    setSubmittingCreate(true)
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({
          vendor_id: '',
          title: '',
          contract_type: 'Master Services Agreement',
          contract_value: '',
          start_date: new Date().toISOString().split('T')[0],
          expiry_date: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
          renewal_date: new Date(Date.now() + 86400000 * 335).toISOString().split('T')[0],
          auto_renew: true,
          compliance_documents: ['ISO Certificate', 'NDA Agreement', 'Tax Filer Compliance'],
          notes: '',
        })
        fetchAll()
      } else alert(json.error || 'Failed to create contract')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingCreate(false)
    }
  }

  // ─── Open Edit Modal ─────────────────────────────────
  const openEditModal = (cnt) => {
    setEditForm({
      id: cnt.id,
      vendor_id: cnt.vendor_id,
      vendor_name: cnt.vendor_name,
      title: cnt.title || '',
      contract_type: cnt.contract_type || 'Master Services Agreement',
      contract_value: cnt.contract_value !== undefined ? cnt.contract_value : '',
      start_date: cnt.start_date ? cnt.start_date.split('T')[0] : '',
      expiry_date: cnt.expiry_date ? cnt.expiry_date.split('T')[0] : '',
      renewal_date: cnt.renewal_date ? cnt.renewal_date.split('T')[0] : '',
      auto_renew: Boolean(cnt.auto_renew),
      status: cnt.status || 'Active',
      compliance_documents: cnt.compliance_documents || [],
      notes: cnt.notes || '',
    })
    setShowEditModal(true)
  }

  // ─── Save Edit Changes ───────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id || !editForm.title) {
      alert('Contract Title is required.')
      return
    }
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/contracts/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
        if (selectedContract && selectedContract.id === editForm.id) {
          await refreshDetail(editForm.id)
        }
      } else alert(json.error || 'Failed to update contract')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ─── Open Renew Modal ────────────────────────────────
  const openRenewModal = (cnt) => {
    const defaultNewExp = new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0]
    setRenewForm({
      id: cnt.id,
      new_expiry_date: defaultNewExp,
      renewed_by: 'Legal & Procurement Team',
      notes: '1-Year Contract Renewal Executed.',
    })
    setShowRenewModal(true)
  }

  // ─── Submit Renewal ──────────────────────────────────
  const handleRenewSubmit = async (e) => {
    e.preventDefault()
    if (!renewForm.id || !renewForm.new_expiry_date) {
      alert('New expiry date is required.')
      return
    }
    setSubmittingRenew(true)
    try {
      const res = await fetch(`/api/contracts/${renewForm.id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowRenewModal(false)
        fetchAll()
        if (selectedContract && selectedContract.id === renewForm.id) {
          await refreshDetail(renewForm.id)
        }
      } else alert(json.error || 'Failed to renew contract')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingRenew(false)
    }
  }

  // ─── Delete Contract ─────────────────────────────────
  const handleDeleteContract = async (id) => {
    if (!window.confirm(`Delete contract agreement ${id}?`)) return
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        if (selectedContract?.id === id) setSelectedContract(null)
        fetchAll()
      } else alert(json.error || 'Failed to delete contract')
    } catch (err) {
      alert('Error deleting contract.')
    }
  }

  const toggleComplianceDoc = (doc, targetForm, setTargetForm) => {
    const list = targetForm.compliance_documents || []
    if (list.includes(doc)) {
      setTargetForm({ ...targetForm, compliance_documents: list.filter(d => d !== doc) })
    } else {
      setTargetForm({ ...targetForm, compliance_documents: [...list, doc] })
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Contract Management"
        subtitle="Manage vendor contracts, renewal schedules, expiry alerts, compliance documents, and PDF attachments"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* ── Control Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search contract title, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expiring Soon">Expiring Soon (&lt;30d)</option>
                <option value="Expired">Expired</option>
                <option value="Renewed">Renewed</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Contract Types</option>
                {contractTypesList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Vendor Contract
          </button>
        </div>

        {/* ── Stats Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Contracts', val: stats.active_contracts, icon: <CheckCircle2 className="w-5 h-5 text-teal-500" /> },
            { label: 'Expiring Soon (<30d)', val: stats.expiring_soon, icon: <AlertTriangle className="w-5 h-5 text-amber-500 animate-bounce" /> },
            { label: 'Expired Contracts', val: stats.expired_contracts, icon: <XCircle className="w-5 h-5 text-rose-500" /> },
            { label: 'Total Contract Value', val: `$${(stats.total_contract_value || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-blue-500" /> },
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

        {/* ── Contracts Table ── */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading contracts ledger...</div>
          ) : contracts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No contracts found. Create one to get started.</div>
          ) : (
            <Table columns={['Contract ID', 'Title & Vendor', 'Type', 'Value ($)', 'Expiry Date', 'Compliance Docs', 'Status', 'Actions']}>
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{c.id}</Td>
                  <Td className="font-medium text-slate-900 max-w-[220px] truncate">
                    <div>{c.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{c.vendor_name}</div>
                  </Td>
                  <Td className="text-xs text-slate-600">{c.contract_type}</Td>
                  <Td mono className="font-bold text-slate-900 text-xs">${(c.contract_value || 0).toLocaleString()}</Td>
                  <Td className="text-xs text-slate-700 font-mono">
                    {c.expiry_date ? c.expiry_date.split('T')[0] : '—'}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1 flex-wrap max-w-[150px]">
                      {(c.compliance_documents || []).slice(0, 2).map((doc, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-medium truncate">
                          {doc}
                        </span>
                      ))}
                      {(c.compliance_documents || []).length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold">+{c.compliance_documents.length - 2}</span>
                      )}
                    </div>
                  </Td>
                  <Td><ContractStatusBadge status={c.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedContract(c); setDrawerTab('overview') }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openRenewModal(c)}
                        title="Renew / Extend Contract Expiry"
                        className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Contract Details"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContract(c.id)}
                        title="Delete Contract"
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
          MODAL 1: Create Vendor Contract
      ════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Create Vendor Contract Agreement</h3>
                <p className="text-xs text-slate-500">Define contract title, value, renewal dates, and compliance documents</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Select Vendor <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={createForm.vendor_id}
                    onChange={e => setCreateForm({ ...createForm, vendor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select vendor...</option>
                    {vendorsList.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contract Type</label>
                  <select
                    value={createForm.contract_type}
                    onChange={e => setCreateForm({ ...createForm, contract_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {contractTypesList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contract Title / Scope <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master Raw Materials & Steel Supply Agreement 2026"
                  value={createForm.title}
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Total Value ($)</label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={createForm.contract_value}
                    onChange={e => setCreateForm({ ...createForm, contract_value: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={createForm.start_date}
                    onChange={e => setCreateForm({ ...createForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={createForm.expiry_date}
                    onChange={e => setCreateForm({ ...createForm, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Renewal Reminder Date</label>
                  <input
                    type="date"
                    value={createForm.renewal_date}
                    onChange={e => setCreateForm({ ...createForm, renewal_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.auto_renew}
                      onChange={e => setCreateForm({ ...createForm, auto_renew: e.target.checked })}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                    />
                    Enable Auto-Renewal Clause
                  </label>
                </div>
              </div>

              {/* Compliance Docs Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Compliance & Legal Documents Checklist</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableComplianceDocs.map(doc => (
                    <label key={doc} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={(createForm.compliance_documents || []).includes(doc)}
                        onChange={() => toggleComplianceDoc(doc, createForm, setCreateForm)}
                        className="w-3.5 h-3.5 rounded text-slate-900"
                      />
                      {doc}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Terms Summary & Special Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record key SLA thresholds, penalty clauses, or payment schedules..."
                  value={createForm.notes}
                  onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingCreate} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {submittingCreate ? 'Creating...' : 'Execute Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Contract Detail Drawer
      ════════════════════════════════════════════════ */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">{selectedContract.id}</span>
                  <ContractStatusBadge status={selectedContract.status} />
                  {selectedContract.auto_renew && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-2 py-0.5 rounded-md">
                      Auto-Renewal Active
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{selectedContract.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedContract.vendor_name} · {selectedContract.contract_type}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openRenewModal(selectedContract)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Renew
                </button>
                <button
                  onClick={() => openEditModal(selectedContract)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteContract(selectedContract.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 shrink-0 bg-white">
              {[
                { id: 'overview', label: 'Overview & Terms', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'renewals', label: 'Renewal History', icon: <RefreshCw className="w-3.5 h-3.5" /> },
                { id: 'compliance', label: 'Compliance Checklist', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { id: 'attachments', label: 'PDF Attachments', icon: <Paperclip className="w-3.5 h-3.5" /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${drawerTab === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: Overview */}
              {drawerTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Value</span>
                      <span className="text-sm font-bold text-slate-900">${(selectedContract.contract_value || 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Start Date</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{selectedContract.start_date ? selectedContract.start_date.split('T')[0] : '—'}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expiry Date</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{selectedContract.expiry_date ? selectedContract.expiry_date.split('T')[0] : '—'}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Renewal Date</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{selectedContract.renewal_date ? selectedContract.renewal_date.split('T')[0] : '—'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-slate-900">Contract Notes & Scope Summary</div>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedContract.notes || 'No special notes specified.'}</p>
                  </div>
                </div>
              )}

              {/* TAB 2: Renewals */}
              {drawerTab === 'renewals' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contract Extension Timeline</span>
                    <button onClick={() => openRenewModal(selectedContract)} className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 hover:bg-teal-100 cursor-pointer">
                      + Extend Expiry
                    </button>
                  </div>

                  {(selectedContract.renewals_history || []).length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">No contract extensions recorded yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedContract.renewals_history.map((ren, idx) => (
                        <div key={ren.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">Extended until: {ren.new_expiry ? ren.new_expiry.split('T')[0] : 'N/A'}</div>
                            <div className="text-[11px] text-slate-500">Executed by {ren.renewed_by} · {ren.notes}</div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{ren.renewed_on ? ren.renewed_on.split('T')[0] : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Compliance */}
              {drawerTab === 'compliance' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Compliance Documents</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(selectedContract.compliance_documents || []).map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 text-xs font-semibold">
                        <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Attachments */}
              {drawerTab === 'attachments' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contract Documents & PDF Legal Scans</span>
                  {(selectedContract.attachments || []).length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                      <Paperclip className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">No PDF files attached to this contract agreement.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedContract.attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-slate-900">{att.original_name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{(att.size_bytes / 1024).toFixed(0)} KB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 3: Edit Contract Modal
      ════════════════════════════════════════════════ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Contract Agreement ({editForm.id})</h3>
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
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contract Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contract Type</label>
                  <select
                    value={editForm.contract_type}
                    onChange={e => setEditForm({ ...editForm, contract_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    {contractTypesList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Total Value ($)</label>
                  <input
                    type="number"
                    value={editForm.contract_value}
                    onChange={e => setEditForm({ ...editForm, contract_value: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    {['Active', 'Expiring Soon', 'Expired', 'Renewed', 'Terminated'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editForm.start_date}
                    onChange={e => setEditForm({ ...editForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editForm.expiry_date}
                    onChange={e => setEditForm({ ...editForm, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Renewal Date</label>
                  <input
                    type="date"
                    value={editForm.renewal_date}
                    onChange={e => setEditForm({ ...editForm, renewal_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Compliance Docs Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Compliance Documents Checklist</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableComplianceDocs.map(doc => (
                    <label key={doc} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={(editForm.compliance_documents || []).includes(doc)}
                        onChange={() => toggleComplianceDoc(doc, editForm, setEditForm)}
                        className="w-3.5 h-3.5 rounded text-slate-900"
                      />
                      {doc}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes & Scope Summary</label>
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
          MODAL 4: Renew Contract Modal
      ════════════════════════════════════════════════ */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Renew Contract ({renewForm.id})</h3>
              </div>
              <button onClick={() => setShowRenewModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Expiry Date <span className="text-red-500">*</span></label>
                <input
                  required
                  type="date"
                  value={renewForm.new_expiry_date}
                  onChange={e => setRenewForm({ ...renewForm, new_expiry_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Executed By</label>
                <input
                  type="text"
                  value={renewForm.renewed_by}
                  onChange={e => setRenewForm({ ...renewForm, renewed_by: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Renewal Execution Notes</label>
                <textarea
                  rows={2}
                  value={renewForm.notes}
                  onChange={e => setRenewForm({ ...renewForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowRenewModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingRenew} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50">
                  {submittingRenew ? 'Renewing...' : 'Confirm Renewal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
