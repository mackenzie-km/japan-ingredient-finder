import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseNationalAzabuHtml } from "@/lib/services/parsers/nationalazabu.parser";

const fixture = readFileSync(
  path.join(__dirname, "../fixtures/nationalazabu.search.html"),
  "utf-8",
);

describe("parseNationalAzabuHtml", () => {
  it("parses all products in the results", () => {
    const products = parseNationalAzabuHtml(fixture);
    expect(products).toHaveLength(3);
  });

  it("extracts name, price, and url correctly", () => {
    const [first] = parseNationalAzabuHtml(fixture);
    expect(first.name).toBe("SKIPPY PEANUT BUTTER CREAMY");
    expect(first.priceYen).toBe(1080);
    expect(first.priceDisplay).toBe("¥1,080");
    expect(first.url).toBe("https://national-azabu.net/products/detail/171638");
    expect(first.imageUrl).toBe(
      "https://national-azabu.net/upload/save_image/37600112390_s.jpg",
    );
  });

  it("marks in-stock items as inStock: true", () => {
    const [first] = parseNationalAzabuHtml(fixture);
    expect(first.inStock).toBe(true);
  });

  it("marks sold-out items as inStock: false", () => {
    const products = parseNationalAzabuHtml(fixture);
    const soldOut = products.find((p) => p.name.includes("THINK!"));
    expect(soldOut?.inStock).toBe(false);
  });

  it("marks low-stock ('残りあと') items as inStock: true", () => {
    const products = parseNationalAzabuHtml(fixture);
    const lowStock = products.find((p) => p.name.includes("NATURE'S PATH"));
    expect(lowStock?.inStock).toBe(true);
  });

  it("extracts dietary tags", () => {
    const products = parseNationalAzabuHtml(fixture);
    const tagged = products.find((p) => p.name.includes("NATURE'S PATH"));
    expect(tagged?.tags).toEqual(["NON GMO", "ORGANIC", "KOSHER", "VEGAN"]);
  });

  it("returns an empty array when no products are present", () => {
    const products = parseNationalAzabuHtml("<html><body></body></html>");
    expect(products).toEqual([]);
  });
});
