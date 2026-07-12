import type { ServiceId, ServiceMeta } from "@/lib/services/types";

export const SERVICE_META: Record<ServiceId, ServiceMeta> = {
  meatguy: {
    id: "meatguy",
    name: "The Meat Guy",
    kind: "data",
    homepage: "https://www.themeatguy.jp",
    deliveryArea: "Ships nationwide within Japan",
    notes: "Specialty imported meat retailer (Shopify storefront).",
  },
  tengunaturalfoods: {
    id: "tengunaturalfoods",
    name: "Tengu Natural Foods",
    kind: "data",
    homepage: "https://store.alishan.jp",
    deliveryArea: "Ships nationwide within Japan",
    notes:
      "Organic/health-food importer (Shopify storefront); catalog leans toward pantry staples, nut butters, baking substitutes.",
  },
  halalfoodjp: {
    id: "halalfoodjp",
    name: "Halal Food Japan",
    kind: "data",
    homepage: "https://halalfoodjp.com",
    deliveryArea: "Ships nationwide within Japan",
    notes: "Halal-certified grocery importer (WooCommerce storefront).",
  },
  nationalazabu: {
    id: "nationalazabu",
    name: "National Azabu",
    kind: "data",
    homepage: "https://national-azabu.net",
    deliveryArea: "Ships nationwide within Japan; based in Tokyo (Azabu)",
    notes: "Long-established Tokyo import grocer.",
  },
};
