import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getServerEnv, resetServerEnvForTests } from "./env";

const saved = { ...process.env };

describe("getServerEnv", () => {
  beforeEach(() => resetServerEnvForTests());
  afterEach(() => {
    process.env = { ...saved };
    resetServerEnvForTests();
  });

  it("parses defaults and lists", () => {
    process.env.ALLOWED_ORIGINS = "https://a.test, https://b.test";
    const env = getServerEnv();
    expect(env.BACKEND_API_TIMEOUT_MS).toBe(10_000);
    expect(env.CACHE_TTL_CATALOG).toBe(600);
    expect(env.ALLOWED_ORIGINS).toContain("https://a.test");
    expect(env.ALLOWED_ORIGINS).toContain("https://b.test");
    // the app's own origin is always allowed
    expect(env.ALLOWED_ORIGINS).toContain(process.env.NEXT_PUBLIC_APP_URL);
    expect(Object.isFrozen(env)).toBe(true);
  });

  it("fails fast with a readable message when a required variable is missing", () => {
    delete process.env.BACKEND_API_URL;
    expect(() => getServerEnv()).toThrowError(/BACKEND_API_URL/);
    expect(() => getServerEnv()).toThrowError(/\.env\.example/);
  });

  it("rejects malformed values", () => {
    process.env.BACKEND_API_URL = "not a url";
    expect(() => getServerEnv()).toThrowError(/BACKEND_API_URL/);
    process.env.BACKEND_API_URL = "https://ok.test/api";
    process.env.RATE_LIMIT_PUBLIC = "-5";
    resetServerEnvForTests();
    expect(() => getServerEnv()).toThrowError(/RATE_LIMIT_PUBLIC/);
  });

  it("caches the parsed result", () => {
    expect(getServerEnv()).toBe(getServerEnv());
  });
});
