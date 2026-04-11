"use client";
import React from "react";

export default function SearchInput({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-left text-gray-500 dark:text-zinc-400"
      tabIndex={0}
      onClick={onClick}
      aria-label="Open Command Palette"
      type="button"
    >
      <span className="">Search (Ctrl+K)</span>
    </button>
  );
}
