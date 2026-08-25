import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/inventory/stats — Overview metrics across 18 warehouses
router.get('/stats', (req, res) => {
  try {
    const stats = db.getInventoryStats ? db.getInventoryStats() : {
      total_grns: 3,
      accepted_grns: 1,
      pending_qc: 1,
      warehouses_count: 18,
      total_stock_value: '$14.2 Million',
    }
    res.json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/inventory/grns — List all GRNs
router.get('/grns', (req, res) => {
  try {
    const { warehouse, status, search } = req.query
    const grns = db.getGRNs({ warehouse, status, search })
    res.json({ success: true, count: grns.length, data: grns })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/inventory/warehouses — List 18 Enterprise Warehouses
router.get('/warehouses', (req, res) => {
  try {
    const warehouses = db.getWarehouses()
    res.json({ success: true, count: warehouses.length, data: warehouses })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/inventory/grns — Record Goods Received Note (GRN)
router.post('/grns', (req, res) => {
  try {
    const { po_id, warehouse_id, received_qty, rejected_qty, notes, inspected_by } = req.body
    if (!po_id || !warehouse_id) {
      return res.status(400).json({ success: false, error: 'PO Reference and Receiving Warehouse are required.' })
    }

    const created = db.createGRN(req.body)
    res.status(201).json({ success: true, message: 'GRN created and inventory updated cleanly', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/inventory/grns/:id — Update GRN Inspection Status
router.patch('/grns/:id', (req, res) => {
  try {
    const updated = db.updateGRNStatus(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'GRN not found' })
    res.json({ success: true, message: 'GRN inspection status updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
