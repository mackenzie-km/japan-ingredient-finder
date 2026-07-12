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
        className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm px-4 py-2 disabled:opacity-50 hover:bg-gray-700 dark:hover:bg-gray-200"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
