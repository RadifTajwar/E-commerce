import { describe, expect, it } from "vitest";
import { registerSchema, resendVerificationSchema, verifyEmailSchema } from "@/validators/auth";

describe("registerSchema", () => {
  it("requires a password the user chose", () => {
    const ok = registerSchema.safeParse({ name: "A", email: "a@b.com", password: "sixchars" });
    expect(ok.success).toBe(true);
    expect(registerSchema.safeParse({ name: "A", email: "a@b.com" }).success).toBe(false);
    expect(registerSchema.safeParse({ name: "A", email: "a@b.com", password: "short" }).success).toBe(false);
  });

  it("rejects a malformed address before anything is created", () => {
    for (const email of ["not-an-email", "a@", "@b.com", ""]) {
      expect(registerSchema.safeParse({ name: "A", email, password: "sixchars" }).success).toBe(false);
    }
  });
});

describe("verifyEmailSchema", () => {
  it("accepts exactly six digits", () => {
    expect(verifyEmailSchema.safeParse({ code: "012345" }).success).toBe(true);
    for (const code of ["12345", "1234567", "abcdef", "12 345", ""]) {
      expect(verifyEmailSchema.safeParse({ code }).success).toBe(false);
    }
  });
});

describe("resendVerificationSchema", () => {
  it("takes an email and nothing else", () => {
    const parsed = resendVerificationSchema.parse({ email: "a@b.com", role: "admin" });
    expect(parsed).toEqual({ email: "a@b.com" });
  });
});
