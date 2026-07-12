import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { halalFoodJpAdapter } from "@/lib/services/adapters/halalfoodjp";

const fixture = JSON.parse(
  readFileSync(path.join(__dirname, "../fixtures/halalfoodjp.search.json"), "utf-8"),
);

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, status, json: async () => body }));
}

describe("halalFoodJpAdapter", () => {
  it("maps price from minor units correctly", async () => {
    mockFetchOnce(fixture);
    const result = await halalFoodJpAdapter.search("rice");
    expect(result.status).toBe("ok");
    expect(result.products[0].priceYen).toBe(350);
    expect(result.products[0].priceDisplay).toBe("¥350");
  });

  it("maps is_in_stock to inStock directly", async () => {
    mockFetchOnce(fixture);
    const result = await halalFoodJpAdapter.search("rice");
    expect(result.products[0].inStock).toBe(true);
    expect(result.products[1].inStock).toBe(false);
  });

  it("maps tags and permalink", async () => {
    mockFetchOnce(fixture);
    const result = await halalFoodJpAdapter.search("rice");
    expect(result.products[0].tags).toEqual(["Halal", "Ramadan"]);
    expect(result.products[0].url).toBe("https://halalfoodjp.com/product/puffed-rice-200g-muri/");
  });

  it("returns status 'empty' for no results", async () => {
    mockFetchOnce([]);
    const result = await halalFoodJpAdapter.search("nonexistent");
    expect(result.status).toBe("empty");
  });

  it("returns status 'unavailable' on non-ok response", async () => {
    mockFetchOnce({}, false, 503);
    const result = await halalFoodJpAdapter.search("rice");
    expect(result.status).toBe("unavailable");
  });
});
