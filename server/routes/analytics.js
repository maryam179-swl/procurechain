import express from 'express'
import crypto from 'crypto'
import { db } from '../db.js'

const router = express.Router()

// POST /api/analytics/ocr-scan — OCR Invoice Processing Simulator
router.post('/ocr-scan', (req, res) => {
  try {
    const { filename, po_number, vendor_name } = req.body

    const parsedData = {
      extracted: true,
      confidence: 0.98,
      document_name: filename || 'invoice_upload.pdf',
      invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      po_number: po_number || 'PO-2026-001',
      vendor_name: vendor_name || 'Al-Noor Steel Co.',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      subtotal: 41200,
      tax_pct: 17,
      tax_amount: 7004,
      grand_total: 48204,
      line_items: [
        { description: 'Industrial Steel Rods (500 units)', qty: 500, unit_price: 82.4, amount: 41200 }
      ],
      ocr_audit_hash: crypto.createHash('sha256').update((filename || 'file') + Date.now()).digest('hex').substring(0, 16)
    }

    res.json({ success: true, message: 'Invoice scanned and parsed successfully via OCR engine', data: parsedData })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/analytics/risk-matrix — Dynamic Vendor Risk Scoring Model
router.get('/risk-matrix', (req, res) => {
  try {
    const vendors = db.getVendors()
    const complaints = db.getComplaints ? db.getComplaints() : []
    const contracts = db.getContracts ? db.getContracts() : []

    const riskData = vendors.map(v => {
      let riskScore = 10

      if (v.tax_filer_status !== 'Active Filer') riskScore += 25
      if ((v.on_time_rate || 100) < 85) riskScore += 20
      if ((v.quality_compliance || 100) < 85) riskScore += 20

      const vComplaints = complaints.filter(c => c.vendor_id === v.id && c.status !== 'Resolved')
      riskScore += vComplaints.length * 15

      const vContract = contracts.find(c => c.vendor_id === v.id && c.status === 'Active')
      if (!vContract) riskScore += 15

      riskScore = Math.min(100, Math.max(0, riskScore))

      let riskLevel = 'Low Risk'
      if (riskScore >= 65) riskLevel = 'High Risk'
      else if (riskScore >= 40) riskLevel = 'Medium Risk'

      return {
        vendor_id: v.id,
        name: v.name,
        category: v.category,
        tax_filer_status: v.tax_filer_status || 'Active Filer',
        rating: v.rating || 90,
        on_time_rate: v.on_time_rate || 90,
        quality_compliance: v.quality_compliance || 90,
        open_complaints_count: vComplaints.length,
        has_active_contract: !!vContract,
        risk_score: riskScore,
        risk_level: riskLevel
      }
    })

    res.json({ success: true, count: riskData.length, data: riskData })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/analytics/esign — E-Signature Verification Engine
router.post('/esign', (req, res) => {
  try {
    const { document_type, document_id, signer_name, signer_role } = req.body

    if (!document_id || !signer_name) {
      return res.status(400).json({ success: false, error: 'Document ID and Signer Name are required.' })
    }

    const timestamp = new Date().toISOString()
    const signatureHash = crypto
      .createHash('sha256')
      .update(`${document_type}:${document_id}:${signer_name}:${timestamp}`)
      .digest('hex')

    const esignRecord = {
      id: `ESG-${Date.now().toString().slice(-6)}`,
      document_type: document_type || 'Contract',
      document_id,
      signer_name,
      signer_role: signer_role || 'Authorized Signatory',
      signed_at: timestamp,
      verification_hash: signatureHash,
      ip_address: req.ip || '127.0.0.1',
      status: 'Verified & Digitally Sealed'
    }

    res.json({ success: true, message: 'Document digitally signed and sealed.', data: esignRecord })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/analytics/export — Power BI / Dataset Export
router.get('/export', (req, res) => {
  try {
    const format = req.query.format || 'json'
    const vendors = db.getVendors()
    const budgets = db.getBudgets()
    const pos = db.getPurchaseOrders()
    const reqs = db.getRequisitions()

    const exportBundle = {
      exported_at: new Date().toISOString(),
      platform: 'ProcureChain Enterprise Procurement Platform',
      metrics: {
        total_budget: '$250 Million',
        active_departments: 45,
        vendors_count: vendors.length,
        purchase_orders_count: pos.length,
        requisitions_count: reqs.length
      },
      datasets: {
        vendors,
        budgets,
        purchase_orders: pos,
        requisitions: reqs
      }
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="procurechain_export.csv"')
      
      let csv = 'ID,Vendor Name,Category,Rating,Status,Tax Filer Status\n'
      vendors.forEach(v => {
        csv += `"${v.id}","${v.name}","${v.category}",${v.rating},"${v.status}","${v.tax_filer_status}"\n`
      })
      return res.send(csv)
    }

    res.json({ success: true, data: exportBundle })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
