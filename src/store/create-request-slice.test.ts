import { describe, expect, it } from "vitest";
import { isPending } from "@/store/create-request-slice";

/**
 * The flicker this guards against: "not fetched yet" and "fetched, came back
 * empty" used to be indistinguishable, so a page painted its empty state for a
 * frame before the effect that starts the fetch had even run.
 */
describe("isPending", () => {
  it("is true before the first request settles, even when idle", () => {
    expect(isPending({ isLoading: false, settled: false })).toBe(true);
  });

  it("is true while a request is in flight", () => {
    expect(isPending({ isLoading: true, settled: false })).toBe(true);
    expect(isPending({ isLoading: true, settled: true })).toBe(true);
  });

  it("is false once a request has settled, including an empty result", () => {
    expect(isPending({ isLoading: false, settled: true })).toBe(false);
  });
});
