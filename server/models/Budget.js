import mongoose from 'mongoose'

const categoryAllocationSchema = new mongoose.Schema({
  category: { type: String, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const budgetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  code: String,
  fiscal_year: { type: String, default: '2026' },
  quarter: { type: String, default: 'Annual' },
  allocated_budget: { type: Number, default: 0 },
  spent_amount: { type: Number, default: 0 },
  committed_amount: { type: Number, default: 0 },
  remaining_budget: { type: Number, default: 0 },
  utilization_pct: { type: Number, default: 0 },
  status: { type: String, default: 'Healthy' },
  category_allocations: [categoryAllocationSchema],
  notes: String,
  created_by: String,
  created_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema)
