import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { initialData } from './db.js'

import Department from './models/Department.js'
import Requisition from './models/Requisition.js'
import Vendor from './models/Vendor.js'
import RFQ from './models/RFQ.js'
import Quotation from './models/Quotation.js'
import PurchaseOrder from './models/PurchaseOrder.js'
import Approval from './models/Approval.js'
import Complaint from './models/Complaint.js'
import Contract from './models/Contract.js'
import Budget from './models/Budget.js'

const seedDB = async () => {
  const connected = await connectDB()
  if (!connected) {
    console.log('❌ Could not connect to MongoDB for seeding.')
    process.exit(1)
  }

  try {
    console.log('🧹 Clearing existing MongoDB collections...')
    await Department.deleteMany({})
    await Requisition.deleteMany({})
    await Vendor.deleteMany({})
    await RFQ.deleteMany({})
    await Quotation.deleteMany({})
    await PurchaseOrder.deleteMany({})
    await Approval.deleteMany({})
    await Complaint.deleteMany({})
    await Contract.deleteMany({})
    await Budget.deleteMany({})

    console.log('🌱 Seeding MongoDB collections...')
    await Department.insertMany(initialData.departments)
    await Requisition.insertMany(initialData.requisitions)
    await Vendor.insertMany(initialData.vendors)
    await RFQ.insertMany(initialData.rfqs)
    await Quotation.insertMany(initialData.quotations)
    await PurchaseOrder.insertMany(initialData.purchaseOrders)
    await Approval.insertMany(initialData.approvals)
    await Complaint.insertMany(initialData.complaints)
    await Contract.insertMany(initialData.contracts)
    await Budget.insertMany(initialData.budgets)

    console.log('✅ MongoDB Seeding completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seedDB()
