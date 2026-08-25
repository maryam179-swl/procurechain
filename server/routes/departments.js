import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/departments
router.get('/', (req, res) => {
  try {
    const departments = db.getDepartments()
    res.json({ success: true, data: departments })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
