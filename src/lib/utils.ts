import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_SYMBOL } from "@/config/constants";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** The URL form of a category name used throughout the shop: lower-case, spaces to hyphens. */
export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

/** "$1,350.00" style money formatting. Symbol defaults to the app-wide constant. */
export function formatMoney(amount: number | string | null | undefined, symbol: string = CURRENCY_SYMBOL): string {
  const n = Number(amount ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `${symbol} ${safe.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Percentage off, rounded, for a price pair. 0 when there is no discount. */
export function discountPercent(originalPrice: number | string, discountedPrice: number | string): number {
  const o = Number(originalPrice);
  const d = Number(discountedPrice);
  if (!Number.isFinite(o) || !Number.isFinite(d) || o <= 0 || d >= o) return 0;
  return Math.round(((o - d) / o) * 100);
}

export function formatDate(value: string | number | Date | undefined | null): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
