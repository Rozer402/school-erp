export type Role = "admin" | "teacher" | "student";

export interface AuthUser {
  name: string;
  role: Role;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber?: string;
  status?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amountDue: number;
  amountPaid: number;
  status: "PAID" | "PENDING" | "PARTIAL" | "OVERDUE";
  dueDate: string;
}
