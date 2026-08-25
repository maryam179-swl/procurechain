import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Gavel, ShoppingCart, CheckSquare,
  Building2, TrendingUp, FileCheck, Coins, Package, LogOut,
  ChevronUp, Check, UserCheck
} from 'lucide-react'
import { navSections } from '../data'

const navIconMap = {
  '/': <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-400" strokeWidth={2.2} />,
  '/requisitions': <FileText className="w-4 h-4 shrink-0 text-blue-400" strokeWidth={2.2} />,
  '/rfq': <Gavel className="w-4 h-4 shrink-0 text-purple-400" strokeWidth={2.2} />,
  '/orders': <ShoppingCart className="w-4 h-4 shrink-0 text-indigo-400" strokeWidth={2.2} />,
  '/approvals': <CheckSquare className="w-4 h-4 shrink-0 text-emerald-400" strokeWidth={2.2} />,
  '/vendors': <Building2 className="w-4 h-4 shrink-0 text-teal-400" strokeWidth={2.2} />,
  '/vendor-performance': <TrendingUp className="w-4 h-4 shrink-0 text-cyan-400" strokeWidth={2.2} />,
  '/contracts': <FileCheck className="w-4 h-4 shrink-0 text-rose-400" strokeWidth={2.2} />,
  '/budget': <Coins className="w-4 h-4 shrink-0 text-gold-400" strokeWidth={2.2} />,
  '/inventory': <Package className="w-4 h-4 shrink-0 text-amber-400" strokeWidth={2.2} />,
}

const availablePersonas = [
  { name: 'Admin', role: 'Admin', email: 'admin@procurechain.com' },
  { name: 'Procurement Specialist', role: 'Procurement Specialist', email: 'procurement@procurechain.com' },
  { name: 'Finance Director', role: 'Finance Director', email: 'finance@procurechain.com' },
  { name: 'Department Manager', role: 'Department Manager', email: 'dept.manager@procurechain.com' },
  { name: 'CEO', role: 'CEO', email: 'ceo@procurechain.com' },
  { name: 'Board Member', role: 'Board Member', email: 'board@procurechain.com' },
  { name: 'Vendor Portal User', role: 'Vendor Portal User', email: 'vendor@alnoorsteel.com' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPersonaMenu, setShowPersonaMenu] = useState(false)
  const menuRef = useRef(null)

  const loadUserFromStorage = () => {
    try {
      const saved = localStorage.getItem('procurechain_user')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && (parsed.name || parsed.role)) return parsed
      }
    } catch (e) {}
    return { name: 'Admin', role: 'Admin', email: 'admin@procurechain.com' }
  }

  const [currentUser, setCurrentUser] = useState(loadUserFromStorage)

  // Sync user profile on route changes or custom storage updates
  useEffect(() => {
    setCurrentUser(loadUserFromStorage())
  }, [location.pathname])

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPersonaMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitials = (name) => {
    if (!name) return 'TA'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleSwitchUser = (persona) => {
    const updated = { name: persona.name, role: persona.role, email: persona.email }
    localStorage.setItem('procurechain_user', JSON.stringify(updated))
    setCurrentUser(updated)
    setShowPersonaMenu(false)
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-slate-950 text-slate-200 h-screen border-r border-slate-800/80 sticky top-0">
      {/* Brand Header */}
      <div className="px-6 pt-7 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
            <Building2 className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              ProcureChain
            </span>
            <div className="text-[10px] tracking-widest uppercase font-mono text-gold-400 font-semibold">
              Enterprise Suite
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-6 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-2.5 text-[10px] font-extrabold tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {section.label}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                        isActive
                          ? 'bg-slate-800/90 text-white font-bold border-l-4 border-gold-500 shadow-md shadow-black/20 text-gold-300'
                          : 'text-slate-200 font-semibold hover:bg-slate-800/50 hover:text-white'
                      }`
                    }
                  >
                    {navIconMap[item.to] || <FileText className="w-4 h-4 shrink-0 text-slate-400" />}
                    <span className="truncate tracking-wide font-bold text-sm">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Dynamic User Profile Footer & Persona Switcher */}
      <div ref={menuRef} className="relative px-3 py-3 border-t border-slate-800/80 bg-slate-900/60">
        {/* Persona Switcher Popover */}
        {showPersonaMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <UserCheck className="w-3.5 h-3.5" /> Switch Persona
              </span>
              <span className="text-[10px] text-slate-400 font-mono">RBAC Demo</span>
            </div>
            <div className="p-1.5 space-y-1 max-h-56 overflow-y-auto">
              {availablePersonas.map((p) => {
                const isSelected = currentUser.name === p.name
                return (
                  <button
                    key={p.name}
                    onClick={() => handleSwitchUser(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
            <div className="p-1.5 border-t border-slate-800 bg-slate-950/60">
              <button
                onClick={() => {
                  setShowPersonaMenu(false)
                  navigate('/login')
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out to Login Screen</span>
              </button>
            </div>
          </div>
        )}

        {/* Main User Card Button */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex-1 flex items-center gap-2.5 min-w-0 text-left p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-gold-600 text-slate-950 flex items-center justify-center font-display font-bold text-xs shadow-sm shrink-0">
              {getInitials(currentUser.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {currentUser.role}
              </div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showPersonaMenu ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          <NavLink
            to="/login"
            title="Sign Out / Switch Account"
            className="text-xs text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0 flex items-center"
          >
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
