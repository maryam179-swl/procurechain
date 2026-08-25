// Sample data — structured after the content found in the original build.
// Swap this out for real API calls when wiring up a backend.

export const kpis = [
  { label: 'Annual Budget Used', value: '$155.4M', sub: '68% of $228M FY26 budget' },
  { label: 'Purchase Orders (YTD)', value: '11,286', sub: '+8.4% vs last year' },
  { label: 'Active Vendors', value: '263', sub: '37 flagged for review' },
  { label: 'Pending Approvals', value: '184', sub: 'Action needed' },
]

export const spendByCategory = [
  { name: 'Raw Materials', value: 38 },
  { name: 'IT & Electronics', value: 22 },
  { name: 'Logistics', value: 16 },
  { name: 'Office Supplies', value: 9 },
  { name: 'Facilities', value: 9 },
  { name: 'Packaging', value: 6 },
]

export const budgetUtilization = { used: 68, remaining: 32 }

export const departmentSpending = [
  { name: 'Manufacturing', value: 52.1 },
  { name: 'IT Infrastructure', value: 34.8 },
  { name: 'Warehouse Ops', value: 21.3 },
  { name: 'Human Resources', value: 9.6 },
  { name: 'Facilities', value: 14.2 },
  { name: 'Admin Services', value: 6.7 },
]

export const monthlySpendTrend = [
  { month: 'Sep', spend: 10.2 },
  { month: 'Oct', spend: 11.8 },
  { month: 'Nov', spend: 12.4 },
  { month: 'Dec', spend: 14.9 },
  { month: 'Jan', spend: 11.1 },
  { month: 'Feb', spend: 12.7 },
  { month: 'Mar', spend: 13.5 },
  { month: 'Apr', spend: 14.1 },
  { month: 'May', spend: 15.0 },
  { month: 'Jun', spend: 13.8 },
  { month: 'Jul', spend: 14.6 },
  { month: 'Aug', spend: 12.3 },
]

export const topVendors = [
  { name: 'Al-Noor Steel Co.', score: 96 },
  { name: 'Crescent Logistics', score: 94 },
  { name: 'TechSphere Systems', score: 91 },
  { name: 'Punjab Office Supplies', score: 88 },
  { name: 'Metro Packaging Ltd.', score: 85 },
]

export const requisitions = [
  { id: 'REQ-4471', item: 'Ergonomic Office Chairs (40 units)', dept: 'Human Resources', priority: 'High', status: 'Pending', requestedBy: 'Sana Malik' },
  { id: 'REQ-4468', item: 'Dell Latitude Laptops (15 units)', dept: 'IT Infrastructure', priority: 'Normal', status: 'Approved', requestedBy: 'Hamza Tariq' },
  { id: 'REQ-4460', item: 'Industrial Steel Rods (500 units)', dept: 'Manufacturing', priority: 'High', status: 'Approved', requestedBy: 'Bilal Ahmed' },
  { id: 'REQ-4455', item: 'Warehouse Racking System', dept: 'Warehouse Ops', priority: 'Urgent', status: 'Pending', requestedBy: 'Ali Raza' },
  { id: 'REQ-4449', item: 'Printer Toner Cartridges (Bulk)', dept: 'Admin Services', priority: 'Normal', status: 'Approved', requestedBy: 'Fatima Noor' },
  { id: 'REQ-4441', item: 'Generator Maintenance Contract', dept: 'Facilities', priority: 'Urgent', status: 'Rejected', requestedBy: 'Usman Sheikh' },
  { id: 'REQ-4437', item: 'Cloud Server Capacity Upgrade', dept: 'IT Infrastructure', priority: 'Normal', status: 'Approved', requestedBy: 'Hamza Tariq' },
]

export const vendors = [
  { id: 'V-001', name: 'Al-Noor Steel Co.', category: 'Raw Materials', location: 'Lahore, PK', ntn: 'NTN-4471-2', cert: 'ISO 9001' },
  { id: 'V-002', name: 'Crescent Logistics', category: 'Logistics', location: 'Karachi, PK', ntn: 'NTN-2290-8', cert: 'ISO 14001' },
  { id: 'V-003', name: 'Metro Packaging Ltd.', category: 'Packaging', location: 'Sahiwal, PK', ntn: 'NTN-9012-1', cert: 'Duplicate record' },
  { id: 'V-004', name: 'TechSphere Systems', category: 'IT & Electronics', location: 'Islamabad, PK', ntn: 'NTN-5581-9', cert: 'ISO 27001' },
  { id: 'V-005', name: 'Punjab Office Supplies', category: 'Office Supplies', location: 'Multan, PK', ntn: 'NTN-3345-4', cert: '—' },
  { id: 'V-006', name: 'Faisalabad Forge Ltd.', category: 'Raw Materials', location: 'Faisalabad, PK', ntn: 'NTN-7712-6', cert: 'ISO 9001' },
]

export const vendorPerformance = [
  { name: 'On-Time Delivery', value: 92 },
  { name: 'Quality Score', value: 88 },
  { name: 'Cost Efficiency', value: 81 },
  { name: 'Contract Compliance', value: 95 },
  { name: 'Complaint-Free Rate', value: 90 },
]

export const purchaseOrders = [
  { id: 'PO-2026-08201', vendor: 'Al-Noor Steel Co.', date: 'Aug 22, 2026', terms: 'Net 30', status: 'Delivered' },
  { id: 'PO-2026-08322', vendor: 'Crescent Logistics', date: 'Aug 09, 2026', terms: 'Net 15', status: 'In Transit' },
  { id: 'PO-2026-08340', vendor: 'TechSphere Systems', date: 'Aug 18, 2026', terms: 'Net 45', status: 'In Transit' },
  { id: 'PO-2026-08355', vendor: 'Punjab Office Supplies', date: 'Aug 06, 2026', terms: 'Net 30', status: 'Delivered' },
  { id: 'PO-2026-08341', vendor: 'Metro Warehousing Ltd.', date: 'Sep 02, 2026', terms: 'Net 60', status: 'Amended' },
]

export const contracts = [
  { id: 'CTR-2024-118', vendor: 'Al-Noor Steel Co.', expiry: 'Sep 14, 2026', docs: 'Docs complete', status: 'Expiring soon' },
  { id: 'CTR-2023-092', vendor: 'Crescent Logistics', expiry: 'Mar 02, 2027', docs: 'Docs complete', status: 'Active' },
  { id: 'CTR-2022-041', vendor: 'TechSphere Systems', expiry: 'Aug 20, 2026', docs: 'Missing tax cert', status: 'Expired' },
]

export const grns = [
  { id: 'GRN-88231', po: 'PO-2026-08201', warehouse: 'WH-Lahore-02', status: 'Complete' },
  { id: 'GRN-88240', po: 'PO-2026-08322', warehouse: 'WH-Karachi-01', status: 'Partial' },
  { id: 'GRN-88255', po: 'PO-2026-08340', warehouse: 'WH-Sahiwal-01', status: 'Delayed' },
]

export const approvalQueue = [
  { id: 'REQ-4471', label: 'Ergonomic Office Chairs (40 units)', priority: 'High', stage: 'Dept Manager' },
  { id: 'PO-2026-08355', label: 'IT Hardware Refresh Batch 4', priority: 'Normal', stage: 'Finance' },
  { id: 'REQ-4488', label: 'Emergency Generator Servicing', priority: 'Urgent', stage: 'Procurement' },
]

export const navSections = [
  {
    label: 'Overview',
    items: [{ label: 'Analytics Dashboard', to: '/', icon: '📊' }],
  },
  {
    label: 'Procurement Cycle',
    items: [
      { label: 'Purchase Requisitions', to: '/requisitions', icon: '📝' },
      { label: 'RFQ & Quotations', to: '/rfq', icon: '🎯' },
      { label: 'Purchase Orders', to: '/orders', icon: '🛒' },
      { label: 'Approval Workflow', to: '/approvals', icon: '⚡' },
    ],
  },
  {
    label: 'Vendors & Contracts',
    items: [
      { label: 'Vendor Management', to: '/vendors', icon: '🏢' },
      { label: 'Vendor Performance', to: '/vendor-performance', icon: '📈' },
      { label: 'Contract Management', to: '/contracts', icon: '📜' },
    ],
  },
  {
    label: 'Finance & Ops',
    items: [
      { label: 'Budget Management', to: '/budget', icon: '💰' },
      { label: 'Inventory / GRN', to: '/inventory', icon: '📦' },
    ],
  },
]
