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
  account: "/myAccount",
  accountOrders: "/myAccount/orders",
  accountViewOrder: (orderId: string) => `/myAccount/viewOrder/${orderId}`,
  accountEditAddress: "/myAccount/editAddress",
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

/** Currency and shipping. Display strings are kept as they were in the UI. */
export const CURRENCY_SYMBOL = "$";
export const DEFAULT_COUNTRY = "Bangladesh";
export const SHIPPING_OPTIONS = [
  { id: "chattogram", label: "Home Delivery - Chattogram City", cost: 60 },
  { id: "dhaka", label: "Home Delivery - Dhaka City", cost: 100 },
  { id: "outside", label: "Home Delivery - Outside City", cost: 120 },
] as const;
export const DEFAULT_SHIPPING_COST = 60;
export const DISTRICTS = ["Dhaka", "Chittagong", "Khulna", "Barisal", "Sylhet"] as const;
export const PHONE_LENGTH = 11;
export const ZIP_LENGTH = 4;

/** Shop filters. */
export const PRICE_FILTER = { min: 0, max: 18000, step: 60, minDistance: 100 } as const;

/** Pagination defaults. */
export const PAGE_SIZE = { admin: 10, shop: 12, recentOrders: 3 } as const;

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
