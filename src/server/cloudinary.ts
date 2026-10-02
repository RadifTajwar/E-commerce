import "server-only";
import { createHash } from "node:crypto";
import { getServerEnv } from "@/config/env";
import { ApiError } from "@/lib/api/errors";

/**
 * Server-side Cloudinary uploads. Signed when API credentials are configured,
 * otherwise the unsigned preset is used (still from the server, so the
 * preset name never ships to the browser).
 */

export type ResourceType = "image" | "video";

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: ResourceType;
  bytes?: number;
  width?: number;
  height?: number;
}

/** Keep only safe path characters; collapse separators; drop traversal. */
export function sanitizeFolder(input: string | undefined | null): string {
  const cleaned = (input ?? "")
    .split("/")
    .map((seg) => seg.trim().replace(/[^A-Za-z0-9 _-]/g, "").replace(/\s+/g, " "))
    .filter((seg) => seg && seg !== "." && seg !== "..")
    .join("/");
  return cleaned.slice(0, 200);
}

export function signParams(params: Record<string, string>, secret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${secret}`).digest("hex");
}

export async function uploadToCloudinary(
  file: Blob,
  options: { folder?: string; resourceType: ResourceType; filename?: string },
  fetchImpl: typeof fetch = fetch,
): Promise<UploadResult> {
  const env = getServerEnv();
  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError("Uploads are not configured (CLOUDINARY_CLOUD_NAME missing)", {
      status: 503,
      code: "INTERNAL_ERROR",
    });
  }

  const folder = sanitizeFolder(options.folder);
  const form = new FormData();
  form.append("file", file, options.filename ?? "upload");
  if (folder) form.append("folder", folder);

  if (env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const params: Record<string, string> = { timestamp, ...(folder ? { folder } : {}) };
    form.append("timestamp", timestamp);
    form.append("api_key", env.CLOUDINARY_API_KEY);
    form.append("signature", signParams(params, env.CLOUDINARY_API_SECRET));
  } else if (env.CLOUDINARY_UPLOAD_PRESET) {
    form.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
  } else {
    throw new ApiError("Uploads are not configured (no API credentials or upload preset)", {
      status: 503,
      code: "INTERNAL_ERROR",
    });
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/${options.resourceType}/upload`;
  const res = await fetchImpl(endpoint, { method: "POST", body: form });
  const json = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    public_id?: string;
    bytes?: number;
    width?: number;
    height?: number;
    error?: { message?: string };
  };

  if (!res.ok || !json.secure_url) {
    throw new ApiError(json.error?.message ?? "Cloudinary upload failed", {
      status: res.status >= 400 && res.status < 500 ? 400 : 502,
      code: "UPSTREAM_ERROR",
    });
  }

  return {
    url: json.secure_url,
    publicId: json.public_id ?? "",
    resourceType: options.resourceType,
    bytes: json.bytes,
    width: json.width,
    height: json.height,
  };
}
