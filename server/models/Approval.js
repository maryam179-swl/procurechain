import mongoose from 'mongoose'

const approvalTrailSchema = new mongoose.Schema({
  stage: String,
  status: { type: String, default: 'Pending' },
  approver: String,
  remarks: String,
  timestamp: Date,
})

const approvalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  target_type: { type: String, required: true },
  target_id: { type: String, required: true },
  title: { type: String, required: true },
  department: String,
  requested_by: String,
  amount: { type: Number, default: 0 },
  priority: { type: String, default: 'Normal' },
  current_stage: { type: String, default: 'Dept Manager' },
  required_stages: [String],
  status: { type: String, default: 'Pending' },
  overdue: { type: Boolean, default: false },
  hours_pending: { type: Number, default: 1 },
  rejection_reason: String,
  created_at: { type: Date, default: Date.now },
  approval_trail: [approvalTrailSchema],
}, { timestamps: true })

export default mongoose.models.Approval || mongoose.model('Approval', approvalSchema)
