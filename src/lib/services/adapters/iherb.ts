import { createLinkOutAdapter } from "@/lib/services/adapters/linkout";
import { SERVICE_META } from "@/lib/services/meta";

// iHerb blocks automated (non-browser) requests with bot detection (confirmed
// HTTP 403 on every server-side fetch attempt, both jp.iherb.com and
// iherb.com) — real browsers get through, so it's not usable as a live
// source without evading that block, which we don't do. Link-out only.
export const iherbAdapter = createLinkOutAdapter(
  SERVICE_META.iherb,
  (q) => `https://jp.iherb.com/search?kw=${encodeURIComponent(q)}`,
);
