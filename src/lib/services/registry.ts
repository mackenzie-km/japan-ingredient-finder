import { meatGuyAdapter } from "@/lib/services/adapters/meatguy";
import type { ServiceAdapter } from "@/lib/services/types";

// Fixed order = display order (data sources first, then link-outs).
export const serviceAdapters: ServiceAdapter[] = [meatGuyAdapter];
