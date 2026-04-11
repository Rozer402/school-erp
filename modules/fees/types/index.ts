/**
 * FEES MODULE DOMAIN MODEL
 * ========================
 *
 * Relationship Diagram (ASCII):
 *
 *     Class (1)
 *       ↓ (1 to many)
 *     Student (1)
 *       ↓ (1 to many)
 *     FeeAssignment (1 per Student per FeeStructure)
 *       ├─ links Student to FeeStructure
 *       └─ tracks Payment(s) - MANY (handles partial payments)
 *
 *     FeeStructure (1)
 *       ├─ classId → Class
 *       └─ components[] → FeeComponent (tuition, transport, exam, etc.)
 *
 * Payment Partial Flow:
 *   - FeeAssignment.totalAmount = 100,000 INR (e.g., annual fees)
 *   - Student pays 30,000 in January
 *     → Payment #1 { amount: 30,000, paidAt: "2026-01-15" }
 *   - Student pays 50,000 in March
 *     → Payment #2 { amount: 50,000, paidAt: "2026-03-20" }
 *   - Status = PARTIAL (30k + 50k = 80k < 100k)
 *   - Due = 20,000
 *
 * Scalability to 10k+ Students:
 *   - Each Student is lightweight: id, name, classId, rollNo
 *   - FeeStructure is per Class, not per Student (1:many deduplication)
 *     → 10k students across 50 classes = 50 FeeStructures, not 10k
 *   - Payments are sparse events, stored separately
 *     → Payment table grows with transactions, not student count
 *   - Status is COMPUTED from payments (not stored redundantly)
 *     → No denormalization needed at query time
 */

// ============================================================================
// DOMAIN ENUMS
// ============================================================================

/**
 * Fee payment status.
 * Computed from sum(payments.amount) vs totalAmount.
 */
export enum FeeStatus {
  PAID = "PAID", // totalAmount fully paid
  PARTIAL = "PARTIAL", // some amount paid, but < totalAmount
  DUE = "DUE", // nothing paid yet, payment date not passed
  OVERDUE = "OVERDUE", // nothing/partial paid, payment date passed
}

/**
 * Payment methods supported.
 */
export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  CASH = "CASH",
  CARD = "CARD",
  ONLINE = "ONLINE",
}

/**
 * Academic year format: "2025-2026"
 */
export type AcademicYear = string; // e.g., "2025-2026"

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Student entity.
 * Belongs to ONE Class for a given academic year.
 */
export type Student = {
  id: string; // UUID or DB-generated ID
  name: string;
  classId: string; // Which class (e.g., "9A", "10B")
  rollNo: number; // Roll number within the class
  email?: string;
  phone?: string;
  dateOfBirth?: string; // ISO 8601 date
};

/**
 * Class entity.
 * Represents a standard (grade) + section for an academic year.
 * E.g., "Class 9 Section A" for "2025-2026".
 */
export type Class = {
  id: string; // Composite: "9A" or UUID
  name: string; // "9 A" or "Grade 9 Section A"
  section?: string; // "A", "B", "C"
  academicYear: AcademicYear;
};

/**
 * FeeComponent within a FeeStructure.
 * Allows breakdown of fees into categories.
 * E.g., tuition: 50k, transport: 15k, exam: 5k, etc.
 */
export type FeeComponent = {
  id: string;
  name: string; // "Tuition", "Transport", "Exam Fee", "Library"
  amount: number; // In smallest currency unit (paisa: 50000 = ₹500)
  description?: string;
};

/**
 * FeeStructure entity.
 * Defines what fees apply to a Class for an academic year.
 * Many Students link to ONE FeeStructure via FeeAssignment.
 *
 * SCALABILITY: Deduplication by Class.
 * - 10,000 students across 50 classes
 * - FeeStructure per class = 50 records
 * - Not 10,000 duplicated fee structures
 */
export type FeeStructure = {
  id: string; // UUID
  classId: string; // Which class does this structure apply to?
  academicYear: AcademicYear;
  components: FeeComponent[]; // Breakdown: tuition, transport, etc.
  totalAmount: number; // Sum of all component amounts (in paisa)
  dueDate: string; // ISO 8601 date → used to calc OVERDUE status
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

/**
 * FeeAssignment entity.
 * Links a Student to a FeeStructure for a given period.
 * Gateway to Payment records.
 *
 * Uniqueness: One per (Student, FeeStructure, period).
 * E.g., Rajat → Class 9A → 2025-2026 = ONE FeeAssignment.
 */
export type FeeAssignment = {
  id: string; // UUID
  studentId: string;
  student?: Student; // Nested for convenience (not always populated)

  feeStructureId: string;
  feeStructure?: FeeStructure; // Nested for convenience

  classId: string; // Denormalized for filtering (matches feeStructure.classId)
  class?: Class; // Nested for convenience

  academicYear: AcademicYear;
  totalAmount: number; // Copied from FeeStructure for clarity (immutable)

  // Computed fields (server-calculated from payments):
  paidAmount: number; // Sum of all successful payments
  dueAmount: number; // totalAmount - paidAmount
  status: FeeStatus; // PAID | PARTIAL | DUE | OVERDUE

  createdAt: string;
  updatedAt: string;
};

/**
 * Payment entity.
 * Single transaction recorded against a FeeAssignment.
 * Multiple payments accumulate toward the totalAmount.
 *
 * PARTIAL PAYMENT SUPPORT:
 * - First payment: 30,000 → status = PARTIAL, due = 70,000
 * - Second payment: 50,000 → status = PARTIAL, due = 20,000
 * - Third payment: 20,000 → status = PAID, due = 0
 */
export type Payment = {
  id: string; // UUID
  assignmentId: string; // Which FeeAssignment does this pay toward?
  assignment?: FeeAssignment;

  amount: number; // Amount paid (in paisa)
  method: PaymentMethod;

  receiptNo: string; // For tracking & audits (e.g., "RCP-2026-001")
  receiptDate: string; // ISO 8601 date

  // Payment metadata:
  paidAt: string; // ISO timestamp (when payment was recorded)
  notes?: string; // Admin notes

  // For audit trail:
  createdBy?: string; // Admin who recorded the payment (user ID)
  createdAt: string;
  updatedAt: string;
};

/**
 * Receipt entity (derived/computed).
 * Read-only view combining FeeAssignment, Payment, Student, & FeeStructure.
 * Used for PDF generation & email receipts.
 * NOT stored separately — computed on demand from linked entities.
 */
export type Receipt = {
  id: string; // UUID or hash
  paymentId: string;
  payment: Payment; // The payment transaction

  assignment: FeeAssignment;
  student: Student;
  feeStructure: FeeStructure;

  // Receipt metadata:
  generatedAt: string; // ISO timestamp
  receipientEmail?: string;
  receipientPhone?: string;
};

// ============================================================================
// API RESPONSE TYPES (Raw shapes before normalization)
// ============================================================================

/**
 * Raw API response for GET /api/fees
 * Typically flattened from backend, requires normalization.
 * NEVER expose this to components — always normalize in Phase 2.
 */
export type ApiFeesResponse = {
  assignments: {
    id: string;
    studentId: string;
    student: {
      id: string;
      name: string;
      classId: string;
      rollNo: number;
    };
    feeStructureId: string;
    feeStructure: {
      id: string;
      classId: string;
      academicYear: string;
      components: Array<{
        id: string;
        name: string;
        amount: number;
      }>;
      totalAmount: number;
      dueDate: string;
    };
    classId: string;
    academicYear: string;
    totalAmount: number;
    payments: Array<{
      id: string;
      amount: number;
      method: string;
      receiptNo: string;
      receiptDate: string;
      paidAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }[];
  meta?: {
    total: number;
    filtered: number;
  };
};

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

/**
 * Query filters for getFees(filters).
 * Used in admin view to slice the fees table.
 */
export type FeeFilters = {
  classId?: string; // Filter by class
  status?: FeeStatus; // Filter by status
  academicYear?: AcademicYear; // Filter by year
  searchQuery?: string; // Student name or ID
};

/**
 * Pagination metadata.
 */
export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Paginated response wrapper.
 */
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

// ============================================================================
// COMPUTED HELPER TYPES
// ============================================================================

/**
 * FeeStatus breakdown for UI aggregation.
 * E.g., admin dashboard: "45 PAID, 120 PARTIAL, 380 DUE, 50 OVERDUE"
 */
export type FeeStatusSummary = {
  PAID: number;
  PARTIAL: number;
  DUE: number;
  OVERDUE: number;
};

/**
 * Student fee stats (for personal dashboard).
 * Shows at a glance: total owed, total paid, next due date.
 */
export type StudentFeeStats = {
  totalFees: number;
  totalPaid: number;
  totalDue: number;
  nextDueDate?: string;
  assignmentCount: number;
  paidCount: number;
  overdueCount: number;
};
