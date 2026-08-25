import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/contracts/stats — Metrics overview
router.get('/stats', (req, res) => {
  try {
    const stats = db.getContractStats()
    res.json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/contracts — List all contracts with filters
router.get('/', (req, res) => {
  try {
    const { status, type, vendor_id, search } = req.query
    const contracts = db.getContracts({ status, type, vendor_id, search })
    res.json({ success: true, count: contracts.length, data: contracts })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/contracts/:id — Single contract detail
router.get('/:id', (req, res) => {
  try {
    const contract = db.getContractById(req.params.id)
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' })
    res.json({ success: true, data: contract })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/contracts — Execute new vendor contract
router.post('/', (req, res) => {
  try {
    const { vendor_id, title } = req.body
    if (!vendor_id || !title) {
      return res.status(400).json({ success: false, error: 'Vendor ID and Contract Title are required.' })
    }

    const created = db.createContract(req.body)
    res.status(201).json({ success: true, message: 'Contract created successfully', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/contracts/:id — Update contract terms & details
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateContract(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Contract not found' })
    res.json({ success: true, message: 'Contract updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/contracts/:id/renew — Renew contract
router.post('/:id/renew', (req, res) => {
  try {
    const { new_expiry_date, renewed_by, notes } = req.body
    if (!new_expiry_date) {
      return res.status(400).json({ success: false, error: 'New expiry date is required.' })
    }

    const renewed = db.renewContract(req.params.id, { new_expiry_date, renewed_by, notes })
    if (!renewed) return res.status(404).json({ success: false, error: 'Contract not found' })
    res.json({ success: true, message: 'Contract renewed successfully', data: renewed })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/contracts/:id — Delete contract
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteContract(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Contract not found' })
    res.json({ success: true, message: 'Contract deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
