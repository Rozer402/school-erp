"use client";
import React from "react";
import CommandPalette from "./CommandPalette.motion";
import SearchInput from "./SearchInput";
import { useCommandPalette } from "../hooks/useCommandPalette";

export default function GlobalCommandPaletteWrapper() {
  const { open } = useCommandPalette();
  return (
    <>
      <SearchInput onClick={open} />
      <CommandPalette />
    </>
  );
}
