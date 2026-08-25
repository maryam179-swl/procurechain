import mongoose from 'mongoose'

const quotationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rfq_id: { type: String, required: true },
  vendor_id: { type: String, required: true },
  vendor_name: String,
  unit_price: Number,
  total_amount: Number,
  lead_time_days: Number,
  warranty_terms: String,
  tech_score: Number,
  tech_remarks: String,
  status: { type: String, default: 'Submitted' },
  submitted_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema)
