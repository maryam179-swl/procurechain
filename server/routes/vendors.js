import express from 'express'
import { db } from '../db.js'

const router = express.Router()
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// GET /api/vendors/stats — Metrics overview
router.get('/stats', (req, res) => {
  try {
    const stats = db.getVendorStats()
    res.json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/vendors — List all vendors with filters
router.get('/', (req, res) => {
  try {
    const { category, status, search } = req.query
    const vendors = db.getVendors({ category, status, search })
    res.json({ success: true, count: vendors.length, data: vendors })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/vendors/:id — Single vendor details
router.get('/:id', (req, res) => {
  try {
    const vendor = db.getVendorById(req.params.id)
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' })
    res.json({ success: true, data: vendor })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/vendors — Register new vendor with validation
router.post('/', (req, res) => {
  try {
    const { name, category, email, contact_person } = req.body
    const errors = {}

    if (!name || !name.trim()) errors.name = 'Company Name is required.'
    if (!category || !category.trim()) errors.category = 'Vendor Category is required.'
    if (email && email.trim() && !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid contact email address.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Vendor validation failed.', errors })
    }

    const created = db.createVendor(req.body)
    res.status(201).json({ success: true, message: 'Vendor registered successfully', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/vendors/:id — Update vendor details with validation
router.put('/:id', (req, res) => {
  try {
    const { name, category, email } = req.body
    const errors = {}

    if (name !== undefined && !name.trim()) errors.name = 'Company Name cannot be empty.'
    if (category !== undefined && !category.trim()) errors.category = 'Category cannot be empty.'
    if (email && email.trim() && !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid contact email address.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Vendor update validation failed.', errors })
    }

    const updated = db.updateVendor(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Vendor not found' })
    res.json({ success: true, message: 'Vendor profile updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/vendors/:id — Delete vendor
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteVendor(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Vendor not found' })
    res.json({ success: true, message: 'Vendor deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
