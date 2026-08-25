import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/purchase-orders — List with filters
router.get('/', (req, res) => {
  try {
    const { status, vendor_id, search } = req.query
    const list = db.getPurchaseOrders({ status, vendor_id, search })
    res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/purchase-orders/:id — Single PO with all detail
router.get('/:id', (req, res) => {
  try {
    const po = db.getPurchaseOrderById(req.params.id)
    if (!po) return res.status(404).json({ success: false, error: 'Purchase Order not found' })
    res.json({ success: true, data: po })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/purchase-orders — Generate new PO with validation
router.post('/', (req, res) => {
  try {
    const { vendor_id, item, quantity, unit_price } = req.body
    const errors = {}

    if (!vendor_id) errors.vendor_id = 'Target Vendor is required.'
    if (!item || !item.trim()) errors.item = 'Item description is required.'
    if (quantity !== undefined && (isNaN(quantity) || Number(quantity) <= 0)) {
      errors.quantity = 'Quantity must be a positive number greater than 0.'
    }
    if (unit_price !== undefined && (isNaN(unit_price) || Number(unit_price) <= 0)) {
      errors.unit_price = 'Unit price must be greater than 0.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Purchase order validation failed.', errors })
    }

    const po = db.createPurchaseOrder(req.body)
    res.status(201).json({ success: true, message: 'Purchase Order generated successfully', data: po })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/purchase-orders/:id — Update complete PO details
router.put('/:id', (req, res) => {
  try {
    const updated = db.updatePurchaseOrder(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Purchase Order not found' })
    res.json({ success: true, message: 'Purchase Order updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/purchase-orders/:id/status — Update PO or payment status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, payment_status, actor, note } = req.body
    const updated = db.updatePurchaseOrderStatus(req.params.id, { status, payment_status, actor, note })
    if (!updated) return res.status(404).json({ success: false, error: 'PO not found' })
    res.json({ success: true, message: 'Status updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/purchase-orders/:id/delivery-schedules — Add a delivery milestone
router.post('/:id/delivery-schedules', (req, res) => {
  try {
    const { milestone, date, qty } = req.body
    if (!milestone || !date) return res.status(400).json({ success: false, error: 'Milestone and Date are required.' })
    const ds = db.addDeliverySchedule(req.params.id, { milestone, date, qty })
    if (!ds) return res.status(404).json({ success: false, error: 'PO not found' })
    res.status(201).json({ success: true, message: 'Delivery schedule added', data: ds })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/purchase-orders/:id/delivery-schedules/:dsId — Mark milestone status
router.patch('/:id/delivery-schedules/:dsId', (req, res) => {
  try {
    const { status } = req.body
    const updated = db.updateDeliverySchedule(req.params.id, req.params.dsId, { status })
    if (!updated) return res.status(404).json({ success: false, error: 'Delivery schedule not found' })
    res.json({ success: true, message: 'Delivery schedule updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/purchase-orders/:id/amendments — Issue an amendment
router.post('/:id/amendments', (req, res) => {
  try {
    const { reason, changes, amended_by } = req.body
    if (!reason) return res.status(400).json({ success: false, error: 'Amendment reason is required.' })
    const amd = db.addAmendment(req.params.id, { reason, changes, amended_by })
    if (!amd) return res.status(404).json({ success: false, error: 'PO not found' })
    res.status(201).json({ success: true, message: 'Amendment issued', data: amd })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/purchase-orders/:id
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deletePurchaseOrder(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'PO not found' })
    res.json({ success: true, message: 'Purchase Order deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
