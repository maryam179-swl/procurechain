import mongoose from 'mongoose'

const renewalSchema = new mongoose.Schema({
  id: String,
  renewed_on: { type: Date, default: Date.now },
  new_expiry: Date,
  renewed_by: String,
  notes: String,
})

const contractSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendor_id: { type: String, required: true },
  vendor_name: String,
  title: { type: String, required: true },
  contract_type: { type: String, default: 'Master Services Agreement' },
  contract_value: { type: Number, default: 0 },
  start_date: Date,
  expiry_date: Date,
  renewal_date: Date,
  auto_renew: { type: Boolean, default: false },
  status: { type: String, default: 'Active' },
  compliance_documents: [String],
  attachments: [{
    id: Number,
    original_name: String,
    stored_name: String,
    size_bytes: Number,
    uploaded_at: Date,
  }],
  renewals_history: [renewalSchema],
  notes: String,
  created_by: String,
  created_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.Contract || mongoose.model('Contract', contractSchema)
