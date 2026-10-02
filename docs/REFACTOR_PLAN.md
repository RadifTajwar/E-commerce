# Refactor Plan

Companion to `docs/AUDIT.md`. Nothing in this document has been implemented yet.
Phase 3 starts only after the decisions in §5 are answered.

---

## 1. Goals and non-goals

**Goals**

- Browser talks only to `/api/*` route handlers on this app. Backend URL, tokens, and Cloudinary credentials never reach the client bundle.
- One HTTP client, one service module per domain, every endpoint defined exactly once.
- Env-driven config validated with zod at startup.
- Redis cache-aside on GET proxies with invalidation on writes; rate limiting on proxies; app keeps working if Redis is down.
- Root layout becomes a Server Component; error/not-found/loading conventions exist; security headers set.
- TypeScript strict, ESLint + Prettier clean, `next build` green, basic Vitest coverage on client/cache/proxy.
- Dead files, dead dependencies, dead assets removed.

**Non-goals (unless approved in §5)**

- No visual or UX change. Same pages, same URLs, same Redux-driven data flow from the component's point of view.
- No route renames (`/myAccount`, `/my-account`, `productCategory/[...slug]` stay).
- No rewrite of the 1,200-line admin product forms beyond extraction into a shared `ProductForm`; no redesign of the storefront.
- No new paid services unless approved (Redis hosting, Cloudinary signed uploads use existing account).

---

## 2. Target structure

```
.
├── .env.example
├── docker-compose.yml               Redis for local dev
├── middleware.ts                    request id, auth guard for /admin and /myAccount, CORS preflight for /api
├── next.config.mjs                  security headers, image hosts from env, pino externals
├── tsconfig.json                    strict, allowJs during migration, "@/*" -> "./src/*"
├── .eslintrc.cjs  .prettierrc       next/core-web-vitals + typescript + prettier
├── vitest.config.ts
├── docs/                            AUDIT.md, REFACTOR_PLAN.md, CHANGELOG_REFACTOR.md
├── public/                          only referenced assets
└── src/
    ├── app/
    │   ├── layout.tsx               SERVER: html/body, font, metadata, <Providers>
    │   ├── error.tsx  not-found.tsx  global-error.tsx  loading.tsx
    │   ├── (storefront)/            was (UserPage); gets its own layout.tsx with <SiteHeader/> <SiteFooter/>
    │   │   ├── page.tsx             home
    │   │   ├── shop/  products/  cart/  checkout/  my-account/  myAccount/   (URLs unchanged)
    │   ├── (admin)/admin/           was (AdminPage); layout without storefront chrome
    │   └── api/                     BFF proxy (route handlers)
    │       ├── _lib/                handler wrapper: validate, rate-limit, cache, error JSON
    │       ├── auth/login/route.ts  sets httpOnly cookie
    │       ├── auth/logout/route.ts
    │       ├── categories/route.ts            GET (cached), POST
    │       ├── categories/[id]/route.ts       GET, PATCH, DELETE
    │       ├── parent-categories/...          same shape
    │       ├── products/route.ts              GET (cached, query-keyed), POST
    │       ├── products/[id]/route.ts         GET, PATCH, DELETE
    │       ├── products/slug/[slug]/route.ts  GET (cached)
    │       ├── products/colors/route.ts       GET (cached)
    │       ├── products/[id]/ratings/route.ts GET, POST
    │       ├── orders/route.ts                GET (admin), POST
    │       ├── orders/[id]/route.ts           GET, PATCH
    │       ├── orders/user/[email]/route.ts   GET
    │       ├── banners/hero/...  banners/video/...
    │       ├── users/route.ts                 POST register
    │       └── uploads/route.ts               Cloudinary (signed, server-side)
    ├── components/
    │   ├── ui/                      button, card, carousel, pagination, icons, skeleton, spinner, confirm-dialog
    │   ├── layout/                  SiteHeader, SiteFooter, NavMenu, SideDrawer, CartDrawer, LoginDrawer, Providers
    │   ├── storefront/              banner, product-card, product-grid, filters/*, cart/*, checkout/*, order-details, product/*
    │   └── admin/                   sidebar, topbar, data-table pieces, forms/*, confirm-delete
    ├── config/
    │   ├── env.ts                   zod-validated, frozen; server + client schemas
    │   └── constants.ts             routes, storage keys, order statuses, currency, shipping options, cache TTLs
    ├── lib/
    │   ├── api/client.ts            fetch-based client: baseURL, timeout, retry/backoff, ApiError
    │   ├── api/errors.ts            ApiError, toErrorResponse()
    │   ├── redis.ts                 singleton, hot-reload safe, degrades to null
    │   ├── cache.ts                 withCache(key, ttl, fetcher), invalidate(namespace)
    │   ├── rate-limit.ts            sliding window on Redis, fail-open
    │   ├── logger.ts                pino (server) / console-shim (client)
    │   ├── auth.ts                  cookie read/write, decode+exp check (verify if JWT_SECRET set)
    │   ├── storage.ts               typed localStorage helpers (cart, ui prefs only)
    │   └── utils.ts                 cn(), money formatting
    ├── services/                    browser-side, call /api only, typed
    │   ├── category.service.ts  parent-category.service.ts  product.service.ts
    │   ├── order.service.ts  banner.service.ts  auth.service.ts  user.service.ts  upload.service.ts
    ├── server/                      server-only, call the real backend
    │   ├── backend.ts               the upstream client instance (env base URL, auth header injection)
    │   └── cloudinary.ts            signature generation
    ├── store/                       Redux (kept)
    │   ├── index.ts  hooks.ts  cart-persistence.ts
    │   └── slices/                  category, parentCategory, product, order, banner, video, user, rating, color, cart
    ├── hooks/                       useDebounce, useClickOutside, useIsMobile, useAuth
    ├── types/                       api.ts (envelope, meta), category.ts, product.ts, order.ts, banner.ts, user.ts
    └── validators/                  zod schemas shared by route handlers and forms
```

Route groups are renamed for clarity only; URLs do not change (groups are not part of the path).

---

## 3. Ordered change list

Each numbered step is one commit (or a small series of commits) on `refactor/architecture-cleanup`. Steps 1 to 4 add code without changing runtime behaviour. Runtime rewiring starts at step 5.

| # | Step | Behaviour change | Depends on |
|---|---|---|---|
| 1 | **Tooling baseline.** `tsconfig.json` (strict, `allowJs`, paths to `./src/*`), ESLint (`next/core-web-vitals`, `@typescript-eslint`, `prettier`), Prettier, Vitest, `npm` scripts (`lint`, `typecheck`, `test`, `format`). Move `typescript`/`@types/*` to devDependencies. Add `eslint`, `eslint-config-next@14`. | none | – |
| 2 | **Env config.** `.env.example`, `src/config/env.ts` (zod; server schema: `BACKEND_API_URL`, `BACKEND_API_TIMEOUT_MS`, `REDIS_URL`, `CACHE_TTL_*`, `RATE_LIMIT_*`, `ALLOWED_ORIGINS`, `CLOUDINARY_*`, `JWT_SECRET?`; client schema: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_IMAGE_HOSTS`), `src/config/constants.ts`. `.gitignore` gets `.env*` with `!.env.example`. | none | 1 |
| 3 | **Core libs.** `lib/api/client.ts` + `errors.ts` (fetch, AbortController timeout, exponential backoff on GET/HEAD/PUT/DELETE for 5xx/network, `ApiError{status, code, message, details}`), `lib/logger.ts` (pino), `lib/redis.ts`, `lib/cache.ts`, `lib/rate-limit.ts`, `server/backend.ts`. Unit tests for client, cache, rate-limit. `docker-compose.yml`. | none | 2 |
| 4 | **Types, validators, services.** `types/*` from the slice code and API responses; `validators/*` (login, register, order, category, parent-category, product, banner, rating, list-query params); `services/*.service.ts` calling `/api/...` through the client. Every backend endpoint from AUDIT §3.1 appears once, in `server/backend.ts` routes map. | none | 3 |
| 5 | **Proxy route handlers.** `src/app/api/**` built on a `createHandler({ schema, cache, rateLimit, auth })` wrapper: validates params/query/body with zod, forwards to the backend with server-side `Authorization` from the cookie, strips hop-by-hop and cookie headers, maps errors to `{ error: { code, message, requestId } }`, applies `withCache` on GET and `invalidate()` on writes, rate-limits per IP (Redis, fail-open). `middleware.ts` adds `x-request-id` and CORS headers from `ALLOWED_ORIGINS`. | Endpoints exist; nothing calls them yet | 4 |
| 6 | **Rewire Redux to services.** Every thunk's inline axios/fetch call replaced by a service call; response/error normalisation unified; `error.response.data` crashes fixed. Slices consolidated per domain (same state field names components read; duplicated thunks merged; dead `categorySlice`/`parentCategorySlice` removed). Store keys kept via `combineReducers` mapping so `useSelector` paths in components keep working, then paths updated file by file. Remove `axios`. | Network path changes from direct-to-backend to via `/api`. Same data in, same data out. | 5 |
| 7 | **Auth via cookie (approval-gated, see D3).** `/api/auth/login` sets httpOnly `access_token`; `middleware.ts` guards `/admin/*` (role admin) and `/myAccount/*` (any user) with decode + exp check, redirecting exactly where the client effects redirect today; a small `/api/auth/session` returns `{ email, role }` for the header's logged-in state. Client-side `useEffect` guards removed. `localStorageUtil` retired; cart persistence moves to `lib/storage.ts` (plain JSON). Category/product id handoff moves to URL query/params instead of localStorage. | Where the token lives; no visible UI change except no logged-out flash. | 6 |
| 8 | **Uploads via proxy (D4).** `/api/uploads` accepts multipart, validates size/MIME, signs and forwards to Cloudinary server-side, returns `secure_url`. `utils/upload*.js` removed. Folder names sanitised. | Upload path; same resulting URL shape. | 5 |
| 9 | **Move to `src/`, delete dead code, prune deps.** `git mv` everything under `src/`, update `@/` alias and every import. Delete the 16 dead files (AUDIT §4.3), the dead admin customers branch and placeholder pages (D6), unused deps (AUDIT §1 "unused"), unreferenced public assets (D7). | none (dead code) | 6 |
| 10 | **Layout split + route conventions.** `app/layout.tsx` server component with `metadata`; `components/layout/Providers.tsx` (Redux); `SiteHeader` holds the drawer state that lived in the root layout; `(storefront)/layout.tsx` and `(admin)/layout.tsx` own their chrome (replaces `pathname.startsWith("/admin")`). Add `error.tsx`, `not-found.tsx`, `global-error.tsx`, `loading.tsx` (minimal, matching existing skeleton style). Wrap `useSearchParams` consumers in `Suspense` and drop `missingSuspenseWithCSRBailout`. Security headers in `next.config.mjs`. Single `ToastContainer` in the admin layout. Remove `console.*`/`alert()` (alerts become toasts, same text). | Tab title appears; no logged-out flash. Toasts instead of `alert()` (D5). | 7 |
| 11 | **Component de-duplication and splitting** (no visual change): one `ConfirmDeleteDialog` replacing 5 `deleteVisible.js`; one `SearchForm`; one `BannerAdminPage` shell for hero/main/video; one `ShopBrowser` used by both shop routes; one `ProductForm mode="create"|"edit"` replacing `addProduct`/`updateProducts`; one `OrderDetails variant`; shared `useClickOutside`, `useDebounce`, `isObjectId`, toast options; `icons/` for the duplicated inline SVGs; split `products/[productName]/page` into gallery/info/reviews; split `checkout/page` into billing form/summary/empty state; `admin/dashboard/sideBar` driven by a nav config. Add `"use client"` to every component that needs it on its own. | none intended | 10 |
| 12 | **TypeScript strict + lint pass.** Rename touched files to `.ts`/`.tsx`; fix strict errors; fix all ESLint warnings (hooks deps, keys, a11y, img→Image where the host is allow-listed, invalid DOM props). Untouched leaf `.jsx` files remain under `allowJs` and are lint-clean. | none | 11 |
| 13 | **Bug fixes from AUDIT §4.1 in the approved set (D5).** Each as its own commit with the bug number in the message. | yes, per approved item | 12 |
| 14 | **Verify.** `npm run build`, `lint`, `typecheck`, `test`; grep for `leather-for-luxury`, `cloudinary.com`, `Tajwar`, `http://`; scripted smoke test of proxy routes against the backend (or recorded fixtures if it is still down); manual flow checklist (home, shop filter, product, add to cart, checkout, order received, login, my orders, admin login, admin CRUD, uploads). | – | 13 |
| 15 | **Docs.** `README.md`, `docs/CHANGELOG_REFACTOR.md`. | – | 14 |

---

## 4. Design notes

**HTTP client.** Native `fetch` (Node 18 and browser) instead of axios: one fewer dependency, works in route handlers and Server Components. Retry only idempotent methods, max 3 attempts, 200 ms base with jitter, only on network errors and 502/503/504. Timeout via `AbortController`. All failures become `ApiError`; route handlers map them to a stable JSON body.

**Cache keys and TTLs.** `khalamma:v1:<domain>:<id-or-query-hash>`. Default TTLs (env-overridable): categories and parent categories 10 min, banners 10 min, product list 60 s, product by slug/id 5 min, colors 10 min, orders never cached (user-specific). Writes call `invalidate("product")` etc., implemented with a per-namespace Redis set of keys (no `KEYS`/`SCAN` in request path). Cache and rate-limit both fail open with a `logger.warn` when Redis is unavailable, so the app runs without Redis.

**Redis client (D2).** See decision. `lib/redis.ts` stores the instance on `globalThis` in development to survive HMR, uses `lazyConnect`, `maxRetriesPerRequest: 1`, `enableOfflineQueue: false`, and marks itself unavailable on error so calls short-circuit instead of hanging.

**Rate limit.** Sliding window per IP per route group: `INCR` + `EXPIRE` on a 60 s bucket; defaults 120 req/min public GET, 30 req/min writes, 10 req/min auth. Returns 429 with `Retry-After`.

**Auth in middleware.** `jose` (small, edge-compatible) to decode; if `JWT_SECRET` is provided it also verifies the signature, otherwise it decodes and checks `exp` and `role` (same trust level as today, but server-side and before render). Cookie: `httpOnly`, `sameSite=lax`, `secure` in production, `path=/`.

**Redux stays.** Components keep `useSelector`/`useDispatch`; the change is inside the thunks. RTK Query would remove most slices, but that is a larger behavioural migration than this brief asks for. Noted as a follow-up.

**TypeScript migration boundary.** All new and all restructured files are `.ts`/`.tsx` under `strict`. Leaf presentational components that are only moved (not split or rewired) keep `.jsx` under `allowJs: true, checkJs: false` so the build stays green while the surface area is reduced. The count of remaining `.jsx` files is reported in the changelog.

**Cloudinary hosts.** `images.remotePatterns` from `NEXT_PUBLIC_IMAGE_HOSTS` (comma list). Admin lists switch from `<img>` to `next/image` only where the host is allow-listed; otherwise they keep `<img>` with an eslint-disable comment and a note.

---

## 5. Decisions needed before Phase 3

| ID | Question | Recommendation |
|---|---|---|
| **D1** | Where is the frontend deployed (Vercel / other serverless / a long-running Node server / not yet)? | Assumed Vercel, based on the backend host and `.vercel` in `.gitignore`. |
| **D2** | Redis client. `ioredis` (TCP; works with docker-compose locally and with any managed Redis, including Upstash's TCP endpoint, on Vercel) vs `@upstash/redis` (HTTP; best fit for serverless, Upstash-only, needs an Upstash account which has a free tier). | **`ioredis`**: one library, same code locally and in prod, no vendor lock. If you are on Vercel and see connection churn, swapping `lib/redis.ts` to Upstash is a one-file change because everything goes through `lib/cache.ts` and `lib/rate-limit.ts`. Either choice needs a hosted Redis in production, which is a new (possibly free-tier) service. |
| **D3** | Move the JWT from localStorage to an httpOnly cookie set by the proxy, with `middleware.ts` guarding `/admin` and `/myAccount`. This is required for "the browser never sees the auth header" and removes the logged-out flash. Existing sessions are invalidated once (users log in again). Do you have the backend's `JWT_SECRET` to enable signature verification? | **Yes, do it.** Signature verification is optional and enabled only when `JWT_SECRET` is set. |
| **D4** | Cloudinary uploads. (a) Signed uploads through `/api/uploads` using `CLOUDINARY_API_KEY`/`API_SECRET` from your Cloudinary dashboard (secret stays server-side, unsigned preset can be disabled). (b) Keep the unsigned preset, expose it as `NEXT_PUBLIC_CLOUDINARY_*`, upload from the browser as now. | **(a)** if you can provide the credentials. Otherwise (b), documented as a known exposure. |
| **D5** | Which AUDIT §4.1 bugs to fix in step 13. Proposed groups: **A: fix without asking** (crashes and plainly broken code: #1, 3, 5, 6, 8, 9, 10, 11, 13, 14, 17, 18, 19, 20, 21, 22, 23, 25, 29, 30, 31, 32, 33, 34, 35, 36, 39, 40). **B: business behaviour, need your yes/no each:** #2 shipping never charged; #4 coupon overwriting name (fix = separate state, coupon still does nothing); #12 out-of-stock addable and unbounded quantity; #15 logout button removing the wrong key; #16 registration password never delivered (fix = show it once or require a password field); #24 Main Banner wired to Hero Banner (fix requires a backend endpoint, so likely: hide the page); #26/27 success toast on failure; #28 re-uploading existing URLs; #7 hardcoded mobile product pane (fix = render real data); #38 review form error handling. **C: leave** (cosmetic, or needs product decisions): currency symbol unification, hardcoded copy, brand strings. | Fix A; fix all of B except #24 which is hidden pending a backend endpoint; C untouched but centralised into `constants.ts` so they are one-line changes later. |
| **D6** | Delete the admin customers branch (5 files + route, all mock data, sidebar link commented out) and the placeholder pages `admin/topBanner`, `admin/midBanner`, `admin/products/[productId]`, `myAccount/editAccount` (no handlers), `myAccount/editAddress` (real personal data), `myAccount/editAddress/billing` (no submit)? | **Delete customers, topBanner, midBanner, products/[productId].** Keep `settings`, `editAccount`, `editAddress`, `billing` as pages but strip the personal data from `editAddress` and mark them clearly as not yet wired. |
| **D7** | Delete ~50 MB of unreferenced files in `public/` (`public/products/`, `public/fonts/`, 40 root images)? They are not used by any code path in this repo. | **Delete**, they are recoverable from git history. |
| **D8** | `alert()` calls (3) become toasts with identical text. Tab title becomes "Tithi" (currently no title). Acceptable as the only visible changes? | Yes. |
| **D9** | Route renames (`/myAccount` → `/account`, `/my-account` → `/login`, `viewOrder/[productId]` → `[orderId]`)? | **Not in this refactor.** Listed as a follow-up in the changelog. |
| **D10** | Migrate remaining leaf components to TypeScript in this pass, or stop at the boundary described in §4? | Stop at the boundary; full migration as a follow-up. |

---

## 6. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Backend is down (HTTP 500 on every endpoint during the audit) | Cannot verify proxied responses end-to-end | Route handlers are written against the shapes the slices already consume; unit tests use fixtures; final manual verification deferred until the backend responds, and stated in the changelog if still blocked |
| Backend response shapes differ from what the slices assume (`data` vs `data.data`) | Silent empty states | Proxy passes the upstream body through unchanged; types describe the envelope; no reshaping in the proxy |
| Backend may reject requests coming from a server (CORS is not involved server-to-server, but IP allow-lists or `Origin` checks could be) | Proxy gets 403 | Forward `User-Agent` and `Origin` explicitly; confirm once the backend is up |
| Redux slice consolidation touches `useSelector` paths in ~60 files | Regressions in data display | Keep state field names; migrate one domain per commit; build after each |
| Moving auth to cookies changes every guarded page's first render | Redirect loops if middleware and page disagree | Middleware mirrors the exact redirect targets currently in the `useEffect`s; login page excluded from the guard |
| `src/` move rewrites every import | Build breaks mid-move | Single commit using `git mv` plus a scripted import rewrite, then `tsc` and `next build` before commit |
| Strict TypeScript surfaces hundreds of errors in leaf components | Time sink | `allowJs` boundary (D10); only rewired files are typed |
| Cloudinary signed uploads need credentials I do not have | Step 8 blocked | Falls back to D4(b) with the preset moved to `NEXT_PUBLIC_` env |
| Redis unavailable in production | Cache and rate-limit silently off | Fail-open by design with `warn` logs; documented |
| Dead-file deletion removes something reached via a path the import graph missed (dynamic import, string path) | Runtime 404/undefined | Graph covered `import`, `export from`, `import()`, `require`; each deletion is re-grepped by basename before removal |
| Behaviour-bug fixes (D5 group B) change what customers see | Product decision | Each is a separate commit, gated on your answer |

---

## 7. Estimated size

- New files: ~70 (route handlers, services, types, validators, libs, tests, configs)
- Files moved: all ~140 source files into `src/`
- Files deleted: ~16 dead sources + customers branch + ~140 public assets + 18 dependencies
- Files rewritten/split: ~25 components and pages
- Commits: ~25 on this branch
