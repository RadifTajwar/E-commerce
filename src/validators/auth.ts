import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});
export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Sign-up. The user picks their own password — it is the one copy an
 * undeliverable email cannot lose. Only a verification code is mailed, so
 * nothing secret ever leaves the system.
 */
export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(200),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(200),
});

/** Fields a signed-in customer may change on their own profile. */
export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  shippingAddress: z.string().trim().max(500).optional(),
  location: z.string().trim().max(100).optional(),
});
