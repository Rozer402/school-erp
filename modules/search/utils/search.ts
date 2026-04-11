// modules/search/utils/search.ts

import { navItems, students, fees, notices } from "../data";

export type CommandItem = {
  type: string;
  label: string;
  path?: string;
  icon?: string;
  meta?: string;
};

type SearchResult = {
  nav: CommandItem[];
  students: CommandItem[];
  fees: CommandItem[];
  notices: CommandItem[];
};

export function searchIndex(query: string): SearchResult {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      nav: navItems as CommandItem[],
      students: students as CommandItem[],
      fees: fees as CommandItem[],
      notices: notices as CommandItem[],
    };
  }
  return {
    nav: (navItems as CommandItem[]).filter((item) =>
      item.label.toLowerCase().includes(q),
    ),
    students: (students as CommandItem[]).filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.meta?.toLowerCase().includes(q),
    ),
    fees: (fees as CommandItem[]).filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.meta?.toLowerCase().includes(q),
    ),
    notices: (notices as CommandItem[]).filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.meta?.toLowerCase().includes(q),
    ),
  };
}
