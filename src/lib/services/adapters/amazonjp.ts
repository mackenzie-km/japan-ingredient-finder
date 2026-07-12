import { createLinkOutAdapter } from "@/lib/services/adapters/linkout";
import { SERVICE_META } from "@/lib/services/meta";

export const amazonJpAdapter = createLinkOutAdapter(
  SERVICE_META.amazonjp,
  (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`,
);
