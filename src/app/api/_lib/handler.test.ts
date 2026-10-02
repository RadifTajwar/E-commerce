import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";

const rl = vi.hoisted(() => ({ allowed: true, retryAfter: 0, limit: 10, remaining: 9 }));
const cacheCalls = vi.hoisted(() => ({ invalidated: [] as string[] }));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: async () => ({ ...rl }),
  clientIpFromHeaders: () => "1.2.3.4",
}));
vi.mock("@/lib/cache", () => ({
  withCache: async (_key: string, _ttl: number, fetcher: () => Promise<unknown>) => fetcher(),
  invalidateNamespace: async (...ns: string[]) => {
    cacheCalls.invalidated.push(...ns);
  },
}));

const { createHandler } = await import("./handler");

const secret = "unit-test-secret-at-least-16-chars";
async function token(claims: Record<string, unknown>, expSeconds = 3600) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + expSeconds)
    .sign(new TextEncoder().encode(secret));
}

function req(
  path: string,
  init: { method?: string; body?: unknown; cookie?: string; headers?: Record<string, string> } = {},
) {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) headers.set("content-type", "application/json");
  if (init.cookie) headers.set("cookie", `access_token=${init.cookie}`);
  return new NextRequest(`http://localhost:4000${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

describe("createHandler", () => {
  beforeEach(() => {
    rl.allowed = true;
    cacheCalls.invalidated.length = 0;
    process.env.JWT_SECRET = secret;
  });

  it("returns the handler result as JSON with a request id", async () => {
    const h = createHandler({}, async () => ({ data: [1] }));
    const res = await h(req("/api/x", { headers: { "x-request-id": "abc" } }), {});
    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("abc");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ data: [1] });
  });

  it("rejects invalid params, query and body with VALIDATION_ERROR", async () => {
    const h = createHandler(
      { params: z.object({ id: z.string().length(3) }), query: z.object({ page: z.coerce.number().min(1) }), body: z.object({ name: z.string().min(1) }) },
      async () => ({ ok: true }),
    );
    const bad = await h(req("/api/x?page=0", { method: "POST", body: { name: "" } }), { params: { id: "toolong" } });
    expect(bad.status).toBe(400);
    const body = await bad.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.message).toBe("Invalid route parameters");
    expect(body.error.requestId).toBeTruthy();
  });

  it("returns 400 on malformed JSON", async () => {
    const h = createHandler({ body: z.object({}) }, async () => ({}));
    const r = new NextRequest("http://localhost:4000/api/x", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    const res = await h(r, {});
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("BAD_REQUEST");
  });

  it("enforces auth: 401 without a session, 403 for non-admin, 200 for admin", async () => {
    const h = createHandler({ auth: "admin" }, async ({ session }) => ({ email: session?.email }));
    expect((await h(req("/api/x"), {})).status).toBe(401);
    const userTok = await token({ email: "u@x.test", role: "user" });
    expect((await h(req("/api/x", { cookie: userTok }), {})).status).toBe(403);
    const adminTok = await token({ email: "a@x.test", role: "admin" });
    const ok = await h(req("/api/x", { cookie: adminTok }), {});
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ email: "a@x.test" });
  });

  it("treats an expired or tampered token as no session", async () => {
    const h = createHandler({ auth: "user" }, async () => ({}));
    const expired = await token({ email: "u@x.test" }, -10);
    expect((await h(req("/api/x", { cookie: expired }), {})).status).toBe(401);
    // Tamper in the middle of the signature, never at the end. A 32-byte
    // HMAC is 43 base64url characters — 258 bits of encoding for 256 bits of
    // data — so the final character carries two slack bits and several values
    // decode to the identical signature. Flipping it therefore leaves a still
    // valid token roughly one run in sixteen. Every bit of a middle character
    // is significant.
    const signed = await token({ email: "u@x.test", role: "admin" });
    const [head, body, sig] = signed.split(".") as [string, string, string];
    const at = Math.floor(sig.length / 2);
    const forged = `${head}.${body}.${sig.slice(0, at)}${sig[at] === "A" ? "B" : "A"}${sig.slice(at + 1)}`;
    expect((await h(req("/api/x", { cookie: forged }), {})).status).toBe(401);
  });

  it("returns 429 with retry headers when rate limited", async () => {
    rl.allowed = false;
    rl.retryAfter = 42;
    const h = createHandler({}, async () => ({}));
    const res = await h(req("/api/x"), {});
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("42");
    expect((await res.json()).error.code).toBe("RATE_LIMITED");
  });

  it("maps ApiError thrown by the handler and hides internal errors", async () => {
    const notFound = createHandler({}, async () => {
      throw new ApiError("No such product", { status: 404 });
    });
    const r1 = await notFound(req("/api/x"), {});
    expect(r1.status).toBe(404);
    expect((await r1.json()).error).toMatchObject({ code: "NOT_FOUND", message: "No such product" });

    const boom = createHandler({}, async () => {
      throw new TypeError("secret internals");
    });
    const r2 = await boom(req("/api/x"), {});
    expect(r2.status).toBe(500);
    expect((await r2.json()).error.code).toBe("INTERNAL_ERROR");
  });

  it("invalidates namespaces after a successful write, not after a GET", async () => {
    const h = createHandler({ invalidate: ["products"] }, async () => ({}));
    await h(req("/api/x"), {});
    expect(cacheCalls.invalidated).toEqual([]);
    await h(req("/api/x", { method: "DELETE" }), {});
    expect(cacheCalls.invalidated).toEqual(["products"]);
  });

  it("passes through a Response returned by the handler", async () => {
    const h = createHandler({}, async () => new Response("raw", { status: 201 }));
    const res = await h(req("/api/x"), {});
    expect(res.status).toBe(201);
    expect(await res.text()).toBe("raw");
    expect(res.headers.get("x-request-id")).toBeTruthy();
  });
});
