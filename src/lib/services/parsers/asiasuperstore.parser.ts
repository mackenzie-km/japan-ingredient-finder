import * as cheerio from "cheerio";
import type { ProductResult } from "@/lib/services/types";

// The storefront has no per-product page — its "detail view" is a JS modal
// with no addressable URL, and /product/detail/id/<id> just 301s to the
// homepage. Every result links back to the search page itself instead.
const SEARCH_PAGE_URL = "https://asia-superstore.com/en/shopin";

function extractPriceYen($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>): number | null {
  // Sale items show their discounted price in a separate ".sale-price-text"
  // element (e.g. "183Yen") and the regular price span gets a
  // "price-decoration" (strikethrough) class instead of being empty — match
  // on "is this text just digits/commas", not on a specific class name, so
  // both cases resolve to the price the customer actually pays.
  const saleMatch = $el.find(".sale-price-text").first().text().match(/[\d,]+/);
  if (saleMatch) return Number(saleMatch[0].replace(/,/g, ""));

  const priceLabel = $el.find("label.common_color_brown_1").not(".product-id").first();
  let priceText = "";
  priceLabel.find("span").each((_, span) => {
    const t = $(span).text().trim();
    if (/^[\d,]+$/.test(t)) {
      priceText = t;
      return false;
    }
  });
  return priceText ? Number(priceText.replace(/,/g, "")) : null;
}

export function parseAsiaSuperstoreHtml(html: string): ProductResult[] {
  const $ = cheerio.load(html);
  const products: ProductResult[] = [];
  const seenSkus = new Set<string>();

  $('[class*="prod-list-item"]').each((_, el) => {
    const $el = $(el);
    const name = $el.find(".prod-list-title").first().text().trim();
    if (!name) return;

    // Every result links to the same SEARCH_PAGE_URL (no per-product page
    // exists), so the site's own product id is what keeps list items unique
    // for React's key prop downstream — it also doubles as a dedup key,
    // since the site's search results genuinely repeat the same product
    // (identical id and markup) more than once for some queries.
    const sku = ($el.attr("id") ?? "").replace(/^p/, "") || undefined;
    if (sku) {
      if (seenSkus.has(sku)) return;
      seenSkus.add(sku);
    }

    const priceYen = extractPriceYen($, $el);

    products.push({
      name,
      priceYen,
      priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
      url: SEARCH_PAGE_URL,
      imageUrl: $el.find("img.prod-list-img").attr("src"),
      inStock: $el.find(".prod-soldout").length === 0,
      sku,
    });
  });

  return products;
}
