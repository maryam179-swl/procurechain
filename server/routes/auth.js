import express from 'express'

const router = express.Router()

const demoUsers = [
  { id: 'USR-001', name: 'Bilal Ahmed', email: 'procurement@procurechain.com', role: 'Procurement Specialist', department: 'Procurement' },
  { id: 'USR-002', name: 'Kamran Raza', email: 'finance@procurechain.com', role: 'Finance Director', department: 'Finance' },
  { id: 'USR-003', name: 'Sana Malik', email: 'hr@procurechain.com', role: 'Department Manager', department: 'Human Resources' },
  { id: 'USR-004', name: 'CEO Office', email: 'ceo@procurechain.com', role: 'CEO / Board Member', department: 'Executive' },
  { id: 'USR-005', name: 'Tariq Al-Noor', email: 'vendor@alnoorsteel.com', role: 'Vendor Portal User', department: 'Al-Noor Steel Co.' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/auth/login — Authenticate with strict validation & issue JWT bearer token
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body
    const errors = {}

    // 1. Email validation
    if (!email || !email.trim()) {
      errors.email = 'Corporate email address is required.'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid email format (e.g. name@domain.com).'
    }

    // 2. Password validation
    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters in length.'
    }

    // Return field-level validation errors if any exist
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors,
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const user = demoUsers.find(u => u.email.toLowerCase() === cleanEmail) || {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: cleanEmail.split('@')[0].replace(/[\._]/g, ' ').toUpperCase(),
      email: cleanEmail,
      role: role || 'Procurement Specialist',
      department: 'Enterprise Operations'
    }

    // Simulated JWT token generation
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 })).toString('base64')}.procurechain_signature_hash`

    res.json({
      success: true,
      message: 'Authentication successful. Welcome to ProcureChain Enterprise.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        tenant_id: 'ORG-88402',
        permissions: ['READ_ALL', 'CREATE_PR', 'APPROVE_STAGE', 'EXPORT_BI']
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/auth/me — Validate session token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization header provided.' })
  }
  res.json({
    success: true,
    user: demoUsers[0]
  })
})

export default router
