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
  amazonfresh: {
    id: "amazonfresh",
    name: "Amazon Fresh",
    kind: "link-out",
    homepage: "https://www.amazon.co.jp",
    deliveryArea: "Tokyo, Kanagawa, Chiba, and parts of Saitama only",
    notes:
      "Grocery delivery service; pricing not shown here, link out to check directly.",
  },
  amazonjp: {
    id: "amazonjp",
    name: "Amazon.co.jp",
    kind: "link-out",
    homepage: "https://www.amazon.co.jp",
    deliveryArea: "Ships nationwide within Japan",
    notes: "General marketplace; imported goods often sold by third-party sellers.",
  },
  ubereats: {
    id: "ubereats",
    name: "Uber Eats",
    kind: "link-out",
    homepage: "https://www.ubereats.com/jp",
    deliveryArea: "Varies by store/area availability",
    notes: "Requires store/area context; no query deep-link available, links to JP homepage.",
  },
};
