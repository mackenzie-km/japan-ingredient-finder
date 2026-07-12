import { createLinkOutAdapter } from "@/lib/services/adapters/linkout";
import { SERVICE_META } from "@/lib/services/meta";

export const amazonFreshAdapter = createLinkOutAdapter(
  SERVICE_META.amazonfresh,
  (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`,
);
