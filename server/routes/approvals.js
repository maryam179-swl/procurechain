import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/approvals/stats — Summary metrics
router.get('/stats', (req, res) => {
  try {
    const stats = db.getApprovalStats()
    res.json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/approvals — List workflow queue
router.get('/', (req, res) => {
  try {
    const { stage, status, search } = req.query
    const list = db.getApprovals({ stage, status, search })
    res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/approvals/:id — Detail view
router.get('/:id', (req, res) => {
  try {
    const item = db.getApprovalById(req.params.id)
    if (!item) return res.status(404).json({ success: false, error: 'Approval item not found' })
    res.json({ success: true, data: item })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/approvals/:id — Update approval item
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateApproval(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Approval item not found' })
    res.json({ success: true, message: 'Approval item updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/approvals/:id — Delete approval item
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteApproval(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Approval item not found' })
    res.json({ success: true, message: 'Approval item deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/approvals/:id/action — Perform Approve, Reject, or Request Revision
router.post('/:id/action', (req, res) => {
  try {
    const { action, stage, approver_name, remarks } = req.body

    if (!action || !['Approve', 'Reject', 'Request Revision'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Valid action (Approve, Reject, Request Revision) is required.' })
    }

    if (action === 'Reject' && (!remarks || remarks.trim() === '')) {
      return res.status(400).json({ success: false, error: 'Mandatory rejection reason/remarks are required for rejection.' })
    }

    const updated = db.submitApprovalAction(req.params.id, { action, stage, approver_name, remarks })
    if (!updated) return res.status(404).json({ success: false, error: 'Approval item not found' })

    res.json({ success: true, message: `Action '${action}' submitted successfully`, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/approvals/:id/escalate — Escalate overdue workflow
router.post('/:id/escalate', (req, res) => {
  try {
    const { reason, escalated_by } = req.body
    const updated = db.escalateApproval(req.params.id, { reason, escalated_by })
    if (!updated) return res.status(404).json({ success: false, error: 'Approval item not found' })

    res.json({ success: true, message: 'Workflow auto-escalated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
