import * as cheerio from "cheerio";
import type { ProductResult } from "@/lib/services/types";

const DOMAIN = "https://national-azabu.net";

function parseStock(text: string): boolean | null {
  const t = text.trim();
  if (/sold out|売り切れ/i.test(t)) return false;
  if (t.includes("有り") || t.includes("残りあと")) return true;
  return null;
}

export function parseNationalAzabuHtml(html: string): ProductResult[] {
  const $ = cheerio.load(html);
  const products: ProductResult[] = [];

  $('div[id^="result_list_box--"]').each((_, el) => {
    const $el = $(el);
    const idAttr = $el.attr("id") ?? "";
    const id = idAttr.replace("result_list_box--", "");
    if (!id) return;

    const name = $el.find(`dt[id^="result_list__name--"]`).text().trim();
    if (!name) return;

    const priceText = $el.find(`dd[id^="result_list__price02_inc_tax--"] .price01_default`).text();
    const priceYen = priceText ? Number(priceText.replace(/,/g, "").trim()) : null;

    const stockText = $el.find(".stock .stock_number").text();
    const imgSrc = $el.find(".item_photo img").attr("src");

    products.push({
      name,
      priceYen,
      priceDisplay: priceYen !== null ? `¥${priceYen.toLocaleString("en-US")}` : null,
      url: `${DOMAIN}/products/detail/${id}`,
      imageUrl: imgSrc ? `${DOMAIN}${imgSrc}` : undefined,
      inStock: parseStock(stockText),
      tags: $el
        .find("ul.item_icon li")
        .map((_, li) => $(li).text().trim())
        .get(),
    });
  });

  return products;
}
