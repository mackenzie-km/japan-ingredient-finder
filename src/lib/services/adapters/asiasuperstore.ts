import { fetchWithTimeout } from "@/lib/http";
import { SERVICE_META } from "@/lib/services/meta";
import { parseAsiaSuperstoreHtml } from "@/lib/services/parsers/asiasuperstore.parser";
import type { ServiceAdapter, ServiceSearchResult } from "@/lib/services/types";

// This storefront only exposes search as a POST form (no GET/JSON endpoint),
// so results can't be reached with a plain query-string URL — see the parser
// for how per-product links are handled instead.
export const asiaSuperstoreAdapter: ServiceAdapter = {
  meta: SERVICE_META.asiasuperstore,
  async search(query: string): Promise<ServiceSearchResult> {
    const start = Date.now();
    const base = {
      service: SERVICE_META.asiasuperstore,
      query,
      fetchedAt: new Date().toISOString(),
    };
    try {
      const res = await fetchWithTimeout("https://asia-superstore.com/en/product/search", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ search: query }).toString(),
      });
      if (!res.ok) {
        return { ...base, status: "unavailable", products: [], durationMs: Date.now() - start };
      }
      const html = await res.text();
      const products = parseAsiaSuperstoreHtml(html);
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
