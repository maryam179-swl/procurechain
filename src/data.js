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
  { id: 'V-001', name: 'Al-Noor Steel Co.', category: 'Raw Materials', contact_person: 'Tariq Al-Noor', email: 'sales@alnoorsteel.com', phone: '+92 42 3571 8899', location: 'Lahore, PK', status: 'Active', ntn: 'NTN-4471-2', strn: 'STRN-3277-8899-1', tax_filer_status: 'Active Filer', tax_wht_pct: 3, cert: 'ISO 9001', bank_name: 'Meezan Bank', account_title: 'Al-Noor Steel', account_no: '01020304050607', iban: 'PK36MEZN0001020304050607', swift_code: 'MEZNPKKA', rating: 96, delivery_score: 98, quality_score: 97, cost_efficiency_score: 94, contract_compliance_score: 95, on_time_rate: 98, quality_compliance: 97, completed_orders_count: 42 },
  { id: 'V-002', name: 'Crescent Logistics', category: 'Logistics', contact_person: 'Shahid Khan', email: 'ops@crescentlogistics.pk', phone: '+92 21 3455 1122', location: 'Karachi, PK', status: 'Active', ntn: 'NTN-2290-8', strn: 'STRN-1199-2233-4', tax_filer_status: 'Active Filer', tax_wht_pct: 3, cert: 'ISO 14001', bank_name: 'Habib Bank Ltd', account_title: 'Crescent Freight', account_no: '00427900112233', iban: 'PK92HABB0000427900112233', swift_code: 'HABBPKKA', rating: 94, delivery_score: 95, quality_score: 96, cost_efficiency_score: 92, contract_compliance_score: 93, on_time_rate: 95, quality_compliance: 96, completed_orders_count: 38 },
  { id: 'V-003', name: 'Metro Packaging Ltd.', category: 'Packaging', contact_person: 'Usman Chaudhry', email: 'info@metropackaging.com', phone: '+92 40 4220 900', location: 'Sahiwal, PK', status: 'Active', ntn: 'NTN-9012-1', strn: 'STRN-9012-3344-5', tax_filer_status: 'Active Filer', tax_wht_pct: 4.5, cert: '—', bank_name: 'Bank Alfalah', account_title: 'Metro Packaging', account_no: '01881005544332', iban: 'PK14ALFH0188100554433201', swift_code: 'ALFHPKKA', rating: 85, delivery_score: 88, quality_score: 86, cost_efficiency_score: 84, contract_compliance_score: 82, on_time_rate: 88, quality_compliance: 86, completed_orders_count: 19 },
  { id: 'V-004', name: 'TechSphere Systems', category: 'IT & Electronics', contact_person: 'Ayesha Raza', email: 'enterprise@techsphere.pk', phone: '+92 51 2890 441', location: 'Islamabad, PK', status: 'Active', ntn: 'NTN-5581-9', strn: 'STRN-5581-8877-6', tax_filer_status: 'Active Filer', tax_wht_pct: 3, cert: 'ISO 27001', bank_name: 'Standard Chartered', account_title: 'TechSphere Systems', account_no: '011899002211', iban: 'PK49SCBL0000011899002211', swift_code: 'SCBLPKKA', rating: 91, delivery_score: 93, quality_score: 94, cost_efficiency_score: 88, contract_compliance_score: 90, on_time_rate: 93, quality_compliance: 94, completed_orders_count: 27 },
  { id: 'V-005', name: 'Punjab Office Supplies', category: 'Office Supplies', contact_person: 'Rashid Mahmood', email: 'orders@punjabsupplies.pk', phone: '+92 61 4511 770', location: 'Multan, PK', status: 'Active', ntn: 'NTN-3345-4', strn: 'STRN-3345-7788-9', tax_filer_status: 'Active Filer', tax_wht_pct: 4.5, cert: '—', bank_name: 'MCB Bank', account_title: 'Punjab Office Supplies', account_no: '056711223344', iban: 'PK71MUCB0567112233440001', swift_code: 'MUCBPKKA', rating: 88, delivery_score: 90, quality_score: 89, cost_efficiency_score: 86, contract_compliance_score: 87, on_time_rate: 90, quality_compliance: 89, completed_orders_count: 31 },
  { id: 'V-006', name: 'Faisalabad Forge Ltd.', category: 'Raw Materials', contact_person: 'Zubair Sheikh', email: 'contact@faisalabadforge.com', phone: '+92 41 8722 344', location: 'Faisalabad, PK', status: 'Under Review', ntn: 'NTN-7712-6', strn: 'STRN-7712-1122-3', tax_filer_status: 'Non-Filer', tax_wht_pct: 6, cert: 'ISO 9001', bank_name: 'United Bank Ltd', account_title: 'Faisalabad Forge', account_no: '098112233445', iban: 'PK20UNIL0981122334450001', swift_code: 'UNILPKKA', rating: 82, delivery_score: 80, quality_score: 84, cost_efficiency_score: 82, contract_compliance_score: 81, on_time_rate: 80, quality_compliance: 84, completed_orders_count: 14 }
]

export const vendorStats = {
  total_vendors: 6,
  active_vendors: 5,
  under_review: 1,
  certified_count: 4,
  active_filers: 5,
  average_rating: 89.3
}

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
  { id: 'APP-001', target_type: 'Requisition', target_id: 'REQ-4471', title: 'Ergonomic Office Chairs (40 units)', department: 'Human Resources', requested_by: 'Sana Malik', amount: 12000, priority: 'High', current_stage: 'Dept Manager', required_stages: ['Dept Manager', 'Finance'], status: 'Pending', overdue: false, hours_pending: 14, approval_trail: [{ stage: 'Dept Manager', status: 'Pending' }] },
  { id: 'APP-002', target_type: 'Requisition', target_id: 'REQ-4455', title: 'Warehouse Racking System', department: 'Warehouse Ops', requested_by: 'Ali Raza', amount: 35000, priority: 'Urgent', current_stage: 'Finance', required_stages: ['Dept Manager', 'Finance', 'Procurement'], status: 'Pending', overdue: true, hours_pending: 28, approval_trail: [{ stage: 'Dept Manager', status: 'Approved', approver: 'WMS Manager' }, { stage: 'Finance', status: 'Pending' }] },
  { id: 'APP-003', target_type: 'Purchase Order', target_id: 'PO-2026-001', title: 'Industrial Steel Rods (500 units)', department: 'Manufacturing', requested_by: 'Bilal Ahmed', amount: 48204, priority: 'High', current_stage: 'Procurement', required_stages: ['Dept Manager', 'Finance', 'Procurement'], status: 'Pending', overdue: false, hours_pending: 8, approval_trail: [{ stage: 'Dept Manager', status: 'Approved' }, { stage: 'Finance', status: 'Approved' }] },
  { id: 'APP-004', target_type: 'Requisition', target_id: 'REQ-4441', title: 'Generator Maintenance Contract', department: 'Facilities', requested_by: 'Usman Sheikh', amount: 65000, priority: 'Urgent', current_stage: 'CEO', required_stages: ['Dept Manager', 'Finance', 'Procurement', 'CEO'], status: 'Rejected', overdue: false, hours_pending: 0 }
]

export const approvalStats = {
  total_pending: 3,
  total_escalated: 1,
  ceo_pending: 0,
  pending_value: 95204,
  total_count: 4
}

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
