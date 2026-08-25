import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  requisition_id: { type: String, required: true },
  original_name: String,
  stored_name: String,
  mime_type: String,
  size_bytes: Number,
  uploaded_at: Date,
})

const historySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  requisition_id: { type: String, required: true },
  old_status: String,
  new_status: String,
  changed_by: String,
  comment: String,
  timestamp: Date,
})

const requisitionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  item: { type: String, required: true },
  dept: { type: String, required: true },
  priority: { type: String, default: 'Normal' },
  status: { type: String, default: 'Pending' },
  requestedBy: { type: String, required: true },
  amount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  documents: [documentSchema],
  history: [historySchema],
  created_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.Requisition || mongoose.model('Requisition', requisitionSchema)
