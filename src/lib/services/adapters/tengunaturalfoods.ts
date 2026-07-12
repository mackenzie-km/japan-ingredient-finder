import { fetchWithTimeout } from "@/lib/http";
import { SERVICE_META } from "@/lib/services/meta";
import { parseTenguNaturalFoodsHtml } from "@/lib/services/parsers/tengunaturalfoods.parser";
import type { ServiceAdapter, ServiceSearchResult } from "@/lib/services/types";

// The store also exposes /products.json, but that feed omits real catalog
// items that this on-site (Elasticsearch-backed) search finds — e.g. its
// "Organic Peanut Butter" line isn't in the JSON feed at all. Live HTML
// search is the accurate source for this merchant; verified by hand.
export const tenguNaturalFoodsAdapter: ServiceAdapter = {
  meta: SERVICE_META.tengunaturalfoods,
  async search(query: string): Promise<ServiceSearchResult> {
    const start = Date.now();
    const base = {
      service: SERVICE_META.tengunaturalfoods,
      query,
      fetchedAt: new Date().toISOString(),
    };
    try {
      const url = `https://store.alishan.jp/en/search?q=${encodeURIComponent(query)}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        return { ...base, status: "unavailable", products: [], durationMs: Date.now() - start };
      }
      const html = await res.text();
      const products = parseTenguNaturalFoodsHtml(html);
      return {
        ...base,
        status: products.length > 0 ? "ok" : "empty",
        products,
        durationMs: Date.now() - start,
      };
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === "AbortError";
      return {
        ...base,
        status: isTimeout ? "unavailable" : "error",
        products: [],
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - start,
      };
    }
  },
};
