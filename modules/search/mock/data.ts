import { Student, Fee, Notice } from "../types";

export const students: Student[] = [
  { id: "1", name: "Arjun Mehta", class: "10A" },
  { id: "2", name: "Priya Singh", class: "9B" },
  { id: "3", name: "Rahul Sharma", class: "8C" },
];

export const fees: Fee[] = [
  { studentName: "Arjun Mehta", status: "pending", dueAmount: 3000 },
  { studentName: "Priya Singh", status: "paid", dueAmount: 0 },
];

export const notices: Notice[] = [
  { title: "Exam Notice", date: "2026-04-01" },
  { title: "Holiday Notice", date: "2026-03-28" },
];
