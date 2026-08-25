import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Requisitions from './pages/Requisitions'
import RFQ from './pages/RFQ'
import PurchaseOrders from './pages/PurchaseOrders'
import Approvals from './pages/Approvals'
import Vendors from './pages/Vendors'
import VendorPerformance from './pages/VendorPerformance'
import Contracts from './pages/Contracts'
import Budget from './pages/Budget'
import Inventory from './pages/Inventory'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div className="flex h-screen overflow-hidden bg-slate-50">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/requisitions" element={<Requisitions />} />
                  <Route path="/rfq" element={<RFQ />} />
                  <Route path="/orders" element={<PurchaseOrders />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/vendor-performance" element={<VendorPerformance />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/inventory" element={<Inventory />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
