import * as cheerio from "cheerio";
import type { ProductResult } from "@/lib/services/types";

const DOMAIN = "https://www.kaldi.co.jp";

export function parseKaldiHtml(html: string): ProductResult[] {
  const $ = cheerio.load(html);
  const products: ProductResult[] = [];

  $("div.item").each((_, el) => {
    const $el = $(el);
    const href = $el.find('a[href^="/ec/pro/disp/"]').first().attr("href");
    const name = $el.find(".list_item_name_style").first().text().trim();
    if (!href || !name) return;

    const priceText = $el.find(".list_item_price_style").first().text();
    const priceMatch = priceText.match(/([\d,]+)\s*円/);
    const priceYen = priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : null;

    const stockText = $el.find(".list_item_stockBox_style").first().text().trim();
    const soldOut = /品切れ|sold out/i.test(stockText);

    const imgSrc = $el.find("img").first().attr("src");

    products.push({
      name,
      priceYen,
      priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
      url: `${DOMAIN}${href.split("?")[0]}`,
      imageUrl: imgSrc ? `${DOMAIN}${imgSrc}` : undefined,
      inStock: soldOut ? false : null,
    });
  });

  return products;
}
