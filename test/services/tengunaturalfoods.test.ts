import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseTenguNaturalFoodsHtml } from "@/lib/services/parsers/tengunaturalfoods.parser";

const fixture = readFileSync(
  path.join(__dirname, "../fixtures/tengunaturalfoods.search.html"),
  "utf-8",
);

describe("parseTenguNaturalFoodsHtml", () => {
  it("parses all products", () => {
    expect(parseTenguNaturalFoodsHtml(fixture)).toHaveLength(2);
  });

  it("extracts name, price, and url correctly", () => {
    const [first] = parseTenguNaturalFoodsHtml(fixture);
    expect(first.name).toBe("Organic Smooth Peanut Butter");
    expect(first.priceYen).toBe(1647);
    expect(first.priceDisplay).toBe("¥1,647");
    expect(first.url).toBe("https://store.alishan.jp/en/products/organic-smooth-peanut-butter");
  });

  it("defaults inStock to null when no sold-out badge is present", () => {
    const [first] = parseTenguNaturalFoodsHtml(fixture);
    expect(first.inStock).toBeNull();
  });

  it("marks sold-out items as inStock: false", () => {
    const [, second] = parseTenguNaturalFoodsHtml(fixture);
    expect(second.inStock).toBe(false);
  });

  it("returns an empty array when no products are present", () => {
    expect(parseTenguNaturalFoodsHtml("<html><body></body></html>")).toEqual([]);
  });
});
