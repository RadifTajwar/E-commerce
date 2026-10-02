import { describe, expect, it, vi } from "vitest";
import { BANNER_IMAGE, checkImageSize, SQUARE_IMAGE } from "@/lib/image-size";

/**
 * The point of this check is that a wrongly sized asset never reaches
 * Cloudinary, so the interesting cases are the near misses.
 */
function fileOf(width: number, height: number) {
  // Stub the decoder rather than building real image bytes.
  vi.stubGlobal("createImageBitmap", async () => ({ width, height, close: () => {} }));
  return new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" });
}

describe("checkImageSize", () => {
  it("accepts an exact match", async () => {
    expect(await checkImageSize(fileOf(1920, 1080), BANNER_IMAGE)).toBeNull();
    expect(await checkImageSize(fileOf(638, 638), SQUARE_IMAGE)).toBeNull();
  });

  it("rejects a near miss by one pixel", async () => {
    expect(await checkImageSize(fileOf(1919, 1080), BANNER_IMAGE)).toMatch(/1920 × 1080/);
    expect(await checkImageSize(fileOf(638, 639), SQUARE_IMAGE)).toMatch(/638 × 638/);
  });

  it("rejects the right aspect ratio at the wrong scale", async () => {
    // 16:9 but half size — an aspect-ratio check would have let this through.
    expect(await checkImageSize(fileOf(960, 540), BANNER_IMAGE)).toMatch(/960 × 540/);
  });

  it("rejects a transposed size", async () => {
    expect(await checkImageSize(fileOf(1080, 1920), BANNER_IMAGE)).not.toBeNull();
  });

  it("names both the requirement and what was given", async () => {
    const message = await checkImageSize(fileOf(800, 600), SQUARE_IMAGE);
    expect(message).toContain("638 × 638");
    expect(message).toContain("800 × 600");
  });

  it("reports a file it cannot decode instead of passing it through", async () => {
    vi.stubGlobal("createImageBitmap", async () => {
      throw new Error("bad");
    });
    vi.stubGlobal("URL", { createObjectURL: () => "blob:x", revokeObjectURL: () => {} });
    class FailingImage {
      onerror: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onerror?.(), 0);
      }
    }
    vi.stubGlobal("Image", FailingImage);
    const blob = new Blob([new Uint8Array([1])], { type: "image/png" });
    expect(await checkImageSize(blob, SQUARE_IMAGE)).toMatch(/could not be read/);
  });
});
