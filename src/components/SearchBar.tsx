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
        className="flex-1 rounded-full border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-[#241a12] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-full bg-amber-700 text-white text-sm px-5 py-2 disabled:opacity-50 hover:bg-amber-800 transition-colors"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
