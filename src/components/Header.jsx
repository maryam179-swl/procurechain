import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, CheckCheck, Trash2, X, FileText,
  Building2, ShoppingCart, FileCheck, AlertTriangle, Info, CheckCircle2
} from 'lucide-react'
import { requisitions, purchaseOrders, vendors, contracts } from '../data'

const initialNotifications = [
  {
    id: 1,
    title: 'Pending Approval Required',
    message: 'REQ-4471 (Ergonomic Office Chairs - 40 units) requires your approval.',
    time: '10 mins ago',
    unread: true,
    type: 'warning',
    link: '/approvals',
  },
  {
    id: 2,
    title: 'Contract Expiring Soon',
    message: 'CTR-2024-118 with Al-Noor Steel Co. expires in 22 days.',
    time: '1 hour ago',
    unread: true,
    type: 'alert',
    link: '/contracts',
  },
  {
    id: 3,
    title: 'Purchase Order Delivered',
    message: 'PO-2026-08201 for Al-Noor Steel Co. marked as Delivered.',
    time: '3 hours ago',
    unread: true,
    type: 'success',
    link: '/orders',
  },
  {
    id: 4,
    title: 'Vendor Compliance Flagged',
    message: 'Metro Packaging Ltd. has a duplicate NTN record flagged.',
    time: '1 day ago',
    unread: false,
    type: 'info',
    link: '/vendors',
  },
]

export default function Header({ title, subtitle }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  const notifRef = useRef(null)
  const searchRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setShowNotifications(false)
        setShowSearchResults(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const handleNotifClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n))
    )
    setShowNotifications(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  // Search Results calculation
  const query = searchQuery.trim().toLowerCase()

  const filteredReqs = query
    ? requisitions.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.item.toLowerCase().includes(query) ||
          r.requestedBy.toLowerCase().includes(query) ||
          r.dept.toLowerCase().includes(query)
      )
    : []

  const filteredOrders = query
    ? purchaseOrders.filter(
        (po) =>
          po.id.toLowerCase().includes(query) ||
          po.vendor.toLowerCase().includes(query) ||
          po.status.toLowerCase().includes(query)
      )
    : []

  const filteredVendors = query
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.category.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query)
      )
    : []

  const filteredContracts = query
    ? contracts.filter(
        (c) =>
          c.id.toLowerCase().includes(query) ||
          c.vendor.toLowerCase().includes(query) ||
          c.status.toLowerCase().includes(query)
      )
    : []

  const totalResultsCount =
    filteredReqs.length +
    filteredOrders.length +
    filteredVendors.length +
    filteredContracts.length

  const handleSelectResult = (path) => {
    setSearchQuery('')
    setShowSearchResults(false)
    navigate(path)
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-md px-3 py-2 w-72 focus-within:ring-2 focus-within:ring-gold-500/50 focus-within:border-gold-500 transition-all">
              <Search className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search PO, vendor, requisition..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(true)
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchResults(true)
                }}
                className="bg-transparent outline-none text-sm text-ink-900 placeholder:text-slate-400 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() !== '' && (
              <div className="absolute right-0 mt-2 w-96 max-h-[420px] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 text-xs font-semibold uppercase text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Search Results</span>
                  <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                    {totalResultsCount} found
                  </span>
                </div>

                {totalResultsCount === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No matching records found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {/* Requisitions */}
                    {filteredReqs.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                          Requisitions ({filteredReqs.length})
                        </div>
                        {filteredReqs.slice(0, 3).map((req) => (
                          <button
                            key={req.id}
                            onClick={() => handleSelectResult('/requisitions')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                                {req.id} — {req.item}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {req.dept} • Requested by {req.requestedBy}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {req.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Purchase Orders */}
                    {filteredOrders.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ShoppingCart className="w-3.5 h-3.5 text-indigo-500" />
                          Purchase Orders ({filteredOrders.length})
                        </div>
                        {filteredOrders.slice(0, 3).map((po) => (
                          <button
                            key={po.id}
                            onClick={() => handleSelectResult('/orders')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                                {po.id} — {po.vendor}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Issued {po.date} • {po.terms}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {po.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Vendors */}
                    {filteredVendors.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-500" />
                          Vendors ({filteredVendors.length})
                        </div>
                        {filteredVendors.slice(0, 3).map((v) => (
                          <button
                            key={v.id}
                            onClick={() => handleSelectResult('/vendors')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-teal-600 truncate">
                                {v.name} ({v.id})
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {v.category} • {v.location}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {v.cert}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Contracts */}
                    {filteredContracts.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-rose-500" />
                          Contracts ({filteredContracts.length})
                        </div>
                        {filteredContracts.slice(0, 3).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleSelectResult('/contracts')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-rose-600 truncate">
                                {c.id} — {c.vendor}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Expires: {c.expiry}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {c.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notification Bell Button & Popover */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className={`relative h-9 w-9 flex items-center justify-center rounded-md border transition-all ${
                showNotifications
                  ? 'border-gold-500 bg-slate-100 text-gold-600 ring-2 ring-gold-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gold-400" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-gold-500/20 text-gold-300 text-xs px-2 py-0.5 rounded-full border border-gold-500/30 font-mono font-medium">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        title="Mark all as read"
                        className="text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        title="Clear all notifications"
                        className="text-slate-400 hover:text-rose-300 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                      All caught up! No notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`p-3.5 transition-colors cursor-pointer flex gap-3 hover:bg-slate-50 ${
                          n.unread ? 'bg-amber-50/40' : 'bg-white'
                        }`}
                      >
                        {getNotifIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                n.unread ? 'text-slate-900' : 'text-slate-600'
                              }`}
                            >
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-snug">
                            {n.message}
                          </p>
                        </div>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 self-center" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false)
                        navigate('/approvals')
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-gold-600 transition-colors"
                    >
                      View Approval Queue →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
