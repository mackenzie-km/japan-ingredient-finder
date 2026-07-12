"use client";

import { useState } from "react";

export function SearchBar({
  onSearch,
  loading,
}: {
  onSearch: (query: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSearch(value.trim());
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search an ingredient or brand, e.g. peanut butter"
        className="flex-1 rounded-full border border-[#e5e5e5] bg-white text-[#141414] placeholder:text-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68c45]"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-full bg-gradient-to-r from-[#c97d35] to-[#d68c45] text-white font-semibold text-base px-8 py-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(214,140,69,0.3)] disabled:bg-[#f4d6b0] disabled:text-[#c8a06a] disabled:opacity-100 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
