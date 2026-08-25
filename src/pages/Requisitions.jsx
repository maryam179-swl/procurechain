import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Card, StatusBadge, PriorityBadge, Table, Td } from '../components/ui'
import { requisitions as initialRequisitions } from '../data'
import {
  Plus,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  Paperclip,
  X,
  Building2,
  Tag,
  Pencil,
  Trash2,
} from 'lucide-react'

export default function Requisitions() {
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReq, setSelectedReq] = useState(null) // For details & approval tracking modal
  const [reqDetails, setReqDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Form State (Create & Edit)
  const [formData, setFormData] = useState({
    id: '',
    item: '',
    dept: '',
    priority: 'Normal',
    requestedBy: '',
    amount: '',
    notes: '',
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [statusComment, setStatusComment] = useState('')
  const [uploadingDoc, setUploadingDoc] = useState(false)

  // Fetch Departments & Requisitions
  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments')
      const json = await res.json()
      if (json.success) {
        setDepartments(json.data)
        if (json.data.length > 0 && !formData.dept) {
          setFormData((prev) => ({ ...prev, dept: json.data[0].name }))
        }
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
    }
  }

  const fetchRequisitions = async () => {
    try {
      const params = new URLSearchParams()
      if (filterDept !== 'All') params.append('dept', filterDept)
      if (filterStatus !== 'All') params.append('status', filterStatus)
      if (filterPriority !== 'All') params.append('priority', filterPriority)
      if (searchTerm) params.append('search', searchTerm)

      const res = await fetch(`/api/requisitions?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data && json.data.length > 0) {
          setRequisitions(json.data)
        }
      }
    } catch (err) {
      console.error('Error fetching requisitions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    fetchRequisitions()
  }, [filterDept, filterStatus, filterPriority, searchTerm])

  // Fetch Single Requisition Details (documents & history timeline)
  const openDetailsModal = async (reqId) => {
    setSelectedReq(reqId)
    setLoadingDetails(true)
    try {
      const res = await fetch(`/api/requisitions/${reqId}`)
      const json = await res.json()
      if (json.success) {
        setReqDetails(json.data)
      }
    } catch (err) {
      console.error('Error fetching details:', err)
    } finally {
      setLoadingDetails(false)
    }
  }

  // Silent refresh for attached documents / status updates without closing or showing loading screen
  const refreshDetailsSilent = async (reqId) => {
    try {
      const res = await fetch(`/api/requisitions/${reqId}`)
      const json = await res.json()
      if (json.success) {
        setReqDetails(json.data)
      }
    } catch (err) {
      console.error('Error refreshing details:', err)
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (req) => {
    setFormData({
      id: req.id,
      item: req.item || '',
      dept: req.dept || (departments[0]?.name || ''),
      priority: req.priority || 'Normal',
      requestedBy: req.requestedBy || '',
      amount: req.amount || '',
      notes: req.notes || '',
    })
    setShowEditModal(true)
  }

  // Handle Edit Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!formData.item || !formData.dept || !formData.requestedBy) {
      alert('Please fill out all required fields (Item, Department, Requested By).')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/requisitions/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: formData.item,
          dept: formData.dept,
          priority: formData.priority,
          requestedBy: formData.requestedBy,
          amount: formData.amount,
          notes: formData.notes,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        if (selectedReq === formData.id) {
          refreshDetailsSilent(formData.id)
        }
        fetchRequisitions()
      } else {
        alert(json.error || 'Failed to update requisition')
      }
    } catch (err) {
      console.error('Error updating requisition:', err)
      alert('Error connecting to backend server.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Requisition
  const handleDeleteReq = async (reqId) => {
    if (!window.confirm(`Are you sure you want to delete purchase requisition ${reqId}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/requisitions/${reqId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        if (selectedReq === reqId) {
          setSelectedReq(null)
          setReqDetails(null)
        }
        fetchRequisitions()
      } else {
        alert(json.error || 'Failed to delete requisition')
      }
    } catch (err) {
      console.error('Error deleting requisition:', err)
    }
  }

  // Handle Delete Document
  const handleDeleteDocument = async (docId) => {
    if (!selectedReq) return
    try {
      const res = await fetch(`/api/requisitions/${selectedReq}/documents/${docId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        refreshDetailsSilent(selectedReq)
      } else {
        alert(json.error || 'Failed to delete document')
      }
    } catch (err) {
      console.error('Error deleting document:', err)
    }
  }

  // Handle Form Submission (Create Purchase Request)
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formData.item || !formData.dept || !formData.requestedBy) {
      alert('Please fill out all required fields (Item, Department, Requested By).')
      return
    }

    setSubmitting(true)
    try {
      const bodyData = new FormData()
      bodyData.append('item', formData.item)
      bodyData.append('dept', formData.dept)
      bodyData.append('priority', formData.priority)
      bodyData.append('requestedBy', formData.requestedBy)
      bodyData.append('amount', formData.amount)
      bodyData.append('notes', formData.notes)

      for (let i = 0; i < selectedFiles.length; i++) {
        bodyData.append('documents', selectedFiles[i])
      }

      const res = await fetch('/api/requisitions', {
        method: 'POST',
        body: bodyData,
      })

      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setFormData({
          id: '',
          item: '',
          dept: departments[0]?.name || '',
          priority: 'Normal',
          requestedBy: '',
          amount: '',
          notes: '',
        })
        setSelectedFiles([])
        fetchRequisitions()
      } else {
        alert(json.error || 'Failed to create requisition')
      }
    } catch (err) {
      console.error('Error creating requisition:', err)
      alert('Error connecting to backend server.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Status Update (Track Approval Status)
  const handleStatusChange = async (newStatus) => {
    if (!selectedReq) return
    setStatusUpdating(true)
    try {
      const res = await fetch(`/api/requisitions/${selectedReq}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          changedBy: 'Procurement Manager',
          comment: statusComment || `Status updated to ${newStatus}`,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setStatusComment('')
        refreshDetailsSilent(selectedReq)
        fetchRequisitions()
      } else {
        alert(json.error || 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setStatusUpdating(false)
    }
  }

  // Handle direct file upload to existing requisition detail modal WITHOUT closing or resetting screen
  const handleFileUploadToExisting = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file || !selectedReq) return

    setUploadingDoc(true)
    const uploadFormData = new FormData()
    uploadFormData.append('document', file)

    try {
      const res = await fetch(`/api/requisitions/${selectedReq}/documents`, {
        method: 'POST',
        body: uploadFormData,
      })
      const json = await res.json()
      if (json.success) {
        // Silently update document list without closing modal or showing loading state
        await refreshDetailsSilent(selectedReq)
      } else {
        alert(json.error || 'File upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploadingDoc(false)
      e.target.value = '' // Reset input
    }
  }

  return (
    <div className="pb-12">
      <Header
        title="Purchase Requisitions"
        subtitle="Manage employee purchase requests, attached documents, and approval tracking"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search REQ ID, Item, Employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setFormData({
                id: '',
                item: '',
                dept: departments[0]?.name || '',
                priority: 'Normal',
                requestedBy: '',
                amount: '',
                notes: '',
              })
              setShowCreateModal(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Purchase Request
          </button>
        </div>

        {/* Requisitions Table */}
        <Card>
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading purchase requisitions...</div>
          ) : requisitions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No requisitions found matching current filters.</div>
          ) : (
            <Table columns={['Req ID', 'Item / Description', 'Department', 'Priority', 'Est. Amount', 'Status', 'Requested By', 'Actions']}>
              {requisitions.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <Td mono className="font-semibold text-slate-900">
                    {r.id}
                  </Td>
                  <Td className="max-w-[240px] truncate font-medium text-slate-800">{r.item}</Td>
                  <Td className="text-slate-600 font-normal">{r.dept}</Td>
                  <Td>
                    <PriorityBadge priority={r.priority} />
                  </Td>
                  <Td className="font-mono text-slate-700">
                    {r.amount ? `$${Number(r.amount).toLocaleString()}` : '—'}
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td className="text-slate-600 font-normal">{r.requestedBy}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openDetailsModal(r.id)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Track & Details →
                      </button>

                      <button
                        onClick={() => handleOpenEdit(r)}
                        title="Edit Requisition"
                        className="text-slate-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteReq(r.id)}
                        title="Delete Requisition"
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

      {/* ======================================================== */}
      {/* MODAL 1: Create Purchase Request                         */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] my-auto relative">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">New Purchase Requisition</h3>
                <p className="text-xs text-slate-500">Submit a new item purchase request for department approval</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                title="Close Modal"
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all border border-slate-200 cursor-pointer shadow-xs"
              >
                <X className="w-5 h-5 font-bold" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Item Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Chairs (40 units) or Dell Latitude Laptops"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Set Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Requested By (Employee) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sana Malik"
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Justification / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Provide business justification or specifications..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Upload Supporting Documents</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 text-center transition-colors bg-slate-50/50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to select files or drag & drop</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Attach vendor quotes, specification sheets, receipts (PDF, PNG, JPG, DOCX)</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    className="mt-2 text-xs text-slate-500 block w-full file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-900 file:text-white cursor-pointer"
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-slate-600">Selected Files ({selectedFiles.length}):</p>
                    {selectedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{(f.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Edit Purchase Request                           */}
      {/* ======================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] my-auto relative">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit Purchase Requisition ({formData.id})</h3>
                <p className="text-xs text-slate-500">Update request details, priority, or department</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                title="Close Modal"
                className="bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white p-2 rounded-full transition-all border border-slate-200 cursor-pointer shadow-xs"
              >
                <X className="w-5 h-5 font-bold" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Item Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Requested By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Justification / Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Track Approval Status & View Attached Documents  */}
      {/* ======================================================== */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] my-auto relative overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">{selectedReq}</span>
                  {reqDetails && <StatusBadge status={reqDetails.status} />}
                  {reqDetails && <PriorityBadge priority={reqDetails.priority} />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{reqDetails?.item || 'Loading...'}</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Button */}
                {reqDetails && (
                  <button
                    onClick={() => handleOpenEdit(reqDetails)}
                    title="Edit Requisition"
                    className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}

                {/* Delete Button */}
                {reqDetails && (
                  <button
                    onClick={() => handleDeleteReq(reqDetails.id)}
                    title="Delete Requisition"
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2.5 py-1.5 rounded-lg transition-colors border border-red-200 hover:border-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}

                {/* Prominent Cross (Close) Button */}
                <button
                  onClick={() => setSelectedReq(null)}
                  title="Close Modal"
                  className="bg-slate-100 hover:bg-red-500 text-slate-700 hover:text-white p-2 rounded-full transition-all border border-slate-200 cursor-pointer shadow-xs ml-1"
                >
                  <X className="w-5 h-5 font-bold" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingDetails ? (
                <div className="py-12 text-center text-slate-400 text-sm">Loading details & status history...</div>
              ) : (
                reqDetails && (
                  <div className="space-y-6">
                    {/* Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide font-medium text-slate-400">Department</div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5">{reqDetails.dept}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide font-medium text-slate-400">Requested By</div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5">{reqDetails.requestedBy}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide font-medium text-slate-400">Est. Amount</div>
                        <div className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                          {reqDetails.amount ? `$${Number(reqDetails.amount).toLocaleString()}` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide font-medium text-slate-400">Created Date</div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5">
                          {new Date(reqDetails.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {reqDetails.notes && (
                      <div className="text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-slate-700">
                        <span className="font-semibold text-slate-900">Notes: </span>
                        {reqDetails.notes}
                      </div>
                    )}

                    {/* Section 1: Attached Supporting Documents */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Paperclip className="w-4 h-4 text-slate-400" />
                          Supporting Documents ({reqDetails.documents?.length || 0})
                        </h4>
                        <label className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingDoc ? 'Uploading...' : 'Attach Document'}
                          <input type="file" onChange={handleFileUploadToExisting} disabled={uploadingDoc} className="hidden" />
                        </label>
                      </div>

                      {reqDetails.documents?.length === 0 ? (
                        <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg text-center">
                          No supporting documents attached yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {reqDetails.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-xs font-medium text-slate-700 truncate">{doc.original_name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({(doc.size_bytes / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/uploads/${doc.stored_name}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={doc.original_name}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 bg-white border border-slate-200 rounded hover:bg-blue-50"
                                >
                                  <Download className="w-3 h-3" />
                                  View / Download
                                </a>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  title="Remove document"
                                  className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 2: Track Approval Status Timeline */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Approval Status Tracking History
                      </h4>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {reqDetails.history?.map((item, idx) => (
                          <div key={item.id || idx} className="relative group">
                            <div
                              className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                                item.new_status === 'Approved'
                                  ? 'border-teal-500 text-teal-500'
                                  : item.new_status === 'Rejected'
                                  ? 'border-red-500 text-red-500'
                                  : 'border-blue-500 text-blue-500'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-900">{item.new_status}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(item.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1">{item.comment}</p>
                              <div className="text-[10px] text-slate-400 mt-1">Updated by: {item.changed_by}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Section 3: Action Bar for Approvers (Fixed at Bottom) */}
            {reqDetails && (
              <div className="border-t border-slate-100 p-4 bg-slate-50/90 backdrop-blur-xs shrink-0 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Manager Approval Controls
                </label>

                <input
                  type="text"
                  placeholder="Add approval comment or reason..."
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={statusUpdating || reqDetails.status === 'Approved'}
                    onClick={() => handleStatusChange('Approved')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Request
                  </button>

                  <button
                    disabled={statusUpdating || reqDetails.status === 'Under Review'}
                    onClick={() => handleStatusChange('Under Review')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Set Under Review
                  </button>

                  <button
                    disabled={statusUpdating || reqDetails.status === 'Rejected'}
                    onClick={() => handleStatusChange('Rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
