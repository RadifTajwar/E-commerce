import { describe, expect, it } from "vitest";
import { resolveStock } from "@/components/storefront/product/ProductInfoPanel";
import type { Product } from "@/types/product";

/**
 * Real catalogue rows disagree between the two stock fields in both directions
 * (bag-22 has 0 / 250, bag-19 has 100 / 0), which used to make stocked products
 * unbuyable. Regression guard for that.
 */
const product = (colourQty?: number, detailQty?: number) =>
  ({
    id: "p1",
    additionalDetails: detailQty === undefined ? [] : [{ color: "Pantone", quantity: detailQty }],
    color: [{ colorName: "Pantone", availableQuantity: colourQty }],
  }) as unknown as Product;

const pantone = (qty?: number) => ({ colorName: "Pantone", availableQuantity: qty });

describe("resolveStock", () => {
  it("uses additionalDetails when color[] is a stale zero (bag-22)", () => {
    expect(resolveStock(product(0, 250), pantone(0))).toBe(250);
  });

  it("keeps color[] when additionalDetails is the stale zero (bag-19)", () => {
    expect(resolveStock(product(100, 0), pantone(100))).toBe(100);
  });

  it("reports genuinely out of stock when both agree on zero", () => {
    expect(resolveStock(product(0, 0), pantone(0))).toBe(0);
  });

  it("returns undefined when neither field says anything", () => {
    expect(resolveStock(product(undefined, undefined), pantone(undefined))).toBeUndefined();
  });
});
