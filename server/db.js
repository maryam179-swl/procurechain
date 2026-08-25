import fs from 'fs'
import path from 'path'

const dbFilePath = path.resolve(process.cwd(), 'db.json')

// ─── Seed / Initial Data ──────────────────────────────
export const initialData = {
  departments: [
    { id: 'DEPT-01', name: 'Human Resources', code: 'HR' },
    { id: 'DEPT-02', name: 'IT Infrastructure', code: 'IT' },
    { id: 'DEPT-03', name: 'Manufacturing', code: 'MFG' },
    { id: 'DEPT-04', name: 'Warehouse Ops', code: 'WMS' },
    { id: 'DEPT-05', name: 'Admin Services', code: 'ADM' },
    { id: 'DEPT-06', name: 'Facilities', code: 'FAC' },
    { id: 'DEPT-07', name: 'Logistics', code: 'LOG' },
  ],
  budgets: [
    {
      id: 'BDG-2026-001',
      dept: 'Manufacturing',
      code: 'MFG',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 250000,
      spent_amount: 145000,
      committed_amount: 48204,
      remaining_budget: 56796,
      utilization_pct: 77.3,
      status: 'Healthy',
      category_allocations: [
        { category: 'Raw Materials', allocated: 180000, spent: 145000 },
        { category: 'Equipment & Machinery', allocated: 50000, spent: 30000 },
        { category: 'Consumables', allocated: 20000, spent: 18204 },
      ],
      notes: 'Q3 raw steel allocation included.',
      created_by: 'Finance Director',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'BDG-2026-002',
      dept: 'IT Infrastructure',
      code: 'IT',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 150000,
      spent_amount: 98000,
      committed_amount: 41145,
      remaining_budget: 10855,
      utilization_pct: 92.8,
      status: 'Near Limit',
      category_allocations: [
        { category: 'Hardware & Laptops', allocated: 70000, spent: 55000 },
        { category: 'Software & Subscriptions', allocated: 50000, spent: 44000 },
        { category: 'Cloud Infrastructure', allocated: 30000, spent: 40145 },
      ],
      notes: 'Near limit due to dev laptop onboarding capex.',
      created_by: 'IT Manager',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'BDG-2026-003',
      dept: 'Facilities',
      code: 'FAC',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 80000,
      spent_amount: 68000,
      committed_amount: 15000,
      remaining_budget: -3000,
      utilization_pct: 103.8,
      status: 'Over Budget',
      category_allocations: [
        { category: 'Maintenance Contracts', allocated: 50000, spent: 55000 },
        { category: 'Utilities & Repairs', allocated: 30000, spent: 28000 },
      ],
      notes: 'Exceeded budget due to emergency generator servicing.',
      created_by: 'Facilities Manager',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'BDG-2026-004',
      dept: 'Human Resources',
      code: 'HR',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 60000,
      spent_amount: 28000,
      committed_amount: 12000,
      remaining_budget: 20000,
      utilization_pct: 66.7,
      status: 'Healthy',
      category_allocations: [
        { category: 'Office Furniture', allocated: 35000, spent: 24000 },
        { category: 'Training & Development', allocated: 25000, spent: 16000 },
      ],
      notes: 'Ergonomic chairs purchase completed.',
      created_by: 'HR Director',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'BDG-2026-005',
      dept: 'Warehouse Ops',
      code: 'WMS',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 110000,
      spent_amount: 62000,
      committed_amount: 35000,
      remaining_budget: 13000,
      utilization_pct: 88.2,
      status: 'Near Limit',
      category_allocations: [
        { category: 'Racking & Storage', allocated: 70000, spent: 62000 },
        { category: 'Packaging & Supplies', allocated: 40000, spent: 35000 },
      ],
      notes: 'Warehouse rack expansion in progress.',
      created_by: 'WMS Manager',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'BDG-2026-006',
      dept: 'Logistics',
      code: 'LOG',
      fiscal_year: '2026',
      quarter: 'Annual',
      allocated_budget: 95000,
      spent_amount: 45000,
      committed_amount: 18000,
      remaining_budget: 32000,
      utilization_pct: 66.3,
      status: 'Healthy',
      category_allocations: [
        { category: 'Freight & Haulage', allocated: 65000, spent: 42000 },
        { category: 'Customs Clearance', allocated: 30000, spent: 21000 },
      ],
      notes: 'Port Qasim freight contracts on schedule.',
      created_by: 'Logistics Head',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
  ],
  vendors: [
    {
      id: 'V-001',
      name: 'Al-Noor Steel Co.',
      category: 'Raw Materials',
      contact_person: 'Tariq Al-Noor',
      email: 'sales@alnoorsteel.com',
      phone: '+92 42 3571 8899',
      location: 'Plot 45, Quaid-e-Azam Industrial Estate, Lahore, PK',
      website: 'https://alnoorsteel.com',
      established_year: 2008,
      status: 'Active',
      ntn: 'NTN-4471-2',
      strn: 'STRN-3277-8899-1',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 3,
      cert: 'ISO 9001',
      cert_expiry: '2027-12-31',
      bank_name: 'Meezan Bank Ltd.',
      account_title: 'Al-Noor Steel Company Ltd',
      account_no: '01020304050607',
      iban: 'PK36MEZN0001020304050607',
      swift_code: 'MEZNPKKA',
      rating: 96,
      delivery_score: 98,
      quality_score: 97,
      cost_efficiency_score: 94,
      contract_compliance_score: 95,
      on_time_rate: 98,
      quality_compliance: 97,
      completed_orders_count: 42,
    },
    {
      id: 'V-002',
      name: 'Crescent Logistics',
      category: 'Logistics',
      contact_person: 'Shahid Khan',
      email: 'ops@crescentlogistics.pk',
      phone: '+92 21 3455 1122',
      location: 'Port Qasim Freight Zone, Karachi, PK',
      website: 'https://crescentlogistics.pk',
      established_year: 2012,
      status: 'Active',
      ntn: 'NTN-2290-8',
      strn: 'STRN-1199-2233-4',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 3,
      cert: 'ISO 14001',
      cert_expiry: '2026-10-15',
      bank_name: 'Habib Bank Ltd (HBL)',
      account_title: 'Crescent Freight & Logistics',
      account_no: '00427900112233',
      iban: 'PK92HABB0000427900112233',
      swift_code: 'HABBPKKA',
      rating: 94,
      delivery_score: 95,
      quality_score: 96,
      cost_efficiency_score: 92,
      contract_compliance_score: 93,
      on_time_rate: 95,
      quality_compliance: 96,
      completed_orders_count: 38,
    },
    {
      id: 'V-003',
      name: 'Metro Packaging Ltd.',
      category: 'Packaging',
      contact_person: 'Usman Chaudhry',
      email: 'info@metropackaging.com',
      phone: '+92 40 4220 900',
      location: 'GT Road Industrial Area, Sahiwal, PK',
      website: 'https://metropackaging.com',
      established_year: 2015,
      status: 'Active',
      ntn: 'NTN-9012-1',
      strn: 'STRN-9012-3344-5',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 4.5,
      cert: '—',
      cert_expiry: null,
      bank_name: 'Bank Alfalah Ltd.',
      account_title: 'Metro Packaging Ltd',
      account_no: '01881005544332',
      iban: 'PK14ALFH0188100554433201',
      swift_code: 'ALFHPKKA',
      rating: 85,
      delivery_score: 88,
      quality_score: 86,
      cost_efficiency_score: 84,
      contract_compliance_score: 82,
      on_time_rate: 88,
      quality_compliance: 86,
      completed_orders_count: 19,
    },
    {
      id: 'V-004',
      name: 'TechSphere Systems',
      category: 'IT & Electronics',
      contact_person: 'Ayesha Raza',
      email: 'enterprise@techsphere.pk',
      phone: '+92 51 2890 441',
      location: 'Evacuee Trust Complex, Blue Area, Islamabad, PK',
      website: 'https://techsphere.pk',
      established_year: 2017,
      status: 'Active',
      ntn: 'NTN-5581-9',
      strn: 'STRN-5581-8877-6',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 3,
      cert: 'ISO 27001',
      cert_expiry: '2028-06-30',
      bank_name: 'Standard Chartered Bank',
      account_title: 'TechSphere Systems Pvt Ltd',
      account_no: '011899002211',
      iban: 'PK49SCBL0000011899002211',
      swift_code: 'SCBLPKKA',
      rating: 91,
      delivery_score: 93,
      quality_score: 94,
      cost_efficiency_score: 88,
      contract_compliance_score: 90,
      on_time_rate: 93,
      quality_compliance: 94,
      completed_orders_count: 27,
    },
    {
      id: 'V-005',
      name: 'Punjab Office Supplies',
      category: 'Office Supplies',
      contact_person: 'Rashid Mahmood',
      email: 'orders@punjabsupplies.pk',
      phone: '+92 61 4511 770',
      location: 'Multan Industrial Estate, Multan, PK',
      website: 'https://punjabsupplies.pk',
      established_year: 2011,
      status: 'Active',
      ntn: 'NTN-3345-4',
      strn: 'STRN-3345-7788-9',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 4.5,
      cert: '—',
      cert_expiry: null,
      bank_name: 'MCB Bank Ltd.',
      account_title: 'Punjab Office Supplies Traders',
      account_no: '056711223344',
      iban: 'PK71MUCB0567112233440001',
      swift_code: 'MUCBPKKA',
      rating: 88,
      delivery_score: 90,
      quality_score: 89,
      cost_efficiency_score: 86,
      contract_compliance_score: 87,
      on_time_rate: 90,
      quality_compliance: 89,
      completed_orders_count: 31,
    },
    {
      id: 'V-006',
      name: 'Faisalabad Forge Ltd.',
      category: 'Raw Materials',
      contact_person: 'Zubair Sheikh',
      email: 'contact@faisalabadforge.com',
      phone: '+92 41 8722 344',
      location: 'Small Industrial Estate, Faisalabad, PK',
      website: 'https://faisalabadforge.com',
      established_year: 2005,
      status: 'Under Review',
      ntn: 'NTN-7712-6',
      strn: 'STRN-7712-1122-3',
      tax_filer_status: 'Non-Filer',
      tax_wht_pct: 6,
      cert: 'ISO 9001',
      cert_expiry: '2026-08-20',
      bank_name: 'United Bank Ltd (UBL)',
      account_title: 'Faisalabad Forge Ltd',
      account_no: '098112233445',
      iban: 'PK20UNIL0981122334450001',
      swift_code: 'UNILPKKA',
      rating: 82,
      delivery_score: 80,
      quality_score: 84,
      cost_efficiency_score: 82,
      contract_compliance_score: 81,
      on_time_rate: 80,
      quality_compliance: 84,
      completed_orders_count: 14,
    },
    {
      id: 'V-007',
      name: 'Alpha Electronics',
      category: 'IT & Electronics',
      contact_person: 'Imran Farooq',
      email: 'sales@alphaelectronics.pk',
      phone: '+92 21 3538 9900',
      location: 'S.I.T.E Area, Karachi, PK',
      website: 'https://alphaelectronics.pk',
      established_year: 2019,
      status: 'Active',
      ntn: 'NTN-1192-3',
      strn: 'STRN-1192-9988-7',
      tax_filer_status: 'Active Filer',
      tax_wht_pct: 3,
      cert: 'ISO 27001',
      cert_expiry: '2027-05-10',
      bank_name: 'Faysal Bank Ltd.',
      account_title: 'Alpha Electronics Pakistan',
      account_no: '034110099887',
      iban: 'PK88FAYS0341100998870001',
      swift_code: 'FAYSPKKA',
      rating: 79,
      delivery_score: 82,
      quality_score: 81,
      cost_efficiency_score: 75,
      contract_compliance_score: 78,
      on_time_rate: 82,
      quality_compliance: 81,
      completed_orders_count: 11,
    },
  ],
  contracts: [
    {
      id: 'CNT-2026-001',
      vendor_id: 'V-001',
      vendor_name: 'Al-Noor Steel Co.',
      title: 'Master Steel Supply Agreement',
      contract_type: 'Master Services Agreement',
      contract_value: 120000,
      start_date: new Date(Date.now() - 86400000 * 180).toISOString(),
      expiry_date: new Date(Date.now() + 86400000 * 185).toISOString(),
      renewal_date: new Date(Date.now() + 86400000 * 155).toISOString(),
      auto_renew: true,
      status: 'Active',
      compliance_documents: ['ISO 9001 Certificate', 'NDA Agreement', 'Tax Filer Compliance', 'SLA Schedule A'],
      attachments: [
        { id: 1, original_name: 'al_noor_master_contract.pdf', stored_name: 'sample_contract.pdf', size_bytes: 542000, uploaded_at: new Date(Date.now() - 86400000 * 180).toISOString() }
      ],
      renewals_history: [
        { id: 'REN-01', renewed_on: new Date(Date.now() - 86400000 * 180).toISOString(), new_expiry: new Date(Date.now() + 86400000 * 185).toISOString(), renewed_by: 'Legal Team', notes: 'Initial 1-year master agreement executed.' }
      ],
      notes: 'Exclusivity clause applies to Grade A raw steel rods.',
      created_by: 'Legal & Procurement',
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    },
    {
      id: 'CNT-2026-002',
      vendor_id: 'V-004',
      vendor_name: 'TechSphere Systems',
      title: 'Enterprise IT Equipment & SLA Agreement',
      contract_type: 'Service Level Agreement (SLA)',
      contract_value: 65000,
      start_date: new Date(Date.now() - 86400000 * 350).toISOString(),
      expiry_date: new Date(Date.now() + 86400000 * 15).toISOString(),
      renewal_date: new Date(Date.now() - 86400000 * 15).toISOString(),
      auto_renew: false,
      status: 'Expiring Soon',
      compliance_documents: ['ISO 27001 Security Cert', 'Data Protection NDA', '3-Year Hardware Warranty'],
      attachments: [],
      renewals_history: [],
      notes: 'Renewal review pending hardware capex approval for Q4.',
      created_by: 'IT Manager',
      created_at: new Date(Date.now() - 86400000 * 350).toISOString(),
    },
    {
      id: 'CNT-2026-003',
      vendor_id: 'V-006',
      vendor_name: 'Faisalabad Forge Ltd.',
      title: 'Annual Forge & Casting Contract',
      contract_type: 'Annual Maintenance Contract (AMC)',
      contract_value: 45000,
      start_date: new Date(Date.now() - 86400000 * 400).toISOString(),
      expiry_date: new Date(Date.now() - 86400000 * 35).toISOString(),
      renewal_date: new Date(Date.now() - 86400000 * 65).toISOString(),
      auto_renew: false,
      status: 'Expired',
      compliance_documents: ['ISO 9001 Certificate'],
      attachments: [],
      renewals_history: [],
      notes: 'Contract expired. Vendor under review due to delivery delays.',
      created_by: 'Procurement Specialist',
      created_at: new Date(Date.now() - 86400000 * 400).toISOString(),
    },
  ],
  complaints: [
    {
      id: 'CMP-001',
      vendor_id: 'V-006',
      vendor_name: 'Faisalabad Forge Ltd.',
      issue_type: 'Late Delivery',
      severity: 'High',
      status: 'In Investigation',
      description: 'Steel rod batch delivery delayed by 9 days beyond agreed PO SLA schedule.',
      logged_by: 'Warehouse Lead (Ali Raza)',
      resolution_notes: 'Vendor promised expedited dispatch by Friday with waived freight charges.',
      logged_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      resolved_at: null,
    },
    {
      id: 'CMP-002',
      vendor_id: 'V-007',
      vendor_name: 'Alpha Electronics',
      issue_type: 'Defective Quality',
      severity: 'Medium',
      status: 'Resolved',
      description: '3 laptops out of 15 batch arrived with defective RAM modules and faulty trackpads.',
      logged_by: 'IT Operations (Hamza Tariq)',
      resolution_notes: 'Vendor replaced units within 48h under 2-year warranty agreement.',
      logged_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      resolved_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'CMP-003',
      vendor_id: 'V-003',
      vendor_name: 'Metro Packaging Ltd.',
      issue_type: 'Pricing Variance',
      severity: 'Low',
      status: 'Open',
      description: 'Invoice total included unauthorized 2% freight surcharge not listed in contract.',
      logged_by: 'Finance Officer (Fatima Noor)',
      resolution_notes: 'Awaiting revised invoice from vendor billing team.',
      logged_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      resolved_at: null,
    },
  ],
  requisitions: [
    { id: 'REQ-4471', item: 'Ergonomic Office Chairs (40 units)', dept: 'Human Resources', priority: 'High', status: 'Pending', requestedBy: 'Sana Malik', amount: 12000, notes: 'Ergonomic mesh chairs for new floor layout.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'REQ-4468', item: 'Dell Latitude Laptops (15 units)', dept: 'IT Infrastructure', priority: 'Normal', status: 'Approved', requestedBy: 'Hamza Tariq', amount: 22500, notes: 'Required for new onboarding dev team.', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'REQ-4460', item: 'Industrial Steel Rods (500 units)', dept: 'Manufacturing', priority: 'High', status: 'Approved', requestedBy: 'Bilal Ahmed', amount: 45000, notes: 'Raw material batch for Q3 production line.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'REQ-4455', item: 'Warehouse Racking System', dept: 'Warehouse Ops', priority: 'Urgent', status: 'Pending', requestedBy: 'Ali Raza', amount: 35000, notes: 'Heavy duty palleted rack system.', created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 'REQ-4449', item: 'Printer Toner Cartridges (Bulk)', dept: 'Admin Services', priority: 'Normal', status: 'Approved', requestedBy: 'Fatima Noor', amount: 1800, notes: 'Stock replenishment for headquarters.', created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'REQ-4441', item: 'Generator Maintenance Contract', dept: 'Facilities', priority: 'Urgent', status: 'Rejected', requestedBy: 'Usman Sheikh', amount: 65000, notes: 'Annual servicing agreement.', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'REQ-4437', item: 'Cloud Server Capacity Upgrade', dept: 'IT Infrastructure', priority: 'Normal', status: 'Approved', requestedBy: 'Hamza Tariq', amount: 9600, notes: 'Expanded storage instance clusters.', created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
  ],
  documents: [
    { id: 1, requisition_id: 'REQ-4471', original_name: 'office_chairs_quote.pdf', stored_name: 'sample_quote.pdf', mime_type: 'application/pdf', size_bytes: 245000, uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
  history: [
    { id: 1, requisition_id: 'REQ-4471', old_status: null, new_status: 'Submitted', changed_by: 'Sana Malik', comment: 'Purchase Requisition Created', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 2, requisition_id: 'REQ-4468', old_status: 'Pending', new_status: 'Approved', changed_by: 'IT Manager', comment: 'Approved budget request', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  rfqs: [
    { id: 'RFQ-2026-001', requisition_id: 'REQ-4460', item: 'Industrial Steel Rods (500 units)', category: 'Raw Materials', budget: 45000, status: 'Awarded', invited_vendors: ['V-001', 'V-006'], awarded_vendor_id: 'V-001', awarded_quotation_id: 'QT-001', deadline: new Date(Date.now() - 86400000).toISOString(), created_by: 'Bilal Ahmed', notes: 'Q3 production line material. Must be ISO 9001 certified supplier.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'RFQ-2026-002', requisition_id: 'REQ-4468', item: 'Dell Latitude Laptops (15 units)', category: 'IT & Electronics', budget: 22500, status: 'Under Evaluation', invited_vendors: ['V-004', 'V-007'], awarded_vendor_id: null, awarded_quotation_id: null, deadline: new Date(Date.now() + 86400000 * 2).toISOString(), created_by: 'Hamza Tariq', notes: 'Laptops must have min 16GB RAM, 512GB SSD, Win 11 Pro.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'RFQ-2026-003', requisition_id: 'REQ-4471', item: 'Ergonomic Office Chairs (40 units)', category: 'Office Supplies', budget: 12000, status: 'Open Bidding', invited_vendors: ['V-005'], awarded_vendor_id: null, awarded_quotation_id: null, deadline: new Date(Date.now() + 86400000 * 5).toISOString(), created_by: 'Sana Malik', notes: 'Adjustable lumbar support required. Quantity: 40.', created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  quotations: [
    { id: 'QT-001', rfq_id: 'RFQ-2026-001', vendor_id: 'V-001', vendor_name: 'Al-Noor Steel Co.', unit_price: 82.4, total_amount: 41200, lead_time_days: 12, warranty_terms: '1 Year Material Warranty', tech_score: 92, tech_remarks: 'Fully compliant. Grade A steel rods. ISO 9001 verified.', status: 'Awarded', submitted_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'QT-002', rfq_id: 'RFQ-2026-001', vendor_id: 'V-006', vendor_name: 'Faisalabad Forge Ltd.', unit_price: 79.6, total_amount: 39800, lead_time_days: 21, warranty_terms: '6 Months Replacement', tech_score: 78, tech_remarks: 'Steel grade marginally compliant. Longer lead time is a concern.', status: 'Evaluated', submitted_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'QT-003', rfq_id: 'RFQ-2026-002', vendor_id: 'V-004', vendor_name: 'TechSphere Systems', unit_price: 1243, total_amount: 18645, lead_time_days: 9, warranty_terms: '3 Year Manufacturer Warranty', tech_score: 95, tech_remarks: 'Full spec compliance. 16GB RAM, 512GB NVMe SSD, Win 11 Pro.', status: 'Submitted', submitted_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'QT-004', rfq_id: 'RFQ-2026-002', vendor_id: 'V-007', vendor_name: 'Alpha Electronics', unit_price: 1380, total_amount: 20700, lead_time_days: 14, warranty_terms: '2 Year On-Site Service', tech_score: 81, tech_remarks: 'Meets spec but sourcing from third party. Slightly higher price.', status: 'Submitted', submitted_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  purchaseOrders: [
    {
      id: 'PO-2026-001',
      rfq_id: 'RFQ-2026-001',
      requisition_id: 'REQ-4460',
      vendor_id: 'V-001',
      vendor_name: 'Al-Noor Steel Co.',
      item: 'Industrial Steel Rods (500 units)',
      category: 'Raw Materials',
      quantity: 500,
      unit_price: 82.4,
      total_amount: 41200,
      tax_pct: 17,
      tax_amount: 7004,
      grand_total: 48204,
      currency: 'PKR',
      payment_terms: 'Net 30',
      payment_status: 'Pending',
      delivery_address: 'Plot 14, Industrial Zone, Lahore',
      delivery_date: new Date(Date.now() + 86400000 * 12).toISOString(),
      status: 'Confirmed',
      notes: 'Deliver to main warehouse gate. Contact: Ali Raza 0321-XXXXXXX',
      created_by: 'Bilal Ahmed',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      amendments: [],
      delivery_schedules: [
        { id: 'DS-001', milestone: 'Partial Delivery (250 units)', date: new Date(Date.now() + 86400000 * 7).toISOString(), qty: 250, status: 'Scheduled' },
        { id: 'DS-002', milestone: 'Final Delivery (250 units)', date: new Date(Date.now() + 86400000 * 12).toISOString(), qty: 250, status: 'Scheduled' },
      ],
      tracking: [
        { id: 'TRK-001', event: 'PO Created & Sent to Vendor', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), actor: 'Bilal Ahmed', note: 'Order confirmed. Vendor acknowledged receipt.' },
        { id: 'TRK-002', event: 'Vendor Confirmed', timestamp: new Date(Date.now() - 86400000).toISOString(), actor: 'Al-Noor Steel Co.', note: 'Production schedule shared. On track.' },
      ],
    },
    {
      id: 'PO-2026-002',
      rfq_id: 'RFQ-2026-002',
      requisition_id: 'REQ-4468',
      vendor_id: 'V-004',
      vendor_name: 'TechSphere Systems',
      item: 'Dell Latitude Laptops (15 units)',
      category: 'IT & Electronics',
      quantity: 15,
      unit_price: 1243,
      total_amount: 18645,
      tax_pct: 17,
      tax_amount: 3169.65,
      grand_total: 21814.65,
      currency: 'PKR',
      payment_terms: 'Net 15',
      payment_status: 'Invoiced',
      delivery_address: 'IT Dept, HQ Tower, Islamabad',
      delivery_date: new Date(Date.now() + 86400000 * 9).toISOString(),
      status: 'Pending',
      notes: 'Pre-load Windows 11 Pro. Asset tagging required upon receipt.',
      created_by: 'Hamza Tariq',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      amendments: [],
      delivery_schedules: [
        { id: 'DS-003', milestone: 'Full Delivery (15 Laptops)', date: new Date(Date.now() + 86400000 * 9).toISOString(), qty: 15, status: 'Scheduled' },
      ],
      tracking: [
        { id: 'TRK-003', event: 'PO Generated', timestamp: new Date(Date.now() - 86400000).toISOString(), actor: 'Hamza Tariq', note: 'PO issued pending vendor signature.' },
      ],
    },
    {
      id: 'PO-2026-003',
      rfq_id: 'RFQ-2026-003',
      requisition_id: 'REQ-4471',
      vendor_id: 'V-005',
      vendor_name: 'Punjab Office Supplies',
      item: 'Ergonomic Office Chairs (40 units)',
      category: 'Office Supplies',
      quantity: 40,
      unit_price: 250,
      total_amount: 10000,
      tax_pct: 17,
      tax_amount: 1700,
      grand_total: 11700,
      currency: 'PKR',
      payment_terms: 'Net 30',
      payment_status: 'Paid',
      delivery_address: 'HR Dept Floor 3, HQ, Lahore',
      delivery_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: 'Delivered',
      notes: 'Delivered and inspected by Sana Malik.',
      created_by: 'Sana Malik',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      amendments: [],
      delivery_schedules: [],
      tracking: [
        { id: 'TRK-004', event: 'Order Delivered & Inspected', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), actor: 'Sana Malik', note: 'All 40 units accepted in good order.' },
      ],
    },
  ],
  approvals: [
    {
      id: 'APP-001',
      target_type: 'Requisition',
      target_id: 'REQ-4471',
      title: 'Ergonomic Office Chairs (40 units)',
      department: 'Human Resources',
      requested_by: 'Sana Malik',
      amount: 12000,
      priority: 'High',
      current_stage: 'Dept Manager',
      required_stages: ['Dept Manager', 'Finance'],
      status: 'Pending',
      overdue: false,
      hours_pending: 14,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      approval_trail: [
        { stage: 'Dept Manager', status: 'Pending', approver: null, remarks: null, timestamp: null },
        { stage: 'Finance', status: 'Pending', approver: null, remarks: null, timestamp: null },
      ],
    },
    {
      id: 'APP-002',
      target_type: 'Requisition',
      target_id: 'REQ-4455',
      title: 'Warehouse Racking System',
      department: 'Warehouse Ops',
      requested_by: 'Ali Raza',
      amount: 35000,
      priority: 'Urgent',
      current_stage: 'Finance',
      required_stages: ['Dept Manager', 'Finance', 'Procurement'],
      status: 'Pending',
      overdue: true,
      hours_pending: 28,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      approval_trail: [
        { stage: 'Dept Manager', status: 'Approved', approver: 'WMS Manager (Tariq)', remarks: 'Urgent expansion required.', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { stage: 'Finance', status: 'Pending', approver: null, remarks: null, timestamp: null },
        { stage: 'Procurement', status: 'Pending', approver: null, remarks: null, timestamp: null },
      ],
    },
    {
      id: 'APP-003',
      target_type: 'Purchase Order',
      target_id: 'PO-2026-001',
      title: 'Industrial Steel Rods (500 units)',
      department: 'Manufacturing',
      requested_by: 'Bilal Ahmed',
      amount: 48204,
      priority: 'High',
      current_stage: 'Procurement',
      required_stages: ['Dept Manager', 'Finance', 'Procurement'],
      status: 'Pending',
      overdue: false,
      hours_pending: 8,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      approval_trail: [
        { stage: 'Dept Manager', status: 'Approved', approver: 'MFG Manager', remarks: 'Approved for production batch.', timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString() },
        { stage: 'Finance', status: 'Approved', approver: 'CFO (Kamran)', remarks: 'Capex budget verified.', timestamp: new Date(Date.now() - 86400000 * 0.4).toISOString() },
        { stage: 'Procurement', status: 'Pending', approver: null, remarks: null, timestamp: null },
      ],
    },
    {
      id: 'APP-004',
      target_type: 'Requisition',
      target_id: 'REQ-4441',
      title: 'Generator Maintenance Contract',
      department: 'Facilities',
      requested_by: 'Usman Sheikh',
      amount: 65000,
      priority: 'Urgent',
      current_stage: 'CEO',
      required_stages: ['Dept Manager', 'Finance', 'Procurement', 'CEO'],
      status: 'Rejected',
      overdue: false,
      hours_pending: 0,
      rejection_reason: 'Quote exceeded maximum allowable facilities threshold for Q3.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      approval_trail: [
        { stage: 'Dept Manager', status: 'Approved', approver: 'Facilities Head', remarks: 'Essential servicing.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
        { stage: 'Finance', status: 'Approved', approver: 'Finance Controller', remarks: 'Budget code 8820.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
        { stage: 'Procurement', status: 'Approved', approver: 'Procurement Head', remarks: 'Vendor vetted.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
        { stage: 'CEO', status: 'Rejected', approver: 'CEO Office', remarks: 'Exceeds threshold.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
      ],
    },
  ],
}

// ─── Helpers ─────────────────────────────────────────
function loadData() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2))
      return JSON.parse(JSON.stringify(initialData))
    }
    const content = fs.readFileSync(dbFilePath, 'utf-8')
    const parsed = JSON.parse(content)
    let updated = false
    for (const key of Object.keys(initialData)) {
      if (!parsed[key] || (Array.isArray(parsed[key]) && parsed[key].length === 0)) {
        parsed[key] = initialData[key]
        updated = true
      }
    }
    if (updated) fs.writeFileSync(dbFilePath, JSON.stringify(parsed, null, 2))
    return parsed
  } catch (err) {
    console.error('Error reading db.json:', err)
    return JSON.parse(JSON.stringify(initialData))
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error writing db.json:', err)
  }
}

function computeBudgetStatus(utilizationPct) {
  if (utilizationPct > 100) return 'Over Budget'
  if (utilizationPct >= 85) return 'Near Limit'
  return 'Healthy'
}

// ─── DB API ───────────────────────────────────────────
export const db = {

  // ── Departments ──────────────────────────────────────
  getDepartments() {
    return loadData().departments.sort((a, b) => a.name.localeCompare(b.name))
  },

  // ── Budget Management ────────────────────────────────
  getBudgets({ dept, fiscal_year, quarter, status, search } = {}) {
    const data = loadData()
    let list = data.budgets || []

    if (dept && dept !== 'All') list = list.filter(b => b.dept === dept)
    if (fiscal_year && fiscal_year !== 'All') list = list.filter(b => b.fiscal_year === fiscal_year)
    if (quarter && quarter !== 'All') list = list.filter(b => b.quarter === quarter)
    if (status && status !== 'All') list = list.filter(b => b.status === status)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(b =>
        b.id.toLowerCase().includes(t) ||
        b.dept.toLowerCase().includes(t) ||
        (b.code && b.code.toLowerCase().includes(t))
      )
    }

    return list.sort((a, b) => (b.allocated_budget || 0) - (a.allocated_budget || 0))
  },

  getBudgetById(id) {
    const data = loadData()
    return (data.budgets || []).find(b => b.id === id) || null
  },

  createBudget({ dept, fiscal_year, quarter, allocated_budget, category_allocations, notes, created_by }) {
    const data = loadData()
    if (!data.budgets) data.budgets = []

    const nums = data.budgets.map(b => { const p = b.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const bdgId = `BDG-2026-${String(next).padStart(3, '0')}`

    const allocated = parseFloat(allocated_budget) || 0
    const spent = 0
    const committed = 0
    const remaining = allocated
    const utilPct = 0

    const deptObj = (data.departments || []).find(d => d.name === dept)

    const newBudget = {
      id: bdgId,
      dept,
      code: deptObj ? deptObj.code : 'DEPT',
      fiscal_year: fiscal_year || '2026',
      quarter: quarter || 'Annual',
      allocated_budget: allocated,
      spent_amount: spent,
      committed_amount: committed,
      remaining_budget: remaining,
      utilization_pct: utilPct,
      status: 'Healthy',
      category_allocations: category_allocations || [
        { category: 'Equipment & Supplies', allocated: Math.round(allocated * 0.6), spent: 0 },
        { category: 'Services & Operations', allocated: Math.round(allocated * 0.4), spent: 0 },
      ],
      notes: notes || '',
      created_by: created_by || 'Finance Director',
      created_at: new Date().toISOString(),
    }

    data.budgets.push(newBudget)
    saveData(data)
    return newBudget
  },

  updateBudget(id, fields) {
    const data = loadData()
    const b = (data.budgets || []).find(b => b.id === id)
    if (!b) return null

    if (fields.dept !== undefined) {
      b.dept = fields.dept
      const deptObj = (data.departments || []).find(d => d.name === fields.dept)
      if (deptObj) b.code = deptObj.code
    }

    for (const k of ['fiscal_year', 'quarter', 'notes']) {
      if (fields[k] !== undefined) b[k] = fields[k]
    }

    if (fields.allocated_budget !== undefined) {
      b.allocated_budget = parseFloat(fields.allocated_budget) || 0
    }
    if (fields.spent_amount !== undefined) {
      b.spent_amount = parseFloat(fields.spent_amount) || 0
    }
    if (fields.committed_amount !== undefined) {
      b.committed_amount = parseFloat(fields.committed_amount) || 0
    }

    b.remaining_budget = +(b.allocated_budget - (b.spent_amount + b.committed_amount)).toFixed(2)
    b.utilization_pct = b.allocated_budget > 0 ? +(((b.spent_amount + b.committed_amount) / b.allocated_budget) * 100).toFixed(1) : 0
    b.status = computeBudgetStatus(b.utilization_pct)

    if (fields.category_allocations !== undefined) {
      b.category_allocations = fields.category_allocations
    }

    saveData(data)
    return b
  },

  reallocateBudget(id, { from_category, to_category, amount, notes }) {
    const data = loadData()
    const b = (data.budgets || []).find(bd => bd.id === id)
    if (!b) return null

    const amt = parseFloat(amount) || 0
    const fromCat = b.category_allocations.find(c => c.category === from_category)
    const toCat = b.category_allocations.find(c => c.category === to_category)

    if (fromCat && toCat) {
      fromCat.allocated = Math.max(0, fromCat.allocated - amt)
      toCat.allocated += amt
    }

    saveData(data)
    return b
  },

  deleteBudget(id) {
    const data = loadData()
    const idx = (data.budgets || []).findIndex(b => b.id === id)
    if (idx === -1) return false
    data.budgets.splice(idx, 1)
    saveData(data)
    return true
  },

  getBudgetStats() {
    const data = loadData()
    const list = data.budgets || []

    const totalAllocated = list.reduce((sum, b) => sum + (b.allocated_budget || 0), 0)
    const totalSpent = list.reduce((sum, b) => sum + (b.spent_amount || 0), 0)
    const totalCommitted = list.reduce((sum, b) => sum + (b.committed_amount || 0), 0)
    const totalRemaining = totalAllocated - (totalSpent + totalCommitted)

    const avgUtilization = list.length ? (list.reduce((sum, b) => sum + (b.utilization_pct || 0), 0) / list.length).toFixed(1) : 0
    const overBudgetCount = list.filter(b => b.status === 'Over Budget' || b.utilization_pct > 100).length

    return {
      total_allocated: totalAllocated,
      total_spent: totalSpent,
      total_committed: totalCommitted,
      total_remaining: totalRemaining,
      average_utilization: avgUtilization,
      over_budget_count: overBudgetCount,
      total_departments_count: list.length,
    }
  },

  getDepartmentSpendingChart() {
    const data = loadData()
    const list = data.budgets || []
    return list.map(b => ({
      name: b.dept,
      allocated: +(b.allocated_budget / 1000).toFixed(1), // in thousands
      spent: +((b.spent_amount + b.committed_amount) / 1000).toFixed(1),
      raw_allocated: b.allocated_budget,
      raw_spent: b.spent_amount + b.committed_amount,
    }))
  },

  // ── Vendors ──────────────────────────────────────────
  getVendors({ category, status, search } = {}) {
    let list = loadData().vendors || []
    if (category && category !== 'All') list = list.filter(v => v.category === category)
    if (status && status !== 'All') list = list.filter(v => v.status === status)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(v =>
        v.name.toLowerCase().includes(t) ||
        v.category.toLowerCase().includes(t) ||
        v.location.toLowerCase().includes(t) ||
        (v.ntn && v.ntn.toLowerCase().includes(t)) ||
        (v.contact_person && v.contact_person.toLowerCase().includes(t))
      )
    }
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  },

  getVendorById(id) {
    return (loadData().vendors || []).find(v => v.id === id) || null
  },

  createVendor(fields) {
    const data = loadData()
    if (!data.vendors) data.vendors = []

    const nums = data.vendors.map(v => { const p = v.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const vendorId = `V-${String(next).padStart(3, '0')}`

    const newVendor = {
      id: vendorId,
      name: fields.name,
      category: fields.category || 'General',
      contact_person: fields.contact_person || '',
      email: fields.email || '',
      phone: fields.phone || '',
      location: fields.location || '',
      website: fields.website || '',
      established_year: parseInt(fields.established_year) || new Date().getFullYear(),
      status: fields.status || 'Active',
      ntn: fields.ntn || '',
      strn: fields.strn || '',
      tax_filer_status: fields.tax_filer_status || 'Active Filer',
      tax_wht_pct: parseFloat(fields.tax_wht_pct) || 3,
      cert: fields.cert || '—',
      cert_expiry: fields.cert_expiry || null,
      bank_name: fields.bank_name || '',
      account_title: fields.account_title || '',
      account_no: fields.account_no || '',
      iban: fields.iban || '',
      swift_code: fields.swift_code || '',
      rating: parseFloat(fields.rating) || 85,
      delivery_score: parseFloat(fields.delivery_score) || 85,
      quality_score: parseFloat(fields.quality_score) || 85,
      cost_efficiency_score: parseFloat(fields.cost_efficiency_score) || 85,
      contract_compliance_score: parseFloat(fields.contract_compliance_score) || 85,
      on_time_rate: parseInt(fields.on_time_rate) || 90,
      quality_compliance: parseInt(fields.quality_compliance) || 90,
      completed_orders_count: 0,
    }

    data.vendors.push(newVendor)
    saveData(data)
    return newVendor
  },

  updateVendor(id, fields) {
    const data = loadData()
    const v = (data.vendors || []).find(v => v.id === id)
    if (!v) return null

    const allowedKeys = [
      'name', 'category', 'contact_person', 'email', 'phone', 'location',
      'website', 'established_year', 'status', 'ntn', 'strn', 'tax_filer_status',
      'tax_wht_pct', 'cert', 'cert_expiry', 'bank_name', 'account_title',
      'account_no', 'iban', 'swift_code', 'rating', 'delivery_score',
      'quality_score', 'cost_efficiency_score', 'contract_compliance_score',
      'on_time_rate', 'quality_compliance'
    ]

    for (const key of allowedKeys) {
      if (fields[key] !== undefined) {
        if (['rating', 'tax_wht_pct', 'delivery_score', 'quality_score', 'cost_efficiency_score', 'contract_compliance_score'].includes(key)) {
          v[key] = parseFloat(fields[key])
        } else if (['established_year', 'on_time_rate', 'quality_compliance'].includes(key)) {
          v[key] = parseInt(fields[key])
        } else {
          v[key] = fields[key]
        }
      }
    }

    saveData(data)
    return v
  },

  deleteVendor(id) {
    const data = loadData()
    const idx = (data.vendors || []).findIndex(v => v.id === id)
    if (idx === -1) return false
    data.vendors.splice(idx, 1)
    data.complaints = (data.complaints || []).filter(c => c.vendor_id !== id)
    data.contracts = (data.contracts || []).filter(c => c.vendor_id !== id)
    saveData(data)
    return true
  },

  getVendorStats() {
    const data = loadData()
    const list = data.vendors || []
    const active = list.filter(v => v.status === 'Active')
    const underReview = list.filter(v => v.status === 'Under Review')
    const certified = list.filter(v => v.cert && v.cert !== '—')
    const filers = list.filter(v => v.tax_filer_status === 'Active Filer')

    const avgRating = list.length ? (list.reduce((sum, v) => sum + (v.rating || 0), 0) / list.length).toFixed(1) : 0

    return {
      total_vendors: list.length,
      active_vendors: active.length,
      under_review: underReview.length,
      certified_count: certified.length,
      active_filers: filers.length,
      average_rating: avgRating,
    }
  },

  // ── Contract Management ─────────────────────────────
  getContracts({ status, type, vendor_id, search } = {}) {
    const data = loadData()
    let list = data.contracts || []

    const now = new Date()

    for (const c of list) {
      if (c.expiry_date) {
        const exp = new Date(c.expiry_date)
        const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
        if (diffDays < 0 && c.status !== 'Terminated') {
          c.status = 'Expired'
        } else if (diffDays >= 0 && diffDays <= 30 && c.status === 'Active') {
          c.status = 'Expiring Soon'
        }
      }
    }

    if (status && status !== 'All') list = list.filter(c => c.status === status)
    if (type && type !== 'All') list = list.filter(c => c.contract_type === type)
    if (vendor_id && vendor_id !== 'All') list = list.filter(c => c.vendor_id === vendor_id)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(c =>
        c.id.toLowerCase().includes(t) ||
        c.title.toLowerCase().includes(t) ||
        c.vendor_name.toLowerCase().includes(t) ||
        c.contract_type.toLowerCase().includes(t)
      )
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getContractById(id) {
    const data = loadData()
    return (data.contracts || []).find(c => c.id === id) || null
  },

  createContract({ vendor_id, title, contract_type, contract_value, start_date, expiry_date, renewal_date, auto_renew, compliance_documents, notes, created_by }) {
    const data = loadData()
    if (!data.contracts) data.contracts = []

    const vendor = (data.vendors || []).find(v => v.id === vendor_id)
    const nums = data.contracts.map(c => { const p = c.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const cntId = `CNT-2026-${String(next).padStart(3, '0')}`

    const contract = {
      id: cntId,
      vendor_id,
      vendor_name: vendor ? vendor.name : 'Unknown Vendor',
      title,
      contract_type: contract_type || 'Master Services Agreement',
      contract_value: parseFloat(contract_value) || 0,
      start_date: start_date || new Date().toISOString(),
      expiry_date: expiry_date || null,
      renewal_date: renewal_date || null,
      auto_renew: Boolean(auto_renew),
      status: 'Active',
      compliance_documents: compliance_documents || ['ISO Certificate', 'NDA Agreement'],
      attachments: [],
      renewals_history: [
        { id: `REN-${Date.now()}`, renewed_on: new Date().toISOString(), new_expiry: expiry_date, renewed_by: created_by || 'Legal Team', notes: 'Initial contract executed.' }
      ],
      notes: notes || '',
      created_by: created_by || 'Legal Team',
      created_at: new Date().toISOString(),
    }

    data.contracts.push(contract)
    saveData(data)
    return contract
  },

  updateContract(id, fields) {
    const data = loadData()
    const cnt = (data.contracts || []).find(c => c.id === id)
    if (!cnt) return null

    if (fields.vendor_id !== undefined) {
      cnt.vendor_id = fields.vendor_id
      const vendor = (data.vendors || []).find(v => v.id === fields.vendor_id)
      if (vendor) cnt.vendor_name = vendor.name
    }

    for (const k of ['title', 'contract_type', 'start_date', 'expiry_date', 'renewal_date', 'status', 'notes']) {
      if (fields[k] !== undefined) cnt[k] = fields[k]
    }

    if (fields.contract_value !== undefined) cnt.contract_value = parseFloat(fields.contract_value) || 0
    if (fields.auto_renew !== undefined) cnt.auto_renew = Boolean(fields.auto_renew)
    if (fields.compliance_documents !== undefined) cnt.compliance_documents = fields.compliance_documents

    saveData(data)
    return cnt
  },

  renewContract(id, { new_expiry_date, renewed_by, notes }) {
    const data = loadData()
    const cnt = (data.contracts || []).find(c => c.id === id)
    if (!cnt) return null

    cnt.expiry_date = new_expiry_date
    cnt.status = 'Active'

    if (!cnt.renewals_history) cnt.renewals_history = []
    cnt.renewals_history.push({
      id: `REN-${Date.now()}`,
      renewed_on: new Date().toISOString(),
      new_expiry: new_expiry_date,
      renewed_by: renewed_by || 'Legal Team',
      notes: notes || 'Contract extension executed.',
    })

    saveData(data)
    return cnt
  },

  deleteContract(id) {
    const data = loadData()
    const idx = (data.contracts || []).findIndex(c => c.id === id)
    if (idx === -1) return false
    data.contracts.splice(idx, 1)
    saveData(data)
    return true
  },

  getContractStats() {
    const data = loadData()
    const list = data.contracts || []
    const active = list.filter(c => c.status === 'Active')
    const expiringSoon = list.filter(c => c.status === 'Expiring Soon')
    const expired = list.filter(c => c.status === 'Expired')

    const totalValue = list.reduce((sum, c) => sum + (c.contract_value || 0), 0)

    return {
      total_contracts: list.length,
      active_contracts: active.length,
      expiring_soon: expiringSoon.length,
      expired_contracts: expired.length,
      total_contract_value: totalValue,
    }
  },

  // ── Performance Analytics & Complaints Engine ────────
  getVendorPerformanceRadar() {
    const data = loadData()
    const vendors = data.vendors || []
    if (!vendors.length) return []

    const avgDelivery = Math.round(vendors.reduce((s, v) => s + (v.delivery_score || 85), 0) / vendors.length)
    const avgQuality = Math.round(vendors.reduce((s, v) => s + (v.quality_score || 85), 0) / vendors.length)
    const avgCost = Math.round(vendors.reduce((s, v) => s + (v.cost_efficiency_score || 85), 0) / vendors.length)
    const avgContract = Math.round(vendors.reduce((s, v) => s + (v.contract_compliance_score || 85), 0) / vendors.length)
    const avgOverall = Math.round(vendors.reduce((s, v) => s + (v.rating || 85), 0) / vendors.length)

    return [
      { name: 'Delivery Time', value: avgDelivery, fullMark: 100 },
      { name: 'Quality Score', value: avgQuality, fullMark: 100 },
      { name: 'Cost Efficiency', value: avgCost, fullMark: 100 },
      { name: 'Contract Compliance', value: avgContract, fullMark: 100 },
      { name: 'Overall Rating', value: avgOverall, fullMark: 100 },
    ]
  },

  getComplaints({ vendor_id, status, severity, search } = {}) {
    const data = loadData()
    let list = data.complaints || []
    if (vendor_id && vendor_id !== 'All') list = list.filter(c => c.vendor_id === vendor_id)
    if (status && status !== 'All') list = list.filter(c => c.status === status)
    if (severity && severity !== 'All') list = list.filter(c => c.severity === severity)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(c =>
        c.id.toLowerCase().includes(t) ||
        c.vendor_name.toLowerCase().includes(t) ||
        c.issue_type.toLowerCase().includes(t) ||
        c.description.toLowerCase().includes(t)
      )
    }
    return list.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
  },

  createComplaint({ vendor_id, issue_type, severity, description, logged_by, resolution_notes }) {
    const data = loadData()
    if (!data.complaints) data.complaints = []

    const vendor = (data.vendors || []).find(v => v.id === vendor_id)
    const nums = data.complaints.map(c => parseInt(c.id.replace('CMP-', '')) || 0)
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const cmpId = `CMP-${String(next).padStart(3, '0')}`

    const cmp = {
      id: cmpId,
      vendor_id,
      vendor_name: vendor ? vendor.name : 'Unknown Vendor',
      issue_type: issue_type || 'General SLA Breach',
      severity: severity || 'Medium',
      status: 'Open',
      description: description || '',
      logged_by: logged_by || 'Quality Inspector',
      resolution_notes: resolution_notes || '',
      logged_at: new Date().toISOString(),
      resolved_at: null,
    }

    data.complaints.push(cmp)

    if (vendor) {
      const penalty = severity === 'Critical' ? 5 : severity === 'High' ? 3 : 1
      vendor.rating = Math.max(0, (vendor.rating || 85) - penalty)
    }

    saveData(data)
    return cmp
  },

  updateComplaint(id, fields) {
    const data = loadData()
    const cmp = (data.complaints || []).find(c => c.id === id)
    if (!cmp) return null

    for (const k of ['issue_type', 'severity', 'status', 'description', 'resolution_notes']) {
      if (fields[k] !== undefined) cmp[k] = fields[k]
    }

    if (fields.status === 'Resolved' && !cmp.resolved_at) {
      cmp.resolved_at = new Date().toISOString()
    }

    saveData(data)
    return cmp
  },

  deleteComplaint(id) {
    const data = loadData()
    const idx = (data.complaints || []).findIndex(c => c.id === id)
    if (idx === -1) return false
    data.complaints.splice(idx, 1)
    saveData(data)
    return true
  },

  // ── Requisitions ─────────────────────────────────────
  getRequisitions({ dept, status, priority, search } = {}) {
    let list = loadData().requisitions || []
    if (dept && dept !== 'All') list = list.filter(r => r.dept === dept)
    if (status && status !== 'All') list = list.filter(r => r.status === status)
    if (priority && priority !== 'All') list = list.filter(r => r.priority === priority)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(r => r.id.toLowerCase().includes(t) || r.item.toLowerCase().includes(t) || r.requestedBy.toLowerCase().includes(t))
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getRequisitionById(id) {
    const data = loadData()
    const req = (data.requisitions || []).find(r => r.id === id)
    if (!req) return null
    return {
      ...req,
      documents: (data.documents || []).filter(d => d.requisition_id === id),
      history: (data.history || []).filter(h => h.requisition_id === id).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    }
  },

  createRequisition({ item, dept, priority, requestedBy, amount, notes, files = [] }) {
    const data = loadData()
    if (!data.requisitions) data.requisitions = []
    if (!data.history) data.history = []
    if (!data.documents) data.documents = []
    if (!data.approvals) data.approvals = []

    const nums = data.requisitions.map(r => parseInt(r.id.replace('REQ-', '')) || 0)
    const reqId = `REQ-${(Math.max(...nums, 4400) + 1)}`
    const createdAt = new Date().toISOString()
    const amt = parseFloat(amount) || 0
    const newReq = { id: reqId, item, dept, priority: priority || 'Normal', status: 'Pending', requestedBy, amount: amt, notes: notes || '', created_at: createdAt }
    data.requisitions.push(newReq)
    data.history.push({ id: Date.now(), requisition_id: reqId, old_status: null, new_status: 'Submitted', changed_by: requestedBy, comment: 'Purchase Requisition Created', timestamp: createdAt })
    const savedDocs = []
    for (const file of files) {
      const doc = { id: Date.now() + Math.floor(Math.random() * 1000), requisition_id: reqId, original_name: file.originalname, stored_name: file.filename, mime_type: file.mimetype, size_bytes: file.size, uploaded_at: createdAt }
      data.documents.push(doc); savedDocs.push(doc)
    }

    const reqStages = getRequiredStagesForAmount(amt)
    const appItem = {
      id: `APP-${String(data.approvals.length + 1).padStart(3, '0')}`,
      target_type: 'Requisition',
      target_id: reqId,
      title: item,
      department: dept,
      requested_by: requestedBy,
      amount: amt,
      priority: priority || 'Normal',
      current_stage: reqStages[0],
      required_stages: reqStages,
      status: 'Pending',
      overdue: false,
      hours_pending: 1,
      created_at: createdAt,
      approval_trail: reqStages.map(st => ({ stage: st, status: 'Pending', approver: null, remarks: null, timestamp: null })),
    }
    data.approvals.push(appItem)

    saveData(data)
    return { ...newReq, documents: savedDocs }
  },

  updateRequisition(id, fields) {
    const data = loadData()
    const req = (data.requisitions || []).find(r => r.id === id)
    if (!req) return null
    for (const k of ['item', 'dept', 'priority', 'requestedBy', 'notes']) { if (fields[k] !== undefined) req[k] = fields[k] }
    if (fields.amount !== undefined) req.amount = parseFloat(fields.amount) || 0
    data.history.push({ id: Date.now(), requisition_id: id, old_status: req.status, new_status: req.status, changed_by: fields.requestedBy || 'User', comment: 'Details updated', timestamp: new Date().toISOString() })
    saveData(data); return this.getRequisitionById(id)
  },

  deleteRequisition(id) {
    const data = loadData()
    const idx = (data.requisitions || []).findIndex(r => r.id === id)
    if (idx === -1) return false
    data.requisitions.splice(idx, 1)
    data.documents = (data.documents || []).filter(d => d.requisition_id !== id)
    data.history = (data.history || []).filter(h => h.requisition_id !== id)
    data.approvals = (data.approvals || []).filter(a => a.target_id !== id)
    saveData(data); return true
  },

  addDocument(reqId, file) {
    const data = loadData()
    if (!data.requisitions.find(r => r.id === reqId)) return null
    const doc = { id: Date.now(), requisition_id: reqId, original_name: file.originalname, stored_name: file.filename, mime_type: file.mimetype, size_bytes: file.size, uploaded_at: new Date().toISOString() }
    data.documents.push(doc); saveData(data); return doc
  },

  deleteDocument(docId) {
    const data = loadData()
    const idx = (data.documents || []).findIndex(d => d.id === Number(docId))
    if (idx === -1) return false
    data.documents.splice(idx, 1); saveData(data); return true
  },

  updateStatus(reqId, { status, changedBy, comment }) {
    const data = loadData()
    const req = (data.requisitions || []).find(r => r.id === reqId)
    if (!req) return null
    const old = req.status; req.status = status
    data.history.push({ id: Date.now(), requisition_id: reqId, old_status: old, new_status: status, changed_by: changedBy || 'Approver', comment: comment || `Status → ${status}`, timestamp: new Date().toISOString() })
    saveData(data); return this.getRequisitionById(reqId)
  },

  // ── RFQs ─────────────────────────────────────────────
  getRFQs({ status, category, search } = {}) {
    const data = loadData()
    let list = data.rfqs || []
    if (status && status !== 'All') list = list.filter(r => r.status === status)
    if (category && category !== 'All') list = list.filter(r => r.category === category)
    if (search) { const t = search.toLowerCase(); list = list.filter(r => r.id.toLowerCase().includes(t) || r.item.toLowerCase().includes(t)) }
    return list.map(rfq => {
      const quotes = (data.quotations || []).filter(q => q.rfq_id === rfq.id)
      const awardedVendor = rfq.awarded_vendor_id ? (data.vendors || []).find(v => v.id === rfq.awarded_vendor_id) || null : null
      return { ...rfq, quotation_count: quotes.length, awarded_vendor: awardedVendor }
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getRFQById(id) {
    const data = loadData()
    const rfq = (data.rfqs || []).find(r => r.id === id)
    if (!rfq) return null
    const quotes = (data.quotations || []).filter(q => q.rfq_id === id)
    const invitedVendors = rfq.invited_vendors.map(vid => (data.vendors || []).find(v => v.id === vid) || { id: vid, name: 'Unknown' })
    const awardedVendor = rfq.awarded_vendor_id ? (data.vendors || []).find(v => v.id === rfq.awarded_vendor_id) || null : null
    return { ...rfq, quotations: quotes, invited_vendors_detail: invitedVendors, awarded_vendor: awardedVendor }
  },

  createRFQ({ item, category, budget, requisition_id, invited_vendors, deadline, notes, created_by }) {
    const data = loadData()
    if (!data.rfqs) data.rfqs = []
    const nums = data.rfqs.map(r => { const p = r.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const rfqId = `RFQ-2026-${String(next).padStart(3, '0')}`
    const newRFQ = { id: rfqId, requisition_id: requisition_id || null, item, category: category || 'General', budget: parseFloat(budget) || 0, status: 'Open Bidding', invited_vendors: invited_vendors || [], awarded_vendor_id: null, awarded_quotation_id: null, deadline: deadline || null, created_by: created_by || 'Procurement Manager', notes: notes || '', created_at: new Date().toISOString() }
    data.rfqs.push(newRFQ); saveData(data); return this.getRFQById(rfqId)
  },

  updateRFQ(id, fields) {
    const data = loadData()
    const rfq = (data.rfqs || []).find(r => r.id === id)
    if (!rfq) return null
    for (const k of ['item', 'category', 'budget', 'deadline', 'notes', 'invited_vendors', 'status']) { if (fields[k] !== undefined) rfq[k] = fields[k] }
    saveData(data); return this.getRFQById(id)
  },

  deleteRFQ(id) {
    const data = loadData()
    const idx = (data.rfqs || []).findIndex(r => r.id === id)
    if (idx === -1) return false
    data.rfqs.splice(idx, 1)
    data.quotations = (data.quotations || []).filter(q => q.rfq_id !== id)
    saveData(data); return true
  },

  submitQuotation({ rfq_id, vendor_id, unit_price, total_amount, lead_time_days, warranty_terms, tech_score, tech_remarks }) {
    const data = loadData()
    if (!data.quotations) data.quotations = []
    const rfq = (data.rfqs || []).find(r => r.id === rfq_id)
    if (!rfq) return null
    const vendor = (data.vendors || []).find(v => v.id === vendor_id)
    const nums = data.quotations.map(q => { const p = q.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const quote = { id: `QT-${String(next).padStart(3, '0')}`, rfq_id, vendor_id, vendor_name: vendor ? vendor.name : 'Unknown', unit_price: parseFloat(unit_price) || 0, total_amount: parseFloat(total_amount) || 0, lead_time_days: parseInt(lead_time_days) || 0, warranty_terms: warranty_terms || '', tech_score: tech_score ? parseFloat(tech_score) : null, tech_remarks: tech_remarks || '', status: 'Submitted', submitted_at: new Date().toISOString() }
    data.quotations.push(quote)
    if (rfq.status === 'Open Bidding') rfq.status = 'Under Evaluation'
    saveData(data); return quote
  },

  updateQuotationEvaluation(rfq_id, quote_id, { tech_score, tech_remarks }) {
    const data = loadData()
    const quote = (data.quotations || []).find(q => q.id === quote_id && q.rfq_id === rfq_id)
    if (!quote) return null
    if (tech_score !== undefined) quote.tech_score = parseFloat(tech_score)
    if (tech_remarks !== undefined) quote.tech_remarks = tech_remarks
    quote.status = 'Evaluated'; saveData(data); return quote
  },

  awardRFQ(rfq_id, quote_id, awarded_by) {
    const data = loadData()
    const rfq = (data.rfqs || []).find(r => r.id === rfq_id)
    const quote = (data.quotations || []).find(q => q.id === quote_id && q.rfq_id === rfq_id)
    if (!rfq || !quote) return null
    rfq.status = 'Awarded'; rfq.awarded_vendor_id = quote.vendor_id; rfq.awarded_quotation_id = quote_id
    for (const q of data.quotations.filter(q => q.rfq_id === rfq_id)) { q.status = q.id === quote_id ? 'Awarded' : 'Not Selected' }
    saveData(data); return this.getRFQById(rfq_id)
  },

  deleteQuotation(quote_id) {
    const data = loadData()
    const idx = (data.quotations || []).findIndex(q => q.id === quote_id)
    if (idx === -1) return false
    data.quotations.splice(idx, 1); saveData(data); return true
  },

  // ── Purchase Orders ───────────────────────────────────
  getPurchaseOrders({ status, vendor_id, search } = {}) {
    const data = loadData()
    let list = data.purchaseOrders || []
    if (status && status !== 'All') list = list.filter(p => p.status === status)
    if (vendor_id && vendor_id !== 'All') list = list.filter(p => p.vendor_id === vendor_id)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(p => p.id.toLowerCase().includes(t) || p.item.toLowerCase().includes(t) || p.vendor_name.toLowerCase().includes(t))
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getPurchaseOrderById(id) {
    return (loadData().purchaseOrders || []).find(p => p.id === id) || null
  },

  createPurchaseOrder({ rfq_id, requisition_id, vendor_id, item, category, quantity, unit_price, total_amount, tax_pct, currency, payment_terms, delivery_address, delivery_date, notes, created_by }) {
    const data = loadData()
    if (!data.purchaseOrders) data.purchaseOrders = []

    const vendor = (data.vendors || []).find(v => v.id === vendor_id)
    const nums = data.purchaseOrders.map(p => { const parts = p.id.split('-'); return parseInt(parts[parts.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const poId = `PO-2026-${String(next).padStart(3, '0')}`
    const tp = parseFloat(tax_pct) || 0
    const amt = parseFloat(total_amount) || (parseFloat(unit_price) * parseInt(quantity)) || 0
    const taxAmt = +(amt * tp / 100).toFixed(2)
    const grandTotal = +(amt + taxAmt).toFixed(2)

    const po = {
      id: poId,
      rfq_id: rfq_id || null,
      requisition_id: requisition_id || null,
      vendor_id,
      vendor_name: vendor ? vendor.name : 'Unknown Vendor',
      item,
      category: category || 'General',
      quantity: parseInt(quantity) || 1,
      unit_price: parseFloat(unit_price) || 0,
      total_amount: amt,
      tax_pct: tp,
      tax_amount: taxAmt,
      grand_total: grandTotal,
      currency: currency || 'PKR',
      payment_terms: payment_terms || 'Net 30',
      payment_status: 'Pending',
      delivery_address: delivery_address || '',
      delivery_date: delivery_date || null,
      status: 'Pending',
      notes: notes || '',
      created_by: created_by || 'Procurement Manager',
      created_at: new Date().toISOString(),
      amendments: [],
      delivery_schedules: [],
      tracking: [{ id: `TRK-${Date.now()}`, event: 'PO Created', timestamp: new Date().toISOString(), actor: created_by || 'Procurement Manager', note: 'Purchase Order generated and dispatched to vendor.' }],
    }

    data.purchaseOrders.push(po)
    saveData(data)
    return po
  },

  updatePurchaseOrder(id, fields) {
    const data = loadData()
    const po = (data.purchaseOrders || []).find(p => p.id === id)
    if (!po) return null

    if (fields.vendor_id !== undefined) {
      po.vendor_id = fields.vendor_id
      const vendor = (data.vendors || []).find(v => v.id === fields.vendor_id)
      if (vendor) po.vendor_name = vendor.name
    }

    if (fields.item !== undefined) po.item = fields.item
    if (fields.category !== undefined) po.category = fields.category
    if (fields.quantity !== undefined) po.quantity = parseInt(fields.quantity) || 1
    if (fields.unit_price !== undefined) po.unit_price = parseFloat(fields.unit_price) || 0
    if (fields.currency !== undefined) po.currency = fields.currency
    if (fields.payment_terms !== undefined) po.payment_terms = fields.payment_terms
    if (fields.payment_status !== undefined) po.payment_status = fields.payment_status
    if (fields.status !== undefined) po.status = fields.status
    if (fields.delivery_address !== undefined) po.delivery_address = fields.delivery_address
    if (fields.delivery_date !== undefined) po.delivery_date = fields.delivery_date
    if (fields.notes !== undefined) po.notes = fields.notes
    if (fields.tax_pct !== undefined) po.tax_pct = parseFloat(fields.tax_pct) || 0

    const amt = fields.total_amount !== undefined ? parseFloat(fields.total_amount) : (po.quantity * po.unit_price)
    po.total_amount = amt
    po.tax_amount = +(amt * po.tax_pct / 100).toFixed(2)
    po.grand_total = +(amt + po.tax_amount).toFixed(2)

    po.tracking.push({
      id: `TRK-${Date.now()}`,
      event: 'PO Details Updated',
      timestamp: new Date().toISOString(),
      actor: fields.updated_by || 'Procurement Manager',
      note: 'Purchase Order specifications and terms updated.',
    })

    saveData(data)
    return po
  },

  updatePurchaseOrderStatus(id, { status, payment_status, actor, note }) {
    const data = loadData()
    const po = (data.purchaseOrders || []).find(p => p.id === id)
    if (!po) return null

    if (status) po.status = status
    if (payment_status) po.payment_status = payment_status

    po.tracking.push({ id: `TRK-${Date.now()}`, event: status ? `Status → ${status}` : `Payment → ${payment_status}`, timestamp: new Date().toISOString(), actor: actor || 'System', note: note || '' })
    saveData(data); return po
  },

  addDeliverySchedule(id, { milestone, date, qty }) {
    const data = loadData()
    const po = (data.purchaseOrders || []).find(p => p.id === id)
    if (!po) return null

    const ds = { id: `DS-${Date.now()}`, milestone, date, qty: parseInt(qty) || 0, status: 'Scheduled' }
    po.delivery_schedules.push(ds)
    po.tracking.push({ id: `TRK-${Date.now()}`, event: 'Delivery Milestone Added', timestamp: new Date().toISOString(), actor: 'Procurement Manager', note: `Milestone: ${milestone} on ${date}` })
    saveData(data); return ds
  },

  updateDeliverySchedule(poId, dsId, { status }) {
    const data = loadData()
    const po = (data.purchaseOrders || []).find(p => p.id === poId)
    if (!po) return null
    const ds = po.delivery_schedules.find(d => d.id === dsId)
    if (!ds) return null
    ds.status = status
    po.tracking.push({ id: `TRK-${Date.now()}`, event: `Delivery Milestone: ${status}`, timestamp: new Date().toISOString(), actor: 'Procurement', note: `Milestone "${ds.milestone}" marked ${status}` })
    saveData(data); return ds
  },

  addAmendment(id, { reason, changes, amended_by }) {
    const data = loadData()
    const po = (data.purchaseOrders || []).find(p => p.id === id)
    if (!po) return null

    const amd = { id: `AMD-${Date.now()}`, reason, changes, amended_by: amended_by || 'Procurement Manager', timestamp: new Date().toISOString() }
    po.amendments.push(amd)
    po.tracking.push({ id: `TRK-${Date.now()}`, event: 'Amendment Issued', timestamp: new Date().toISOString(), actor: amended_by || 'Procurement Manager', note: reason })
    saveData(data); return amd
  },

  deletePurchaseOrder(id) {
    const data = loadData()
    const idx = (data.purchaseOrders || []).findIndex(p => p.id === id)
    if (idx === -1) return false
    data.purchaseOrders.splice(idx, 1); saveData(data); return true
  },

  // ── Approval Workflow ────────────────────────────────
  getApprovals({ stage, status, search } = {}) {
    const data = loadData()
    let list = data.approvals || []

    if (stage && stage !== 'All') list = list.filter(a => a.current_stage === stage)
    if (status && status !== 'All') list = list.filter(a => a.status === status)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(a =>
        a.id.toLowerCase().includes(t) ||
        a.title.toLowerCase().includes(t) ||
        a.target_id.toLowerCase().includes(t) ||
        a.department.toLowerCase().includes(t)
      )
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getApprovalById(id) {
    const data = loadData()
    return (data.approvals || []).find(a => a.id === id) || null
  },

  updateApproval(id, fields) {
    const data = loadData()
    const item = (data.approvals || []).find(a => a.id === id)
    if (!item) return null

    if (fields.title !== undefined) item.title = fields.title
    if (fields.department !== undefined) item.department = fields.department
    if (fields.requested_by !== undefined) item.requested_by = fields.requested_by
    if (fields.amount !== undefined) item.amount = parseFloat(fields.amount) || 0
    if (fields.priority !== undefined) item.priority = fields.priority
    if (fields.current_stage !== undefined) item.current_stage = fields.current_stage
    if (fields.status !== undefined) item.status = fields.status
    if (fields.rejection_reason !== undefined) item.rejection_reason = fields.rejection_reason

    const now = new Date().toISOString()
    if (fields.status === 'Approved') {
      if (item.target_type === 'Requisition') {
        const req = data.requisitions.find(r => r.id === item.target_id)
        if (req) req.status = 'Approved'
      } else if (item.target_type === 'Purchase Order') {
        const po = data.purchaseOrders.find(p => p.id === item.target_id)
        if (po) po.status = 'Confirmed'
      }
    } else if (fields.status === 'Rejected') {
      if (item.target_type === 'Requisition') {
        const req = data.requisitions.find(r => r.id === item.target_id)
        if (req) req.status = 'Rejected'
      } else if (item.target_type === 'Purchase Order') {
        const po = data.purchaseOrders.find(p => p.id === item.target_id)
        if (po) po.status = 'Cancelled'
      }
    }

    saveData(data)
    return item
  },

  deleteApproval(id) {
    const data = loadData()
    const idx = (data.approvals || []).findIndex(a => a.id === id)
    if (idx === -1) return false
    data.approvals.splice(idx, 1)
    saveData(data)
    return true
  },

  submitApprovalAction(id, { action, stage, approver_name, remarks }) {
    const data = loadData()
    const appItem = (data.approvals || []).find(a => a.id === id)
    if (!appItem) return null

    const now = new Date().toISOString()
    const approver = approver_name || `${stage} Signoff`

    const trailIdx = appItem.approval_trail.findIndex(t => t.stage === (stage || appItem.current_stage))
    if (trailIdx !== -1) {
      appItem.approval_trail[trailIdx].status = action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Revision Requested'
      appItem.approval_trail[trailIdx].approver = approver
      appItem.approval_trail[trailIdx].remarks = remarks || ''
      appItem.approval_trail[trailIdx].timestamp = now
    }

    if (action === 'Approve') {
      const currentIdx = appItem.required_stages.indexOf(appItem.current_stage)
      if (currentIdx !== -1 && currentIdx < appItem.required_stages.length - 1) {
        appItem.current_stage = appItem.required_stages[currentIdx + 1]
        appItem.status = 'Pending'
        appItem.overdue = false
        appItem.hours_pending = 1
      } else {
        appItem.status = 'Approved'
        appItem.overdue = false
        appItem.hours_pending = 0

        if (appItem.target_type === 'Requisition') {
          const req = data.requisitions.find(r => r.id === appItem.target_id)
          if (req) {
            req.status = 'Approved'
            data.history.push({ id: Date.now(), requisition_id: req.id, old_status: 'Pending', new_status: 'Approved', changed_by: approver, comment: `Multi-stage approval completed (${stage}).`, timestamp: now })
          }
        } else if (appItem.target_type === 'Purchase Order') {
          const po = data.purchaseOrders.find(p => p.id === appItem.target_id)
          if (po) {
            po.status = 'Confirmed'
            po.tracking.push({ id: `TRK-${Date.now()}`, event: 'PO Approved', timestamp: now, actor: approver, note: `Final approval granted by ${stage}.` })
          }
        }
      }
    } else if (action === 'Reject') {
      appItem.status = 'Rejected'
      appItem.overdue = false
      appItem.rejection_reason = remarks || 'Rejected during review.'

      if (appItem.target_type === 'Requisition') {
        const req = data.requisitions.find(r => r.id === appItem.target_id)
        if (req) {
          req.status = 'Rejected'
          data.history.push({ id: Date.now(), requisition_id: req.id, old_status: req.status, new_status: 'Rejected', changed_by: approver, comment: `Rejected by ${stage}: ${remarks || 'No remarks'}`, timestamp: now })
        }
      } else if (appItem.target_type === 'Purchase Order') {
        const po = data.purchaseOrders.find(p => p.id === appItem.target_id)
        if (po) {
          po.status = 'Cancelled'
          po.tracking.push({ id: `TRK-${Date.now()}`, event: 'PO Rejected', timestamp: now, actor: approver, note: remarks || 'Rejected by approver.' })
        }
      }
    } else if (action === 'Request Revision') {
      appItem.status = 'Revision Requested'
      appItem.revision_remarks = remarks || 'Revision requested.'
    }

    saveData(data)
    return appItem
  },

  escalateApproval(id, { reason, escalated_by }) {
    const data = loadData()
    const appItem = (data.approvals || []).find(a => a.id === id)
    if (!appItem) return null

    appItem.status = 'Escalated'
    appItem.overdue = true
    appItem.priority = 'Urgent'
    appItem.approval_trail.push({
      stage: `${appItem.current_stage} Escalation`,
      status: 'Escalated',
      approver: escalated_by || 'Auto Escalation Engine',
      remarks: reason || 'SLA 24h threshold exceeded. Auto-escalated to higher tier.',
      timestamp: new Date().toISOString(),
    })

    saveData(data)
    return appItem
  },

  getApprovalStats() {
    const data = loadData()
    const list = data.approvals || []
    const pending = list.filter(a => a.status === 'Pending')
    const escalated = list.filter(a => a.status === 'Escalated' || a.overdue)
    const ceoPending = list.filter(a => a.current_stage === 'CEO' && a.status !== 'Approved')

    const pendingValue = pending.reduce((sum, a) => sum + (a.amount || 0), 0)

    return {
      total_pending: pending.length,
      total_escalated: escalated.length,
      ceo_pending: ceoPending.length,
      pending_value: pendingValue,
      total_count: list.length,
    }
  },

  // ── Inventory & Warehouses ───────────────────────────
  getWarehouses() {
    const data = loadData()
    if (!data.warehouses) {
      data.warehouses = [
        { id: 'WH-01', name: 'Lahore Central Fulfillment Hub', city: 'Lahore', capacity_sqft: 85000, manager: 'Ali Raza', status: 'Active', current_occupancy_pct: 78 },
        { id: 'WH-02', name: 'Port Qasim Freight Terminal', city: 'Karachi', capacity_sqft: 120000, manager: 'Shahid Khan', status: 'Active', current_occupancy_pct: 84 },
        { id: 'WH-03', name: 'Blue Area IT Asset Depot', city: 'Islamabad', capacity_sqft: 35000, manager: 'Hamza Tariq', status: 'Active', current_occupancy_pct: 62 },
        { id: 'WH-04', name: 'Sahiwal Manufacturing Store', city: 'Sahiwal', capacity_sqft: 65000, manager: 'Usman Chaudhry', status: 'Active', current_occupancy_pct: 91 },
        { id: 'WH-05', name: 'Multan Industrial Logistics', city: 'Multan', capacity_sqft: 50000, manager: 'Rashid Mahmood', status: 'Active', current_occupancy_pct: 70 },
        { id: 'WH-06', name: 'Faisalabad Raw Materials Center', city: 'Faisalabad', capacity_sqft: 75000, manager: 'Zubair Sheikh', city: 'Faisalabad', status: 'Active', current_occupancy_pct: 88 },
        { id: 'WH-07', name: 'Rawalpindi Regional Warehouse', city: 'Rawalpindi', capacity_sqft: 40000, manager: 'Sana Malik', status: 'Active', current_occupancy_pct: 55 },
        { id: 'WH-08', name: 'Peshawar North Trade Hub', city: 'Peshawar', capacity_sqft: 45000, manager: 'Tariq Khan', status: 'Active', current_occupancy_pct: 60 },
        { id: 'WH-09', name: 'Quetta Freight Depot', city: 'Quetta', capacity_sqft: 30000, manager: 'Bilal Ahmed', status: 'Active', current_occupancy_pct: 48 },
        { id: 'WH-10', name: 'Sialkot Export Warehouse', city: 'Sialkot', capacity_sqft: 55000, manager: 'Imran Farooq', status: 'Active', current_occupancy_pct: 75 },
        { id: 'WH-11', name: 'Gujranwala Heavy Equipment Depot', city: 'Gujranwala', capacity_sqft: 60000, manager: 'Kashif Ali', status: 'Active', current_occupancy_pct: 80 },
        { id: 'WH-12', name: 'Hyderabad South Store', city: 'Hyderabad', capacity_sqft: 42000, manager: 'Asif Sheikh', status: 'Active', current_occupancy_pct: 65 },
        { id: 'WH-13', name: 'Sukkur Logistics Junction', city: 'Sukkur', capacity_sqft: 38000, manager: 'Kamran Raza', status: 'Active', current_occupancy_pct: 50 },
        { id: 'WH-14', name: 'Bahawalpur Storage Facility', city: 'Bahawalpur', capacity_sqft: 32000, manager: 'Noman Tariq', status: 'Active', current_occupancy_pct: 42 },
        { id: 'WH-15', name: 'Sheikhupura Industrial Annex', city: 'Sheikhupura', capacity_sqft: 48000, manager: 'Zulqarnain Ahmed', status: 'Active', current_occupancy_pct: 72 },
        { id: 'WH-16', name: 'Mardan North Logistics', city: 'Mardan', capacity_sqft: 28000, manager: 'Junaid Khan', status: 'Active', current_occupancy_pct: 53 },
        { id: 'WH-17', name: 'Gwadar Deep Port Terminal', city: 'Gwadar', capacity_sqft: 150000, manager: 'Sultan Port Ops', status: 'Active', current_occupancy_pct: 35 },
        { id: 'WH-18', name: 'Mirpur Azad Kashmir Depot', city: 'Mirpur', capacity_sqft: 25000, manager: 'Waqas Malik', status: 'Active', current_occupancy_pct: 49 },
      ]
      saveData(data)
    }
    return data.warehouses
  },

  getGRNs({ warehouse, status, search } = {}) {
    const data = loadData()
    if (!data.grns) {
      data.grns = [
        { id: 'GRN-2026-001', po_id: 'PO-2026-003', item: 'Ergonomic Office Chairs (40 units)', warehouse: 'WH-01 Lahore Central Fulfillment Hub', received_qty: 40, accepted_qty: 40, rejected_qty: 0, status: 'Inspected & Accepted', inspected_by: 'Sana Malik', received_date: new Date(Date.now() - 86400000).toISOString(), notes: 'All 40 chairs passed quality QC.' },
        { id: 'GRN-2026-002', po_id: 'PO-2026-001', item: 'Industrial Steel Rods (250 units partial)', warehouse: 'WH-04 Sahiwal Manufacturing Store', received_qty: 250, accepted_qty: 250, rejected_qty: 0, status: 'Partial Receipt', inspected_by: 'Ali Raza', received_date: new Date().toISOString(), notes: 'Partial delivery milestone 1 received in good condition.' },
        { id: 'GRN-2026-003', po_id: 'PO-2026-002', item: 'Dell Latitude Laptops (15 units)', warehouse: 'WH-03 Blue Area IT Asset Depot', received_qty: 15, accepted_qty: 12, rejected_qty: 3, status: 'Pending QC', inspected_by: 'Hamza Tariq', received_date: new Date().toISOString(), notes: '3 units flagged with box seal damage, under quarantine.' },
      ]
      saveData(data)
    }

    let list = data.grns
    if (warehouse && warehouse !== 'All') list = list.filter(g => g.warehouse.includes(warehouse))
    if (status && status !== 'All') list = list.filter(g => g.status === status)
    if (search) {
      const t = search.toLowerCase()
      list = list.filter(g => g.id.toLowerCase().includes(t) || g.po_id.toLowerCase().includes(t) || g.item.toLowerCase().includes(t) || g.warehouse.toLowerCase().includes(t))
    }
    return list.sort((a, b) => new Date(b.received_date) - new Date(a.received_date))
  },

  createGRN({ po_id, warehouse_id, received_qty, rejected_qty, notes, inspected_by }) {
    const data = loadData()
    if (!data.grns) data.grns = []

    const po = (data.purchaseOrders || []).find(p => p.id === po_id)
    const warehouses = this.getWarehouses()
    const wh = warehouses.find(w => w.id === warehouse_id)

    const recQty = parseInt(received_qty) || 0
    const rejQty = parseInt(rejected_qty) || 0
    const accQty = Math.max(0, recQty - rejQty)

    const nums = data.grns.map(g => { const p = g.id.split('-'); return parseInt(p[p.length - 1]) || 0 })
    const next = nums.length ? Math.max(...nums) + 1 : 1
    const grnId = `GRN-2026-${String(next).padStart(3, '0')}`

    let status = 'Inspected & Accepted'
    if (rejQty > 0) status = 'Pending QC'
    if (po && recQty < po.quantity) status = 'Partial Receipt'

    const newGRN = {
      id: grnId,
      po_id,
      item: po ? po.item : 'Received Goods Batch',
      warehouse: wh ? `${wh.id} ${wh.name}` : 'Central Warehouse',
      received_qty: recQty,
      accepted_qty: accQty,
      rejected_qty: rejQty,
      status,
      inspected_by: inspected_by || 'Warehouse Inspector',
      received_date: new Date().toISOString(),
      notes: notes || '',
    }

    data.grns.push(newGRN)

    if (po) {
      if (accQty >= po.quantity) {
        po.status = 'Delivered'
      } else {
        po.status = 'In Transit'
      }
      po.tracking.push({
        id: `TRK-${Date.now()}`,
        event: 'Goods Received (GRN Issued)',
        timestamp: new Date().toISOString(),
        actor: inspected_by || 'Warehouse Team',
        note: `GRN ${grnId}: Received ${recQty} units at ${newGRN.warehouse}.`,
      })
    }

    saveData(data)
    return newGRN
  },

  updateGRNStatus(id, { status, inspected_by, notes }) {
    const data = loadData()
    const grn = (data.grns || []).find(g => g.id === id)
    if (!grn) return null

    if (status) grn.status = status
    if (inspected_by) grn.inspected_by = inspected_by
    if (notes) grn.notes = notes

    saveData(data)
    return grn
  },

  getInventoryStats() {
    const grns = this.getGRNs()
    const warehouses = this.getWarehouses()

    const accepted = grns.filter(g => g.status === 'Inspected & Accepted' || g.status === 'Delivered')
    const pending = grns.filter(g => g.status === 'Pending QC' || g.status === 'Partial Receipt')

    return {
      total_grns: grns.length,
      accepted_grns: accepted.length,
      pending_qc: pending.length,
      warehouses_count: warehouses.length,
      total_stock_value: '$14.2 Million',
    }
  },
}
