import { describe, expect, it } from "vitest";
import { createLinkOutAdapter } from "@/lib/services/adapters/linkout";
import type { ServiceMeta } from "@/lib/services/types";

const meta: ServiceMeta = {
  id: "amazonjp",
  name: "Amazon.co.jp",
  kind: "link-out",
  homepage: "https://www.amazon.co.jp",
  deliveryArea: "Nationwide",
  deliveryFee: "test",
};

describe("createLinkOutAdapter", () => {
  it("always resolves status 'ok' with an empty products array", async () => {
    const adapter = createLinkOutAdapter(meta, (q) => `https://example.com?q=${q}`);
    const result = await adapter.search("miso");
    expect(result.status).toBe("ok");
    expect(result.products).toEqual([]);
  });

  it("builds the linkOutUrl from the query", async () => {
    const adapter = createLinkOutAdapter(
      meta,
      (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`,
    );
    const result = await adapter.search("peanut butter");
    expect(result.linkOutUrl).toBe("https://www.amazon.co.jp/s?k=peanut%20butter");
  });

  it("falls back to the service homepage when buildUrl returns null", async () => {
    const adapter = createLinkOutAdapter(meta, () => null);
    const result = await adapter.search("anything");
    expect(result.linkOutUrl).toBe(meta.homepage);
  });
});
