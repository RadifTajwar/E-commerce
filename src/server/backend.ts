import "server-only";
import { getServerEnv } from "@/config/env";
import { createHttpClient, type HttpClient } from "@/lib/api/client";

/**
 * The upstream backend. This is the ONLY module that knows the real API URL.
 * Only route handlers and server code import it; the browser never does.
 */

const enc = encodeURIComponent;

/** Every upstream endpoint, defined exactly once. */
export const backendRoutes = {
  auth: {
    login: "/auth/login",
  },
  users: {
    create: "/user/create-user",
  },
  categories: {
    list: "/category",
    byId: (id: string) => `/category/ById/${enc(id)}`,
    create: "/category/create-category",
    update: (id: string) => `/category/update/${enc(id)}`,
    remove: (id: string) => `/category/delete/${enc(id)}`,
  },
  parentCategories: {
    list: "/parent-category",
    byId: (id: string) => `/parent-category/ById/${enc(id)}`,
    create: "/parent-category/create-parent",
    update: (id: string) => `/parent-category/update/${enc(id)}`,
    remove: (id: string) => `/parent-category/delete/${enc(id)}`,
  },
  products: {
    list: "/product",
    bySlug: (slug: string) => `/product/${enc(slug)}`,
    byId: (id: string) => `/product/ById/${enc(id)}`,
    create: "/product/create-product",
    update: (id: string) => `/product/update/${enc(id)}`,
    remove: (id: string) => `/product/delete/${enc(id)}`,
    colors: "/product/all/colors",
    ratings: (productId: string) => `/product/product/${enc(productId)}`,
    createRating: "/product/rating",
  },
  orders: {
    list: "/order/all-order",
    byId: (id: string) => `/order/ById/${enc(id)}`,
    byUser: (email: string) => `/order/User/${enc(email)}`,
    create: "/order/create-order",
    update: (id: string) => `/order/update/${enc(id)}`,
  },
  banners: {
    heroList: "/banner/all-topBanner",
    heroById: (id: string) => `/banner/Top-Banner/${enc(id)}`,
    heroUpdate: (id: string) => `/banner/Update-Top-Banner/${enc(id)}`,
    videoList: "/banner/all-VideoBanner",
    videoById: (id: string) => `/banner/Video-Banner/${enc(id)}`,
    videoUpdate: (id: string) => `/banner/Update-Video-Banner/${enc(id)}`,
  },
} as const;

let client: HttpClient | undefined;

export function getBackend(): HttpClient {
  if (client) return client;
  const env = getServerEnv();
  client = createHttpClient({
    baseUrl: env.BACKEND_API_URL,
    timeoutMs: env.BACKEND_API_TIMEOUT_MS,
    maxRetries: env.BACKEND_API_MAX_RETRIES,
    headers: { "user-agent": "khalamma-bff/1.0" },
  });
  return client;
}

/** Headers to forward to the backend for an authenticated call. */
export function authHeaders(token: string | undefined): HeadersInit {
  return token ? { authorization: `Bearer ${token}` } : {};
}

/** Test helper. */
export function resetBackendForTests(): void {
  client = undefined;
}
