/**
 * Image dimension rules for admin uploads.
 *
 * Enforced in the browser before anything reaches Cloudinary: a wrongly sized
 * asset is rejected at the file picker with a message naming both the required
 * and the actual size, rather than being uploaded, stored, and then noticed
 * when it renders badly in the storefront.
 */

export interface ImageSpec {
  width: number;
  height: number;
  /** Shown in the field so the requirement is visible before picking a file. */
  label: string;
}

/** Hero and video banner artwork: full-bleed, 16:9. */
export const BANNER_IMAGE: ImageSpec = { width: 1920, height: 1080, label: "1920 × 1080" };

/**
 * Product, category and parent-category artwork: square.
 * Everywhere these appear in the storefront the frame is square, so anything
 * else is letterboxed or cropped.
 */
export const SQUARE_IMAGE: ImageSpec = { width: 638, height: 638, label: "638 × 638" };

export interface ImageDimensions {
  width: number;
  height: number;
}

/** Natural pixel size of an image file. Rejects anything the browser cannot decode. */
export async function readImageDimensions(file: File | Blob): Promise<ImageDimensions> {
  // createImageBitmap decodes off the main thread and needs no DOM node.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close?.();
      return size;
    } catch {
      // Fall through: some formats (older Safari, SVG) fail here but decode
      // fine through an <img>.
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = url;
  });
}

/**
 * Null when the file matches the spec, otherwise the message to show.
 * Returning a message rather than throwing keeps the caller's error handling
 * to a single branch.
 */
export async function checkImageSize(file: File | Blob, spec: ImageSpec): Promise<string | null> {
  let size: ImageDimensions;
  try {
    size = await readImageDimensions(file);
  } catch (err) {
    return (err as Error).message || "That file could not be read as an image.";
  }

  if (size.width === spec.width && size.height === spec.height) return null;

  return `Image must be exactly ${spec.label} pixels. This one is ${size.width} × ${size.height}.`;
}

/** Throwing form, for the upload service's backstop check. */
export async function assertImageSize(file: File | Blob, spec: ImageSpec): Promise<void> {
  const problem = await checkImageSize(file, spec);
  if (problem) throw new Error(problem);
}
