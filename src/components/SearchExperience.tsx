"use client";

import { useState } from "react";
import { ResultsView } from "@/components/ResultsView";
import { SearchBar } from "@/components/SearchBar";
import type { SearchApiResponse } from "@/lib/services/types";

export function SearchExperience() {
  const [data, setData] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = (await res.json()) as SearchApiResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <p className="text-sm text-[#c0392b]">{error}</p>}
      {data && <ResultsView results={data.results} />}
    </div>
  );
}
