import { createLinkOutAdapter } from "@/lib/services/adapters/linkout";
import { SERVICE_META } from "@/lib/services/meta";

// No query deep-link exists for Uber Eats (area/store-dependent); always
// falls back to the JP homepage via createLinkOutAdapter's `?? meta.homepage`.
export const uberEatsAdapter = createLinkOutAdapter(SERVICE_META.ubereats, () => null);
