import { halalFoodJpAdapter } from "@/lib/services/adapters/halalfoodjp";
import { meatGuyAdapter } from "@/lib/services/adapters/meatguy";
import { nationalAzabuAdapter } from "@/lib/services/adapters/nationalazabu";
import { tenguNaturalFoodsAdapter } from "@/lib/services/adapters/tengunaturalfoods";
import type { ServiceAdapter } from "@/lib/services/types";

// Fixed order = display order (data sources first, then link-outs).
export const serviceAdapters: ServiceAdapter[] = [
  meatGuyAdapter,
  halalFoodJpAdapter,
  tenguNaturalFoodsAdapter,
  nationalAzabuAdapter,
];
