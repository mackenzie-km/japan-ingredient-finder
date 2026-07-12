import { getCached, setCached } from "@/lib/services/cache";
import { serviceAdapters } from "@/lib/services/registry";
import type { SearchApiResponse, ServiceAdapter } from "@/lib/services/types";

// Some catalogs (e.g. a single-country specialty importer) can match far
// more broadly than others for a common term — cap per-card display so one
// source's card doesn't dwarf the rest of the results page. `status` is
// already decided by the adapter from the untruncated match count, so
// truncating here doesn't misrepresent "no results" as anything else.
const MAX_PRODUCTS_PER_SERVICE = 20;

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function searchAllServices(
  query: string,
  adapters: ServiceAdapter[] = serviceAdapters,
): Promise<SearchApiResponse> {
  const key = normalizeQuery(query);
  const cached = getCached<SearchApiResponse>(key);
  if (cached) return cached;

  const start = Date.now();
  const settled = await Promise.allSettled(adapters.map((a) => a.search(query)));
  const results = settled.map((r, i) => {
    const result =
      r.status === "fulfilled"
        ? r.value
        : {
            service: adapters[i].meta,
            status: "error" as const,
            query,
            products: [],
            error: String(r.reason),
            fetchedAt: new Date().toISOString(),
            durationMs: 0,
          };
    return { ...result, products: result.products.slice(0, MAX_PRODUCTS_PER_SERVICE) };
  });

  const response: SearchApiResponse = { query, tookMs: Date.now() - start, results };
  setCached(key, response);
  return response;
}
