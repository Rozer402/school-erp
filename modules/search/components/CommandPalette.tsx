"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchIndex } from "../utils/search";
import { useCommandPalette } from "../hooks/useCommandPalette";
import SearchResults from "./SearchResults";

export default function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    group: string;
    idx: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce input
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Search results
  const results = useMemo(() => searchIndex(debouncedQuery), [debouncedQuery]);
  const groups = [
    { key: "nav", label: "Navigation", items: results.nav },
    { key: "students", label: "Students", items: results.students },
    { key: "fees", label: "Fees", items: results.fees },
    { key: "notices", label: "Notices", items: results.notices },
  ];

  const flatItems = groups.flatMap((g, gi) =>
    g.items.map((item, idx) => ({
      ...item,
      _group: g.key,
      _groupIdx: gi,
      _idx: idx,
    })),
  );

  // Action handler
  function handleAction(item: any) {
    if (item.type === "nav" && item.path) {
      router.push(item.path);
      close();
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((sel) => {
          const flatIdx = sel
            ? flatItems.findIndex(
                (i) => i._group === sel.group && i._idx === sel.idx,
              )
            : -1;
          const next = (flatIdx + 1) % flatItems.length;
          const item = flatItems[next];
          return { group: item._group, idx: item._idx };
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((sel) => {
          const flatIdx = sel
            ? flatItems.findIndex(
                (i) => i._group === sel.group && i._idx === sel.idx,
              )
            : flatItems.length;
          const prev = (flatIdx - 1 + flatItems.length) % flatItems.length;
          const item = flatItems[prev];
          return { group: item._group, idx: item._idx };
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selected) {
          const group = groups.find((g) => g.key === selected.group);
          const item = group?.items[selected.idx];
          if (item) handleAction(item);
        }
      } else if (e.key === "Escape") {
        close();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, selected, flatItems, groups, close, router]);

  // Focus input on open, reset on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setSelected(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-xl mx-auto p-0">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <input
            ref={inputRef}
            className="w-full bg-transparent outline-none text-lg px-2 py-2 rounded"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <SearchResults
          groups={groups}
          selected={selected}
          query={debouncedQuery}
          onSelect={(group, idx) => setSelected({ group, idx })}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
