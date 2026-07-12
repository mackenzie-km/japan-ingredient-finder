import { ServiceCard } from "@/components/ServiceCard";
import type { ServiceSearchResult } from "@/lib/services/types";

export function ResultsView({ results }: { results: ServiceSearchResult[] }) {
  if (results.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((r) => (
        <ServiceCard key={r.service.id} result={r} />
      ))}
    </div>
  );
}
