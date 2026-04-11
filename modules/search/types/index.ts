// Types for Global Search System

export type Student = {
  id: string;
  name: string;
  class: string;
};

export type Fee = {
  studentName: string;
  status: "pending" | "paid";
  dueAmount: number;
};

export type Notice = {
  title: string;
  date: string;
};

export type SearchResults = {
  students: Student[];
  fees: Fee[];
  notices: Notice[];
};
