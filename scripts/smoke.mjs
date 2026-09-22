#!/usr/bin/env node
/**
 * Smoke test for the BFF proxy. Run against a live server:
 *
 *   npm run dev           # in one terminal
 *   node scripts/smoke.mjs [baseUrl]     # default http://localhost:4000
 *
 * Checks that every public route answers with the expected status and the
 * uniform JSON shape, that protected routes reject anonymous callers, that
 * validation errors are reported as 400 VALIDATION_ERROR, and that security
 * headers and request ids are present. It never mutates backend data.
 */

const base = (process.argv[2] ?? "http://localhost:4000").replace(/\/+$/, "");
let failures = 0;

async function check(name, path, { method = "GET", body, expect, headers = {} } = {}) {
  const url = `${base}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
    });
  } catch (err) {
    failures++;
    console.log(`✗ ${name}: network error ${err.message}`);
    return;
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  const problems = [];
  if (expect.status && !expect.status.includes(res.status)) problems.push(`status ${res.status}, wanted ${expect.status.join("|")}`);
  if (expect.errorCode && json?.error?.code !== expect.errorCode) problems.push(`error.code ${json?.error?.code}, wanted ${expect.errorCode}`);
  if (expect.requestId && !res.headers.get("x-request-id")) problems.push("missing x-request-id");
  if (expect.json && json === undefined) problems.push("body is not JSON");
  if (expect.headers) {
    for (const [k, v] of Object.entries(expect.headers)) {
      if (res.headers.get(k) !== v) problems.push(`header ${k}=${res.headers.get(k)}, wanted ${v}`);
    }
  }
  if (problems.length) {
    failures++;
    console.log(`✗ ${name}: ${problems.join("; ")}`);
    if (json?.error) console.log(`    ${JSON.stringify(json.error)}`);
  } else {
    console.log(`✓ ${name} (${res.status})`);
  }
}

console.log(`Smoke-testing ${base}\n`);

// Backend-dependent GETs: 200 when the upstream is healthy, 5xx JSON when it is down.
const upstream = { status: [200, 502, 503, 504], json: true, requestId: true };
await check("GET /api/categories", "/api/categories", { expect: upstream });
await check("GET /api/parent-categories", "/api/parent-categories", { expect: upstream });
await check("GET /api/products?limit=1", "/api/products?limit=1", { expect: upstream });
await check("GET /api/products/colors", "/api/products/colors", { expect: upstream });
await check("GET /api/banners/hero", "/api/banners/hero", { expect: upstream });
await check("GET /api/banners/video", "/api/banners/video", { expect: upstream });

// Validation
await check("GET /api/products?page=0 → 400", "/api/products?page=0", { expect: { status: [400], errorCode: "VALIDATION_ERROR" } });
await check("GET /api/categories/not-an-id → 400", "/api/categories/not-an-id", { expect: { status: [400], errorCode: "VALIDATION_ERROR" } });
await check("POST /api/auth/login {} → 400", "/api/auth/login", { method: "POST", body: {}, expect: { status: [400], errorCode: "VALIDATION_ERROR" } });
await check("POST /api/orders {} → 400", "/api/orders", { method: "POST", body: {}, expect: { status: [400], errorCode: "VALIDATION_ERROR" } });

// Auth
await check("GET /api/auth/session anonymous", "/api/auth/session", { expect: { status: [200], json: true } });
await check("GET /api/orders anonymous → 401", "/api/orders", { expect: { status: [401], errorCode: "UNAUTHORIZED" } });
await check("POST /api/categories anonymous → 401", "/api/categories", { method: "POST", body: { name: "x", parentCategoryId: "0".repeat(24) }, expect: { status: [401], errorCode: "UNAUTHORIZED" } });
await check("POST /api/uploads anonymous → 401", "/api/uploads", { method: "POST", expect: { status: [401], errorCode: "UNAUTHORIZED" } });
await check("GET /api/orders/user/a@b.test anonymous → 401", "/api/orders/user/a%40b.test", { expect: { status: [401] } });

// Page guards (middleware redirects)
await check("GET /admin/dashboard anonymous → redirect", "/admin/dashboard", { expect: { status: [307, 308] } });
await check("GET /myAccount anonymous → redirect", "/myAccount", { expect: { status: [307, 308] } });

// CORS
await check("OPTIONS /api/categories from disallowed origin → 403", "/api/categories", { method: "OPTIONS", headers: { origin: "https://evil.test" }, expect: { status: [403] } });

// Security headers + 404
await check("GET / security headers", "/", { expect: { status: [200], headers: { "x-frame-options": "DENY", "x-content-type-options": "nosniff" } } });
await check("GET /nope → 404", "/this-page-does-not-exist", { expect: { status: [404] } });

console.log(`\n${failures === 0 ? "All checks passed" : `${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
