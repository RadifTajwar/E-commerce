import { describe, expect, it } from "vitest";
import { getVisiblePages } from "@/components/admin/AdminPagination";

/**
 * The control must not grow with the dataset: however many pages exist, it
 * shows at most seven entries plus the ellipses.
 */
describe("getVisiblePages", () => {
  it("lists every page when there are seven or fewer", () => {
    expect(getVisiblePages(1, 1)).toEqual([1]);
    expect(getVisiblePages(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("clips the tail while near the start", () => {
    expect(getVisiblePages(2, 20)).toEqual([1, 2, 3, 4, 5, "end-ellipsis", 20]);
  });

  it("clips the head while near the end", () => {
    expect(getVisiblePages(19, 20)).toEqual([1, "start-ellipsis", 16, 17, 18, 19, 20]);
  });

  it("clips both sides in the middle", () => {
    expect(getVisiblePages(10, 20)).toEqual([1, "start-ellipsis", 9, 10, 11, "end-ellipsis", 20]);
  });

  it("never renders more than seven page entries", () => {
    for (const total of [8, 15, 50, 500]) {
      for (const current of [1, 4, Math.floor(total / 2), total - 3, total]) {
        expect(getVisiblePages(current, total).length).toBeLessThanOrEqual(7);
      }
    }
  });
});
