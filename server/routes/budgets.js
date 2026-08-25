import express from 'express'
import { db } from '../db.js'

const router = express.Router()

// GET /api/budgets/stats — Overview metrics
router.get('/stats', (req, res) => {
  try {
    const stats = db.getBudgetStats()
    res.json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/budgets/department-spending — Bar chart visualization data
router.get('/department-spending', (req, res) => {
  try {
    const chartData = db.getDepartmentSpendingChart()
    res.json({ success: true, data: chartData })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/budgets — List budgets with filters
router.get('/', (req, res) => {
  try {
    const { dept, fiscal_year, quarter, status, search } = req.query
    const budgets = db.getBudgets({ dept, fiscal_year, quarter, status, search })
    res.json({ success: true, count: budgets.length, data: budgets })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/budgets/:id — Single budget detail
router.get('/:id', (req, res) => {
  try {
    const budget = db.getBudgetById(req.params.id)
    if (!budget) return res.status(404).json({ success: false, error: 'Budget not found' })
    res.json({ success: true, data: budget })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/budgets — Allocate new budget
router.post('/', (req, res) => {
  try {
    const { dept, allocated_budget } = req.body
    if (!dept || !allocated_budget) {
      return res.status(400).json({ success: false, error: 'Department and Allocated Budget amount are required.' })
    }

    const created = db.createBudget(req.body)
    res.status(201).json({ success: true, message: 'Budget allocated successfully', data: created })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/budgets/:id — Update budget details & allocations
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateBudget(req.params.id, req.body)
    if (!updated) return res.status(404).json({ success: false, error: 'Budget not found' })
    res.json({ success: true, message: 'Budget updated successfully', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/budgets/:id/reallocate — Transfer funds between categories
router.post('/:id/reallocate', (req, res) => {
  try {
    const { from_category, to_category, amount } = req.body
    if (!from_category || !to_category || !amount) {
      return res.status(400).json({ success: false, error: 'From Category, To Category, and Amount are required.' })
    }

    const reallocated = db.reallocateBudget(req.params.id, req.body)
    if (!reallocated) return res.status(404).json({ success: false, error: 'Budget not found' })
    res.json({ success: true, message: 'Funds reallocated successfully', data: reallocated })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/budgets/:id — Delete budget record
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteBudget(req.params.id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Budget not found' })
    res.json({ success: true, message: 'Budget deleted', deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
