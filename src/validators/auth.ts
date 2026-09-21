import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(200),
});
export type RegisterSchema = z.infer<typeof registerSchema>;
