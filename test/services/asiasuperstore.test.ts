import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseAsiaSuperstoreHtml } from "@/lib/services/parsers/asiasuperstore.parser";

const fixture = readFileSync(
  path.join(__dirname, "../fixtures/asiasuperstore.search.html"),
  "utf-8",
);

describe("parseAsiaSuperstoreHtml", () => {
  it("parses all products in the results, deduped by product id", () => {
    // Fixture has 5 product blocks but p315 is repeated verbatim, matching
    // real search responses observed on the live site.
    const products = parseAsiaSuperstoreHtml(fixture);
    expect(products).toHaveLength(4);
  });

  it("extracts name, price, and image correctly", () => {
    const [first] = parseAsiaSuperstoreHtml(fixture);
    expect(first.name).toBe("LOBO・Masman Curry Paste(50g)");
    expect(first.priceYen).toBe(289);
    expect(first.priceDisplay).toBe("¥289");
    expect(first.imageUrl).toBe("https://asia-superstore.com/web/img/product/1164_og.jpg");
  });

  it("links every result back to the search page (no per-product page exists)", () => {
    const products = parseAsiaSuperstoreHtml(fixture);
    expect(products.every((p) => p.url === "https://asia-superstore.com/en/shopin")).toBe(true);
  });

  it("gives every product a unique sku, since url can't tell them apart", () => {
    const products = parseAsiaSuperstoreHtml(fixture);
    const skus = products.map((p) => p.sku);
    expect(new Set(skus).size).toBe(products.length);
    expect(skus).toContain("1164");
  });

  it("uses the discounted price for sale items, not the struck-through original", () => {
    const products = parseAsiaSuperstoreHtml(fixture);
    const sale = products.find((p) => p.sku === "315");
    expect(sale?.priceYen).toBe(183);
    expect(sale?.priceDisplay).toBe("¥183");
  });

  it("marks in-stock items as inStock: true", () => {
    const [first] = parseAsiaSuperstoreHtml(fixture);
    expect(first.inStock).toBe(true);
  });

  it("marks sold-out items as inStock: false", () => {
    const products = parseAsiaSuperstoreHtml(fixture);
    const soldOut = products.find((p) => p.name.includes("Kao Soi"));
    expect(soldOut?.inStock).toBe(false);
  });

  it("strips comma separators from four-digit prices", () => {
    const products = parseAsiaSuperstoreHtml(fixture);
    const expensive = products.find((p) => p.name.includes("Yellow Curry"));
    expect(expensive?.priceYen).toBe(1298);
    expect(expensive?.priceDisplay).toBe("¥1,298");
  });

  it("returns an empty array when no products are present", () => {
    const products = parseAsiaSuperstoreHtml("<html><body></body></html>");
    expect(products).toEqual([]);
  });
});
