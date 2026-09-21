import { z } from "zod";
import { OBJECT_ID_RE } from "@/config/constants";

export const objectId = z.string().regex(OBJECT_ID_RE, "must be a 24-character hex id");

export const idParam = z.object({ id: objectId });

export const slugParam = z.object({ slug: z.string().min(1).max(200) });

export const emailParam = z.object({ email: z.string().email() });

/** Accepts "true"/"false"/"1"/"0" from query strings as booleans. */
export const queryBoolean = z
  .union([z.boolean(), z.enum(["true", "false", "1", "0"])])
  .transform((v) => v === true || v === "true" || v === "1");

export const queryInt = (min = 1, max = 10_000) => z.coerce.number().int().min(min).max(max);

export const listQuery = z.object({
  page: queryInt(1).optional(),
  limit: queryInt(1, 100).optional(),
  searchTerm: z.string().max(200).optional(),
});

/** Trims and rejects empty strings. */
export const nonEmpty = (max = 500) => z.string().trim().min(1).max(max);

export const urlString = z.string().url().max(2048);
