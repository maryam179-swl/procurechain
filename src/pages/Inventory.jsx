import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import {
  Package, Plus, Search, Filter, Warehouse, CheckCircle2, Clock,
  AlertTriangle, ShieldCheck, FileText, ChevronRight, X, Building2, TrendingUp
} from 'lucide-react'

const GRN_STATUS = {
  'Inspected & Accepted': 'bg-teal-100 text-teal-700 font-semibold',
  'Partial Receipt': 'bg-amber-100 text-amber-800 font-semibold',
  'Pending QC': 'bg-purple-100 text-purple-700 font-semibold',
  Quarantined: 'bg-rose-100 text-rose-700 font-bold',
}

export default function Inventory() {
  const [grns, setGrns] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [stats, setStats] = useState({ total_grns: 0, accepted_grns: 0, pending_qc: 0, warehouses_count: 18, total_stock_value: '$14.2 Million' })
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('grns') // 'grns' | 'warehouses'
  const [filterWarehouse, setFilterWarehouse] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Create GRN Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    po_id: '',
    warehouse_id: 'WH-01',
    received_qty: '',
    rejected_qty: '0',
    inspected_by: 'Warehouse Manager',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterWarehouse !== 'All') params.append('warehouse', filterWarehouse)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [grnRes, whRes, poRes, statRes] = await Promise.all([
        fetch(`/api/inventory/grns?${params}`),
        fetch('/api/inventory/warehouses'),
        fetch('/api/purchase-orders'),
        fetch('/api/inventory/stats'),
      ])

      const [grnJ, whJ, poJ, statJ] = await Promise.all([
        grnRes.json(), whRes.json(), poRes.json(), statRes.json()
      ])

      if (grnJ.success) setGrns(grnJ.data)
      if (whJ.success) setWarehouses(whJ.data)
      if (poJ.success) setPurchaseOrders(poJ.data)
      if (statJ.success) setStats(statJ.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [filterWarehouse, filterStatus, searchTerm])

  const handleCreateGRN = async (e) => {
    e.preventDefault()
    if (!createForm.po_id || !createForm.warehouse_id) {
      alert('PO Reference and Receiving Warehouse are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/inventory/grns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({ po_id: '', warehouse_id: 'WH-01', received_qty: '', rejected_qty: '0', inspected_by: 'Warehouse Manager', notes: '' })
        fetchAll()
      } else alert(json.error)
    } catch (err) {
      alert('Error creating GRN.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Inventory & Warehouse Operations"
        subtitle="Manage Goods Received Notes (GRN), quality inspections, and stock allocation across 18 enterprise warehouses"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <Warehouse className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.warehouses_count}</div>
              <div className="text-xs text-slate-500 font-medium">Enterprise Warehouses</div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <Package className="w-5 h-5 text-teal-500" />
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.total_grns}</div>
              <div className="text-xs text-slate-500 font-medium">Total GRN Records</div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.accepted_grns}</div>
              <div className="text-xs text-slate-500 font-medium">QC Accepted Batches</div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-xl font-bold text-slate-900">{stats.total_stock_value}</div>
              <div className="text-xs text-slate-500 font-medium">Active Stock Value</div>
            </div>
          </Card>
        </div>

        {/* Tab & Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('grns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'grns' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Goods Received Notes (GRNs)
            </button>
            <button
              onClick={() => setActiveTab('warehouses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'warehouses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              18 Warehouses Network
            </button>
          </div>

          {activeTab === 'grns' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search GRN, PO ID, item..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Record Goods Received (GRN)
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: GRN Table */}
        {activeTab === 'grns' && (
          <Card>
            <Table columns={['GRN ID', 'PO Reference', 'Item Received', 'Warehouse Facility', 'Qty (Rec / Acc / Rej)', 'Quality Status', 'Inspector']}>
              {loading ? (
                <tr><Td colSpan={7} className="text-center py-8 text-slate-400">Loading GRN records...</Td></tr>
              ) : grns.length === 0 ? (
                <tr><Td colSpan={7} className="text-center py-8 text-slate-400">No GRN records found.</Td></tr>
              ) : (
                grns.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <Td mono>{g.id}</Td>
                    <Td mono className="font-semibold text-slate-900">{g.po_id}</Td>
                    <Td className="font-medium text-slate-900">{g.item}</Td>
                    <Td className="text-slate-600 font-normal">{g.warehouse}</Td>
                    <Td mono className="text-xs">
                      <span className="font-bold text-slate-900">{g.received_qty}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-emerald-600 font-semibold">{g.accepted_qty}</span>
                      {g.rejected_qty > 0 && (
                        <span className="text-rose-600 font-semibold"> ({g.rejected_qty} rej)</span>
                      )}
                    </Td>
                    <Td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${GRN_STATUS[g.status] || 'bg-slate-100 text-slate-600'}`}>
                        {g.status}
                      </span>
                    </Td>
                    <Td className="text-slate-600 text-xs font-normal">{g.inspected_by}</Td>
                  </tr>
                ))
              )}
            </Table>
          </Card>
        )}

        {/* Tab 2: 18 Warehouses Grid */}
        {activeTab === 'warehouses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {warehouses.map((w) => (
              <Card key={w.id} className="p-4 space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-slate-900 text-gold-400 font-mono font-bold flex items-center justify-center text-xs">
                      {w.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                      <p className="text-xs text-slate-500">{w.city}, Pakistan</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {w.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage Capacity:</span>
                    <span className="font-mono font-semibold text-slate-900">{w.capacity_sqft.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Warehouse Lead:</span>
                    <span className="font-medium text-slate-900">{w.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock Occupancy:</span>
                    <span className="font-mono font-bold text-slate-900">{w.current_occupancy_pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${w.current_occupancy_pct >= 85 ? 'bg-amber-500' : 'bg-teal-500'}`}
                    style={{ width: `${w.current_occupancy_pct}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* Record GRN Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 text-lg">Record Goods Received (GRN)</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGRN} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Purchase Order (PO)</label>
                <select
                  required
                  value={createForm.po_id}
                  onChange={e => setCreateForm(f => ({ ...f, po_id: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">-- Choose PO --</option>
                  {purchaseOrders.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.item} ({p.vendor_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Receiving Warehouse Facility</label>
                <select
                  required
                  value={createForm.warehouse_id}
                  onChange={e => setCreateForm(f => ({ ...f, warehouse_id: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.id} — {w.name} ({w.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Received Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={createForm.received_qty}
                    onChange={e => setCreateForm(f => ({ ...f, received_qty: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rejected Quantity (QC)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={createForm.rejected_qty}
                    onChange={e => setCreateForm(f => ({ ...f, rejected_qty: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspected By</label>
                <input
                  type="text"
                  required
                  value={createForm.inspected_by}
                  onChange={e => setCreateForm(f => ({ ...f, inspected_by: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspector Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on packaging, seal verification, or quarantine reason..."
                  value={createForm.notes}
                  onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {submitting ? 'Recording...' : 'Submit GRN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
