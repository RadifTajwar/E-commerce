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

const { rateLimit, clientIpFromHeaders } = await import("./rate-limit");

describe("rateLimit", () => {
  beforeEach(() => {
    fake.store.clear();
    fake.failing = false;
  });

  it("allows up to the limit then blocks with a retryAfter", async () => {
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rateLimit({ key: "ip:public", limit: 3, windowSeconds: 60 }));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[0]?.remaining).toBe(2);
    expect(results[3]?.remaining).toBe(0);
    expect(results[3]?.retryAfter).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", async () => {
    await rateLimit({ key: "a", limit: 1 });
    const second = await rateLimit({ key: "b", limit: 1 });
    expect(second.allowed).toBe(true);
  });

  it("fails open when Redis is unavailable", async () => {
    fake.failing = true;
    const r = await rateLimit({ key: "x", limit: 1 });
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(1);
  });
});

describe("clientIpFromHeaders", () => {
  it("prefers the first x-forwarded-for entry", () => {
    expect(clientIpFromHeaders(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIpFromHeaders(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIpFromHeaders(new Headers())).toBe("unknown");
  });
});
