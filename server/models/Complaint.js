import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendor_id: { type: String, required: true },
  vendor_name: String,
  issue_type: { type: String, required: true },
  severity: { type: String, default: 'Medium' },
  status: { type: String, default: 'Open' },
  description: String,
  logged_by: String,
  resolution_notes: String,
  logged_at: { type: Date, default: Date.now },
  resolved_at: Date,
}, { timestamps: true })

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema)
