import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, StatusBadge, Table, Td } from '../components/ui'
import {
  Plus,
  X,
  Search,
  Filter,
  Gavel,
  Star,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  ShieldCheck,
  Pencil,
  Trash2,
  Award,
  FileText,
} from 'lucide-react'

// ─── Local Status Badge Styles ─────────────────────────
const rfqStatusStyles = {
  'Open Bidding': 'bg-blue-100 text-blue-700',
  'Under Evaluation': 'bg-amber-100 text-amber-700',
  Awarded: 'bg-teal-100 text-teal-700',
  Draft: 'bg-slate-100 text-slate-500',
  Closed: 'bg-red-100 text-red-600',
}

function RFQStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${rfqStatusStyles[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}

const quoteStatusStyles = {
  Submitted: 'bg-blue-100 text-blue-700',
  Evaluated: 'bg-amber-100 text-amber-700',
  Awarded: 'bg-teal-100 text-teal-700',
  'Not Selected': 'bg-slate-100 text-slate-500',
}

function QuoteStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${quoteStatusStyles[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}

// ─── Score Bar ─────────────────────────────────────────
function ScoreBar({ score }) {
  const pct = Math.min(Math.max(score || 0, 0), 100)
  const color = pct >= 85 ? 'bg-teal-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-semibold text-slate-700 w-8 text-right">{pct}%</span>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────
export default function RFQ() {
  const [rfqs, setRfqs] = useState([])
  const [vendors, setVendors] = useState([])
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(null) // rfq id
  const [rfqDetail, setRfqDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Evaluation inline edit state
  const [evalEdit, setEvalEdit] = useState({}) // { quoteId: { tech_score, tech_remarks } }
  const [savingEval, setSavingEval] = useState(null)
  const [awardingQuote, setAwardingQuote] = useState(null)

  // Create RFQ form
  const [createForm, setCreateForm] = useState({
    item: '', category: '', budget: '', deadline: '',
    requisition_id: '', notes: '', created_by: 'Procurement Manager',
    invited_vendors: [],
  })
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Submit Quotation form
  const [quoteForm, setQuoteForm] = useState({
    rfq_id: '', vendor_id: '', unit_price: '', total_amount: '',
    lead_time_days: '', warranty_terms: '', tech_score: '', tech_remarks: '',
  })
  const [submittingQuote, setSubmittingQuote] = useState(false)

  const categories = ['Raw Materials', 'IT & Electronics', 'Office Supplies', 'Logistics', 'Packaging', 'Facilities', 'General']

  // ─── Data Fetching ──────────────────────────────────
  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [rfqRes, vendorRes, reqRes] = await Promise.all([
        fetch(`/api/rfq?${params}`),
        fetch('/api/vendors'),
        fetch('/api/requisitions'),
      ])
      const [rfqJson, vendorJson, reqJson] = await Promise.all([rfqRes.json(), vendorRes.json(), reqRes.json()])
      if (rfqJson.success) setRfqs(rfqJson.data)
      if (vendorJson.success) setVendors(vendorJson.data)
      if (reqJson.success) setRequisitions(reqJson.data)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetail = async (id) => {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/rfq/${id}`)
      const json = await res.json()
      if (json.success) setRfqDetail(json.data)
    } catch (err) {
      console.error('Detail fetch error:', err)
    } finally {
      setLoadingDetail(false)
    }
  }

  const refreshDetail = async (id) => {
    try {
      const res = await fetch(`/api/rfq/${id}`)
      const json = await res.json()
      if (json.success) setRfqDetail(json.data)
    } catch (err) {}
  }

  useEffect(() => { fetchAll() }, [filterStatus, searchTerm])

  const openDetail = (id) => {
    setShowDetailModal(id)
    fetchDetail(id)
  }

  // ─── Create RFQ ─────────────────────────────────────
  const handleCreateRFQ = async (e) => {
    e.preventDefault()
    if (!createForm.item || !createForm.category) {
      alert('Item and Category are required.')
      return
    }
    setSubmittingCreate(true)
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({ item: '', category: '', budget: '', deadline: '', requisition_id: '', notes: '', created_by: 'Procurement Manager', invited_vendors: [] })
        fetchAll()
      } else alert(json.error || 'Failed to create RFQ')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingCreate(false)
    }
  }

  const toggleVendor = (vendorId) => {
    setCreateForm(prev => ({
      ...prev,
      invited_vendors: prev.invited_vendors.includes(vendorId)
        ? prev.invited_vendors.filter(v => v !== vendorId)
        : [...prev.invited_vendors, vendorId],
    }))
  }

  // ─── Submit Quotation ───────────────────────────────
  const handleSubmitQuote = async (e) => {
    e.preventDefault()
    if (!quoteForm.vendor_id || !quoteForm.total_amount) {
      alert('Vendor and Total Amount are required.')
      return
    }
    setSubmittingQuote(true)
    try {
      const res = await fetch(`/api/rfq/${quoteForm.rfq_id}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowQuoteModal(false)
        setQuoteForm({ rfq_id: '', vendor_id: '', unit_price: '', total_amount: '', lead_time_days: '', warranty_terms: '', tech_score: '', tech_remarks: '' })
        fetchAll()
        if (showDetailModal) await refreshDetail(showDetailModal)
      } else alert(json.error || 'Failed to submit quotation')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingQuote(false)
    }
  }

  // ─── Technical Evaluation Save ───────────────────────
  const saveEvaluation = async (quoteId) => {
    if (!showDetailModal) return
    const { tech_score, tech_remarks } = evalEdit[quoteId] || {}
    setSavingEval(quoteId)
    try {
      const res = await fetch(`/api/rfq/${showDetailModal}/evaluations/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tech_score, tech_remarks }),
      })
      const json = await res.json()
      if (json.success) {
        setEvalEdit(prev => { const n = { ...prev }; delete n[quoteId]; return n })
        await refreshDetail(showDetailModal)
      } else alert(json.error || 'Failed to save evaluation')
    } catch (err) {
      alert('Error saving evaluation.')
    } finally {
      setSavingEval(null)
    }
  }

  // ─── Award Vendor ────────────────────────────────────
  const handleAward = async (quoteId, vendorName) => {
    if (!window.confirm(`Award contract to ${vendorName}?`)) return
    if (!showDetailModal) return
    setAwardingQuote(quoteId)
    try {
      const res = await fetch(`/api/rfq/${showDetailModal}/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_id: quoteId, awarded_by: 'Procurement Manager' }),
      })
      const json = await res.json()
      if (json.success) {
        await refreshDetail(showDetailModal)
        fetchAll()
      } else alert(json.error || 'Award failed')
    } catch (err) {
      alert('Error awarding contract.')
    } finally {
      setAwardingQuote(null)
    }
  }

  // ─── Delete RFQ ──────────────────────────────────────
  const handleDeleteRFQ = async (id) => {
    if (!window.confirm(`Delete RFQ ${id}?`)) return
    try {
      const res = await fetch(`/api/rfq/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        if (showDetailModal === id) setShowDetailModal(null)
        fetchAll()
      }
    } catch (err) {}
  }

  // ─── Price Comparison helpers ─────────────────────────
  const lowestPrice = (quotes) => quotes.length ? Math.min(...quotes.map(q => q.total_amount)) : null
  const fastestLead = (quotes) => quotes.length ? Math.min(...quotes.map(q => q.lead_time_days)) : null
  const highestScore = (quotes) => quotes.length ? Math.max(...quotes.filter(q => q.tech_score != null).map(q => q.tech_score)) : null

  return (
    <div className="pb-12">
      <Header
        title="RFQ & Quotations"
        subtitle="Manage vendor bids, compare prices, evaluate technical compliance, and award contracts"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search RFQ ID or Item..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open Bidding">Open Bidding</option>
                <option value="Under Evaluation">Under Evaluation</option>
                <option value="Awarded">Awarded</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New RFQ
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total RFQs', value: rfqs.length, icon: <FileText className="w-5 h-5 text-slate-400" /> },
            { label: 'Open Bidding', value: rfqs.filter(r => r.status === 'Open Bidding').length, icon: <AlertCircle className="w-5 h-5 text-blue-400" /> },
            { label: 'Under Evaluation', value: rfqs.filter(r => r.status === 'Under Evaluation').length, icon: <BarChart3 className="w-5 h-5 text-amber-400" /> },
            { label: 'Awarded', value: rfqs.filter(r => r.status === 'Awarded').length, icon: <Award className="w-5 h-5 text-teal-400" /> },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* RFQ List Table */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading RFQs...</div>
          ) : rfqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No RFQs found. Create one to start bidding.</div>
          ) : (
            <Table columns={['RFQ ID', 'Item / Requirement', 'Category', 'Budget', 'Deadline', 'Vendors', 'Quotes', 'Status', 'Actions']}>
              {rfqs.map(rfq => (
                <tr key={rfq.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{rfq.id}</Td>
                  <Td className="max-w-[200px] truncate font-medium text-slate-800">{rfq.item}</Td>
                  <Td className="text-slate-600 font-normal">{rfq.category}</Td>
                  <Td className="font-mono text-slate-700">
                    {rfq.budget ? `$${Number(rfq.budget).toLocaleString()}` : '—'}
                  </Td>
                  <Td className="text-slate-600 font-normal text-xs">
                    {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : '—'}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium">{rfq.invited_vendors?.length || 0}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {rfq.quotation_count || 0} quotes
                    </span>
                  </Td>
                  <Td><RFQStatusBadge status={rfq.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetail(rfq.id)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Evaluate →
                      </button>
                      <button
                        onClick={() => {
                          setQuoteForm(prev => ({ ...prev, rfq_id: rfq.id }))
                          setShowQuoteModal(true)
                        }}
                        title="Submit Vendor Quote"
                        className="text-slate-500 hover:text-teal-600 p-1 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRFQ(rfq.id)}
                        title="Delete RFQ"
                        className="text-slate-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
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

      {/* ═══════════════════════════════════════════════════════
          MODAL 1: Create New RFQ
      ═══════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Create New RFQ</h3>
                <p className="text-xs text-slate-500">Invite vendors to bid on a purchase requirement</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item / Requirement <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Steel Rods (500 units)"
                  value={createForm.item}
                  onChange={e => setCreateForm({ ...createForm, item: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={createForm.category}
                    onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45000"
                    value={createForm.budget}
                    onChange={e => setCreateForm({ ...createForm, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bid Deadline</label>
                  <input
                    type="date"
                    value={createForm.deadline}
                    onChange={e => setCreateForm({ ...createForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Link to Requisition (optional)</label>
                  <select
                    value={createForm.requisition_id}
                    onChange={e => setCreateForm({ ...createForm, requisition_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">None</option>
                    {requisitions.map(r => (
                      <option key={r.id} value={r.id}>{r.id} — {r.item.substring(0, 35)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Created By</label>
                  <input
                    type="text"
                    value={createForm.created_by}
                    onChange={e => setCreateForm({ ...createForm, created_by: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Technical Notes & Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Specifications, certifications, compliance requirements..."
                  value={createForm.notes}
                  onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Invite Vendors (Multi-Select) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Invite Vendors ({createForm.invited_vendors.length} selected)
                </label>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-52 overflow-y-auto">
                  {vendors.map(v => {
                    const selected = createForm.invited_vendors.includes(v.id)
                    return (
                      <label key={v.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors ${selected ? 'bg-blue-50/50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleVendor(v.id)}
                          className="accent-blue-600"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-800">{v.name}</div>
                          <div className="text-xs text-slate-500">{v.category} · {v.location}</div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {v.rating}
                        </div>
                        {v.cert && v.cert !== '—' && (
                          <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded font-medium">{v.cert}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submittingCreate} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {submittingCreate ? 'Creating...' : 'Create RFQ & Invite Vendors'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL 2: Submit Vendor Quotation
      ═══════════════════════════════════════════════════════ */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Submit Vendor Quotation</h3>
                <p className="text-xs text-slate-500">Record a vendor's bid for {quoteForm.rfq_id || 'the selected RFQ'}</p>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">RFQ <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={quoteForm.rfq_id}
                    onChange={e => setQuoteForm({ ...quoteForm, rfq_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select RFQ...</option>
                    {rfqs.filter(r => r.status !== 'Awarded').map(r => (
                      <option key={r.id} value={r.id}>{r.id} — {r.item.substring(0, 25)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={quoteForm.vendor_id}
                    onChange={e => setQuoteForm({ ...quoteForm, vendor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select vendor...</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={quoteForm.unit_price}
                    onChange={e => setQuoteForm({ ...quoteForm, unit_price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Total Amount ($) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={quoteForm.total_amount}
                    onChange={e => setQuoteForm({ ...quoteForm, total_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Lead Time (days)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 14"
                    value={quoteForm.lead_time_days}
                    onChange={e => setQuoteForm({ ...quoteForm, lead_time_days: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Warranty Terms</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year Manufacturer Warranty"
                    value={quoteForm.warranty_terms}
                    onChange={e => setQuoteForm({ ...quoteForm, warranty_terms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Technical Score (0–100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 85"
                    value={quoteForm.tech_score}
                    onChange={e => setQuoteForm({ ...quoteForm, tech_score: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Technical Evaluation Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Compliance notes, certification status, material grade, spec alignment..."
                  value={quoteForm.tech_remarks}
                  onChange={e => setQuoteForm({ ...quoteForm, tech_remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowQuoteModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submittingQuote} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {submittingQuote ? 'Submitting...' : 'Submit Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL 3: RFQ Detail — Price Comparison + Evaluation + Award
      ═══════════════════════════════════════════════════════ */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-slate-900">{showDetailModal}</span>
                  {rfqDetail && <RFQStatusBadge status={rfqDetail.status} />}
                  {rfqDetail?.category && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{rfqDetail.category}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{rfqDetail?.item || 'Loading...'}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setQuoteForm(prev => ({ ...prev, rfq_id: showDetailModal }))
                    setShowQuoteModal(true)
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white px-2.5 py-1.5 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  Add Quote
                </button>
                <button
                  onClick={() => handleDeleteRFQ(showDetailModal)}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <button
                  onClick={() => { setShowDetailModal(null); setRfqDetail(null) }}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {loadingDetail ? (
                <div className="py-12 text-center text-slate-400 text-sm">Loading evaluation data...</div>
              ) : rfqDetail ? (
                <>
                  {/* RFQ Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[11px] uppercase font-medium text-slate-400">Budget</div>
                      <div className="text-sm font-mono font-bold text-slate-900">
                        {rfqDetail.budget ? `$${Number(rfqDetail.budget).toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-medium text-slate-400">Deadline</div>
                      <div className="text-xs font-semibold text-slate-800">
                        {rfqDetail.deadline ? new Date(rfqDetail.deadline).toLocaleDateString() : 'Open'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-medium text-slate-400">Invited Vendors</div>
                      <div className="text-xs font-semibold text-slate-800">{rfqDetail.invited_vendors_detail?.length || 0} vendors</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-medium text-slate-400">Total Quotes</div>
                      <div className="text-xs font-semibold text-slate-800">{rfqDetail.quotations?.length || 0} submitted</div>
                    </div>
                  </div>

                  {rfqDetail.notes && (
                    <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700">
                      <span className="font-semibold text-slate-900">Requirements: </span>{rfqDetail.notes}
                    </div>
                  )}

                  {/* Award Winner Banner */}
                  {rfqDetail.status === 'Awarded' && rfqDetail.awarded_vendor && (
                    <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <div className="bg-teal-500 rounded-full p-2">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Contract Awarded</div>
                        <div className="text-sm font-bold text-teal-900 mt-0.5">{rfqDetail.awarded_vendor.name}</div>
                        <div className="text-xs text-teal-700">{rfqDetail.awarded_vendor.location} · {rfqDetail.awarded_vendor.cert}</div>
                      </div>
                    </div>
                  )}

                  {/* Price Comparison & Evaluation Matrix */}
                  {rfqDetail.quotations?.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                      No quotations submitted yet. Click <strong>"Add Quote"</strong> to record vendor bids.
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-slate-400" />
                        Side-by-Side Price & Technical Evaluation
                      </h4>

                      {/* Comparison Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rfqDetail.quotations.map((q) => {
                          const quotes = rfqDetail.quotations
                          const isLowest = q.total_amount === lowestPrice(quotes)
                          const isFastest = q.lead_time_days === fastestLead(quotes)
                          const isBestScore = q.tech_score != null && q.tech_score === highestScore(quotes)
                          const isAwarded = q.status === 'Awarded'
                          const budgetVariance = rfqDetail.budget ? ((q.total_amount - rfqDetail.budget) / rfqDetail.budget * 100).toFixed(1) : null

                          return (
                            <div key={q.id} className={`rounded-xl border p-4 space-y-3 relative transition-shadow ${isAwarded ? 'border-teal-300 bg-teal-50/30 shadow-md shadow-teal-100' : 'border-slate-200 bg-white hover:shadow-sm'}`}>
                              {/* Vendor Header */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-bold text-slate-900">{q.vendor_name}</div>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <QuoteStatusBadge status={q.status} />
                                    {isLowest && (
                                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-full">
                                        <TrendingDown className="w-2.5 h-2.5" /> Lowest Price
                                      </span>
                                    )}
                                    {isFastest && (
                                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">
                                        <Clock className="w-2.5 h-2.5" /> Fastest Delivery
                                      </span>
                                    )}
                                    {isBestScore && (
                                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                                        <Star className="w-2.5 h-2.5" /> Best Tech Score
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isAwarded && (
                                  <div className="bg-teal-500 text-white p-1 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                )}
                              </div>

                              {/* Price & Lead Time */}
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="text-[10px] text-slate-400 uppercase font-medium">Total Bid</div>
                                  <div className="text-sm font-bold font-mono text-slate-900">${Number(q.total_amount).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="text-[10px] text-slate-400 uppercase font-medium">Lead Time</div>
                                  <div className="text-sm font-bold text-slate-900">{q.lead_time_days}d</div>
                                </div>
                                <div className={`rounded-lg p-2 ${budgetVariance !== null ? (parseFloat(budgetVariance) > 0 ? 'bg-red-50' : 'bg-teal-50') : 'bg-slate-50'}`}>
                                  <div className="text-[10px] text-slate-400 uppercase font-medium">vs Budget</div>
                                  <div className={`text-sm font-bold ${budgetVariance !== null ? (parseFloat(budgetVariance) > 0 ? 'text-red-600' : 'text-teal-600') : 'text-slate-400'}`}>
                                    {budgetVariance !== null ? `${budgetVariance > 0 ? '+' : ''}${budgetVariance}%` : '—'}
                                  </div>
                                </div>
                              </div>

                              {/* Warranty */}
                              {q.warranty_terms && (
                                <div className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  {q.warranty_terms}
                                </div>
                              )}

                              {/* Technical Score */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Technical Score</span>
                                </div>
                                {q.tech_score != null ? (
                                  <ScoreBar score={q.tech_score} />
                                ) : (
                                  <div className="text-xs text-slate-400 italic">Not yet evaluated</div>
                                )}
                                {q.tech_remarks && (
                                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{q.tech_remarks}</p>
                                )}
                              </div>

                              {/* Inline Evaluation Editor */}
                              {evalEdit[q.id] !== undefined ? (
                                <div className="border border-blue-200 bg-blue-50/40 rounded-lg p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-medium text-slate-700 shrink-0">Tech Score</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={evalEdit[q.id].tech_score ?? q.tech_score ?? ''}
                                      onChange={e => setEvalEdit(prev => ({ ...prev, [q.id]: { ...prev[q.id], tech_score: e.target.value } }))}
                                      className="w-20 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none"
                                    />
                                    <span className="text-xs text-slate-400">/ 100</span>
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder="Technical remarks..."
                                    value={evalEdit[q.id].tech_remarks ?? q.tech_remarks ?? ''}
                                    onChange={e => setEvalEdit(prev => ({ ...prev, [q.id]: { ...prev[q.id], tech_remarks: e.target.value } }))}
                                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      disabled={savingEval === q.id}
                                      onClick={() => saveEvaluation(q.id)}
                                      className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer disabled:opacity-50"
                                    >
                                      {savingEval === q.id ? 'Saving...' : 'Save Score'}
                                    </button>
                                    <button
                                      onClick={() => setEvalEdit(prev => { const n = { ...prev }; delete n[q.id]; return n })}
                                      className="px-2 py-1 border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-50 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEvalEdit(prev => ({ ...prev, [q.id]: { tech_score: q.tech_score, tech_remarks: q.tech_remarks } }))}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                  Edit Technical Evaluation
                                </button>
                              )}

                              {/* Award Button */}
                              {rfqDetail.status !== 'Awarded' && (
                                <button
                                  disabled={awardingQuote === q.id}
                                  onClick={() => handleAward(q.id, q.vendor_name)}
                                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  {awardingQuote === q.id ? 'Awarding...' : `Award Contract to ${q.vendor_name.split(' ')[0]}`}
                                </button>
                              )}

                              {isAwarded && (
                                <div className="text-xs text-center text-teal-700 font-semibold py-1">
                                  ✓ Contract Awarded
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">Failed to load RFQ details.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
