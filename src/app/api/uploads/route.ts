import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { uploadToCloudinary, type ResourceType } from "@/server/cloudinary";

/**
 * POST /api/uploads  (multipart/form-data, admin only)
 *   file:          the image or video
 *   folder:        optional Cloudinary folder (sanitised)
 *   resourceType:  "image" (default) | "video"
 * Returns { data: { url, publicId, resourceType } }.
 */
export const POST = createHandler({ auth: "admin", rateLimit: "write" }, async ({ req, env }) => {
  const form = await req.formData().catch(() => {
    throw new ApiError("Expected multipart/form-data", { status: 400, code: "BAD_REQUEST" });
  });

  const file = form.get("file");
  if (!(file instanceof Blob)) {
    throw new ApiError("Missing file", { status: 400, code: "VALIDATION_ERROR", details: [{ path: "file" }] });
  }

  const requested = String(form.get("resourceType") ?? "image");
  const resourceType: ResourceType = requested === "video" ? "video" : "image";
  const folder = form.get("folder");

  const maxBytes = env.UPLOAD_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new ApiError(`File exceeds ${env.UPLOAD_MAX_MB} MB`, { status: 413, code: "VALIDATION_ERROR" });
  }
  const mime = file.type || "";
  if (!mime.startsWith(`${resourceType}/`)) {
    throw new ApiError(`Expected a ${resourceType} file, got "${mime || "unknown"}"`, {
      status: 415,
      code: "VALIDATION_ERROR",
    });
  }

  const filename = file instanceof File ? file.name : undefined;
  const result = await uploadToCloudinary(file, {
    folder: typeof folder === "string" ? folder : undefined,
    resourceType,
    filename,
  });
  return { success: true, data: result };
});
