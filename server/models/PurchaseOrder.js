import mongoose from 'mongoose'

const deliveryScheduleSchema = new mongoose.Schema({
  id: String,
  milestone: String,
  date: Date,
  qty: Number,
  status: { type: String, default: 'Scheduled' },
})

const trackingSchema = new mongoose.Schema({
  id: String,
  event: String,
  timestamp: { type: Date, default: Date.now },
  actor: String,
  note: String,
})

const amendmentSchema = new mongoose.Schema({
  id: String,
  reason: String,
  changes: String,
  amended_by: String,
  timestamp: { type: Date, default: Date.now },
})

const purchaseOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rfq_id: String,
  requisition_id: String,
  vendor_id: { type: String, required: true },
  vendor_name: String,
  item: { type: String, required: true },
  category: { type: String, default: 'General' },
  quantity: { type: Number, default: 1 },
  unit_price: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  tax_pct: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  grand_total: { type: Number, default: 0 },
  currency: { type: String, default: 'PKR' },
  payment_terms: { type: String, default: 'Net 30' },
  payment_status: { type: String, default: 'Pending' },
  delivery_address: String,
  delivery_date: Date,
  status: { type: String, default: 'Pending' },
  notes: String,
  created_by: String,
  created_at: { type: Date, default: Date.now },
  amendments: [amendmentSchema],
  delivery_schedules: [deliveryScheduleSchema],
  tracking: [trackingSchema],
}, { timestamps: true })

export default mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema)
