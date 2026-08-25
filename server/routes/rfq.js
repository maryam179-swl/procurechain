import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/rfq — List all RFQs with filters
router.get('/', (req, res) => {
  try {
    const { status, category, search } = req.query
    const list = db.getRFQs({ status, category, search })
    res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/rfq/:id — Get single RFQ with quotations + evaluation matrix
router.get('/:id', (req, res) => {
  try {
    const rfq = db.getRFQById(req.params.id)
    if (!rfq) return res.status(404).json({ success: false, error: 'RFQ not found' })
    res.json({ success: true, data: rfq })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/rfq — Create new RFQ and invite vendors
router.post('/', (req, res) => {
  try {
    const { item, category, budget, requisition_id, invited_vendors, deadline, notes, created_by } = req.body

    if (!item || !category) {
      return res.status(400).json({ success: false, error: 'Item and Category are required.' })
    }

    const created = db.createRFQ({ item, category, budget, requisition_id, invited_vendors, deadline, notes, created_by })
    res.status(201).json({ success: true, message: 'RFQ created successfully', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/rfq/:id — Update RFQ details
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateRFQ(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'RFQ not found' })
    res.json({ success: true, message: 'RFQ updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/rfq/:id — Delete RFQ
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteRFQ(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'RFQ not found' })
    res.json({ success: true, message: 'RFQ deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/rfq/:id/quotations — Submit a vendor quotation
router.post('/:id/quotations', (req, res) => {
  try {
    const rfq_id = req.params.id
    const { vendor_id, unit_price, total_amount, lead_time_days, warranty_terms, tech_score, tech_remarks } = req.body

    if (!vendor_id || !total_amount) {
      return res.status(400).json({ success: false, error: 'Vendor ID and Total Amount are required.' })
    }

    const quote = db.submitQuotation({ rfq_id, vendor_id, unit_price, total_amount, lead_time_days, warranty_terms, tech_score, tech_remarks })
    if (!quote) return res.status(404).json({ success: false, error: 'RFQ not found' })

    res.status(201).json({ success: true, message: 'Quotation submitted successfully', data: quote })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/rfq/:id/evaluations/:quoteId — Update technical evaluation score & remarks
router.patch('/:id/evaluations/:quoteId', (req, res) => {
  try {
    const { tech_score, tech_remarks } = req.body
    const updated = db.updateQuotationEvaluation(req.params.id, req.params.quoteId, { tech_score, tech_remarks })
    if (!updated) return res.status(404).json({ success: false, error: 'Quotation not found' })
    res.json({ success: true, message: 'Evaluation updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/rfq/:id/award — Award the winning vendor quotation
router.post('/:id/award', (req, res) => {
  try {
    const { quote_id, awarded_by } = req.body
    if (!quote_id) return res.status(400).json({ success: false, error: 'Quote ID is required.' })

    const awarded = db.awardRFQ(req.params.id, quote_id, awarded_by || 'Procurement Manager')
    if (!awarded) return res.status(404).json({ success: false, error: 'RFQ or Quotation not found' })

    res.json({ success: true, message: 'Contract awarded successfully', data: awarded })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/rfq/quotations/:quoteId — Remove a quotation
router.delete('/quotations/:quoteId', (req, res) => {
  try {
    const deleted = db.deleteQuotation(req.params.quoteId)
    if (!deleted) return res.status(404).json({ success: false, error: 'Quotation not found' })
    res.json({ success: true, message: 'Quotation removed' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
