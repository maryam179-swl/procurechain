import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { db } from '../db.js'

const router = express.Router()

// Configure Multer storage
const uploadDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// GET /api/requisitions - List with filters & search
router.get('/', (req, res) => {
  try {
    const { dept, status, priority, search } = req.query
    const list = db.getRequisitions({ dept, status, priority, search })
    res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/requisitions/:id - Get single requisition details with attached documents & history
router.get('/:id', (req, res) => {
  try {
    const detail = db.getRequisitionById(req.params.id)
    if (!detail) {
      return res.status(404).json({ success: false, error: 'Requisition not found' })
    }
    res.json({ success: true, data: detail })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/requisitions - Create Purchase Request with supporting documents
router.post('/', upload.array('documents', 5), (req, res) => {
  try {
    const { item, dept, priority, requestedBy, amount, notes } = req.body

    if (!item || !dept || !requestedBy) {
      return res.status(400).json({ success: false, error: 'Item, Department, and RequestedBy are required.' })
    }

    const created = db.createRequisition({
      item,
      dept,
      priority,
      requestedBy,
      amount,
      notes,
      files: req.files || [],
    })

    res.status(201).json({
      success: true,
      message: 'Purchase Requisition created successfully',
      data: created,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/requisitions/:id - Edit Purchase Requisition Details
router.put('/:id', (req, res) => {
  try {
    const reqId = req.params.id
    const { item, dept, priority, requestedBy, amount, notes } = req.body

    const updated = db.updateRequisition(reqId, { item, dept, priority, requestedBy, amount, notes })
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Requisition not found' })
    }

    res.json({
      success: true,
      message: 'Requisition updated successfully',
      data: updated,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/requisitions/:id - Delete Purchase Requisition
router.delete('/:id', (req, res) => {
  try {
    const reqId = req.params.id
    const deleted = db.deleteRequisition(reqId)
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Requisition not found' })
    }

    res.json({
      success: true,
      message: 'Requisition deleted successfully',
      deletedId: reqId,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/requisitions/:id/documents - Add supporting document
router.post('/:id/documents', upload.single('document'), (req, res) => {
  try {
    const reqId = req.params.id
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    const doc = db.addDocument(reqId, req.file)
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Requisition not found' })
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: doc,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/requisitions/:id/documents/:docId - Remove document
router.delete('/:id/documents/:docId', (req, res) => {
  try {
    const { docId } = req.params
    const deleted = db.deleteDocument(docId)
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Document not found' })
    }

    res.json({ success: true, message: 'Document removed successfully' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/requisitions/:id/status - Track & Update Approval Status
router.patch('/:id/status', (req, res) => {
  try {
    const reqId = req.params.id
    const { status, changedBy, comment } = req.body

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' })
    }

    const updated = db.updateStatus(reqId, { status, changedBy, comment })
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Requisition not found' })
    }

    res.json({
      success: true,
      message: `Requisition status updated to ${status}`,
      data: updated,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
