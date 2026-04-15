export const feesData = [
  { id: "F001", type: "Tuition Fee (Fall Semester)", amount: "$1,500.00", dueDate: "Aug 15, 2026", status: "Paid" },
  { id: "F002", type: "Library Maintenance", amount: "$50.00", dueDate: "Sep 01, 2026", status: "Paid" },
  { id: "F003", type: "Hostel & Mess Charges", amount: "$800.00", dueDate: "Oct 15, 2026", status: "Pending" },
  { id: "F004", type: "Laboratory Fee", amount: "$120.00", dueDate: "Nov 01, 2026", status: "Upcoming" },
];

export const leaveData = [
  { id: "L001", dateRange: "Oct 12 - Oct 13, 2026", days: 2, reason: "Sick Leave (Viral Fever)", status: "Approved" },
  { id: "L002", dateRange: "Nov 05 - Nov 05, 2026", days: 1, reason: "Family Function", status: "Pending" },
  { id: "L003", dateRange: "Sep 01 - Sep 03, 2026", days: 3, reason: "Out of Station", status: "Rejected" },
];

export const libraryData = [
  { id: "B102", title: "Introduction to Algorithms", author: "Thomas H. Cormen", issueDate: "Oct 10, 2026", returnDate: "Oct 24, 2026", status: "Overdue" },
  { id: "B405", title: "Operating System Concepts", author: "Abraham Silberschatz", issueDate: "Oct 20, 2026", returnDate: "Nov 03, 2026", status: "Issued" },
  { id: "B211", title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross", issueDate: "Sep 01, 2026", returnDate: "Sep 15, 2026", status: "Returned" },
];

export const attendanceTrends = [
  { month: "Aug", percentage: 92 },
  { month: "Sep", percentage: 88 },
  { month: "Oct", percentage: 85 },
  { month: "Nov", percentage: 89 },
];

export const subjectAttendance = [
  { id: "CS301", name: "Data Structures", totalClasses: 40, attended: 35, percentage: 87.5 },
  { id: "CS302", name: "Database Management", totalClasses: 38, attended: 30, percentage: 78.9 },
  { id: "CS303", name: "Computer Networks", totalClasses: 42, attended: 40, percentage: 95.2 },
  { id: "CS304", name: "Operating Systems", totalClasses: 40, attended: 32, percentage: 80.0 },
];

export const mockUser = {
  id: "1",
  name: "Arjun Mehta",
  role: "student",
};

export const mockFees = [
  {
    id: "F001",
    amount: 5000,
    status: "PAID",
    date: "2026-04-01",
  },
];

export const mockAttendance = {
  percentage: 85.2,
};

export const mockDashboard = {
  stats: [
    { value: "1,200", trend: "+5%", progress: 85 },
    { value: "45", trend: "+2", progress: 60 },
    { value: "15", trend: "-3", progress: 90 },
    { value: "$12,000", trend: "+10%", progress: 75 },
    { value: "98%", trend: "+1%", progress: 98 }
  ],
  bulletins: [
    { id: "1", type: "IMPORTANT", date: "2026-05-10 10:00", title: "Semester Exams announced" },
    { id: "2", type: "HOLIDAY", date: "2026-04-20 00:00", title: "Spring Break" },
    { id: "3", type: "EXAM", date: "2026-06-01 09:00", title: "Finals" }
  ]
};

export const mockNotices = mockDashboard.bulletins;
