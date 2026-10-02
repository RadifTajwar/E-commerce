import { z } from "zod";
import { ORDER_STATUSES, PHONE_LENGTH, SHIPPING_OPTIONS, ZIP_LENGTH } from "@/config/constants";

import { listQuery, nonEmpty, objectId } from "./common";

const SHIPPING_COSTS: readonly number[] = SHIPPING_OPTIONS.map((o) => o.cost);

/**
 * What a customer may send when placing an order.
 *
 * `totalPrice` and `status` are deliberately absent: the route prices the order
 * from the catalogue and always creates it as Pending. Unknown keys are stripped
 * (no `.passthrough()`), so a client cannot smuggle fields like `isPaid` through
 * to the database.
 */
export const orderInputSchema = z.object({
  orderItems: z
    .array(
      z.object({
        quantity: z.coerce.number().int().min(1).max(999),
        product: objectId,
        color: z.string().max(50).optional(),
      }),
    )
    .min(1, "cart is empty")
    .max(100),
  shippingAddress: nonEmpty(500),
  name: nonEmpty(100),
  email: z.string().trim().email().max(254),
  city: nonEmpty(100),
  zip: z.string().trim().length(ZIP_LENGTH),
  country: nonEmpty(100),
  phone: z.string().trim().length(PHONE_LENGTH),
  /** Must be one of the published shipping rates; any other value is rejected. */
  shippingCost: z.coerce
    .number()
    .refine((c) => SHIPPING_COSTS.includes(c), { message: "unknown shipping option" }),
  additionalDetails: z.string().max(2000).optional(),
});
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
