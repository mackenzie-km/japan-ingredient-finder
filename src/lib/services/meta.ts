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
};
