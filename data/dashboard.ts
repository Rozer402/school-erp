import { Megaphone, CheckCircle, FileText, CheckSquare, Briefcase } from "lucide-react";

export const statCardsData = [
  { 
    title: "Announcements", 
    value: 12, 
    icon: Megaphone, 
    color: "bg-blue-500", 
    lightBase: "bg-blue-50 dark:bg-blue-900/20", 
    text: "text-blue-600 dark:text-blue-400",
    trend: { value: "NEW", isUp: true }
  },
  { 
    title: "Attendance", 
    value: "85.2%", 
    icon: CheckCircle, 
    color: "bg-emerald-500", 
    lightBase: "bg-emerald-50 dark:bg-emerald-900/20", 
    text: "text-emerald-600 dark:text-emerald-400",
    trend: { value: "+2.1%", isUp: true },
    progress: 85.2
  },
  { 
    title: "Assessments", 
    value: 1, 
    icon: FileText, 
    color: "bg-purple-500", 
    lightBase: "bg-purple-50 dark:bg-purple-900/20", 
    text: "text-purple-600 dark:text-purple-400",
    trend: { value: "DUE", isUp: false }
  },
  { 
    title: "Tasks", 
    value: 4, 
    icon: CheckSquare, 
    color: "bg-amber-500", 
    lightBase: "bg-amber-50 dark:bg-amber-900/20", 
    text: "text-amber-600 dark:text-amber-400",
    trend: { value: "PENDING", isUp: false },
    progress: 40
  },
  { 
    title: "Placement", 
    value: 0, 
    icon: Briefcase, 
    color: "bg-indigo-500", 
    lightBase: "bg-indigo-50 dark:bg-indigo-900/20", 
    text: "text-indigo-600 dark:text-indigo-400",
    trend: { value: "+0", isUp: true }
  },
];

export const scheduleData = [
  { id: 1, time: "09:00 AM - 10:00 AM", subject: "Data Structures & Algorithms", location: "Room 101", type: "Lecture" },
  { id: 2, time: "10:15 AM - 11:15 AM", subject: "Database Management", location: "Lab 3", type: "Practical" },
  { id: 3, time: "11:30 AM - 12:30 PM", subject: "Computer Networks", location: "Room 102", type: "Lecture" },
  { id: 4, time: "01:30 PM - 02:30 PM", subject: "Operating Systems", location: "Room 205", type: "Lecture" },
];

export const bulletinData = [
  { id: 1, title: "Mid-Term Examination Schedule Released", date: "Oct 24, 2026", type: "Important" },
  { id: 2, title: "Campus Recruitment Drive: Tech Solutions", date: "Oct 26, 2026", type: "Placement" },
  { id: 3, title: "Holiday Notice: Diwali", date: "Oct 30, 2026", type: "General" },
];
