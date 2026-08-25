import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import {
  Plus, X, Search, Filter, FileText, Truck, DollarSign,
  Clock, CheckCircle2, AlertTriangle, ChevronRight,
  Pencil, Trash2, History, ClipboardList, CalendarDays,
  ShieldAlert, CircleDot, Package, TrendingUp, Save,
} from 'lucide-react'

// ─── Status helpers ──────────────────────────────────
const PO_STATUS = {
  Pending:    'bg-amber-100 text-amber-700',
  Confirmed:  'bg-blue-100 text-blue-700',
  'In Transit': 'bg-indigo-100 text-indigo-700',
  Delivered:  'bg-teal-100 text-teal-700',
  Cancelled:  'bg-red-100 text-red-600',
  Closed:     'bg-slate-100 text-slate-500',
}

const PAY_STATUS = {
  Pending:  'bg-amber-100 text-amber-700',
  Invoiced: 'bg-blue-100 text-blue-700',
  Paid:     'bg-teal-100 text-teal-700',
  Overdue:  'bg-red-100 text-red-600',
}

const DS_STATUS = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-teal-100 text-teal-700',
  Delayed:   'bg-red-100 text-red-600',
  Partial:   'bg-amber-100 text-amber-700',
}

function Badge({ text, map }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[text] || 'bg-slate-100 text-slate-500'}`}>
      {text}
    </span>
  )
}

// ─── Tracking Timeline ───────────────────────────────
function Timeline({ events }) {
  if (!events?.length) return <div className="text-xs text-slate-400 italic text-center py-4">No tracking events yet.</div>
  return (
    <ol className="relative ml-3 space-y-4 border-l-2 border-slate-200">
      {events.map((ev, i) => (
        <li key={ev.id || i} className="ml-4">
          <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-900">{ev.event}</p>
              {ev.note && <p className="text-[11px] text-slate-500 mt-0.5">{ev.note}</p>}
              <p className="text-[10px] text-slate-400 mt-0.5">by {ev.actor}</p>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
              {new Date(ev.timestamp).toLocaleDateString()} {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

// ─── Main Component ──────────────────────────────────
export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [vendors, setVendors] = useState([])
  const [rfqs, setRfqs] = useState([])
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [detailPO, setDetailPO] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Tabs inside detail modal
  const [activeTab, setActiveTab] = useState('overview')

  // Sub-forms inside detail modal
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [showAddAmendment, setShowAddAmendment] = useState(false)

  const [scheduleForm, setScheduleForm] = useState({ milestone: '', date: '', qty: '' })
  const [amendForm, setAmendForm] = useState({ reason: '', changes: '', amended_by: 'Procurement Manager' })
  const [submittingDS, setSubmittingDS] = useState(false)
  const [submittingAmd, setSubmittingAmd] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Create PO form
  const [createForm, setCreateForm] = useState({
    vendor_id: '', rfq_id: '', requisition_id: '', item: '', category: '',
    quantity: '', unit_price: '', total_amount: '', tax_pct: '17',
    currency: 'PKR', payment_terms: 'Net 30',
    delivery_address: '', delivery_date: '',
    notes: '', created_by: 'Procurement Manager',
  })
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Edit PO form
  const [editForm, setEditForm] = useState({
    id: '', vendor_id: '', item: '', category: '',
    quantity: '', unit_price: '', total_amount: '', tax_pct: '17',
    currency: 'PKR', payment_terms: 'Net 30', status: 'Pending',
    payment_status: 'Pending', delivery_address: '', delivery_date: '',
    notes: '', updated_by: 'Procurement Manager',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  const categories = ['Raw Materials', 'IT & Electronics', 'Office Supplies', 'Logistics', 'Packaging', 'Facilities', 'General']

  // ── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [poRes, vRes, rfqRes, reqRes] = await Promise.all([
        fetch(`/api/purchase-orders?${params}`),
        fetch('/api/vendors'),
        fetch('/api/rfq'),
        fetch('/api/requisitions'),
      ])
      const [poJ, vJ, rfqJ, reqJ] = await Promise.all([poRes.json(), vRes.json(), rfqRes.json(), reqRes.json()])
      if (poJ.success) setOrders(poJ.data)
      if (vJ.success) setVendors(vJ.data)
      if (rfqJ.success) setRfqs(rfqJ.data)
      if (reqJ.success) setRequisitions(reqJ.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchDetail = async (id) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/purchase-orders/${id}`)
      const json = await res.json()
      if (json.success) setDetailPO(json.data)
    } catch (err) {} finally { setDetailLoading(false) }
  }

  const refreshDetail = async (id) => {
    const res = await fetch(`/api/purchase-orders/${id}`)
    const json = await res.json()
    if (json.success) setDetailPO(json.data)
  }

  useEffect(() => { fetchAll() }, [filterStatus, searchTerm])

  // ── Auto-compute total for Create ─────────────────────
  useEffect(() => {
    const qty = parseFloat(createForm.quantity) || 0
    const up = parseFloat(createForm.unit_price) || 0
    if (qty > 0 && up > 0) setCreateForm(f => ({ ...f, total_amount: (qty * up).toFixed(2) }))
  }, [createForm.quantity, createForm.unit_price])

  // ── Auto-compute total for Edit ───────────────────────
  useEffect(() => {
    const qty = parseFloat(editForm.quantity) || 0
    const up = parseFloat(editForm.unit_price) || 0
    if (qty > 0 && up > 0) setEditForm(f => ({ ...f, total_amount: (qty * up).toFixed(2) }))
  }, [editForm.quantity, editForm.unit_price])

  const grandTotalPreview = (form) => {
    const amt = parseFloat(form.total_amount) || 0
    const tax = (amt * (parseFloat(form.tax_pct) || 0)) / 100
    return (amt + tax).toFixed(2)
  }

  // ── Create PO ────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!createForm.vendor_id || !createForm.item) { alert('Vendor and Item are required.'); return }
    setSubmittingCreate(true)
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({ vendor_id: '', rfq_id: '', requisition_id: '', item: '', category: '', quantity: '', unit_price: '', total_amount: '', tax_pct: '17', currency: 'PKR', payment_terms: 'Net 30', delivery_address: '', delivery_date: '', notes: '', created_by: 'Procurement Manager' })
        fetchAll()
      } else alert(json.error || 'Failed to create PO')
    } catch (err) { alert('Error connecting to server.') }
    finally { setSubmittingCreate(false) }
  }

  // ── Open Edit Modal ──────────────────────────────────
  const openEditModal = (po) => {
    setEditForm({
      id: po.id,
      vendor_id: po.vendor_id || '',
      item: po.item || '',
      category: po.category || 'General',
      quantity: po.quantity || '',
      unit_price: po.unit_price || '',
      total_amount: po.total_amount || '',
      tax_pct: po.tax_pct !== undefined ? po.tax_pct : '17',
      currency: po.currency || 'PKR',
      payment_terms: po.payment_terms || 'Net 30',
      status: po.status || 'Pending',
      payment_status: po.payment_status || 'Pending',
      delivery_address: po.delivery_address || '',
      delivery_date: po.delivery_date ? po.delivery_date.split('T')[0] : '',
      notes: po.notes || '',
      updated_by: 'Procurement Manager',
    })
    setShowEditModal(true)
  }

  // ── Save Edit Changes ────────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id || !editForm.item) { alert('Item description is required.'); return }
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/purchase-orders/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
        if (detailPO && detailPO.id === editForm.id) {
          await refreshDetail(editForm.id)
        }
      } else alert(json.error || 'Failed to update Purchase Order')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ── Status Update ────────────────────────────────────
  const handleStatusUpdate = async (id, status, note = '') => {
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/purchase-orders/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actor: 'Procurement Manager', note }),
      })
      const json = await res.json()
      if (json.success) { await refreshDetail(id); fetchAll() }
    } catch (err) {} finally { setUpdatingStatus(false) }
  }

  const handlePaymentStatusUpdate = async (id, payment_status) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status, actor: 'Finance', note: `Payment marked as ${payment_status}` }),
      })
      const json = await res.json()
      if (json.success) { await refreshDetail(id); fetchAll() }
    } catch (err) {}
  }

  // ── Add Delivery Schedule ────────────────────────────
  const handleAddSchedule = async (e) => {
    e.preventDefault()
    if (!detailPO) return
    setSubmittingDS(true)
    try {
      const res = await fetch(`/api/purchase-orders/${detailPO.id}/delivery-schedules`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowAddSchedule(false)
        setScheduleForm({ milestone: '', date: '', qty: '' })
        await refreshDetail(detailPO.id)
      } else alert(json.error)
    } catch (err) {} finally { setSubmittingDS(false) }
  }

  const handleDSStatus = async (poId, dsId, status) => {
    await fetch(`/api/purchase-orders/${poId}/delivery-schedules/${dsId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await refreshDetail(poId)
  }

  // ── Add Amendment ────────────────────────────────────
  const handleAddAmendment = async (e) => {
    e.preventDefault()
    if (!detailPO) return
    setSubmittingAmd(true)
    try {
      const res = await fetch(`/api/purchase-orders/${detailPO.id}/amendments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(amendForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowAddAmendment(false)
        setAmendForm({ reason: '', changes: '', amended_by: 'Procurement Manager' })
        await refreshDetail(detailPO.id)
      } else alert(json.error)
    } catch (err) {} finally { setSubmittingAmd(false) }
  }

  // ── Delete PO ────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm(`Delete Purchase Order ${id}?`)) return
    await fetch(`/api/purchase-orders/${id}`, { method: 'DELETE' })
    if (detailPO?.id === id) setDetailPO(null)
    fetchAll()
  }

  // ── Summary stats ─────────────────────────────────────
  const totalValue = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

  const DETAIL_TABS = [
    { id: 'overview', label: 'Overview', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'delivery', label: 'Delivery Schedule', icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { id: 'tracking', label: 'Order Tracking', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'amendments', label: 'Amendments', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="pb-12">
      <Header
        title="Purchase Orders"
        subtitle="Generate POs, manage delivery schedules, track order progress, and issue amendments"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PO ID, item or vendor..."
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
                {Object.keys(PO_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Purchase Order
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: orders.length, icon: <FileText className="w-5 h-5 text-slate-400" />, sub: null },
            { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-blue-400" />, sub: 'gross' },
            { label: 'Pending Confirmation', value: pendingCount, icon: <Clock className="w-5 h-5 text-amber-400" />, sub: null },
            { label: 'Delivered', value: deliveredCount, icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />, sub: null },
          ].map(s => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Orders Table */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading purchase orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No purchase orders yet. Generate one from an awarded RFQ.</div>
          ) : (
            <Table columns={['PO Number', 'Item', 'Vendor', 'Grand Total', 'Delivery Date', 'Payment', 'Status', 'Actions']}>
              {orders.map(po => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{po.id}</Td>
                  <Td className="max-w-[180px] truncate text-slate-800 font-medium">{po.item}</Td>
                  <Td className="text-slate-600 font-normal">{po.vendor_name}</Td>
                  <Td className="font-mono text-slate-900 font-semibold">
                    {po.currency} {Number(po.grand_total || 0).toLocaleString()}
                  </Td>
                  <Td className="text-xs text-slate-600">
                    {po.delivery_date ? new Date(po.delivery_date).toLocaleDateString() : '—'}
                  </Td>
                  <Td><Badge text={po.payment_status || 'Pending'} map={PAY_STATUS} /></Td>
                  <Td><Badge text={po.status} map={PO_STATUS} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setDetailPO(null); setActiveTab('overview'); fetchDetail(po.id) }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => openEditModal(po)}
                        title="Edit Purchase Order"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(po.id)}
                        title="Delete Purchase Order"
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded cursor-pointer"
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
          MODAL 1: Generate Purchase Order
      ════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Generate Purchase Order</h3>
                <p className="text-xs text-slate-500">Create a new PO for a vendor with delivery and payment terms</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-4">

              {/* Linked refs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Link to RFQ</label>
                  <select value={createForm.rfq_id} onChange={e => {
                    const rfq = rfqs.find(r => r.id === e.target.value)
                    setCreateForm(f => ({ ...f, rfq_id: e.target.value, item: rfq ? rfq.item : f.item, category: rfq ? rfq.category : f.category }))
                  }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    <option value="">None</option>
                    {rfqs.filter(r => r.status === 'Awarded').map(r => (
                      <option key={r.id} value={r.id}>{r.id} — {r.item.substring(0, 28)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Link to Requisition</label>
                  <select value={createForm.requisition_id} onChange={e => setCreateForm(f => ({ ...f, requisition_id: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    <option value="">None</option>
                    {requisitions.map(r => <option key={r.id} value={r.id}>{r.id} — {r.item.substring(0, 28)}</option>)}
                  </select>
                </div>
              </div>

              {/* Item & Vendor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                  <select required value={createForm.vendor_id} onChange={e => setCreateForm(f => ({ ...f, vendor_id: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    <option value="">Select vendor...</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select value={createForm.category} onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item / Description <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. Industrial Steel Rods (500 units)" value={createForm.item} onChange={e => setCreateForm(f => ({ ...f, item: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Qty</label>
                  <input type="number" min="1" placeholder="500" value={createForm.quantity} onChange={e => setCreateForm(f => ({ ...f, quantity: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" value={createForm.unit_price} onChange={e => setCreateForm(f => ({ ...f, unit_price: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subtotal ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" value={createForm.total_amount} onChange={e => setCreateForm(f => ({ ...f, total_amount: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tax %</label>
                  <input type="number" min="0" max="100" placeholder="17" value={createForm.tax_pct} onChange={e => setCreateForm(f => ({ ...f, tax_pct: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>

              {/* Grand Total Preview */}
              {createForm.total_amount && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Grand Total (incl. {createForm.tax_pct || 0}% tax):</span>
                  <span className="font-bold text-slate-900 font-mono">{createForm.currency} {Number(grandTotalPreview(createForm)).toLocaleString()}</span>
                </div>
              )}

              {/* Payment & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Terms</label>
                  <select value={createForm.payment_terms} onChange={e => setCreateForm(f => ({ ...f, payment_terms: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    {['Net 15', 'Net 30', 'Net 45', 'Net 60', '50% Advance + 50% on Delivery', 'Full Advance', 'Letter of Credit'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select value={createForm.currency} onChange={e => setCreateForm(f => ({ ...f, currency: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                    {['PKR', 'USD', 'EUR', 'AED', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expected Delivery</label>
                  <input type="date" value={createForm.delivery_date} onChange={e => setCreateForm(f => ({ ...f, delivery_date: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Address</label>
                <input type="text" placeholder="e.g. Plot 14, Industrial Zone, Lahore" value={createForm.delivery_address} onChange={e => setCreateForm(f => ({ ...f, delivery_address: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Special Instructions</label>
                <textarea rows={2} placeholder="Packaging requirements, contact person, inspection notes..." value={createForm.notes} onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingCreate} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {submittingCreate ? 'Generating...' : 'Generate Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Edit Purchase Order
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
                  <h3 className="text-lg font-semibold text-slate-900">Edit Purchase Order ({editForm.id})</h3>
                  <p className="text-xs text-slate-500">Update order details, amounts, vendor, and terms</p>
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
              {/* Item & Vendor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={editForm.vendor_id}
                    onChange={e => setEditForm(f => ({ ...f, vendor_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select vendor...</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item / Description <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={editForm.item}
                  onChange={e => setEditForm(f => ({ ...f, item: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.quantity}
                    onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.unit_price}
                    onChange={e => setEditForm(f => ({ ...f, unit_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subtotal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.total_amount}
                    onChange={e => setEditForm(f => ({ ...f, total_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.tax_pct}
                    onChange={e => setEditForm(f => ({ ...f, tax_pct: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Grand Total Preview */}
              {editForm.total_amount && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Calculated Grand Total (incl. {editForm.tax_pct || 0}% tax):</span>
                  <span className="font-bold text-slate-900 font-mono">{editForm.currency} {Number(grandTotalPreview(editForm)).toLocaleString()}</span>
                </div>
              )}

              {/* Payment & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Terms</label>
                  <select
                    value={editForm.payment_terms}
                    onChange={e => setEditForm(f => ({ ...f, payment_terms: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {['Net 15', 'Net 30', 'Net 45', 'Net 60', '50% Advance + 50% on Delivery', 'Full Advance', 'Letter of Credit'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={editForm.currency}
                    onChange={e => setEditForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {['PKR', 'USD', 'EUR', 'AED', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={editForm.delivery_date}
                    onChange={e => setEditForm(f => ({ ...f, delivery_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">PO Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {Object.keys(PO_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={editForm.payment_status}
                    onChange={e => setEditForm(f => ({ ...f, payment_status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
                  >
                    {Object.keys(PAY_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={editForm.delivery_address}
                  onChange={e => setEditForm(f => ({ ...f, delivery_address: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Prominent Save Changes Button at the bottom */}
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
          DETAIL MODAL: View PO with Tabs
      ════════════════════════════════════════════════ */}
      {(detailPO !== null || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">{detailPO?.id || '...'}</span>
                  {detailPO && <Badge text={detailPO.status} map={PO_STATUS} />}
                  {detailPO && <Badge text={detailPO.payment_status || 'Pending'} map={PAY_STATUS} />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-0.5">{detailPO?.item || 'Loading...'}</h3>
                {detailPO && <p className="text-xs text-slate-500 mt-0.5">{detailPO.vendor_name} · Created by {detailPO.created_by}</p>}
              </div>

              <div className="flex items-center gap-2">
                {detailPO && (
                  <button
                    onClick={() => openEditModal(detailPO)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit PO
                  </button>
                )}
                <button
                  onClick={() => setDetailPO(null)}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer ml-1 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {detailLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">Loading...</div>
            ) : detailPO ? (
              <>
                {/* Tab Bar */}
                <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 shrink-0 overflow-x-auto">
                  {DETAIL_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {tab.icon}{tab.label}
                      {tab.id === 'amendments' && detailPO.amendments?.length > 0 && (
                        <span className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 rounded-full">{detailPO.amendments.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">

                  {/* ── OVERVIEW ── */}
                  {activeTab === 'overview' && (
                    <div className="space-y-5">
                      {/* Key Fields Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Subtotal', value: `${detailPO.currency} ${Number(detailPO.total_amount || 0).toLocaleString()}` },
                          { label: `Tax (${detailPO.tax_pct || 0}%)`, value: `${detailPO.currency} ${Number(detailPO.tax_amount || 0).toLocaleString()}` },
                          { label: 'Grand Total', value: `${detailPO.currency} ${Number(detailPO.grand_total || 0).toLocaleString()}`, highlight: true },
                          { label: 'Payment Terms', value: detailPO.payment_terms },
                        ].map(f => (
                          <div key={f.label} className={`rounded-lg p-3 ${f.highlight ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-100'}`}>
                            <div className={`text-[10px] font-medium uppercase tracking-wide ${f.highlight ? 'text-slate-300' : 'text-slate-400'}`}>{f.label}</div>
                            <div className={`text-sm font-bold mt-0.5 font-mono ${f.highlight ? 'text-white' : 'text-slate-900'}`}>{f.value || '—'}</div>
                          </div>
                        ))}
                      </div>

                      {/* Vendor & Category details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs">
                        <div>
                          <span className="text-slate-400 font-medium uppercase block text-[10px]">Vendor</span>
                          <span className="font-semibold text-slate-800">{detailPO.vendor_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium uppercase block text-[10px]">Category</span>
                          <span className="font-semibold text-slate-800">{detailPO.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium uppercase block text-[10px]">Quantity</span>
                          <span className="font-semibold text-slate-800">{detailPO.quantity?.toLocaleString()} units</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium uppercase block text-[10px]">Unit Price</span>
                          <span className="font-semibold text-slate-800">{detailPO.currency} {Number(detailPO.unit_price || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Delivery & Notes */}
                      {(detailPO.delivery_address || detailPO.delivery_date) && (
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <Truck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-blue-900">Delivery Details</div>
                            {detailPO.delivery_address && <div className="text-xs text-blue-800 mt-0.5">{detailPO.delivery_address}</div>}
                            {detailPO.delivery_date && <div className="text-xs text-blue-700 mt-0.5">Expected: {new Date(detailPO.delivery_date).toLocaleDateString()}</div>}
                          </div>
                        </div>
                      )}

                      {detailPO.notes && (
                        <div className="text-xs text-slate-700 bg-amber-50 border border-amber-100 p-3 rounded-lg">
                          <span className="font-semibold">Notes: </span>{detailPO.notes}
                        </div>
                      )}

                      {/* Status Change Controls */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Update Order Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Confirmed', 'In Transit', 'Delivered', 'Cancelled', 'Closed'].map(s => (
                            <button
                              key={s}
                              disabled={detailPO.status === s || updatingStatus}
                              onClick={() => handleStatusUpdate(detailPO.id, s, `Marked as ${s}`)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${detailPO.status === s ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-100'} disabled:cursor-not-allowed`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 pt-1">Update Payment Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Pending', 'Invoiced', 'Paid', 'Overdue'].map(s => (
                            <button
                              key={s}
                              disabled={detailPO.payment_status === s}
                              onClick={() => handlePaymentStatusUpdate(detailPO.id, s)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${detailPO.payment_status === s ? 'bg-blue-700 text-white border-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-100'} disabled:cursor-not-allowed`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── DELIVERY SCHEDULE ── */}
                  {activeTab === 'delivery' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Delivery Milestones</h4>
                        <button
                          onClick={() => setShowAddSchedule(s => !s)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-900 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Milestone
                        </button>
                      </div>

                      {showAddSchedule && (
                        <form onSubmit={handleAddSchedule} className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-slate-50">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">Milestone Description</label>
                              <input required type="text" placeholder="e.g. Partial Delivery (250 units)" value={scheduleForm.milestone} onChange={e => setScheduleForm(f => ({ ...f, milestone: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                              <input type="number" placeholder="250" value={scheduleForm.qty} onChange={e => setScheduleForm(f => ({ ...f, qty: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                              <input required type="date" value={scheduleForm.date} onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" disabled={submittingDS} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer disabled:opacity-50">
                              {submittingDS ? 'Adding...' : 'Add Milestone'}
                            </button>
                            <button type="button" onClick={() => setShowAddSchedule(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer hover:bg-slate-100">Cancel</button>
                          </div>
                        </form>
                      )}

                      {detailPO.delivery_schedules?.length === 0 ? (
                        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                          No delivery milestones. Add one above.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {detailPO.delivery_schedules.map(ds => (
                            <div key={ds.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Package className={`w-5 h-5 ${ds.status === 'Delivered' ? 'text-teal-500' : ds.status === 'Delayed' ? 'text-red-500' : 'text-slate-400'}`} />
                                <div>
                                  <div className="text-sm font-semibold text-slate-900">{ds.milestone}</div>
                                  <div className="text-xs text-slate-500">
                                    {ds.qty ? `${ds.qty.toLocaleString()} units · ` : ''}
                                    {new Date(ds.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge text={ds.status} map={DS_STATUS} />
                                <select
                                  value={ds.status}
                                  onChange={e => handleDSStatus(detailPO.id, ds.id, e.target.value)}
                                  className="text-xs border border-slate-200 bg-white rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                                >
                                  {Object.keys(DS_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TRACKING ── */}
                  {activeTab === 'tracking' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-900">Order Activity Log</h4>
                      <Timeline events={[...(detailPO.tracking || [])].reverse()} />
                    </div>
                  )}

                  {/* ── AMENDMENTS ── */}
                  {activeTab === 'amendments' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Amendments ({detailPO.amendments?.length || 0})</h4>
                        <button
                          onClick={() => setShowAddAmendment(s => !s)}
                          className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-amber-200"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Issue Amendment
                        </button>
                      </div>

                      {showAddAmendment && (
                        <form onSubmit={handleAddAmendment} className="border border-dashed border-amber-300 rounded-xl p-4 space-y-3 bg-amber-50/40">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Reason for Amendment <span className="text-red-500">*</span></label>
                            <input required type="text" placeholder="e.g. Quantity revised from 500 to 600 units" value={amendForm.reason} onChange={e => setAmendForm(f => ({ ...f, reason: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Changes</label>
                            <textarea rows={3} placeholder="List all changes made to the original PO..." value={amendForm.changes} onChange={e => setAmendForm(f => ({ ...f, changes: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Amended By</label>
                              <input type="text" value={amendForm.amended_by} onChange={e => setAmendForm(f => ({ ...f, amended_by: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" disabled={submittingAmd} className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium cursor-pointer disabled:opacity-50">
                              {submittingAmd ? 'Issuing...' : 'Issue Amendment'}
                            </button>
                            <button type="button" onClick={() => setShowAddAmendment(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer hover:bg-slate-50">Cancel</button>
                          </div>
                        </form>
                      )}

                      {detailPO.amendments?.length === 0 ? (
                        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                          No amendments issued for this PO.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {[...detailPO.amendments].reverse().map((amd, i) => (
                            <div key={amd.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">AMD #{detailPO.amendments.length - i}</div>
                                  <span className="text-xs font-semibold text-amber-900">{amd.reason}</span>
                                </div>
                                <span className="text-[10px] text-amber-700 shrink-0">{new Date(amd.timestamp).toLocaleDateString()}</span>
                              </div>
                              {amd.changes && <p className="text-xs text-amber-800 mt-2 leading-relaxed">{amd.changes}</p>}
                              <p className="text-[10px] text-amber-600 mt-1.5">Issued by: {amd.amended_by}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(detailPO)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit PO Details
                    </button>
                    <button
                      onClick={() => handleDelete(detailPO.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete PO
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      Created {new Date(detailPO.created_at).toLocaleDateString()}
                    </span>
                    {detailPO.rfq_id && (
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono">via {detailPO.rfq_id}</span>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
