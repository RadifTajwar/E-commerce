import { describe, expect, it } from "vitest";
import { SHIPPING_OPTIONS, shippingCostForDistrict } from "@/config/constants";
import { orderInputSchema } from "@/validators/order";

/**
 * The checkout path is the one place a customer can influence what is written
 * to the orders collection, and the upstream stores the payload verbatim.
 * These assert the two properties that keep it honest.
 */

const valid = {
  orderItems: [{ quantity: 2, product: "67780e247d7a65eb820aca15", color: "Pantone" }],
  shippingAddress: "1 Test Road",
  name: "Test Buyer",
  email: "buyer@example.com",
  city: "Dhaka",
  zip: "1207",
  country: "Bangladesh",
  phone: "01700000000",
  shippingCost: 60,
};

describe("orderInputSchema", () => {
  it("accepts a well formed order", () => {
    expect(orderInputSchema.safeParse(valid).success).toBe(true);
  });

  it("strips a client supplied price and status instead of trusting them", () => {
    const parsed = orderInputSchema.parse({
      ...valid,
      totalPrice: 0,
      status: "Delivered",
      isPaid: true,
      injectedField: "arbitrary",
    });
    expect(parsed).not.toHaveProperty("totalPrice");
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("isPaid");
    expect(parsed).not.toHaveProperty("injectedField");
  });

  it("rejects a shipping cost the store does not offer", () => {
    // 100 was the old Dhaka rate, removed when shipping became a simple
    // inside/outside Chattogram choice.
    for (const shippingCost of [0, 1, 59, 100, 999, -60]) {
      expect(orderInputSchema.safeParse({ ...valid, shippingCost }).success).toBe(false);
    }
    for (const shippingCost of [60, 120]) {
      expect(orderInputSchema.safeParse({ ...valid, shippingCost }).success).toBe(true);
    }
  });

  it("rejects an empty cart and a non-ObjectId product", () => {
    expect(orderInputSchema.safeParse({ ...valid, orderItems: [] }).success).toBe(false);
    expect(
      orderInputSchema.safeParse({ ...valid, orderItems: [{ quantity: 1, product: "nope" }] }).success,
    ).toBe(false);
  });
});

describe("shipping rates", () => {
  it("offers exactly two rates", () => {
    expect(SHIPPING_OPTIONS.map((o) => o.id)).toEqual(["inside", "outside"]);
  });

  it("maps a district to the right rate, however Chattogram is spelt", () => {
    for (const district of ["Chittagong", "chittagong", " Chattogram ", "CHATTOGRAM"]) {
      expect(shippingCostForDistrict(district)).toBe(60);
    }
    for (const district of ["Dhaka", "Khulna", "Barisal", "Sylhet", ""]) {
      expect(shippingCostForDistrict(district)).toBe(120);
    }
  });

  it("only accepts a rate the store actually offers", () => {
    const base = {
      orderItems: [{ quantity: 1, product: "67780e247d7a65eb820aca15" }],
      shippingAddress: "x", name: "x", email: "a@b.com",
      city: "Dhaka", zip: "1207", country: "Bangladesh", phone: "01700000000",
    };
    expect(orderInputSchema.safeParse({ ...base, shippingCost: 60 }).success).toBe(true);
    expect(orderInputSchema.safeParse({ ...base, shippingCost: 120 }).success).toBe(true);
    // 100 was the old Dhaka rate and must no longer be accepted.
    expect(orderInputSchema.safeParse({ ...base, shippingCost: 100 }).success).toBe(false);
  });
});
