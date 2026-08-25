import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, Lock, Mail, Eye, EyeOff, Building2, ArrowRight,
  Sparkles, UserCheck, AlertCircle
} from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('procurement@procurechain.com')
  const [password, setPassword] = useState('procurechain2026')
  const [role, setRole] = useState('Procurement Specialist')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Validation States
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })

  // Clean demo personas matching screenshot (roles only)
  const demoPersonas = [
    { title: 'Procurement Specialist', label: 'Procurement Specialist', email: 'procurement@procurechain.com', role: 'Procurement Specialist' },
    { title: 'Finance Director', label: 'Finance Director', email: 'finance@procurechain.com', role: 'Finance Director' },
    { title: 'Department Manager', label: 'Department Manager', email: 'dept.manager@procurechain.com', role: 'Department Manager' },
    { title: 'CEO Office', label: 'CEO Office', email: 'ceo@procurechain.com', role: 'CEO' },
    { title: 'Vendor Portal', label: 'Vendor Portal', email: 'vendor@alnoorsteel.com', role: 'Vendor Portal User' },
  ]

  // Validate single field
  const validateField = (name, value) => {
    let err = ''
    if (name === 'email') {
      if (!value || !value.trim()) {
        err = 'Corporate email address is required.'
      } else if (!EMAIL_REGEX.test(value.trim())) {
        err = 'Please enter a valid email format (e.g. name@domain.com).'
      }
    }
    if (name === 'password') {
      if (!value) {
        err = 'Password is required.'
      } else if (value.length < 6) {
        err = 'Password must be at least 6 characters in length.'
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }))
    return err
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === 'email') validateField('email', email)
    if (field === 'password') validateField('password', password)
  }

  const handleEmailChange = (val) => {
    setEmail(val)
    if (touched.email) validateField('email', val)
  }

  const handlePasswordChange = (val) => {
    setPassword(val)
    if (touched.password) validateField('password', val)
  }

  const handleSelectDemo = (p) => {
    setEmail(p.email)
    setRole(p.role)
    setPassword('procurechain2026')
    setFieldErrors({ email: '', password: '' })
    setTouched({ email: true, password: true })
    setErrorMessage('')
    localStorage.setItem('procurechain_user', JSON.stringify({ name: p.title, email: p.email, role: p.role }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailErr = validateField('email', email)
    const passErr = validateField('password', password)
    setTouched({ email: true, password: true })

    if (emailErr || passErr) {
      setErrorMessage('Please fix the highlighted validation errors before signing in.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role }),
      })
      const json = await res.json()

      if (json.success) {
        localStorage.setItem('procurechain_token', json.token)
        localStorage.setItem('procurechain_user', JSON.stringify(json.user))
        navigate('/')
      } else {
        if (json.errors) {
          setFieldErrors(json.errors)
        }
        setErrorMessage(json.message || json.error || 'Authentication failed.')
      }
    } catch (err) {
      localStorage.setItem('procurechain_user', JSON.stringify({ name: role, email, role }))
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative overflow-hidden">

      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-[#070c18] border border-[#131e30] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">

        {/* ── Left Branding Panel (5 Cols) ── */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-[#060b14] border-b lg:border-b-0 lg:border-r border-[#131e30] flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#b98a2e]/20 border border-[#b98a2e]/40 flex items-center justify-center text-[#f5b731] font-bold shrink-0">
                <Building2 className="h-5 w-5 text-[#f5b731]" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white block">ProcureChain</span>
                <span className="text-[10px] font-mono tracking-widest text-[#f5b731] uppercase font-semibold block">ENTERPRISE PLATFORM</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#0e2a22] border border-[#144738] text-[#27d9a1]">
                  <Sparkles className="w-3 h-3 text-[#27d9a1]" /> Tenant ID: ORG-88402
                </span>
              </div>

              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-white leading-snug">
                Enterprise Procurement &amp; Vendor Management
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized automation across 300 Vendors, 45 Departments, 18 Warehouses, and $250M Procurement Budget.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0b1424] border border-[#16233b] text-xs">
                <div className="font-bold text-white font-mono text-sm sm:text-base">$250 Million</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Annual Budget</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0b1424] border border-[#16233b] text-xs">
                <div className="font-bold text-white font-mono text-sm sm:text-base">15,000 POs</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Annual Volume</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#131e30] flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ISO 27001 Certified • Role-Based Access</span>
          </div>
        </div>

        {/* ── Right Login Form Panel (7 Cols) ── */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center space-y-6 bg-[#070c18]">

          <div>
            <h3 className="text-2xl font-normal text-white font-display tracking-tight">Sign In to ProcureChain</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your enterprise email and credentials below</p>
          </div>

          {/* Quick Demo Login Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070e1b] border border-[#182640] space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-[#f5b731] font-bold tracking-tight">
                <UserCheck className="w-4 h-4 text-[#f5b731]" /> Quick Demo Login Selector
              </span>
              <span className="text-xs text-[#5c6e8e] font-normal">Auto-fills credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {demoPersonas.map((p) => {
                const isSelected = email === p.email
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => handleSelectDemo(p)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#241808] border-[#c8922c] ring-1 ring-[#c8922c]/50 text-white'
                        : 'bg-[#0d1627] border-[#182640] text-slate-300 hover:border-[#263859] hover:bg-[#111c30]'
                    }`}
                  >
                    <div className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">{p.title}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-[#b89e78]' : 'text-[#6b7c9c]'}`}>
                      {p.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@procurechain.com"
                  className={`w-full pl-10 pr-3 py-2.5 text-sm bg-[#040811] border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                    fieldErrors.email && touched.email
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-[#131f33] focus:border-[#f5b731]/80 focus:ring-1 focus:ring-[#f5b731]/20'
                  }`}
                />
              </div>
              {fieldErrors.email && touched.email && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-[#040811] border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                    fieldErrors.password && touched.password
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-[#131f33] focus:border-[#f5b731]/80 focus:ring-1 focus:ring-[#f5b731]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Permission Context</label>
              <div className="flex items-center justify-between gap-4">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-[#040811] border border-[#131f33] rounded-xl text-slate-200 focus:outline-none focus:border-[#f5b731]/80 cursor-pointer"
                >
                  <option value="Procurement Specialist">Procurement Specialist</option>
                  <option value="Finance Director">Finance Director</option>
                  <option value="Department Manager">Department Manager</option>
                  <option value="CEO">CEO</option>
                  <option value="Vendor Portal User">Vendor Portal User</option>
                </select>

                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Contact your IT Administrator to reset credentials.') }}
                  className="text-xs text-[#f5b731] hover:underline font-semibold shrink-0"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#040811] border-slate-800 text-[#f5b731] focus:ring-[#f5b731]/30 cursor-pointer w-4 h-4"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#f5b731] hover:bg-[#e0a424] text-[#070c18] font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Validating JWT Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  )
}
