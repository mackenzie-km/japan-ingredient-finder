import { fetchWithTimeout } from "@/lib/http";
import { SERVICE_META } from "@/lib/services/meta";
import type { ProductResult, ServiceAdapter, ServiceSearchResult } from "@/lib/services/types";

interface WooProduct {
  name: string;
  permalink: string;
  sku: string;
  is_in_stock: boolean;
  prices: {
    price: string;
    currency_minor_unit: number;
  };
  images: { src: string }[];
  tags: { name: string }[];
}

function toProductResult(item: WooProduct): ProductResult {
  const priceYen = Number(item.prices.price) / 10 ** item.prices.currency_minor_unit;
  return {
    name: item.name,
    priceYen,
    priceDisplay: `¥${priceYen.toLocaleString("en-US")}`,
    url: item.permalink,
    imageUrl: item.images[0]?.src,
    inStock: item.is_in_stock,
    sku: item.sku || undefined,
    tags: item.tags.map((t) => t.name),
  };
}

export const halalFoodJpAdapter: ServiceAdapter = {
  meta: SERVICE_META.halalfoodjp,
  async search(query: string): Promise<ServiceSearchResult> {
    const start = Date.now();
    const base = {
      service: SERVICE_META.halalfoodjp,
      query,
      fetchedAt: new Date().toISOString(),
    };
    try {
      const res = await fetchWithTimeout(
        `https://halalfoodjp.com/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}`,
      );
      if (!res.ok) {
        return { ...base, status: "unavailable", products: [], durationMs: Date.now() - start };
      }
      const items = (await res.json()) as WooProduct[];
      return {
        ...base,
        status: items.length > 0 ? "ok" : "empty",
        products: items.map(toProductResult),
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
