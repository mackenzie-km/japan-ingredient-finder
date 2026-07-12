import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchAllServices } from "@/lib/services/aggregate";
import type { ServiceAdapter, ServiceMeta } from "@/lib/services/types";

function makeMeta(id: string): ServiceMeta {
  return {
    id: id as ServiceMeta["id"],
    name: id,
    kind: "data",
    homepage: "https://example.com",
    deliveryArea: "test",
    deliveryFee: "test",
  };
}

function resolvingAdapter(id: string): ServiceAdapter {
  const meta = makeMeta(id);
  const search = vi.fn().mockResolvedValue({
    service: meta,
    status: "ok" as const,
    query: "x",
    products: [],
    fetchedAt: new Date().toISOString(),
    durationMs: 1,
  });
  return { meta, search };
}

function throwingAdapter(id: string): ServiceAdapter {
  const meta = makeMeta(id);
  return { meta, search: vi.fn().mockRejectedValue(new Error("boom")) };
}

describe("searchAllServices", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("returns a result for every adapter, including ones that throw", async () => {
    const adapters = [resolvingAdapter("a"), throwingAdapter("b"), resolvingAdapter("c")];
    const response = await searchAllServices(`unique-query-${Math.random()}`, adapters);
    expect(response.results).toHaveLength(3);
    const statuses = response.results.map((r) => r.status);
    expect(statuses).toEqual(["ok", "error", "ok"]);
  });

  it("a throwing adapter does not prevent others from returning results", async () => {
    const adapters = [throwingAdapter("a"), resolvingAdapter("b")];
    const response = await searchAllServices(`unique-query-${Math.random()}`, adapters);
    expect(response.results[1].status).toBe("ok");
  });

  it("caches results for the same normalized query", async () => {
    const adapter = resolvingAdapter("a");
    const adapters = [adapter];
    const query = `cache-test-${Math.random()}`;

    await searchAllServices(query, adapters);
    await searchAllServices(query.toUpperCase(), adapters); // same after normalization
    await searchAllServices(`  ${query}  `, adapters); // same after trim

    expect(adapter.search).toHaveBeenCalledTimes(1);
  });

  it("does not cache across different queries", async () => {
    const adapter = resolvingAdapter("a");
    const adapters = [adapter];

    await searchAllServices(`distinct-1-${Math.random()}`, adapters);
    await searchAllServices(`distinct-2-${Math.random()}`, adapters);

    expect(adapter.search).toHaveBeenCalledTimes(2);
  });
});
