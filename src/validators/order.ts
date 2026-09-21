import { z } from "zod";
import { ORDER_STATUSES, PHONE_LENGTH, ZIP_LENGTH } from "@/config/constants";
import { listQuery, nonEmpty, objectId } from "./common";

export const orderInputSchema = z
  .object({
    orderItems: z
      .array(
        z.object({
          quantity: z.coerce.number().int().min(1),
          product: objectId,
          color: z.string().max(50).optional(),
        }),
      )
      .min(1, "cart is empty"),
    shippingAddress: nonEmpty(500),
    name: nonEmpty(100),
    email: z.string().trim().email().max(254),
    city: nonEmpty(100),
    zip: z.string().trim().length(ZIP_LENGTH),
    country: nonEmpty(100),
    phone: z.string().trim().length(PHONE_LENGTH),
    status: z.string().max(30).default("Pending"),
    totalPrice: z.coerce.number().min(0),
    additionalDetails: z.string().max(2000).optional(),
  })
  .passthrough();
export type OrderInputSchema = z.infer<typeof orderInputSchema>;

export const orderUpdateSchema = z
  .object({
    status: z.enum(ORDER_STATUSES as [string, ...string[]]).optional(),
    trackCode: z.string().trim().max(100).optional(),
  })
  .refine((v) => v.status !== undefined || v.trackCode !== undefined, {
    message: "status or trackCode is required",
  });

export const orderListQuerySchema = listQuery.extend({
  status: z.string().max(30).optional(),
  email: z.string().email().optional(),
  startDate: z.string().max(40).optional(),
  endDate: z.string().max(40).optional(),
});
