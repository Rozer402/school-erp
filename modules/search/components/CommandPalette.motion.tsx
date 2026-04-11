"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchIndex, type CommandItem } from "../utils/search";
import { useCommandPalette } from "../hooks/useCommandPalette";
import { motion, AnimatePresence } from "framer-motion";

const ICONS: Record<string, string> = {
  nav: "📁",
  students: "👤",
  fees: "💰",
  notices: "📢",
};

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

  const groups: { key: string; label: string; items: CommandItem[] }[] = [
    { key: "nav", label: "Navigation", items: results.nav as CommandItem[] },
    {
      key: "students",
      label: "Students",
      items: results.students as CommandItem[],
    },
    { key: "fees", label: "Fees", items: results.fees as CommandItem[] },
    {
      key: "notices",
      label: "Notices",
      items: results.notices as CommandItem[],
    },
  ];

  const flatItems = groups.flatMap((g, gi) =>
    g.items.map((item, idx) => ({
      ...item,
      _group: g.key,
      _groupIdx: gi,
      _idx: idx,
    })),
  );

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
          if (item?.type === "nav" && item && "path" in item && item.path) {
            router.push(item.path as string);

            close();
          }
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

  const showRecent = !debouncedQuery;
  const recent: CommandItem[] = [
    { type: "nav", label: "Fees", path: "/fees", icon: "💰" },
    { type: "nav", label: "Timetable", path: "/timetable", icon: "📅" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        >
          {/* Search input */}
          <div className="border-b border-border">
            <input
              ref={inputRef}
              autoFocus
              placeholder="Search students, fees, notices... (Ctrl + K)"
              className="w-full px-4 py-3 text-sm bg-transparent outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Results list */}
          <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
            {showRecent ? (
              <div>
                <p className="text-xs uppercase text-muted-foreground px-3 py-1 tracking-wider">
                  Recent
                </p>
                {recent.map((item, idx) => (
                  <div
                    key={item.label + idx}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted/40"
                    onClick={() => {
                      if ("path" in item && item.path) {
                        router.push(item.path as string);
                        close();
                      }
                    }}
                  >
                    <span>{item.icon ?? ""}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            ) : groups.every((g) => g.items.length === 0) ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                No results found. Try &quot;fees&quot; or &quot;timetable&quot;
              </p>
            ) : (
              groups.map((group) =>
                group.items.length > 0 ? (
                  <div key={group.key}>
                    <p className="text-xs uppercase text-muted-foreground px-3 py-1 tracking-wider">
                      {group.label}
                    </p>
                    {group.items.map((item, idx) => {
                      const isActive =
                        selected?.group === group.key && selected?.idx === idx;
                      return (
                        <div
                          key={item.label + idx}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            isActive
                              ? "bg-indigo-500/10 border border-indigo-500/20"
                              : "hover:bg-muted/40"
                          }`}
                          onMouseEnter={() =>
                            setSelected({ group: group.key, idx })
                          }
                          onClick={() => {
                            if (item.type === "nav" && item.path) {
                              router.push(item.path);
                              close();
                            }
                          }}
                        >
                          <span>{ICONS[group.key] ?? ""}</span>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {item.meta && (
                            <span className="ml-auto text-xs text-zinc-400">
                              {item.meta}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null,
              )
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
