# ProcureChain — Enterprise Procurement Platform

A React + Vite + Tailwind CSS v4 recreation of the ProcureChain dashboard.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
```

## Stack

- React 19 + Vite
- Tailwind CSS v4 (theme tokens in `src/index.css`)
- React Router for navigation
- Recharts for charts
- lucide-react for icons

## Structure

- `src/data.js` — all sample data (KPIs, vendors, requisitions, POs, contracts, etc.) — swap for real API calls
- `src/components/` — Sidebar, Header, and shared UI primitives (Card, Table, StatusBadge, KpiCard...)
- `src/pages/` — one file per route: Dashboard, Requisitions, RFQ, PurchaseOrders, Approvals, Vendors, VendorPerformance, Contracts, Budget, Inventory

## Design tokens

- Fonts: Fraunces (display), Inter (body), JetBrains Mono (data/mono)
- Colors: navy (`#0b1b33`/`#08111f`), gold accent (`#b98a2e`/`#cba24c`), ink text (`#101828`/`#475066`), slate neutrals, plus status colors (teal/amber/red)
