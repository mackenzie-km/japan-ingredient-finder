import { fetchWithTimeout } from "@/lib/http";
import { SERVICE_META } from "@/lib/services/meta";
import { parseKaldiHtml } from "@/lib/services/parsers/kaldi.parser";
import type { ServiceAdapter, ServiceSearchResult } from "@/lib/services/types";

export const kaldiAdapter: ServiceAdapter = {
  meta: SERVICE_META.kaldi,
  async search(query: string): Promise<ServiceSearchResult> {
    const start = Date.now();
    const base = {
      service: SERVICE_META.kaldi,
      query,
      fetchedAt: new Date().toISOString(),
    };
    try {
      const url = `https://www.kaldi.co.jp/ec/Facet?inputKeywordFacet=${encodeURIComponent(query)}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        return { ...base, status: "unavailable", products: [], durationMs: Date.now() - start };
      }
      const html = await res.text();
      const products = parseKaldiHtml(html);
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
