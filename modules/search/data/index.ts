// Unified index for Command Palette
import { type CommandItem } from "../utils/search";

export const navItems: CommandItem[] = [
  { type: "nav", label: "Fees", path: "/fees", icon: "💰" },
  { type: "nav", label: "Timetable", path: "/timetable", icon: "📅" },
];

export const students: CommandItem[] = [
  { type: "student", label: "Arjun Mehta", meta: "Class 10-A" },
  { type: "student", label: "Priya Singh", meta: "Class 9-B" },
];

export const fees: CommandItem[] = [
  { type: "fee", label: "₹3000 Pending", meta: "Arjun Mehta" },
  { type: "fee", label: "₹0 Paid", meta: "Priya Singh" },
];

export const notices: CommandItem[] = [
  { type: "notice", label: "Exam Notice", meta: "Apr 1" },
  { type: "notice", label: "Holiday Notice", meta: "Apr 5" },
];

export const unifiedIndex: CommandItem[] = [...navItems, ...students, ...fees, ...notices];
