import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseKaldiHtml } from "@/lib/services/parsers/kaldi.parser";

const fixture = readFileSync(path.join(__dirname, "../fixtures/kaldi.search.html"), "utf-8");

describe("parseKaldiHtml", () => {
  it("parses all products in the results", () => {
    expect(parseKaldiHtml(fixture)).toHaveLength(2);
  });

  it("extracts name, price, and url correctly", () => {
    const [first] = parseKaldiHtml(fixture);
    expect(first.name).toBe("Geeta Rogan Josh Curry 350g");
    expect(first.priceYen).toBe(699);
    expect(first.priceDisplay).toBe("¥699");
    expect(first.url).toBe("https://www.kaldi.co.jp/ec/pro/disp/1/5021185502047");
    expect(first.imageUrl).toBe("https://www.kaldi.co.jp/ec/img/047/5021185502047_M_6s.jpg");
  });

  it("defaults inStock to null when no stock text is present", () => {
    const [first] = parseKaldiHtml(fixture);
    expect(first.inStock).toBeNull();
  });

  it("marks sold-out items (品切れ) as inStock: false", () => {
    const [, second] = parseKaldiHtml(fixture);
    expect(second.inStock).toBe(false);
  });

  it("returns an empty array when no products are present", () => {
    expect(parseKaldiHtml("<html><body></body></html>")).toEqual([]);
  });
});
