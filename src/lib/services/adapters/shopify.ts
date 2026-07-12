import { fetchWithTimeout } from "@/lib/http";
import type {
  ProductResult,
  ServiceAdapter,
  ServiceMeta,
  ServiceSearchResult,
} from "@/lib/services/types";

interface ShopifyVariant {
  price: string;
  available: boolean;
  sku: string | null;
}

interface ShopifyProduct {
  title: string;
  handle: string;
  vendor: string;
  variants: ShopifyVariant[];
  images: { src: string }[];
}

interface ShopifyProductsResponse {
  products: ShopifyProduct[];
}

async function fetchCatalog(domain: string, localePrefix: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  // Cap at 2 pages (~500 products) rather than fully paginating — a
  // documented tradeoff, not full catalog coverage.
  for (const page of [1, 2]) {
    const res = await fetchWithTimeout(
      `https://${domain}${localePrefix}/products.json?limit=250&page=${page}`,
    );
    if (!res.ok) {
      // A failed first page means we couldn't check the catalog at all —
      // that must surface as an error/unavailable status, not a silent
      // "empty" (no results) which would misrepresent "we don't know" as
      // "we checked and there's nothing".
      if (page === 1) throw new Error(`Shopify catalog fetch failed: HTTP ${res.status}`);
      break;
    }
    const data = (await res.json()) as ShopifyProductsResponse;
    products.push(...data.products);
    if (data.products.length < 250) break;
  }
  return products;
}

function cheapestVariant(variants: ShopifyVariant[]): ShopifyVariant | undefined {
  return variants
    .slice()
    .sort((a, b) => Number(a.price) - Number(b.price))[0];
}

function toProductResult(
  domain: string,
  localePrefix: string,
  product: ShopifyProduct,
): ProductResult {
  const variant = cheapestVariant(product.variants);
  const priceYen = variant ? Number(variant.price) : null;
  return {
    name: product.title,
    priceYen,
    priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
    url: `https://${domain}${localePrefix}/products/${product.handle}`,
    imageUrl: product.images[0]?.src,
    inStock: variant ? variant.available : null,
    sku: variant?.sku ?? undefined,
  };
}

export function createShopifyJsonAdapter(
  meta: ServiceMeta,
  domain: string,
  // Some Shopify storefronts default to a Japanese-only catalog with an
  // English catalog available under a locale path (e.g. "/en") — pass
  // that here so titles/search match English ingredient queries.
  localePrefix = "",
): ServiceAdapter {
  return {
    meta,
    async search(query: string): Promise<ServiceSearchResult> {
      const start = Date.now();
      const base = {
        service: meta,
        query,
        fetchedAt: new Date().toISOString(),
      };
      try {
        const catalog = await fetchCatalog(domain, localePrefix);
        const q = query.trim().toLowerCase();
        const matches = catalog.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.vendor.toLowerCase().includes(q),
        );
        return {
          ...base,
          status: matches.length > 0 ? "ok" : "empty",
          products: matches.map((p) => toProductResult(domain, localePrefix, p)),
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
}
