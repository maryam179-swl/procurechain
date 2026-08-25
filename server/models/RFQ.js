import mongoose from 'mongoose'

const rfqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  requisition_id: String,
  item: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, default: 0 },
  status: { type: String, default: 'Open Bidding' },
  invited_vendors: [String],
  awarded_vendor_id: String,
  awarded_quotation_id: String,
  deadline: Date,
  created_by: String,
  notes: String,
  created_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.RFQ || mongoose.model('RFQ', rfqSchema)
