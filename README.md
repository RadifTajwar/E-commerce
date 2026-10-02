# Khalamma storefront

Next.js 14 (App Router) e-commerce storefront and admin dashboard for a leather goods shop.
The browser never talks to the product backend directly: every request goes through a
backend-for-frontend (BFF) proxy in this app, which holds the credentials, validates input,
caches reads in Redis and rate-limits callers.

---

## Architecture

```
Browser
  │  fetch /api/...            (same origin, session cookie, no secrets)
  ▼
src/app/api/**/route.ts        BFF proxy (Next.js Route Handlers)
  │  createHandler() wrapper:
  │    request id → rate limit → auth → zod validation → cache → handler
  ▼
src/server/backend.ts          the only module that knows BACKEND_API_URL
  │  Authorization attached server-side
  ▼
Product backend (REST)
```

Supporting pieces:

| Concern | Where | Notes |
| --- | --- | --- |
| Env config | `src/config/env.ts` | zod-validated, frozen, fails fast at startup |
| HTTP client | `src/lib/api/client.ts` | timeout, retry with backoff, `ApiError` normalisation |
| Cache | `src/lib/cache.ts` + `src/lib/redis.ts` | cache-aside, namespaced invalidation, fails open |
| Rate limit | `src/lib/rate-limit.ts` | fixed window per IP, fails open |
| Auth | `src/middleware.ts` + `src/lib/auth.ts` | httpOnly cookie, guards `/admin/*` and `/myAccount/*` |
| Logging | `src/lib/logger.ts` | pino, redacts auth headers and tokens |
| State | `src/store/**` | Redux Toolkit; thunks call services, never HTTP directly |

**Request flow for a page:** component → thunk in `src/store/slices` → service in
`src/services` → `/api/...` route handler → `src/server/backend.ts` → backend.

---

## Folder structure

```
src/
├── app/
│   ├── layout.tsx              Server Component root (metadata, <Providers>)
│   ├── error.tsx  not-found.tsx  global-error.tsx
│   ├── (UserPage)/             storefront routes + its header/footer layout
│   ├── (AdminPage)/            admin dashboard routes
│   └── api/                    BFF proxy route handlers
│       └── _lib/handler.ts     createHandler(): the shared middleware pipeline
├── components/
│   ├── layout/                 Providers, SiteHeader
│   ├── ui/                     design primitives (button, card, carousel, icons…)
│   ├── admin/                  admin building blocks (dialogs, tables, product form)
│   └── storefront/             shop, product, checkout, account components
├── config/                     env.ts (validated), constants.ts (routes, statuses…)
├── hooks/                      useSession, useDebounce, useClickOutside, useObjectUrl…
├── lib/                        api client, redis, cache, rate limit, logger, auth, utils
├── server/                     server-only: backend client, cloudinary signing
├── services/                   typed browser services, one per domain
├── store/                      Redux store, slices, createRequestSlice factory
├── types/                      request/response types
└── validators/                 zod schemas shared by routes and forms
```

Rules of thumb:

- **Server-only code imports `server-only`** and lives in `src/server` or `src/app/api`.
- **Secrets never get a `NEXT_PUBLIC_` prefix.** Only `NEXT_PUBLIC_*` reaches the browser.
- **One definition per endpoint.** Upstream paths live once in `src/server/backend.ts`;
  internal paths live once in `src/config/constants.ts` under `API`.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. The app refuses to start with a clear
message if a required variable is missing or malformed.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `BACKEND_API_URL` | **yes** | – | Upstream REST base URL. Server-only. |
| `BACKEND_API_TIMEOUT_MS` | no | `10000` | Per-request timeout to the backend. |
| `BACKEND_API_MAX_RETRIES` | no | `2` | Retries for idempotent requests on 502/503/504. |
| `JWT_SECRET` | no | – | When set, the session JWT signature is verified, not just decoded. |
| `AUTH_COOKIE_NAME` | no | `access_token` | Name of the httpOnly session cookie. |
| `REDIS_URL` | no | – | When unset, caching and rate limiting are disabled with a warning. |
| `REDIS_KEY_PREFIX` | no | `khalamma:v1` | Namespace for every key this app writes. |
| `CACHE_TTL_CATALOG` | no | `600` | TTL (s) for categories, parent categories, colours. |
| `CACHE_TTL_PRODUCT_LIST` | no | `60` | TTL (s) for product listings, keyed by query. |
| `CACHE_TTL_PRODUCT` | no | `300` | TTL (s) for a single product. |
| `CACHE_TTL_BANNER` | no | `600` | TTL (s) for banners. |
| `RATE_LIMIT_PUBLIC` | no | `120` | Requests/min per IP for public GETs. |
| `RATE_LIMIT_WRITE` | no | `30` | Requests/min per IP for writes. |
| `RATE_LIMIT_AUTH` | no | `10` | Requests/min per IP for login/register. |
| `ALLOWED_ORIGINS` | no | `""` | Comma-separated CORS allow-list. Same origin always allowed. |
| `CLOUDINARY_CLOUD_NAME` | for uploads | – | Cloudinary account. Server-only. |
| `CLOUDINARY_UPLOAD_PRESET` | no | – | Used when no API key/secret is set. |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | no | – | When both are set, uploads are signed. |
| `UPLOAD_MAX_MB` | no | `25` | Rejected above this size. |
| `NEXT_PUBLIC_APP_NAME` | no | `Tithi` | Shown in metadata. |
| `NEXT_PUBLIC_APP_URL` | no | `http://localhost:4000` | Canonical URL for metadata. |
| `NEXT_PUBLIC_IMAGE_HOSTS` | no | `res.cloudinary.com` | Comma-separated `next/image` hosts. |
| `LOG_LEVEL` | no | `info` | pino level. |

---

## Deploying

Set these in the hosting provider's environment (Vercel: Project → Settings →
Environment Variables) **before the first deploy**:

| Variable | Needed | If missing |
| --- | --- | --- |
| `BACKEND_API_URL` | **required** | the build fails with a message naming it |
| `NEXT_PUBLIC_APP_URL` | strongly recommended | metadata and canonical URLs point at localhost |
| `ALLOWED_ORIGINS` | if any other origin calls `/api` | cross-origin calls are rejected |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET` | for admin uploads | uploads return 503 |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for signed uploads | uploads fall back to the unsigned preset |
| `JWT_SECRET` | optional | tokens are decoded and checked for expiry and role, not verified |
| `REDIS_URL` | **optional** | see below |

**Deploying without Redis is supported.** With `REDIS_URL` unset the app logs one
warning at startup and runs with caching and rate limiting disabled: every read
goes straight to the backend and no caller is throttled. Nothing errors, and the
same is true if Redis is configured but unreachable. Add Redis later by setting
`REDIS_URL`; no code change is needed.

On serverless platforms, prefer a Redis with a connection-pooling or HTTP
endpoint. `src/lib/redis.ts` is the only file that would change to swap the
driver, because everything goes through `lib/cache.ts` and `lib/rate-limit.ts`.

## Running locally

```bash
npm install
cp .env.example .env.local     # then edit BACKEND_API_URL and the Cloudinary values
npm run redis:up               # docker compose up -d redis  (optional)
npm run dev                    # http://localhost:4000
```

Redis is optional. Without it the app runs with caching and rate limiting disabled and logs
a warning; with it, `docker-compose.yml` starts Redis 7 on `localhost:6379`.

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server on port 4000 |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier |
| `npm test` / `npm run test:watch` | Vitest |
| `npm run smoke` | Hits a running server and checks every proxy route |
| `npm run redis:up` / `redis:down` | Local Redis via docker compose |

---

## Adding a new API endpoint

Say the backend gains `GET /api/v1/product/featured`.

1. **Upstream path** — add it to `src/server/backend.ts`:

   ```ts
   products: { /* … */ featured: "/product/featured" },
   ```

2. **Types and validation** — a response type in `src/types/product.ts`, and a zod schema in
   `src/validators/catalog.ts` if the route takes query params or a body.

3. **Route handler** — `src/app/api/products/featured/route.ts`:

   ```ts
   export const GET = createHandler(
     {
       query: featuredQuerySchema,                       // omit if there are none
       cache: {
         ttl: (env) => env.CACHE_TTL_PRODUCT_LIST,
         key: ({ query }) => `products:featured:${hashKey(query)}`,
         namespace: CACHE_NS.products,                   // invalidated by product writes
       },
     },
     async ({ query }) => getBackend().get(backendRoutes.products.featured, { query }),
   );
   ```

   For a write, pass `auth: "admin"`, `body: someSchema` and
   `invalidate: [CACHE_NS.products]`, and forward `authHeaders(token)`.

4. **Internal path** — add it to `API` in `src/config/constants.ts`.

5. **Service** — a method on `productService` in `src/services/product.service.ts` that calls
   that path and unwraps the envelope.

6. **Store** (only if components need it in Redux) — a thunk with `createApiThunk` and a slice
   with `createRequestSlice` in `src/store/slices/product.slice.ts`, registered in
   `src/store/index.ts`.

7. **Components** call the thunk or the service. They must never call `fetch` directly.

Then `npm run typecheck && npm run lint && npm test && npm run build`.

---

## Conventions

- TypeScript strict. New files are `.ts`/`.tsx`; `any` is an ESLint error. Older leaf
  components remain `.js` under `allowJs` and are migrated as they are touched.
- Server Components by default; `"use client"` only where hooks or browser APIs are used.
- No hardcoded URLs, keys or business constants: environment variables in `src/config/env.ts`,
  everything else in `src/config/constants.ts`.
- API errors are always `{ error: { code, message, details?, requestId } }`.
