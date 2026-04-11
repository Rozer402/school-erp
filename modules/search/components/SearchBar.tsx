"use client";
import React, { useState, useRef } from "react";
import { searchIndex as searchAll } from "../utils/search";
import SearchResultsPanel from "./SearchResults";

type SearchState = ReturnType<typeof searchAll>;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchState>({
    nav: [],
    students: [],
    fees: [],
    notices: [],
  });
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setResults(searchAll(val));
    setOpen(!!val);
  }

  function handleBlur() {
    setTimeout(() => setOpen(false), 100);
  }

  return (
    <div className="relative w-full max-w-xs">
      <input
        ref={inputRef}
        type="text"
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search students, fees, notices..."
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        aria-label="Global Search"
      />
      {open && query && (
        <div className="absolute left-0 right-0 mt-2 z-50">
          <SearchResultsPanel
            groups={[
              { key: "students", label: "Students", items: results.students },
              { key: "fees", label: "Fees", items: results.fees },
              { key: "notices", label: "Notices", items: results.notices },
            ]}
            selected={null}
            query={query}
            onSelect={() => {}}
            onAction={() => {}}
          />
        </div>
      )}
    </div>
  );
}
