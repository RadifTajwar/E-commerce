import { z } from "zod";
import { listQuery, nonEmpty, objectId, queryBoolean, urlString } from "./common";

export const parentCategoryInputSchema = z
  .object({
    name: nonEmpty(100),
    image: urlString.or(z.literal("")).optional(),
    description: z.string().max(2000).optional(),
  })
  .passthrough();

export const categoryInputSchema = parentCategoryInputSchema.extend({
  parentCategoryId: objectId,
});

const colorDetailSchema = z
  .object({
    colorId: z.string().optional(),
    color: nonEmpty(50),
    hex: z.string().max(20).optional(),
    images: z.array(urlString).default([]),
    quantity: z.coerce.number().int().min(0).optional(),
    availableQuantity: z.coerce.number().int().min(0).optional(),
  })
  .passthrough();

const price = z.coerce.number().min(0);

export const productInputSchema = z
  .object({
    barcode: z.string().max(100).optional(),
    name: nonEmpty(200),
    slug: z.string().trim().max(200).optional(),
    description: z.string().max(5000).optional(),
    category: z.string().max(100).optional(),
    categoryId: objectId.or(z.literal("")).optional(),
    parentCategoryId: objectId.or(z.literal("")).optional(),
    inStock: z.boolean().optional(),
    onSale: z.boolean().optional(),
    originalPrice: price,
    discountedPrice: price,
    imageDefault: urlString.or(z.literal("")).nullable().optional(),
    imageHover: urlString.or(z.literal("")).nullable().optional(),
    leather: z
      .object({ title: z.array(z.string()).default([]), image: urlString.nullable().optional() })
      .passthrough()
      .optional(),
    color: z
      .array(
        z
          .object({
            id: z.string().optional(),
            colorName: nonEmpty(50),
            hex: z.string().max(20).optional(),
            availableQuantity: z.coerce.number().int().min(0).optional(),
          })
          .passthrough(),
      )
      .optional(),
    additionalDetails: z.array(colorDetailSchema).default([]),
    productDetails: z
      .object({
        additionalProductDetails: z.record(z.string(), z.string()).optional(),
        size: z.array(z.string()).optional(),
        warranty: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .refine((p) => Number(p.discountedPrice) <= Number(p.originalPrice), {
    message: "discountedPrice must not exceed originalPrice",
    path: ["discountedPrice"],
  });

/** PATCH accepts any subset of the create payload. */
export const productUpdateSchema = z.object({}).passthrough();

export const productListQuerySchema = listQuery.extend({
  categoryId: objectId.optional(),
  parentCategoryId: objectId.optional(),
  startPrice: z.coerce.number().min(0).optional(),
  endPrice: z.coerce.number().min(0).optional(),
  colorName: z.string().max(200).optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(["asc", "desc", "default"]).optional(),
  inStock: queryBoolean.optional(),
  onSale: queryBoolean.optional(),
});
export type ProductListQuerySchema = z.infer<typeof productListQuerySchema>;

export const ratingInputSchema = z.object({
  productId: objectId,
  userName: nonEmpty(100),
  userEmail: z.string().trim().email().max(254),
  ratingStar: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().max(2000).optional().default(""),
});
