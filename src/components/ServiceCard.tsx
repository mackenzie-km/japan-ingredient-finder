import { DataServiceCard } from "@/components/DataServiceCard";
import { LinkOutServiceCard } from "@/components/LinkOutServiceCard";
import type { ServiceSearchResult } from "@/lib/services/types";

// Presentation-only branch — the data contract underneath is uniform;
// only the last-mile rendering differs by service kind.
export function ServiceCard({ result }: { result: ServiceSearchResult }) {
  if (result.service.kind === "link-out") {
    return <LinkOutServiceCard result={result} />;
  }
  return <DataServiceCard result={result} />;
}
