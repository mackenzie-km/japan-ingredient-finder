import { createShopifyJsonAdapter } from "@/lib/services/adapters/shopify";
import { SERVICE_META } from "@/lib/services/meta";

export const meatGuyAdapter = createShopifyJsonAdapter(
  SERVICE_META.meatguy,
  "www.themeatguy.jp",
);
