# Refactor changelog

Branch `refactor/architecture-cleanup`, 11 commits on top of `7ef79b3`.
566 files changed. See `docs/AUDIT.md` for the findings this work addresses and
`docs/REFACTOR_PLAN.md` for the plan that was approved.

Behaviour is unchanged except where listed under "Behaviour changes" and "Bugs fixed".

---

## 1. Environment configuration

- `src/config/env.ts` validates every variable with zod at startup and exports a frozen,
  typed object. A missing or malformed variable fails the process with a message naming the
  variable and pointing at `.env.example`.
- Server config is parsed lazily and throws if touched in the browser; only `NEXT_PUBLIC_*`
  is exposed to the client.
- `.env.example` documents all 24 variables. `.gitignore` now ignores `.env*` except the example.
- `src/config/constants.ts` holds what used to be scattered magic values: routes, internal API
  paths, storage keys, order statuses, shipping options, currency, districts, price-filter
  bounds, page sizes, cache namespaces, toast options.

**Removed from the source:** 40 hardcoded backend URLs, the Cloudinary cloud name and upload
preset, and the AES key that appeared in three files.

## 2. Centralised API layer

- `src/lib/api/client.ts`: one `fetch`-based client with base URL, per-request timeout via
  `AbortController`, retry with exponential backoff and jitter for idempotent methods only,
  JSON and FormData handling, and every failure normalised to `ApiError`.
- `src/lib/api/errors.ts`: `ApiError` with a stable `code`, `status`, `details` and `requestId`,
  plus `getErrorMessage()` for UI code.
- `src/services/*.service.ts`: one module per domain (auth, category, product, order, banner,
  upload), fully typed, calling only this app's `/api` routes.
- `src/server/backend.ts`: the single place where an upstream endpoint is defined (35 of them).
- `axios` removed.

## 3. Proxy / BFF layer

- 21 route handlers under `src/app/api` cover every upstream endpoint plus login, logout,
  session and uploads.
- `src/app/api/_lib/handler.ts` provides `createHandler()`: request id → rate limit → cookie
  auth with role checks → zod validation of params, query and body → cache-aside on GET →
  namespace invalidation on writes → uniform JSON errors.
- `src/middleware.ts` adds request ids, CORS from `ALLOWED_ORIGINS`, and server-side guards for
  `/admin/*` (role `admin`) and `/myAccount/*`, redirecting exactly where the old client-side
  effects did.
- `/api/uploads` performs Cloudinary uploads server-side, signed when API credentials are
  configured, with size and MIME checks and folder-path sanitisation.
- The browser no longer sees the backend URL, the bearer token, or any Cloudinary credential.

## 4. Redis caching

- `ioredis` chosen over `@upstash/redis`: the same code works against local docker-compose and
  any managed Redis, and everything routes through `cache.ts`/`rate-limit.ts`, so swapping the
  driver is a one-file change.
- `src/lib/redis.ts`: singleton kept on `globalThis` so it survives hot reload, lazy connect,
  no offline queue, throttled error logging.
- `src/lib/cache.ts`: `withCache(key, ttl, fetcher)` cache-aside with namespaced keys and
  `invalidateNamespace()` that uses a per-namespace set rather than `KEYS`/`SCAN`.
- TTLs per resource from env: catalogue 10 min, product list 60 s, product 5 min, banners 10 min.
  Orders are never cached.
- `src/lib/rate-limit.ts`: fixed-window per IP, separate limits for public reads, writes and auth.
- **Both fail open.** With Redis down the app serves every request directly and logs a warning.
- `docker-compose.yml` runs Redis 7 for local development.

## 5. Project structure

- Everything moved under `src/`; `@/*` now resolves to `./src/*`.
- Feature-oriented layout: `app/`, `components/{ui,layout,admin,storefront}`, `config/`, `hooks/`,
  `lib/`, `server/`, `services/`, `store/`, `types/`, `validators/`.
- `src/app/layout.tsx` is a **Server Component** with `metadata`; the Redux provider and session
  and cart bootstrap moved to `components/layout/Providers.tsx`, the navigation and drawers to
  `components/layout/SiteHeader.jsx`. Route groups own their chrome instead of a
  `pathname.startsWith("/admin")` check.
- The 36 hand-written Redux slices became one `createRequestSlice` factory plus eight domain
  slices. **Store keys and state field names are unchanged**, so existing `useSelector` paths
  still work.

## 6. Error handling, logging, security

- `error.tsx`, `global-error.tsx` and `not-found.tsx` added; API errors are always
  `{ error: { code, message, details?, requestId } }`.
- `pino` logger with redaction of authorization headers, cookies, passwords and tokens.
  All 9 remaining `console.*` calls and all 3 `alert()` calls removed.
- Security headers in `next.config.mjs`: `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and HSTS in production. `poweredByHeader` off.
- All user input is validated server-side with zod before it reaches the backend.
- `next/image` hosts come from env instead of a hardcoded domain.

## 7. Code quality

- TypeScript strict with `noUncheckedIndexedAccess`; `tsconfig.json` replaces `jsconfig.json`.
  New and restructured files are typed; untouched leaf components remain `.js` under `allowJs`.
- ESLint (`next/core-web-vitals` + `@typescript-eslint` + Prettier) and Prettier configured;
  `npm run lint` reports **0 errors**.
- Vitest with 32 tests covering the HTTP client, cache helper, rate limiter, env validation and
  the proxy handler (validation, 401/403, expired and forged tokens, 429, error mapping,
  cache invalidation).
- `scripts/smoke.mjs` (`npm run smoke`) exercises every proxy route against a running server.

---

## 8. Server / client split (follow-up pass)

The root layout becoming a Server Component unblocked per-page conversion, which
was then done for the public routes.

- `src/server/queries.ts` gives Server Components direct, cached access to the
  backend. It calls the backend in-process rather than looping through this app's
  own `/api` routes, and uses the same Redis keys and namespaces as the proxy, so
  the two share cache entries and a write through `/api` invalidates what a page
  cached. `safely()` keeps optional data from taking a route down.
- **`/products/[productName]`** is a Server Component. The product is rendered
  into the HTML and `generateMetadata` supplies the title, description and
  OpenGraph image. A missing product returns 404; a backend outage surfaces the
  error boundary rather than an empty page.
- **`/shop`** and **`/shop/productCategory/[...slug]`** are Server Components with
  ISR (10 minutes). The category taxonomy is rendered server-side and passed to
  `ShopBrowser`, so slug resolution is correct on first paint and the client no
  longer refetches it. The category route resolves its slug into a real title.
- **`/`** fetches hero banners and parent categories on the server, putting the
  LCP hero image in the first paint.
- **`/cart`, `/checkout`, `/my-account`** became small Server Component shells that
  export metadata and render their interactive view; client components cannot
  export metadata, so these routes previously had no title at all.
- `(checkout)/layout.js` is a Server Component with the step indicator as its one
  client island.

Counts: 13 Server Components among pages and layouts, 16 client. The 16 are the
admin dashboard (behind auth, no indexable content, entirely interactive) and the
session-bound account and order screens. Metadata now exists on 8 route files;
before this refactor the app had none anywhere.

## Behaviour changes

These are the only user-visible differences.

| Change | Why |
| --- | --- |
| **Everyone must log in again once.** | The session moved from `localStorage` to an httpOnly cookie. |
| **Registration now asks for a password.** | It previously generated a random one and never showed or emailed it, so the account was unusable afterwards. |
| **Shipping is added to the order total.** | It was displayed but never submitted, so every order underbilled by 60 to 120. |
| Blocking `alert()` dialogs became toasts with the same text. | Consistency with the rest of the app. |
| Pages now have a browser tab title, and product pages carry OpenGraph tags. | The app had no metadata at all. |
| Product, shop, category and home content is rendered on the server. | These are the indexable routes; previously every page shipped empty HTML and fetched on the client. |
| The "Main Banner" admin page was removed. | It was wired to the hero-banner endpoints and had no backend of its own; it edited hero banners under a second name. |
| The admin "Customers" area was removed. | Entirely mock data; its sidebar link was already commented out. |
| Order confirmation shows one currency. | The same order showed `৳100` on one screen and `₹60` on another. |
| Shop category deep links and refresh now work. | Category ids came from `localStorage`, so a shared or refreshed URL showed the previously clicked category. |

## Bugs fixed

Numbering follows `docs/AUDIT.md` §4.1.

1. Shop page threw `ReferenceError` on every category click (missing import).
2. Shipping never charged (above).
3. `createOrder` rejection unhandled; a failed order showed the customer nothing.
4. Coupon input shared its id and state with the billing name field.
5. Shipping read raw from `localStorage` produced `NaN` totals.
6. `localStorage` read during render of the product page (SSR error, hydration mismatch).
7. Hardcoded mobile product pane, missing its out-of-stock guard.
8. `window.innerWidth` read during render; `false` passed to the carousel API.
9. Rules-of-hooks violation in the nav menu crashed the layout on a failed category fetch.
10. Cart drawer showed a literal `1` instead of the line quantity.
11. Mobile cart +/- buttons did nothing; line subtotal showed the whole-cart total.
12. Out-of-stock items were addable and quantities unbounded; cart total could drift.
13. Cart hydration mismatch from reading storage at module load.
14. Orders page crashed for logged-out visitors (`jwtDecode` on a null token).
15. Account logout removed the wrong storage key, so it did nothing.
16. Registration password never delivered (above).
17. Storage key written with a trailing space; inverted mobile category condition.
18. Product titles linked to a non-existent `/product/1`.
19. Two incompatible product-id handoff schemes via `localStorage`; both removed.
20. Related-products carousel: render-time width read, invalid carousel options, wrong length check.
21. Infinite scroll ignored filters applied after mount; premature paging; swallowed errors.
22. Filter components synced through an uncleared `setTimeout` on a stale boolean.
23. Admin product delete dialog fetched a *category* by product id.
24. "Main Banner" wired to hero-banner endpoints (feature removed).
25. Admin product filters used previous state instead of the handler argument.
26. Validation of fields the form does not collect; success toast on validation failure.
27. Success toast fired before an un-awaited mutation.
28. Existing image URLs re-uploaded to Cloudinary on every save.
29. Blob URLs created during render and never revoked.
30. Invoice page: unkeyed rows, missing optional chaining, dead blob link, swallowed errors.
31. Error objects rendered as React children in six admin lists.
32. `error.response.data` without optional chaining in ten thunks.
33. `jwtDecode` outside try/catch in four places.
34. Unscoped cart stylesheet broke every table in the app.
35. Relative `router.push` targets.
36. Two footers on the login page.
37. Subscribe form reloaded the page.
38. Review submission errors swallowed and the form cleared as if successful.
39. Banner crash when a hero banner had fewer images than expected.
40. Filter changes did not refetch because of a latch.

Also fixed: a real person's name, address, phone number and email hardcoded into the account
address page.

## Removed

- **16 unreachable source files** (~1,300 lines): the shadcn sidebar subtree, chart, table,
  collection, top-rated products, a duplicate search form, two unused hooks, two dead slices.
- **The admin customers branch** and the placeholder pages `topBanner`, `midBanner`,
  `products/[productId]`.
- **18 unused dependencies**: `@nextui-org/react`, `@nextui-org/slider`, `@material-tailwind/react`,
  `@mui/styled-engine-sc`, `styled-components`, `chart.js`, `react-chartjs-2`,
  `@tanstack/react-table`, `easy-magnify`, `react-tooltip`, `emailjs-com`, `nodemailer`, `multer`,
  `cloudinary`, `@fontsource/roboto`, `tailwindcss-scoped-groups`, plus `axios`, `crypto-js`,
  `jwt-decode` and three Radix packages once their consumers went. 51 → 28 runtime dependencies.
- **~50 MB of unreferenced assets** from `public/` (58 MB → 156 KB).
- Duplicates: 4 delete dialogs, 2 search forms, 3 banner page shells, 2 order-detail components,
  2 shop pages, 2 product forms (2,533 lines → 38 lines of wrappers plus a shared form),
  3 login forms, 2 logout implementations, and ~40 copy-pasted inline SVGs.

## Known gaps and follow-ups

- **The backend was unreachable during this work** (HTTP 500 `FUNCTION_INVOCATION_FAILED` on
  every endpoint). Proxy shapes were written against what the existing slices consumed and are
  covered by unit tests, but an end-to-end pass with a live backend is still required. Run
  `npm run dev` and then `npm run smoke`.
- **Cloudinary uploads are unsigned** until `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are
  set. They now happen server-side, so the preset no longer ships to the browser, but signing
  should be enabled and the unsigned preset disabled in the Cloudinary dashboard.
- **The AES key in git history is burned.** It is out of the source, but anyone with repository
  access can read it from old commits. Nothing depends on it any more.
- `JWT_SECRET` is optional. Until it is set, the session token is decoded and its expiry and role
  checked, but the signature is not verified; the backend remains the authority.
- Not migrated to TypeScript: leaf components that were only moved. They are `.js` under
  `allowJs` and lint clean.
- Route names left alone by decision: `/myAccount` vs `/my-account`, and
  `viewOrder/[productId]` which carries an order id.
- Placeholder screens kept but clearly inert: admin settings, account "edit account" and
  "edit address" (no backend endpoints exist for them).
- Still using Redux thunks. RTK Query would remove most of the remaining slice code; it was
  out of scope here.
