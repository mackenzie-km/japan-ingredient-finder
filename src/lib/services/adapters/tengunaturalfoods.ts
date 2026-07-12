import { createShopifyJsonAdapter } from "@/lib/services/adapters/shopify";
import { SERVICE_META } from "@/lib/services/meta";

export const tenguNaturalFoodsAdapter = createShopifyJsonAdapter(
  SERVICE_META.tengunaturalfoods,
  "store.alishan.jp",
);
