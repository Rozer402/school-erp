# Fees Module Architecture

## Overview

Production-grade School ERP Fees Management module built with Next.js 14 App Router, following strict SSR-first patterns with zero client-side auth logic.

## Core Principles

### 1. SSR-First Authentication

- Cookies read server-side via `cookies()` from `next/headers`
- Role checks happen in Server Components, never middleware or client
- apiFetchServer redirects 401 → /login, 403 → /dashboard automatically
- Zero hydration flicker: user injected from server to AuthProvider

### 2. Separation of Concerns

```
└─ Server Layer (Phase 2)
   ├─ getFees() → reads cookies, calls API, normalizes to FeeAssignment[]
   ├─ getStudentFees() → same pattern for students
   └─ Raw API types NEVER leak past this layer

└─ Server Components (Phase 3)
   ├─ /app/(dashboard)/fees/page.tsx → admin view
   ├─ /app/(dashboard)/my-fees/page.tsx → student view
   └─ Fetch via server functions, pass pre-fetched data to client

└─ Client Components (Phase 4)
   ├─ FeeTable.tsx → dumb renderer
   ├─ StudentFeeTable.tsx → dumb renderer
   ├─ PaymentModal.tsx → controlled form, no logic
   └─ StatusBadge.tsx → pure UI

└─ Utilities (Phase 5)
   ├─ fees-utils.ts → pure functions (no API, no components)
   └─ Calculations, formatting, validation
```

### 3. Strict API Separation

```
apiFetchServer (SSR only)
├─ Reads cookies from request context
├─ Throws on 401/403 (auto-redirect)
└─ Used in: Server components, server functions

apiFetchClient (Client only)
├─ Uses credentials: "include"
├─ Throws on 401 (caught by client-side error handling)
└─ Used in: Client mutations, React Query
```

## Phase Breakdown

### Phase 1: Domain Model (`/modules/fees/types/index.ts`)

Complete typed domain entities:

- `Student` — id, name, classId, rollNo
- `Class` — standard + section for an academic year
- `FeeStructure` — per-class fee definition (deduplicates across students)
- `FeeComponent` — tuition, transport, exam, etc.
- `FeeAssignment` — links Student to FeeStructure, tracks status/payments
- `Payment` — individual transaction (supports partial payments)
- `Receipt` — read-only view for PDF generation

**Key Design:**

- FeeStructure is 1:many (1 per class, shared by all students in that class)
- Payments are a list (not single amount) → handles partial payments cleanly
- Status is computed from payments (never stored redundantly)

### Phase 2: Server Data Layer (`/modules/fees/server/`)

SSR-safe data fetching layer:

```typescript
// /modules/fees/server/getFees.ts
export async function getFees(filters?: FeeFilters): Promise<FeeAssignment[]>
  → Validates role: ADMIN only
  → Calls apiFetchServer() → raw API response
  → Normalizes to typed FeeAssignment[]
  → Never returns raw API type to caller

export async function getStudentFees(): Promise<FeeAssignment[]>
  → Validates role: STUDENT or ADMIN
  → Normalization same as getFees()

export async function getFeeDetails(assignmentId: string): Promise<FeeAssignment>
  → Fetch one assignment with full payment history
```

**Normalization Pipeline:**

```typescript
raw: ApiFeesResponse (raw backend shape)
  ↓ normalizeFeeAssignment(raw)
  ├─ Extract student/class/structure
  ├─ Compute: paidAmount = payments.sum()
  ├─ Compute: dueAmount = total - paid
  ├─ Compute: status = FeeStatus (PAID | PARTIAL | DUE | OVERDUE)
  ↓
result: FeeAssignment (typed, computed)
```

### Phase 3: SSR Pages (`/app/(dashboard)/`)

Server Components (no "use client"):

#### `/fees/page.tsx` — Admin View

```typescript
export default async function FeesPage() {
  const user = await getServerUser();          // ← SSR auth
  if (user?.role !== "admin") redirect("/dashboard");  // ← Server-side gate

  const assignments = await getFees();          // ← Pre-fetched data
  return <FeeTableClient initialData={assignments} />;  // ← Pass to client
}
```

#### `/my-fees/page.tsx` — Student View

```typescript
export default async function MyFeesPage() {
  const user = await getServerUser();
  if (!["student", "admin"].includes(user?.role)) redirect("/dashboard");

  const assignments = await getStudentFees();
  return <StudentFeeTableClient initialData={assignments} />;
}
```

**Why pre-fetch?**

- No loading states on first paint
- Data is already role-validated (server fetched it)
- Client components receive immutable props
- Zero client-side authentication race conditions

### Phase 4: UI Components (`/modules/fees/components/`)

Dumb, re-usable client components:

#### `FeeTable.tsx` — Admin fee list

- Displays all students' fees in table
- Shows: student, class, total, paid, due, status, actions
- Clicking "Record Payment" opens modal
- **Zero business logic** — just renders props + emits events

#### `StudentFeeTable.tsx` — Student dashboard

- Shows summary cards: total, paid, due, overdue count
- Fee assignment table
- "Pay Now" button → opens modal
- Pure renderer of `initialData` props

#### `PaymentModal.tsx` — Payment form

- Controlled input: amount
- Dropdown: payment method
- Validation: amount ≤ due amount, amount > 0
- Submit: calls `POST /api/payments` via apiFetchClient

**Key constraint:** No React Query, no useSWR on mount. Just controlled form + mutation on submit.

#### `StatusBadge.tsx` — Status indicator

- Maps FeeStatus → color + label
- PAID = green, PARTIAL = yellow, DUE = red, OVERDUE = dark red
- Pure UI wrapper

### Phase 5: Business Logic (`/modules/fees/utils/fees-utils.ts`)

Pure functions, no API calls, safe for server & client:

```typescript
formatCurrency(paisa) → "₹1,500.00"
parseCurrency(input) → 150000 paisa

isValidPaymentAmount(amount, assignment) → { valid, error? }
computeTotalPaid(assignments) → sum
computeTotalDue(assignments) → sum

generateStudentFeeStats(assignments) → StudentFeeStats
generateFeeStatusSummary(assignments) → { PAID: 4, PARTIAL: 2, ... }

hasOverdueFees(assignments) → boolean
formatDate(iso) → "01 Apr 2026"
getPaymentMethodLabel(method) → "Online", "Bank Transfer", etc.
```

## API Contracts

### Endpoints Consumed

```
GET /api/fees
  ?classId={id}
  &status={PAID|PARTIAL|DUE|OVERDUE}
  &academicYear={2025-2026}
  → { assignments: FeeAssignment[], meta?: { total, filtered } }

GET /api/fees/me
  → { assignments: FeeAssignment[] } (current student only)

GET /api/fees/:assignmentId
  → { ... FeeAssignment with full Payment history }

POST /api/payments
  { assignmentId, amount (paisa), method, receiptNo? }
  → { id, amount, paidAt, receiptNo, ... } or 400/402/409

GET /api/payments/:paymentId/receipt
  → { student, feeStructure, payment, receiptNo, ... }
```

## Usage Guide

### Server Components

```typescript
import { getServerUser, getFees, formatCurrency } from "@/modules/fees";

export default async function MyPage() {
  const user = await getServerUser();
  const assignments = await getFees({ classId: "9A" });

  return (
    <div>
      {assignments.map(a => (
        <div key={a.id}>
          {a.student?.name} owes {formatCurrency(a.dueAmount)}
        </div>
      ))}
    </div>
  );
}
```

### Client Components

```typescript
"use client";

import { useState } from "react";
import type { FeeAssignment } from "@/modules/fees";
import { formatCurrency, isValidPaymentAmount } from "@/modules/fees";

export default function Payment({ assignment }: { assignment: FeeAssignment }) {
  const [amount, setAmount] = useState("");

  const validation = isValidPaymentAmount(parseInt(amount) || 0, assignment);

  return (
    <div>
      <p>Pay {formatCurrency(assignment.dueAmount)}</p>
      <input
        value={amount}
        onChange={e => setAmount(e.target.value)}
        disabled={!validation.valid}
      />
      {!validation.valid && <p>{validation.error}</p>}
    </div>
  );
}
```

### Server Functions from Client

```typescript
"use client";

import { apiFetchClient } from "@/lib/api-client";
import type { Payment } from "@/modules/fees";

async function recordPayment(assignmentId: string, amount: number) {
  const result: Payment = await apiFetchClient("/api/payments", {
    method: "POST",
    body: JSON.stringify({ assignmentId, amount, method: "ONLINE" }),
  });

  return result.receiptNo;
}
```

## Scalability Patterns

### FeeStructure Deduplication

- 10,000 students across 50 classes = 50 FeeStructures
- NOT 10,000 duplicates per class
- One fee change updates 1 record, affects all 200 students immediately

### Payment Sparsity

- Payment table grows with transactions, not student count
- 10k students × ~3 payments/year = 30k Payment records/year
- Index by assignmentId for O(1) lookups

### Computed Fields

- Status is derived from payments.sum() vs totalAmount
- No denormalization needed
- Single-pass computation on each request

### Query Patterns

```
O(1): Get specific student's fees → index on studentId
O(n): Get all students in class → index on classId
O(n): Get overdue fees → compute status + filter by dueDate
```

## Error Handling

### Unauthorized (401)

```typescript
// Server: apiFetchServer throws 401 → auto-redirects to /login
const data = await getFees();  // ✅ Automatic redirect if token invalid

// Client: apiFetchClient throws 401 → catch and handle
try {
  await recordPayment(...);
} catch (e) {
  if (e.message === "Unauthorized") {
    // Redirect to login via client-side router
  }
}
```

### Forbidden (403)

```typescript
// Server: apiFetchServer throws 403 → auto-redirects to /dashboard
const data = await getFees();  // ✅ Automatic redirect if role missing

// Client: apiFetchClient throws 403 → catch and handle
catch (e) {
  if (e.message === "Forbidden") {
    // Show "Access denied" message or redirect
  }
}
```

### Validation (400)

```typescript
// Payment amount validation happens in UI via isValidPaymentAmount()
const validation = isValidPaymentAmount(amount, assignment);
if (!validation.valid) {
  // Show error from validation.error
}
```

## Testing Helpers

### Mock Data Setup

```typescript
import type { FeeAssignment } from "@/modules/fees";

const mockAssignment: FeeAssignment = {
  id: "1",
  studentId: "s1",
  student: { id: "s1", name: "Rajat", classId: "9A", rollNo: 1 },
  totalAmount: 100000, // ₹1000 in paisa
  paidAmount: 30000, // ₹300 paid
  dueAmount: 70000, // ₹700 due
  status: "PARTIAL",
  // ...
};
```

### Testing Utilities

```typescript
import {
  isValidPaymentAmount,
  formatCurrency,
  generateStudentFeeStats,
} from "@/modules/fees";

// Valid payment: ₹500 partial payment
isValidPaymentAmount(50000, mockAssignment); // { valid: true }

// Too much: exceeds due
isValidPaymentAmount(100000, mockAssignment); // { valid: false, error: "..." }

// Format output
formatCurrency(50000); // "₹500.00"

// Summary stats
generateStudentFeeStats([mockAssignment]); // { totalFees, totalPaid, totalDue, ... }
```

## Common Gotchas

❌ **NEVER**

- Write auth logic in client components
- Use localStorage for fees or auth data
- Fetch fees in useEffect on client mount
- Render role-based UI without server validation
- Return raw API types from server functions
- Mix apiFetchServer with client components

✅ **ALWAYS**

- Fetch in Server Components via server functions
- Pass pre-fetched data to client components
- Validate role in Server Components via getServerUser
- Use apiFetchServer in server functions
- Use apiFetchClient in client components only
- Normalize API responses in server layer

## File Structure

```
modules/fees/
├── types/
│   └── index.ts                 # Domain model (8 entities, enums, filters)
├── server/
│   ├── getFees.ts               # Server functions + normalization
│   ├── getServerUser.ts         # Fetch authenticated user
│   ├── constants.ts             # Role/API/currency constants
│   ├── rbac.ts                  # Role-based access control (Phase 7)
│   └── edge-cases.ts            # Error handling guide (Phase 9)
├── components/
│   ├── FeeTable.tsx             # Admin fee list (client)
│   ├── StudentFeeTable.tsx       # Student dashboard (client)
│   ├── PaymentModal.tsx          # Payment form (client)
│   └── StatusBadge.tsx           # Status badge (client)
├── utils/
│   ├── fees-utils.ts            # Formatting, stats, parsing (Phase 5)
│   └── calculations.ts          # Pure business logic (Phase 6)
├── api/
│   └── client.ts                # React Query mutations (Phase 5)
├── index.ts                     # Barrel export (all public APIs)
├── FLOW.md                      # End-to-end payment flow (Phase 8)
├── REVIEW.md                    # Completion review (Phase 10)
└── README.md                    # This file

app/(dashboard)/
├── fees/
│   └── page.tsx                 # Admin view (SSR, Phase 3)
└── my-fees/
    └── page.tsx                 # Student view (SSR, Phase 3)
```

## Complete Phase Reference

### ✅ Phase 1: Domain Model

- 8 core entities, enums, filter types
- **Status:** Complete & Locked

### ✅ Phase 2: Server Data Layer

- getFees(), getStudentFees(), getFeeDetails()
- Normalization pipeline (raw API → domain model)
- **Status:** Complete

### ✅ Phase 3: SSR Pages

- /fees (admin view) & /my-fees (student view)
- Server-side role checks & redirects
- Pre-fetched data, zero loading states
- **Status:** Complete

### ✅ Phase 4: UI Components

- FeeTable, StudentFeeTable, PaymentModal, StatusBadge
- Dumb components (props only, no logic)
- **Status:** Complete

### ✅ Phase 5: Client Mutations & Business Logic

- payFee(), usePayFee() (React Query)
- Optimistic updates + rollback
- Cache invalidation strategy
- **Status:** Complete

### ✅ Phase 6: Calculations

- calculateStatus(), calculateDue(), validatePayment()
- Pure functions (testable, no side effects)
- **Status:** Complete

### ✅ Phase 7: Role-Based Access Control

- canViewAllFees(), canRecordPayment(), etc.
- requireFeesAdmin() guards
- **Status:** Complete & Documented

### ✅ Phase 8: Payment Flow

- End-to-end trace: UI → Mutation → API → Cache → Rerender
- Error scenarios & recovery paths
- See FLOW.md for complete diagram
- **Status:** Documented

### ✅ Phase 9: Edge Case Hardening

- 15+ failure modes handled explicitly
- Error → User message mapping
- Optimistic rollback, double-submit prevention
- See edge-cases.ts for implementation guide
- **Status:** Documented

### ✅ Phase 10: Completion Review

- Architecture summary per layer
- What was built & why
- What was deliberately NOT built & why
- Next module recommendation (Attendance)
- Production readiness checklist
- See REVIEW.md
- **Status:** Complete

## Future Phases (TBD)

**Phase 11: PDF Receipts**

- Use `pdfkit` or `html2pdf` to generate receipts from Receipt data
- Touch layers: Client mutations (new endpoint), Utilities (format receipt data)

**Phase 12: Payment Analytics**

- Dashboard: fees collected this month, trend charts
- Touch layers: Server functions (new getFeeAnalytics()), Server components (analytics page)

**Phase 13: Bulk Operations**

- Bulk payment import (Excel)
- Bulk fee structure updates
- Touch layers: Client (new BulkUploadModal), Server functions (processBulkPayments)

**Phase 14: Late Fee & Penalties**

- Automatic late fee accrual after dueDate
- Touch layers: Domain model (extend FeeAssignment), Calculations (add penalty logic)

**Phase 15: Accounting Integration**

- Sync with accounting module
- Bank reconciliation
- Touch layers: Server functions (new syncToAccounting), API layer (new endpoints)
