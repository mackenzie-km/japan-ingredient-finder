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

async function fetchCatalog(domain: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  // Cap at 2 pages (~500 products) rather than fully paginating — a
  // documented tradeoff, not full catalog coverage.
  for (const page of [1, 2]) {
    const res = await fetchWithTimeout(
      `https://${domain}/products.json?limit=250&page=${page}`,
    );
    if (!res.ok) break;
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

function toProductResult(domain: string, product: ShopifyProduct): ProductResult {
  const variant = cheapestVariant(product.variants);
  const priceYen = variant ? Number(variant.price) : null;
  return {
    name: product.title,
    priceYen,
    priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
    url: `https://${domain}/products/${product.handle}`,
    imageUrl: product.images[0]?.src,
    inStock: variant ? variant.available : null,
    sku: variant?.sku ?? undefined,
  };
}

export function createShopifyJsonAdapter(
  meta: ServiceMeta,
  domain: string,
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
        const catalog = await fetchCatalog(domain);
        const q = query.trim().toLowerCase();
        const matches = catalog.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.vendor.toLowerCase().includes(q),
        );
        return {
          ...base,
          status: matches.length > 0 ? "ok" : "empty",
          products: matches.map((p) => toProductResult(domain, p)),
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
