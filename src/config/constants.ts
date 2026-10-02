/**
 * Application-wide constants. Anything that used to be a magic string or
 * number repeated across components lives here.
 */

/** App routes (browser-facing). URLs are unchanged from the original app. */
export const ROUTES = {
  home: "/",
  shop: "/shop",
  shopCategory: (parentSlug: string, categorySlug?: string) =>
    categorySlug
      ? `/shop/productCategory/${parentSlug}/${categorySlug}`
      : `/shop/productCategory/${parentSlug}`,
  product: (slug: string) => `/products/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orderReceived: (orderId: string) => `/checkout/orderReceived/${orderId}`,
  login: "/my-account",
  verifyEmail: "/myAccount/verifyEmail",
  forgotPassword: "/forgot-password",
  account: "/myAccount",
  accountOrders: "/myAccount/orders",
  accountViewOrder: (orderId: string) => `/myAccount/viewOrder/${orderId}`,
  accountEditAddress: "/myAccount/editAddress",
  accountEditAddressBilling: "/myAccount/editAddress/billing",
  accountEditAccount: "/myAccount/editAccount",
  admin: {
    login: "/admin",
    dashboard: "/admin/dashboard",
    categories: "/admin/categories",
    parentCategories: "/admin/parentCategories",
    products: "/admin/products",
    orders: "/admin/orders",
    order: (orderId: string) => `/admin/orderNo/${orderId}`,
    heroBanner: "/admin/heroBanner",
    mainBanner: "/admin/mainBanner",
    video: "/admin/video",
    settings: "/admin/settings",
  },
} as const;

/** Internal API (BFF) routes the browser calls. */
export const API = {
  auth: { login: "/api/auth/login", logout: "/api/auth/logout", session: "/api/auth/session" },
  usersMe: "/api/users/me",
  usersForgotPassword: "/api/users/forgot-password",
  usersResetPassword: "/api/users/reset-password",
  usersVerify: "/api/users/verify",
  usersResendVerification: "/api/users/resend-verification",
  users: "/api/users",
  categories: "/api/categories",
  category: (id: string) => `/api/categories/${encodeURIComponent(id)}`,
  parentCategories: "/api/parent-categories",
  parentCategory: (id: string) => `/api/parent-categories/${encodeURIComponent(id)}`,
  products: "/api/products",
  product: (id: string) => `/api/products/${encodeURIComponent(id)}`,
  productBySlug: (slug: string) => `/api/products/slug/${encodeURIComponent(slug)}`,
  productColors: "/api/products/colors",
  productRatings: (productId: string) => `/api/products/${encodeURIComponent(productId)}/ratings`,
  orders: "/api/orders",
  order: (id: string) => `/api/orders/${encodeURIComponent(id)}`,
  ordersByUser: (email: string) => `/api/orders/user/${encodeURIComponent(email)}`,
  heroBanners: "/api/banners/hero",
  heroBanner: (id: string) => `/api/banners/hero/${encodeURIComponent(id)}`,
  videoBanners: "/api/banners/video",
  videoBanner: (id: string) => `/api/banners/video/${encodeURIComponent(id)}`,
  uploads: "/api/uploads",
} as const;

/** Browser storage keys (non-sensitive state only). */
export const STORAGE_KEYS = {
  cart: "cart",
  selectedShipping: "selectedShipping",
} as const;

export const ORDER_STATUS = {
  pending: "Pending",
  processing: "Processing",
  delivered: "Delivered",
  cancelled: "Cancel",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export const ORDER_STATUSES: readonly OrderStatus[] = Object.values(ORDER_STATUS);

export const USER_ROLE = { admin: "admin", user: "user" } as const;

/** Currency (Bangladeshi taka, as on the product cards and in emails) and shipping. */
export const CURRENCY_SYMBOL = "৳";
export const DEFAULT_COUNTRY = "Bangladesh";
export const SHIPPING_OPTIONS = [
  { id: "inside", label: "Inside Chattogram", cost: 60 },
  { id: "outside", label: "Outside Chattogram", cost: 120 },
] as const;
export const DEFAULT_SHIPPING_COST = 120;
export const DISTRICTS = ["Chittagong", "Dhaka", "Khulna", "Barisal", "Sylhet"] as const;

/**
 * Districts that count as inside Chattogram. The district list spells it
 * "Chittagong" while the shipping option reads "Chattogram" — both are the same
 * place, so match on either rather than on one exact string.
 */
const INSIDE_CHATTOGRAM = ["chittagong", "chattogram"];

/** The shipping cost implied by a delivery district. */
export function shippingCostForDistrict(district: string): number {
  const inside = INSIDE_CHATTOGRAM.includes(district.trim().toLowerCase());
  const option = SHIPPING_OPTIONS.find((o) => (inside ? o.id === "inside" : o.id === "outside"));
  return option?.cost ?? DEFAULT_SHIPPING_COST;
}
export const PHONE_LENGTH = 11;
export const ZIP_LENGTH = 4;

/** Shop filters. */
export const PRICE_FILTER = { min: 0, max: 18000, step: 60, minDistance: 100 } as const;

/** Pagination defaults. */
export const PAGE_SIZE = { admin: 10, shop: 12, recentOrders: 15 } as const;

/** Mongo ObjectId shape used by the backend. */
export const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;
export const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && OBJECT_ID_RE.test(value);

/** Shared react-toastify options (previously copy-pasted 14 times). */
export const TOAST_OPTIONS = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "light",
} as const;

/** Cache namespaces: invalidated as a group when a related write happens. */
export const CACHE_NS = {
  categories: "categories",
  parentCategories: "parent-categories",
  products: "products",
  banners: "banners",
} as const;
