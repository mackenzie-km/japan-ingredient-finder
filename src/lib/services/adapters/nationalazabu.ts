import { fetchWithTimeout } from "@/lib/http";
import { SERVICE_META } from "@/lib/services/meta";
import { parseNationalAzabuHtml } from "@/lib/services/parsers/nationalazabu.parser";
import type { ServiceAdapter, ServiceSearchResult } from "@/lib/services/types";

export const nationalAzabuAdapter: ServiceAdapter = {
  meta: SERVICE_META.nationalazabu,
  async search(query: string): Promise<ServiceSearchResult> {
    const start = Date.now();
    const base = {
      service: SERVICE_META.nationalazabu,
      query,
      fetchedAt: new Date().toISOString(),
    };
    try {
      const name = encodeURIComponent(query).replace(/%20/g, "+");
      const url = `https://national-azabu.net/products/list?category_id=&name=${name}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        return { ...base, status: "unavailable", products: [], durationMs: Date.now() - start };
      }
      const html = await res.text();
      const products = parseNationalAzabuHtml(html);
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
