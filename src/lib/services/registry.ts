import { amazonFreshAdapter } from "@/lib/services/adapters/amazonfresh";
import { amazonJpAdapter } from "@/lib/services/adapters/amazonjp";
import { halalFoodJpAdapter } from "@/lib/services/adapters/halalfoodjp";
import { iherbAdapter } from "@/lib/services/adapters/iherb";
import { kaldiAdapter } from "@/lib/services/adapters/kaldi";
import { meatGuyAdapter } from "@/lib/services/adapters/meatguy";
import { nationalAzabuAdapter } from "@/lib/services/adapters/nationalazabu";
import { tenguNaturalFoodsAdapter } from "@/lib/services/adapters/tengunaturalfoods";
import { uberEatsAdapter } from "@/lib/services/adapters/ubereats";
import type { ServiceAdapter } from "@/lib/services/types";

// Fixed order = display order (data sources first, then link-outs).
export const serviceAdapters: ServiceAdapter[] = [
  kaldiAdapter,
  nationalAzabuAdapter,
  tenguNaturalFoodsAdapter,
  halalFoodJpAdapter,
  meatGuyAdapter,
  iherbAdapter,
  amazonFreshAdapter,
  amazonJpAdapter,
  uberEatsAdapter,
];
