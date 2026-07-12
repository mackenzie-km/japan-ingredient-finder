import * as cheerio from "cheerio";
import type { ProductResult } from "@/lib/services/types";

const DOMAIN = "https://store.alishan.jp";

export function parseTenguNaturalFoodsHtml(html: string): ProductResult[] {
  const $ = cheerio.load(html);
  const products: ProductResult[] = [];

  $("div.card-wrapper").each((_, el) => {
    const $card = $(el);
    const $link = $card.find("h3.card__heading a").first();
    const name = $link.text().trim();
    const href = $link.attr("href");
    if (!name || !href) return;

    const priceText = $card.find(".price__regular .price-item--regular").first().text().trim();
    const priceMatch = priceText.match(/[\d,]+/);
    const priceYen = priceMatch ? Number(priceMatch[0].replace(/,/g, "")) : null;

    const soldOut = /sold out/i.test($card.find(".card__badge").text());

    products.push({
      name,
      priceYen,
      priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
      url: `${DOMAIN}${href.split("?")[0]}`,
      imageUrl: $card.find("img").first().attr("src")?.replace(/^\/\//, "https://"),
      inStock: soldOut ? false : null,
    });
  });

  return products;
}
