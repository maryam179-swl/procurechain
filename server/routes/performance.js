import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/performance/radar — Radar chart metrics
router.get('/radar', (req, res) => {
  try {
    const radar = db.getVendorPerformanceRadar()
    res.json({ success: true, data: radar })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/performance/rankings — Top vendor rankings
router.get('/rankings', (req, res) => {
  try {
    const vendors = db.getVendors()
    const rankings = vendors.map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      score: v.rating || 85,
      delivery_score: v.delivery_score || 85,
      quality_score: v.quality_score || 85,
      cost_efficiency_score: v.cost_efficiency_score || 85,
      contract_compliance_score: v.contract_compliance_score || 85,
      status: v.status,
    }))
    res.json({ success: true, count: rankings.length, data: rankings })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/performance/complaints — List complaints
router.get('/complaints', (req, res) => {
  try {
    const { vendor_id, status, severity, search } = req.query
    const list = db.getComplaints({ vendor_id, status, severity, search })
    res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/performance/complaints — Log new complaint
router.post('/complaints', (req, res) => {
  try {
    const { vendor_id, issue_type } = req.body
    if (!vendor_id || !issue_type) {
      return res.status(400).json({ success: false, error: 'Vendor ID and Issue Type are required.' })
    }
    const created = db.createComplaint(req.body)
    res.status(201).json({ success: true, message: 'Complaint logged successfully', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/performance/complaints/:id — Update complaint details / resolution
router.put('/complaints/:id', (req, res) => {
  try {
    const updated = db.updateComplaint(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Complaint not found' })
    res.json({ success: true, message: 'Complaint updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/performance/complaints/:id — Delete complaint
router.delete('/complaints/:id', (req, res) => {
  try {
    const deleted = db.deleteComplaint(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Complaint not found' })
    res.json({ success: true, message: 'Complaint deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
