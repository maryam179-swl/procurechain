import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, Table, Td } from '../components/ui'
import { vendors as initialVendors, vendorStats as initialStats } from '../data'
import {
  Plus, X, Search, Filter, Building2, ShieldCheck, CreditCard,
  Star, MapPin, Mail, Phone, Globe, Calendar, Award, TrendingUp,
  Pencil, Trash2, Save, ChevronRight, CheckCircle2, AlertCircle,
  FileText, ExternalLink, User, DollarSign, BarChart3, Clock,
} from 'lucide-react'

// ─── Status Badges ─────────────────────────────────────
const VENDOR_STATUS = {
  Active: 'bg-teal-100 text-teal-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  Inactive: 'bg-slate-100 text-slate-500',
  Blacklisted: 'bg-red-100 text-red-600',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${VENDOR_STATUS[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}

const TAX_FILER_STATUS = {
  'Active Filer': 'bg-teal-50 text-teal-700 border border-teal-200',
  'Non-Filer': 'bg-red-50 text-red-700 border border-red-200',
  Exempt: 'bg-blue-50 text-blue-700 border border-blue-200',
}

function FilerBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${TAX_FILER_STATUS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ─── Rating Score Bar ──────────────────────────────────
function ScoreBar({ score }) {
  const pct = Math.min(Math.max(score || 0, 0), 100)
  const color = pct >= 90 ? 'bg-teal-500' : pct >= 80 ? 'bg-blue-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[50px]">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-bold text-slate-700">{score}%</span>
    </div>
  )
}

// ─── Main Vendors Component ────────────────────────────
export default function Vendors() {
  const [vendors, setVendors] = useState(initialVendors)
  const [stats, setStats] = useState(initialStats)
  const [loading, setLoading] = useState(false)

  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [profileTab, setProfileTab] = useState('overview')

  // Create Form
  const [createForm, setCreateForm] = useState({
    name: '', category: 'Raw Materials', contact_person: '', email: '', phone: '',
    location: '', website: '', established_year: new Date().getFullYear(), status: 'Active',
    ntn: '', strn: '', tax_filer_status: 'Active Filer', tax_wht_pct: '3',
    cert: 'ISO 9001', cert_expiry: '', bank_name: '', account_title: '',
    account_no: '', iban: '', swift_code: '', rating: '90',
    on_time_rate: '95', quality_compliance: '95',
  })
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Edit Form
  const [editForm, setEditForm] = useState({
    id: '', name: '', category: '', contact_person: '', email: '', phone: '',
    location: '', website: '', established_year: '', status: 'Active',
    ntn: '', strn: '', tax_filer_status: 'Active Filer', tax_wht_pct: '3',
    cert: '', cert_expiry: '', bank_name: '', account_title: '',
    account_no: '', iban: '', swift_code: '', rating: '90',
    on_time_rate: '90', quality_compliance: '90',
  })
  const [submittingEdit, setSubmittingEdit] = useState(false)

  const categoriesList = ['Raw Materials', 'IT & Electronics', 'Logistics', 'Packaging', 'Office Supplies', 'Facilities', 'General']

  // ─── Fetching ────────────────────────────────────────
  const fetchAll = async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategory !== 'All') params.append('category', filterCategory)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)

      const [vRes, sRes] = await Promise.all([
        fetch(`/api/vendors?${params}`),
        fetch('/api/vendors/stats'),
      ])
      if (vRes.ok) {
        const vJson = await vRes.json()
        if (vJson.success && vJson.data && vJson.data.length > 0) setVendors(vJson.data)
      }
      if (sRes.ok) {
        const sJson = await sRes.json()
        if (sJson.success && sJson.data) setStats(sJson.data)
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
      const res = await fetch(`/api/vendors/${id}`)
      const json = await res.json()
      if (json.success) setSelectedVendor(json.data)
    } catch (err) {} finally {
      setDetailLoading(false)
    }
  }

  const refreshDetail = async (id) => {
    const res = await fetch(`/api/vendors/${id}`)
    const json = await res.json()
    if (json.success) setSelectedVendor(json.data)
  }

  useEffect(() => { fetchAll() }, [filterCategory, filterStatus, searchTerm])

  // ─── Create Vendor ───────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!createForm.name || !createForm.category) {
      alert('Company Name and Category are required.')
      return
    }
    setSubmittingCreate(true)
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setCreateForm({
          name: '', category: 'Raw Materials', contact_person: '', email: '', phone: '',
          location: '', website: '', established_year: new Date().getFullYear(), status: 'Active',
          ntn: '', strn: '', tax_filer_status: 'Active Filer', tax_wht_pct: '3',
          cert: 'ISO 9001', cert_expiry: '', bank_name: '', account_title: '',
          account_no: '', iban: '', swift_code: '', rating: '90',
          on_time_rate: '95', quality_compliance: '95',
        })
        fetchAll()
      } else alert(json.error || 'Failed to register vendor')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingCreate(false)
    }
  }

  // ─── Open Edit Modal ─────────────────────────────────
  const openEditModal = (vendor) => {
    setEditForm({
      id: vendor.id,
      name: vendor.name || '',
      category: vendor.category || 'General',
      contact_person: vendor.contact_person || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      location: vendor.location || '',
      website: vendor.website || '',
      established_year: vendor.established_year || '',
      status: vendor.status || 'Active',
      ntn: vendor.ntn || '',
      strn: vendor.strn || '',
      tax_filer_status: vendor.tax_filer_status || 'Active Filer',
      tax_wht_pct: vendor.tax_wht_pct !== undefined ? vendor.tax_wht_pct : '3',
      cert: vendor.cert || '—',
      cert_expiry: vendor.cert_expiry || '',
      bank_name: vendor.bank_name || '',
      account_title: vendor.account_title || '',
      account_no: vendor.account_no || '',
      iban: vendor.iban || '',
      swift_code: vendor.swift_code || '',
      rating: vendor.rating || '85',
      on_time_rate: vendor.on_time_rate || '90',
      quality_compliance: vendor.quality_compliance || '90',
    })
    setShowEditModal(true)
  }

  // ─── Save Edit Changes ───────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.id || !editForm.name) {
      alert('Company Name is required.')
      return
    }
    setSubmittingEdit(true)
    try {
      const res = await fetch(`/api/vendors/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchAll()
        if (selectedVendor && selectedVendor.id === editForm.id) {
          await refreshDetail(editForm.id)
        }
      } else alert(json.error || 'Failed to update vendor profile')
    } catch (err) {
      alert('Error connecting to server.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ─── Delete Vendor ───────────────────────────────────
  const handleDeleteVendor = async (id) => {
    if (!window.confirm(`Delete vendor profile ${id}?`)) return
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        if (selectedVendor?.id === id) setSelectedVendor(null)
        fetchAll()
      } else alert(json.error || 'Failed to delete vendor')
    } catch (err) {
      alert('Error deleting vendor.')
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Vendor Management"
        subtitle="Manage vendor profiles, company details, tax registration, certifications, bank accounts, and performance ratings"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* ── Control Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor name, NTN or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register New Vendor
          </button>
        </div>

        {/* ── Stats Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Vendors', value: stats.total_vendors, icon: <Building2 className="w-5 h-5 text-slate-400" /> },
            { label: 'Active Filers', value: stats.active_filers, icon: <ShieldCheck className="w-5 h-5 text-teal-500" /> },
            { label: 'ISO Certified', value: stats.certified_count, icon: <Award className="w-5 h-5 text-blue-500" /> },
            { label: 'Avg Rating Score', value: `${stats.average_rating || 0}%`, icon: <Star className="w-5 h-5 text-amber-500" /> },
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

        {/* ── Vendors Table ── */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading vendors directory...</div>
          ) : vendors.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No vendors found. Register one to populate the directory.</div>
          ) : (
            <Table columns={['Vendor ID', 'Company Name', 'Category', 'NTN / STRN', 'Filer Status', 'Certifications', 'Rating', 'Status', 'Actions']}>
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">{v.id}</Td>
                  <Td className="font-medium text-slate-900 max-w-[200px] truncate">
                    <div>{v.name}</div>
                    {v.contact_person && <div className="text-[11px] text-slate-400 font-normal">{v.contact_person}</div>}
                  </Td>
                  <Td className="text-slate-600 text-xs">{v.category}</Td>
                  <Td mono className="text-xs text-slate-700">{v.ntn || '—'}</Td>
                  <Td><FilerBadge status={v.tax_filer_status || 'Active Filer'} /></Td>
                  <Td>
                    {v.cert && v.cert !== '—' ? (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {v.cert}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </Td>
                  <Td><ScoreBar score={v.rating} /></Td>
                  <Td><StatusBadge status={v.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedVendor(null); setProfileTab('overview'); fetchDetail(v.id) }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Profile <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(v)}
                        title="Edit Vendor Profile"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(v.id)}
                        title="Delete Vendor Profile"
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
          MODAL 1: Register New Vendor
      ════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Register New Vendor Profile</h3>
                <p className="text-xs text-slate-500">Enter company details, tax registration, bank accounts, and certifications</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Section 1: Company Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Company Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="e.g. Crescent Logistics Ltd" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <select value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person</label>
                    <input type="text" placeholder="e.g. Tariq Khan" value={createForm.contact_person} onChange={e => setCreateForm({ ...createForm, contact_person: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" placeholder="sales@company.com" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="text" placeholder="+92 42 XXXXXXX" value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location / Office Address</label>
                    <input type="text" placeholder="Plot, Street, City" value={createForm.location} onChange={e => setCreateForm({ ...createForm, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Website URL</label>
                    <input type="text" placeholder="https://company.com" value={createForm.website} onChange={e => setCreateForm({ ...createForm, website: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Section 2: Tax Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Tax & Compliance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">NTN Number</label>
                    <input type="text" placeholder="NTN-XXXX-X" value={createForm.ntn} onChange={e => setCreateForm({ ...createForm, ntn: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">STRN Number</label>
                    <input type="text" placeholder="STRN-XXXX-X" value={createForm.strn} onChange={e => setCreateForm({ ...createForm, strn: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tax Filer Status</label>
                    <select value={createForm.tax_filer_status} onChange={e => setCreateForm({ ...createForm, tax_filer_status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="Active Filer">Active Filer</option>
                      <option value="Non-Filer">Non-Filer</option>
                      <option value="Exempt">Exempt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">WHT Rate (%)</label>
                    <input type="number" step="0.5" placeholder="3.0" value={createForm.tax_wht_pct} onChange={e => setCreateForm({ ...createForm, tax_wht_pct: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Section 3: Bank Accounts */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Bank Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name</label>
                    <input type="text" placeholder="e.g. Meezan Bank Ltd" value={createForm.bank_name} onChange={e => setCreateForm({ ...createForm, bank_name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Title</label>
                    <input type="text" placeholder="e.g. Crescent Logistics Company" value={createForm.account_title} onChange={e => setCreateForm({ ...createForm, account_title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Number</label>
                    <input type="text" placeholder="Account No" value={createForm.account_no} onChange={e => setCreateForm({ ...createForm, account_no: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">IBAN Number</label>
                    <input type="text" placeholder="PK36MEZN..." value={createForm.iban} onChange={e => setCreateForm({ ...createForm, iban: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Swift / Branch Code</label>
                    <input type="text" placeholder="MEZNPKKA" value={createForm.swift_code} onChange={e => setCreateForm({ ...createForm, swift_code: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Section 4: Certifications & Performance */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Certifications & Rating</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Primary Certification</label>
                    <select value={createForm.cert} onChange={e => setCreateForm({ ...createForm, cert: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="ISO 9001">ISO 9001 (Quality)</option>
                      <option value="ISO 27001">ISO 27001 (Security)</option>
                      <option value="ISO 14001">ISO 14001 (Environmental)</option>
                      <option value="HSE Compliant">HSE Compliant</option>
                      <option value="—">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Cert Expiry Date</label>
                    <input type="date" value={createForm.cert_expiry} onChange={e => setCreateForm({ ...createForm, cert_expiry: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Initial Rating (0-100)</label>
                    <input type="number" min="0" max="100" value={createForm.rating} onChange={e => setCreateForm({ ...createForm, rating: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingCreate} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {submittingCreate ? 'Registering...' : 'Register Vendor Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 2: Vendor Profile & Financial Detail Drawer
      ════════════════════════════════════════════════ */}
      {(selectedVendor !== null || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">{selectedVendor?.id || '...'}</span>
                  {selectedVendor && <StatusBadge status={selectedVendor.status} />}
                  {selectedVendor && <FilerBadge status={selectedVendor.tax_filer_status || 'Active Filer'} />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{selectedVendor?.name || 'Loading...'}</h3>
                {selectedVendor && <p className="text-xs text-slate-500 mt-0.5">{selectedVendor.category} · {selectedVendor.location}</p>}
              </div>

              <div className="flex items-center gap-2">
                {selectedVendor && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedVendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(selectedVendor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Tab Navigation */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 shrink-0 bg-white">
              {[
                { id: 'overview', label: 'Company Info', icon: <Building2 className="w-3.5 h-3.5" /> },
                { id: 'tax', label: 'Tax & Compliance', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { id: 'banking', label: 'Bank Account', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'performance', label: 'Ratings & Metrics', icon: <Star className="w-3.5 h-3.5" /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${profileTab === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Profile Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {detailLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">Loading vendor details...</div>
              ) : selectedVendor ? (
                <>
                  {/* TAB 1: Company Info */}
                  {profileTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Person</span>
                          <span className="text-xs font-bold text-slate-900">{selectedVendor.contact_person || '—'}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                          <span className="text-xs font-bold text-slate-900">{selectedVendor.email || '—'}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone Number</span>
                          <span className="text-xs font-bold text-slate-900">{selectedVendor.phone || '—'}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Established Year</span>
                          <span className="text-xs font-bold text-slate-900">{selectedVendor.established_year || '—'}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1">
                        <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          Office & Warehouse Address
                        </div>
                        <p className="text-xs text-blue-800 leading-relaxed">{selectedVendor.location || 'Not specified'}</p>
                      </div>

                      {selectedVendor.website && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span>Website: </span>
                          <a href={selectedVendor.website} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
                            {selectedVendor.website} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Tax & Compliance */}
                  {profileTab === 'tax' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">NTN Number</span>
                          <span className="text-xs font-mono font-bold text-slate-900">{selectedVendor.ntn || '—'}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">STRN Number</span>
                          <span className="text-xs font-mono font-bold text-slate-900">{selectedVendor.strn || '—'}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tax Filer Status</span>
                          <div className="mt-1"><FilerBadge status={selectedVendor.tax_filer_status || 'Active Filer'} /></div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">WHT Rate</span>
                          <span className="text-xs font-bold text-slate-900">{selectedVendor.tax_wht_pct || 3}%</span>
                        </div>
                      </div>

                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                        <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          Primary Certification Status
                        </div>
                        <div className="text-sm font-bold text-teal-800 mt-1">
                          {selectedVendor.cert && selectedVendor.cert !== '—' ? selectedVendor.cert : 'No formal ISO certification on file'}
                        </div>
                        {selectedVendor.cert_expiry && (
                          <div className="text-xs text-teal-700 mt-0.5">Valid until: {selectedVendor.cert_expiry}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Bank Account */}
                  {profileTab === 'banking' && (
                    <div className="space-y-4">
                      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-teal-400" />
                            <span className="text-sm font-bold text-white">{selectedVendor.bank_name || 'Bank Details'}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">SWIFT: {selectedVendor.swift_code || '—'}</span>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-semibold text-slate-400">Account Title</div>
                          <div className="text-sm font-semibold text-white mt-0.5">{selectedVendor.account_title || '—'}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <div className="text-[10px] uppercase font-semibold text-slate-400">Account Number</div>
                            <div className="text-xs font-mono text-slate-200 mt-0.5">{selectedVendor.account_no || '—'}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-semibold text-slate-400">IBAN</div>
                            <div className="text-xs font-mono text-teal-300 mt-0.5">{selectedVendor.iban || '—'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Performance & Ratings */}
                  {profileTab === 'performance' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                          <div className="text-xs font-semibold text-slate-500 uppercase">Overall Rating</div>
                          <div className="text-2xl font-bold text-slate-900 mt-1">{selectedVendor.rating || 85}%</div>
                          <div className="mt-2"><ScoreBar score={selectedVendor.rating} /></div>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                          <div className="text-xs font-semibold text-slate-500 uppercase">On-Time Delivery Rate</div>
                          <div className="text-2xl font-bold text-teal-600 mt-1">{selectedVendor.on_time_rate || 90}%</div>
                          <p className="text-[11px] text-slate-500 mt-1">Based on PO lead time accuracy</p>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                          <div className="text-xs font-semibold text-slate-500 uppercase">Quality Compliance</div>
                          <div className="text-2xl font-bold text-blue-600 mt-1">{selectedVendor.quality_compliance || 90}%</div>
                          <p className="text-[11px] text-slate-500 mt-1">Inspection pass rate</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">Total Fulfilled Orders</div>
                            <div className="text-xs text-slate-500">Historical contracts completed successfully</div>
                          </div>
                        </div>
                        <span className="text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                          {selectedVendor.completed_orders_count || 0} Orders
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">Failed to load profile.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          MODAL 3: Edit Vendor Profile
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
                  <h3 className="text-lg font-semibold text-slate-900">Edit Vendor Profile ({editForm.id})</h3>
                  <p className="text-xs text-slate-500">Update company info, tax data, bank details, and ratings</p>
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
              {/* Company Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                    <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person</label>
                    <input type="text" value={editForm.contact_person} onChange={e => setEditForm({ ...editForm, contact_person: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location / Address</label>
                    <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      {['Active', 'Under Review', 'Inactive', 'Blacklisted'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax & Banking */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tax & Banking</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">NTN Number</label>
                    <input type="text" value={editForm.ntn} onChange={e => setEditForm({ ...editForm, ntn: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">STRN Number</label>
                    <input type="text" value={editForm.strn} onChange={e => setEditForm({ ...editForm, strn: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Filer Status</label>
                    <select value={editForm.tax_filer_status} onChange={e => setEditForm({ ...editForm, tax_filer_status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="Active Filer">Active Filer</option>
                      <option value="Non-Filer">Non-Filer</option>
                      <option value="Exempt">Exempt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name</label>
                    <input type="text" value={editForm.bank_name} onChange={e => setEditForm({ ...editForm, bank_name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">IBAN Number</label>
                    <input type="text" value={editForm.iban} onChange={e => setEditForm({ ...editForm, iban: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Certs & Performance */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Certifications & Rating</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Certification</label>
                    <select value={editForm.cert} onChange={e => setEditForm({ ...editForm, cert: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="ISO 9001">ISO 9001</option>
                      <option value="ISO 27001">ISO 27001</option>
                      <option value="ISO 14001">ISO 14001</option>
                      <option value="HSE Compliant">HSE Compliant</option>
                      <option value="—">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rating Score (0-100)</label>
                    <input type="number" min="0" max="100" value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">On-Time Rate (%)</label>
                    <input type="number" min="0" max="100" value={editForm.on_time_rate} onChange={e => setEditForm({ ...editForm, on_time_rate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Prominent Save Changes Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submittingEdit} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50">
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
