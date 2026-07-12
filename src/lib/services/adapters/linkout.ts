import type { ServiceAdapter, ServiceMeta } from "@/lib/services/types";

export function createLinkOutAdapter(
  meta: ServiceMeta,
  buildUrl: (query: string) => string | null,
): ServiceAdapter {
  return {
    meta,
    async search(query: string) {
      return {
        service: meta,
        status: "ok" as const,
        query,
        products: [],
        linkOutUrl: buildUrl(query) ?? meta.homepage,
        fetchedAt: new Date().toISOString(),
        durationMs: 0,
      };
    },
  };
}
