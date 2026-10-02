"use client";

import { toast, type ToastOptions } from "react-toastify";
import { TOAST_OPTIONS } from "@/config/constants";

const base: ToastOptions = { ...TOAST_OPTIONS };

/** One place for the toast configuration that used to be copy-pasted 14 times. */
export const notify = {
  success: (message: string, options?: ToastOptions) => toast.success(message, { ...base, ...options }),
  error: (message: string, options?: ToastOptions) => toast.error(message, { ...base, ...options }),
  info: (message: string, options?: ToastOptions) => toast.info(message, { ...base, ...options }),
  warning: (message: string, options?: ToastOptions) => toast.warning(message, { ...base, ...options }),
};
