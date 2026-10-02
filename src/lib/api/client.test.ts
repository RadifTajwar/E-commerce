import { describe, expect, it, vi } from "vitest";
import { ApiError, gatewayStatus } from "./errors";
import { buildQueryString, createHttpClient, joinUrl } from "./client";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

function makeClient(fetchImpl: typeof fetch, extra: Partial<Parameters<typeof createHttpClient>[0]> = {}) {
  return createHttpClient({
    baseUrl: "https://api.test/v1",
    timeoutMs: 200,
    maxRetries: 2,
    retryBaseDelayMs: 1,
    sleep: async () => undefined,
    fetchImpl,
    ...extra,
  });
}

describe("buildQueryString", () => {
  it("skips empty values and supports arrays", () => {
    expect(buildQueryString({ a: 1, b: "", c: undefined, d: null, e: ["x", "y"], f: false })).toBe(
      "?a=1&e=x&e=y&f=false",
    );
    expect(buildQueryString()).toBe("");
  });
});

describe("joinUrl", () => {
  it("joins base and path without duplicate slashes", () => {
    expect(joinUrl("https://a.test/v1/", "/product")).toBe("https://a.test/v1/product");
    expect(joinUrl("https://a.test/v1", "product")).toBe("https://a.test/v1/product");
    expect(joinUrl("https://a.test/v1", "https://other.test/x")).toBe("https://other.test/x");
  });
});

describe("createHttpClient", () => {
  it("performs a GET with query and parses JSON", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe("https://api.test/v1/product?page=2");
      return json({ data: [1, 2] });
    });
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const res = await client.get<{ data: number[] }>("/product", { query: { page: 2 } });
    expect(res.data).toEqual([1, 2]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("sends JSON bodies with content-type and does not retry POST", async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("content-type")).toBe("application/json");
      expect(init?.body).toBe(JSON.stringify({ a: 1 }));
      return json({ message: "boom" }, 503);
    });
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    await expect(client.post("/x", { a: 1 })).rejects.toMatchObject({ status: 503, code: "UPSTREAM_ERROR" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries idempotent requests on 503 then succeeds", async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async () => (++calls < 3 ? json({ message: "down" }, 503) : json({ ok: true })));
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const res = await client.get<{ ok: boolean }>("/x");
    expect(res.ok).toBe(true);
    expect(calls).toBe(3);
  });

  it("does not retry on 4xx and normalises the error body", async () => {
    const fetchImpl = vi.fn(async () => json({ success: false, message: "Nope", errorMessages: [{ path: "a" }] }, 404, { "x-request-id": "req-1" }));
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const err = (await client.get("/missing").catch((e: unknown) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, code: "NOT_FOUND", message: "Nope", requestId: "req-1" });
    expect(err.details).toEqual([{ path: "a" }]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("times out and reports TIMEOUT after retries", async () => {
    const fetchImpl = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason ?? new Error("aborted")));
        }),
    );
    const client = makeClient(fetchImpl as unknown as typeof fetch, { timeoutMs: 10, maxRetries: 1 });
    await expect(client.get("/slow")).rejects.toMatchObject({ code: "TIMEOUT", status: 504 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("maps network failures to NETWORK_ERROR", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    const client = makeClient(fetchImpl as unknown as typeof fetch, { maxRetries: 0 });
    await expect(client.delete("/x")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 503 });
  });

  it("passes FormData through untouched", async () => {
    const fetchImpl = vi.fn(async (_i: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.body).toBeInstanceOf(FormData);
      expect(new Headers(init?.headers).get("content-type")).toBeNull();
      return json({ ok: 1 });
    });
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const fd = new FormData();
    fd.append("a", "b");
    await client.post("/upload", fd);
  });

  it("merges base headers with per-request headers", async () => {
    const fetchImpl = vi.fn(async (_i: RequestInfo | URL, init?: RequestInit) => {
      const h = new Headers(init?.headers);
      expect(h.get("authorization")).toBe("Bearer t");
      expect(h.get("x-custom")).toBe("1");
      return json({});
    });
    const client = makeClient(fetchImpl as unknown as typeof fetch, { headers: async () => ({ authorization: "Bearer t" }) });
    await client.get("/x", { headers: { "x-custom": "1" } });
  });
});

describe("upstream error normalisation", () => {
  it("ignores an upstream error code that is not one of ours", async () => {
    // The backend answers 500 with {"error":{"code":"500"}}; that must not leak
    // into our contract.
    const fetchImpl = vi.fn(async () => json({ error: { code: "500", message: "A server error has occurred" } }, 500));
    const client = makeClient(fetchImpl as unknown as typeof fetch, { maxRetries: 0 });
    const err = (await client.get("/x").catch((e: unknown) => e)) as ApiError;
    expect(err.code).toBe("UPSTREAM_ERROR");
    expect(err.message).toBe("A server error has occurred");
  });

  it("adopts an upstream code when it is one of ours", async () => {
    const fetchImpl = vi.fn(async () => json({ error: { code: "VALIDATION_ERROR", message: "bad" } }, 400));
    const client = makeClient(fetchImpl as unknown as typeof fetch, { maxRetries: 0 });
    const err = (await client.get("/x").catch((e: unknown) => e)) as ApiError;
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("maps upstream failures onto gateway statuses", () => {
    expect(gatewayStatus(new ApiError("x", { status: 500, code: "UPSTREAM_ERROR" }))).toBe(502);
    expect(gatewayStatus(new ApiError("x", { status: 504, code: "TIMEOUT" }))).toBe(504);
    expect(gatewayStatus(new ApiError("x", { status: 503, code: "NETWORK_ERROR" }))).toBe(503);
    // Our own failures keep their status.
    expect(gatewayStatus(new ApiError("x", { status: 404, code: "NOT_FOUND" }))).toBe(404);
    expect(gatewayStatus(new ApiError("x", { status: 500, code: "INTERNAL_ERROR" }))).toBe(500);
  });
});
