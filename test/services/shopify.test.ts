import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createShopifyJsonAdapter } from "@/lib/services/adapters/shopify";
import type { ServiceMeta } from "@/lib/services/types";

const fixture = JSON.parse(
  readFileSync(path.join(__dirname, "../fixtures/shopify.products.json"), "utf-8"),
);

const meta: ServiceMeta = {
  id: "meatguy",
  name: "The Meat Guy",
  kind: "data",
  homepage: "https://www.themeatguy.jp",
  deliveryArea: "Nationwide",
  deliveryFee: "test",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => body,
    }),
  );
}

describe("createShopifyJsonAdapter", () => {
  it("matches products by title substring (case-insensitive)", async () => {
    mockFetchOnce(fixture);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp");
    const result = await adapter.search("BEEF");
    expect(result.status).toBe("ok");
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe("Grass-Fed Beef Tenderized Steaks (500g)");
  });

  it("maps price, url, stock, and image correctly", async () => {
    mockFetchOnce(fixture);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp");
    const result = await adapter.search("beef");
    const [p] = result.products;
    expect(p.priceYen).toBe(2390);
    expect(p.priceDisplay).toBe("¥2,390");
    expect(p.url).toBe("https://www.themeatguy.jp/products/b007a");
    expect(p.inStock).toBe(true);
    expect(p.sku).toBe("B007a");
  });

  it("marks unavailable variants as inStock: false", async () => {
    mockFetchOnce(fixture);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp");
    const result = await adapter.search("boar");
    expect(result.products[0].inStock).toBe(false);
  });

  it("returns status 'empty' when nothing matches", async () => {
    mockFetchOnce(fixture);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp");
    const result = await adapter.search("nonexistent-item-xyz");
    expect(result.status).toBe("empty");
    expect(result.products).toEqual([]);
  });

  it("returns status 'error' when the catalog fetch fails", async () => {
    mockFetchOnce({}, false, 500);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp");
    const result = await adapter.search("beef");
    expect(result.status).toBe("error");
    expect(result.products).toEqual([]);
  });

  it("applies the locale prefix to both the catalog URL and product URLs", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => fixture });
    vi.stubGlobal("fetch", fetchSpy);
    const adapter = createShopifyJsonAdapter(meta, "www.themeatguy.jp", "/en");
    const result = await adapter.search("beef");
    expect(fetchSpy.mock.calls[0][0]).toContain("/en/products.json");
    expect(result.products[0].url).toBe("https://www.themeatguy.jp/en/products/b007a");
  });
});
