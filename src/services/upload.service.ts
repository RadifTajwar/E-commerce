import { API } from "@/config/constants";
import { assertImageSize, type ImageSpec } from "@/lib/image-size";
import type { ApiEnvelope } from "@/types/api";
import { http, unwrap } from "./_shared";

export interface UploadedAsset {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

async function upload(file: File | Blob, folder: string | undefined, resourceType: "image" | "video") {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);
  form.append("resourceType", resourceType);
  return http.post<ApiEnvelope<UploadedAsset>>(API.uploads, form, { timeoutMs: 120_000 }).then(unwrap);
}

export const uploadService = {
  /**
   * Upload an image and get back its URL. Existing URL strings are returned
   * untouched, so re-saving a record does not re-upload what it already has.
   *
   * Pass `spec` to require exact pixel dimensions. The forms also check on
   * selection so the message appears at the file picker; this is the backstop
   * that keeps a wrongly sized asset out of Cloudinary even if a caller forgets.
   */
  image: async (file: File | Blob | string, folder?: string, spec?: ImageSpec): Promise<string> => {
    if (typeof file === "string") return file;
    if (spec) await assertImageSize(file, spec);
    return (await upload(file, folder, "image")).url;
  },

  video: async (file: File | Blob | string, folder?: string): Promise<string> =>
    typeof file === "string" ? file : (await upload(file, folder, "video")).url,
};
