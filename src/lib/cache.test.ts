import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeRedis } from "@/test/fake-redis";

const fake = new FakeRedis();

vi.mock("@/lib/redis", () => ({
  getRedis: () => (fake.failing ? null : fake),
  isRedisAvailable: () => !fake.failing,
  safeRedis: async (op: (c: FakeRedis) => Promise<unknown>, fallback: unknown) => {
    if (fake.failing) return fallback;
    try {
      return await op(fake);
    } catch {
      return fallback;
    }
  },
}));

const { withCache, invalidateNamespace, hashKey, stableStringify, cacheGet } = await import("./cache");

describe("cache helpers", () => {
  beforeEach(() => {
    fake.store.clear();
    fake.sets.clear();
    fake.failing = false;
  });

  it("stableStringify is order-independent and drops undefined", () => {
    expect(stableStringify({ b: 1, a: [2, { z: 1, y: undefined }] })).toBe(stableStringify({ a: [2, { z: 1 }], b: 1 }));
    expect(hashKey({ a: 1, b: 2 })).toBe(hashKey({ b: 2, a: 1 }));
    expect(hashKey({ a: 1 })).not.toBe(hashKey({ a: 2 }));
  });

  it("calls the fetcher once and serves the second call from cache", async () => {
    const fetcher = vi.fn(async () => ({ items: [1, 2, 3] }));
    const a = await withCache("products:list:x", 60, fetcher, { namespace: "products" });
    // cacheSet is fire-and-forget; give it a tick.
    await new Promise((r) => setTimeout(r, 0));
    const b = await withCache("products:list:x", 60, fetcher, { namespace: "products" });
    expect(a).toEqual(b);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(await cacheGet("products:list:x")).toEqual({ items: [1, 2, 3] });
  });

  it("invalidateNamespace removes every key recorded under it", async () => {
    const fetcher = vi.fn(async () => "v");
    await withCache("products:a", 60, fetcher, { namespace: "products" });
    await withCache("products:b", 60, fetcher, { namespace: "products" });
    await withCache("categories:a", 60, fetcher, { namespace: "categories" });
    await new Promise((r) => setTimeout(r, 0));
    expect(fetcher).toHaveBeenCalledTimes(3);

    await invalidateNamespace("products");
    await withCache("products:a", 60, fetcher, { namespace: "products" });
    await withCache("categories:a", 60, fetcher, { namespace: "categories" });
    expect(fetcher).toHaveBeenCalledTimes(4); // only products:a refetched
  });

  it("falls back to the fetcher when Redis is down", async () => {
    fake.failing = true;
    const fetcher = vi.fn(async () => 42);
    expect(await withCache("k", 60, fetcher)).toBe(42);
    expect(await withCache("k", 60, fetcher)).toBe(42);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("bypasses the cache when asked or when ttl is 0", async () => {
    const fetcher = vi.fn(async () => 1);
    await withCache("k2", 0, fetcher);
    await withCache("k2", 60, fetcher, { bypass: true });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fake.store.size).toBe(0);
  });
});
