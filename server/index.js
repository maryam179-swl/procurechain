import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config/db.js'

import departmentsRouter from './routes/departments.js'
import requisitionsRouter from './routes/requisitions.js'
import vendorsRouter from './routes/vendors.js'
import rfqRouter from './routes/rfq.js'
import purchaseOrdersRouter from './routes/purchaseOrders.js'
import approvalsRouter from './routes/approvals.js'
import performanceRouter from './routes/performance.js'
import contractsRouter from './routes/contracts.js'
import budgetsRouter from './routes/budgets.js'
import analyticsRouter from './routes/analytics.js'
import inventoryRouter from './routes/inventory.js'
import authRouter from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Database Connection
connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'ProcureChain API', timestamp: new Date() })
})

app.use(['/api/auth', '/auth'], authRouter)
app.use(['/api/departments', '/departments'], departmentsRouter)
app.use(['/api/requisitions', '/requisitions'], requisitionsRouter)
app.use(['/api/vendors', '/vendors'], vendorsRouter)
app.use(['/api/rfq', '/rfq'], rfqRouter)
app.use(['/api/purchase-orders', '/purchase-orders'], purchaseOrdersRouter)
app.use(['/api/approvals', '/approvals'], approvalsRouter)
app.use(['/api/performance', '/performance'], performanceRouter)
app.use(['/api/contracts', '/contracts'], contractsRouter)
app.use(['/api/budgets', '/budgets'], budgetsRouter)
app.use(['/api/analytics', '/analytics'], analyticsRouter)
app.use(['/api/inventory', '/inventory'], inventoryRouter)

app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' })
})

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ProcureChain Backend API running on http://localhost:${PORT}`)
  })
}

export default app

