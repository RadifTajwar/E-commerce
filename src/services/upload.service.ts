import { API } from "@/config/constants";
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
  /** Upload an image and get back its URL. Existing URL strings are returned untouched. */
  image: async (file: File | Blob | string, folder?: string): Promise<string> =>
    typeof file === "string" ? file : (await upload(file, folder, "image")).url,

  video: async (file: File | Blob | string, folder?: string): Promise<string> =>
    typeof file === "string" ? file : (await upload(file, folder, "video")).url,
};
