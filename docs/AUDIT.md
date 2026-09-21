# Architecture Audit

Project: `khalamma` (storefront brand "Tithi", backend "leather-for-luxury")
Date: 2026-09-22
Branch: `refactor/architecture-cleanup`
Scope: every file under `app/`, `components/`, `hooks/`, `lib/`, `redux/`, `utils/`, plus root config. Read-only; no code was changed.

Line references are `path:line` against the commit `7ef79b3` tree.

---

## 0. Executive summary

| Area | Finding |
|---|---|
| Stack | Next.js 14.1.1 App Router, React 18.3.1, **plain JavaScript** (jsconfig, no tsconfig), Tailwind 3, Redux Toolkit |
| Rendering | `app/layout.js:1` is `"use client"` and wraps `<html>` in the Redux Provider. Every page in the app is a client component. No `metadata`, no `loading`/`error`/`not-found` files anywhere. |
| Config | 40 backend URLs hardcoded across 36 slices (two on plain `http://`). Cloudinary cloud name and unsigned preset hardcoded. AES key hardcoded in 3 files and present in git history since 2024-10. No `.env*` files exist. |
| API layer | No client, no proxy, no services. Browser calls the backend and Cloudinary directly. No `Authorization` header is ever sent. Every admin write endpoint is called anonymously. |
| Duplication | Category and parent-category lists are dispatched from 9 call sites each; products from 8; hero banners from 5. On a shop page load the two category lists are fetched 3 to 4 times each. |
| Auth | JWT stored in localStorage, decoded (never verified) client-side, expiry never checked. Admin gate is a `useEffect` redirect. No middleware. |
| Dead code | 16 source files unreachable from any route (~1,300 lines). ~50 MB of the 58 MB `public/` folder is unreferenced. 18 of 51 dependencies are never imported. |
| Tooling | No ESLint config, no Prettier, no tests, no CI. `npm run lint` will prompt to create a config. |
| Backend | `https://leather-for-luxury.vercel.app` returned HTTP 500 `FUNCTION_INVOCATION_FAILED` on every endpoint probed during this audit. |

---

## 1. Stack and dependencies

### Framework

| Item | Value |
|---|---|
| Next.js | `14.1.1` (locked) |
| Router | App Router (`app/`), no `pages/` |
| React | `18.3.1` |
| Language | JavaScript. One `.tsx` file (`components/imageEffect.tsx`). `typescript@5.6.3` is installed but there is **no `tsconfig.json`**; Next will auto-generate an untracked one on first build. `jsconfig.json` defines only `@/* -> ./*`. |
| Styling | Tailwind 3.3 + shadcn tokens in `app/globals.css`, plus MUI, plus flowbite CSS classes |
| State | Redux Toolkit, 36 slices, one store (`redux/store.js`) |
| HTTP | axios in 31 files; raw `fetch` in 4 slices and 2 utils |
| Scripts | `dev` runs on port 4000; `lint` is `next lint` with no config |
| Node | v18.20.8 on this machine (Next 14 minimum is 18.17) |
| Deploy target | `.vercel` in `.gitignore`, backend on Vercel. Assumed Vercel/serverless for the frontend too (see plan for Redis choice). |

### Dependencies (51) with actual usage

"Files" = number of source files importing the package.

| Package | Files | Verdict |
|---|---|---|
| `next`, `react`, `react-dom` | all | core |
| `@reduxjs/toolkit` | 36 | used |
| `react-redux` | 54 | used |
| `axios` | 31 | used (to be replaced by one client) |
| `jwt-decode` | 8 | used |
| `crypto-js` | 3 | used only for the hardcoded-key AES scheme |
| `react-toastify` | 7 | used (admin pages only, 7 separate `ToastContainer`s) |
| `react-icons` | 8 | used (admin only) |
| `lucide-react` | 4 | used (3 icons total) |
| `@mui/material` | 13 | used for `Skeleton`, `Rating`, `Slider`, `Box`, `Typography` only |
| `@mui/icons-material` | 12 | used |
| `@radix-ui/react-slot` | 2 | used (button) |
| `@radix-ui/react-icons` | 3 | used (pagination + dead files) |
| `class-variance-authority` | 3 | used |
| `clsx`, `tailwind-merge` | 1 | used (`lib/utils.js`) |
| `embla-carousel-react` | 1 | used (`ui/carousel.jsx`) |
| `recharts` | 3 | used only in admin dashboard placeholders with constant data; one of the files is dead |
| `jspdf` | 1 | used (`orderNo` invoice); depends on html2canvas which is never imported |
| `flowbite` | 1 | side-effect import only, never initialised, accordion markup is inert |
| `tailwindcss-animate` | tailwind.config | used |
| `@radix-ui/react-dialog` | 1 | only by dead `ui/sheet.jsx` |
| `@radix-ui/react-separator` | 1 | only by dead `ui/separator.jsx` |
| `@radix-ui/react-tooltip` | 1 | only by dead `ui/tooltip.jsx` |
| `@types/node`, `@types/react` | – | in `dependencies` instead of `devDependencies` |
| `typescript` | – | in `dependencies`; no tsconfig |
| `@emotion/react`, `@emotion/styled` | 0 | MUI peer deps, not imported directly |
| `@mui/styled-engine-sc` | 0 | **unused** |
| `styled-components` | 0 | **unused** |
| `@nextui-org/react`, `@nextui-org/slider` | 0 | **unused** |
| `@material-tailwind/react` | 0 | **unused** |
| `chart.js`, `react-chartjs-2` | 0 | **unused** (second chart lib) |
| `@tanstack/react-table` | 0 | **unused** |
| `easy-magnify` | 0 | **unused** |
| `react-tooltip` | 0 | **unused** |
| `html2canvas` | 0 | never imported; jspdf resolves it at runtime |
| `emailjs-com` | 0 | **unused** (registration never sends the password it generates) |
| `nodemailer` | 0 | **unused**, server-only package in a client-only app |
| `multer` | 0 | **unused**, Express middleware |
| `cloudinary` | 0 | **unused** (uploads use raw fetch) |
| `@fontsource/roboto` | 0 | **unused** |
| `tailwindcss-scoped-groups` | 0 | **unused**, not in tailwind plugins |

Four overlapping UI kits (MUI, NextUI, Material Tailwind, Radix/shadcn) and two chart libraries are declared. `devDependencies` holds only `autoprefixer`, `postcss`, `tailwindcss`.

---

## 2. Hardcoded values

### 2.1 Backend base URL (40 occurrences in 36 files)

Every slice inlines `https://leather-for-luxury.vercel.app/api/v1/...`. Full list:

| File:line | URL |
|---|---|
| `redux/category/allCategoriesSlice.js:5` | `/category` |
| `redux/category/categoryByIdSlice.js:5` | `/category/ById` |
| `redux/category/categorySlice.js:5,6` | `/category`, `/category/ById` (dead file) |
| `redux/category/createCategorySlice.js:6` | `/category/create-category` |
| `redux/category/deleteCategoryByIdSlice.js:5` | `/category/delete` |
| `redux/category/updateCategoryDataSlice.js:11` | `/category/update/` |
| `redux/color/getColorSlice.js:11` | `/product/all/colors` |
| `redux/heroBanner/allHeroBannerSlice.js:9` | `/banner/all-topBanner` |
| `redux/heroBanner/heroBannerByIdSlice.js:5` | `/banner/Top-Banner` |
| `redux/heroBanner/updateHeroBannerSlice.js:11` | `/banner/Update-Top-Banner/` |
| `redux/order/createOrderSlice.js:20` | `/order/create-order` |
| `redux/order/getAllOrderSlice.js:33` | `/order/all-order` |
| `redux/order/getOrderByIdSlice.js:17` | `/order/ById/` |
| `redux/order/getOrderByUserSlice.js:17` | `/order/User/` |
| `redux/order/updateOrderSlice.js:16` | `/order/update/` |
| `redux/parentCategory/allParentCategorySlice.js:9` | `/parent-category` |
| `redux/parentCategory/createParentCategorySlice.js:8` | `/parent-category/create-parent` |
| `redux/parentCategory/deleteParentCategoryByIdSlice.js:5` | `/parent-category/delete` |
| `redux/parentCategory/parentCategoryByIdSlice.js:5` | `/parent-category/ById` |
| `redux/parentCategory/parentCategorySlice.js:5` | `/category/delete-parent` (dead file, wrong path) |
| `redux/parentCategory/updateParentCategoryDataSlice.js:11` | `/parent-category/update/` |
| `redux/product/allProductsSlice.js:34` | `/product` |
| `redux/product/createProductSlice.js:9` | `/product/create-product` |
| `redux/product/deleteProductByIdSlice.js:9` | `/product/delete/` |
| `redux/product/productByIdSlice.js:9` | `/product/ById/` |
| `redux/product/productBySlugSlice.js:10` | `/product/` |
| `redux/product/updateProductDataSlice.js:9` | `/product/update/` |
| `redux/rating/createRatingSlice.js:10` | **`http://`** `/product/rating` |
| `redux/rating/ratingByProductIdSlice.js:10` | **`http://`** `/product/product/` |
| `redux/user/createUserSlice.js:15` | `/user/create-user` |
| `redux/user/userLoginSlice.js:15` | `/auth/login` |
| `redux/video/allVideoBannerSlice.js:9` | `/banner/all-VideoBanner` |
| `redux/video/updateVideoBannerSlice.js:11` | `/banner/Update-Video-Banner/` |
| `redux/video/videoBannerByIdSlice.js:5` | `/banner/Video-Banner` |

### 2.2 Secrets and third-party identifiers

| File:line | Value | Notes |
|---|---|---|
| `utils/localStorageUtil.js:3` | `SECRET_KEY = "Tajwar@00452268"` | AES key shipped in the browser bundle. Present in 4 commits since 2024-10. Must be treated as burned. |
| `components/ui/components/shop/card.js:59` | same key | encrypts product id into `localStorage["wc_di"]` |
| `app/(UserPage)/products/[productName]/page.js:59` | same key | decrypts it into `PID`, which is never used |
| `utils/uploadToCloudinary.js:5,10` | preset `LeatherForLuxury`, cloud `dzmhtdw6b` | unsigned upload preset callable by anyone |
| `utils/uploadVidToCloudinary.js:5,11` | same | |
| `next.config.mjs:4` | `res.cloudinary.com` | image allow-list |
| `app/(AdminPage)/admin/orderNo/[orderId]/page.js:212` | `blob:https://mern-admin-pi.vercel.app/0a39bbe8-...` | dead blob URL from a different project wrapping the invoice download button |

No `process.env` reference exists anywhere in the codebase. No `.env*` file exists or was ever committed.

### 2.3 Personal data shipped in markup

| File:line | Value |
|---|---|
| `app/(UserPage)/myAccount/editAddress/page.js:15-19` | a real name, street address in Dhaka, phone number and Gmail address rendered to every user as "their" address |
| `components/ui/components/admin/customers/allCustomers.js:42-64` | mock customer name/email |
| `components/ui/components/admin/customers/customerOrder.js:39-60` | mock order PII |

### 2.4 Business constants scattered

| Constant | Locations |
|---|---|
| Shipping 60 / 100 / 120 | `checkout/page.js:27,570-601`, `cart/page.js:11,203-229`, `orderDetailsOnOrderUserPage.js:71` (₹60), `orderDetails.js:66` (৳100), `admin/orderNo/[orderId]/page.js:185` ($60) |
| Currency symbol | `$` on product/cart/checkout/admin list pages; `৳` on order pages, cards, range bar; `₹` on admin dashboard, admin price inputs, one order-detail component |
| Country `"Bangladesh"`, status `"Pending"` | `checkout/page.js:175,177` |
| Districts array (5 items) | `checkout/page.js:43`, `myAccount/editAddress/billing/page.js:21` |
| Phone length 11, zip length 4 | `checkout/page.js:148,153`, `billing/page.js:94,99` |
| Price slider max `18000`, step `60`, minDistance `100` | `shop/rangeBar.js:10,44-45`, `shop/page.js:379,418`, `productCategory/[...slug]/page.js:400,439` |
| Order statuses `"Pending" "Processing" "Delivered" "Cancel" "Status"` | `admin/orders/page.js:17-123`, `orders/orderRow.js:42-87`, `orders/recentOrders.js:69,176`, `orders/deleteVisible.js:46`, `dashboard/orderStats.js:27-33`, `customers/customerOrder.js:64-73` |
| Role `'admin'`, storage key `'accessToken'` | `admin/layout.js:16,21`, `admin/page.js:39-59`, `dashboard/topBar.js:12`, `dashboard/sideBar.js:20`, 8 storefront files |
| localStorage keys `wc_di`, `obfuscatedKey`, `categoryId`, `parentCategoryId`, `parentCategoryId ` (trailing space), `selectedShipping`, `userEmail`, `cart`, `orderID` | see §4.1 for the key-mismatch bugs |
| Mongo ObjectId regex `^[a-fA-F0-9]{24}$` | 10 admin files |
| `setTimeout(..., 2000)` refetch delay | 10 admin call sites |
| Toast options object | repeated 14 times |
| Cloudinary folder templates `Category/${name}`, `Product/${name}`, `${folder}/${color}`, `Banner`, `Video` | `addCategory.js:78`, `updateCateogories.js:118`, `addParentCategory.js:59`, `updateParentCategories.js:89`, `addProduct.js:214,244`, `updateProducts.js:372,406`, `updateBanner.js:109`, `updateMainBanner.js:59`, `updateVideoBanner.js:82` |
| Brand strings `"Tithi"`, `"Tithi Admin"`, `"My Company"`, `"Leather For Luxury"`, `"London, England"` | `app/layout.js:338`, `admin/dashboard/sideBar.js:62`, `footer.js:142`, `admin/orderNo/[orderId]/page.js:86-89` |
| Hex colours `#E8A811`, `#ece1d3`, `#a9a9a9`, `#424242`, `rgba(0,0,0,0.67)` etc. as inline styles | 40+ sites across layout, shop pages, sidebar, cards |
| Dev port 4000 | `package.json` |

---

## 3. API calls by endpoint

### 3.1 Endpoint definitions (one per slice, no sharing)

| Method | Endpoint | Defined in | Dispatched from (files) |
|---|---|---|---|
| GET | `/category` | `allCategoriesSlice.js` (+ dead `categorySlice.js`) | **9**: shop/page, productCategory/[...slug]/page, admin/categories/page, sideBar, navMenu, admin/products/searchForm, admin/products/updateProducts, admin/products/addProduct, admin/categories/allCategories |
| GET | `/category/ById/:id` | `categoryByIdSlice.js` (+ dead) | 3: admin/products/deleteVisible (**wrong thunk, passes a product id**), admin/categories/updateCateogories, admin/categories/deleteVisible |
| POST | `/category/create-category` | `createCategorySlice.js` | 1 |
| PATCH | `/category/update/:id` | `updateCategoryDataSlice.js` | 1 |
| DELETE | `/category/delete/:id` | `deleteCategoryByIdSlice.js` | 1 |
| GET | `/parent-category` | `allParentCategorySlice.js` | **9**: shop/page, productCategory page, admin/parentCategories/page, sideBar, productSection, navMenu, admin/parentCategories/allParentCategories, admin/categories/updateCateogories, admin/categories/addCategory |
| GET | `/parent-category/ById/:id` | `parentCategoryByIdSlice.js` | 2 |
| POST | `/parent-category/create-parent` | `createParentCategorySlice.js` (raw fetch) | 1 |
| PATCH | `/parent-category/update/:id` | `updateParentCategoryDataSlice.js` | 1 |
| DELETE | `/parent-category/delete/:id` | `deleteParentCategoryByIdSlice.js` | 1 |
| DELETE | `/category/delete-parent/:id` | dead `parentCategorySlice.js` | 0 |
| GET | `/product?page&limit&searchTerm&categoryId&parentCategoryId&startPrice&endPrice&colorName&sortOrder&sortBy&inStock&onSale` | `allProductsSlice.js` | **8**: shop/page, productCategory page, admin/products/page, cart.js (carousel), sideBar, navMenu, shop/infiniteScroll, admin/products/allProducts |
| GET | `/product/:slug` | `productBySlugSlice.js` | 1 |
| GET | `/product/ById/:id` | `productByIdSlice.js` | 2: shop/card (per card on click), admin/products/updateProducts |
| GET | `/product/all/colors` | `getColorSlice.js` | 1 (rendered twice per shop page, so 2 fetches) |
| POST | `/product/create-product` | `createProductSlice.js` | 1 |
| PATCH | `/product/update/:id` | `updateProductDataSlice.js` | 1 |
| DELETE | `/product/delete/:id` | `deleteProductByIdSlice.js` | 1 |
| POST | `/product/rating` (**http**) | `createRatingSlice.js` | 1 |
| GET | `/product/product/:productId` (**http**) | `ratingByProductIdSlice.js` | 1 |
| GET | `/banner/all-topBanner` | `allHeroBannerSlice.js` | **5**: admin/mainBanner/page, admin/heroBanner/page, banner.js, admin/mainBanner/allMainBanner, admin/heroBanner/allHeroBanners |
| GET | `/banner/Top-Banner/:id` | `heroBannerByIdSlice.js` | 2 (hero + "main" banner, same data) |
| PATCH | `/banner/Update-Top-Banner/:id` | `updateHeroBannerSlice.js` | 2 |
| GET | `/banner/all-VideoBanner` | `allVideoBannerSlice.js` | 2 |
| GET | `/banner/Video-Banner/:id` | `videoBannerByIdSlice.js` | 1 |
| PATCH | `/banner/Update-Video-Banner/:id` | `updateVideoBannerSlice.js` | 1 |
| POST | `/order/create-order` | `createOrderSlice.js` | 1 |
| GET | `/order/all-order?page&limit&searchTerm&status&email&startDate&endDate` | `getAllOrderSlice.js` | 2 (orderStats dispatches it **4 times serially** on mount) |
| GET | `/order/ById/:id` | `getOrderByIdSlice.js` | 4 |
| GET | `/order/User/:email` | `getOrderByUserSlice.js` | 1 |
| PATCH | `/order/update/:id` | `updateOrderSlice.js` | 2 |
| POST | `/user/create-user` | `createUserSlice.js` (raw fetch) | 1 |
| POST | `/auth/login` | `userLoginSlice.js` (raw fetch) | 3 (three copy-pasted login forms) |
| POST | `api.cloudinary.com/v1_1/dzmhtdw6b/image/upload` | `utils/uploadToCloudinary.js` | 8 admin components, called directly from JSX handlers |
| POST | `api.cloudinary.com/v1_1/dzmhtdw6b/video/upload` | `utils/uploadVidToCloudinary.js` | 1 |

### 3.2 Duplicate and redundant fetch patterns

- **Layout-level double fetch on every page.** `NavMenu` (`navMenu.js:64,67`) and `SideBar` (`sideBar.js:75,76`) are mounted by the root layout on every route and each dispatch `fetchAllParentCategories` + `fetchAllCategories` on mount. Shop pages then dispatch both again (`shop/page.js:41,43`), and `productSection.js:20` a fourth time on the home page. `sideBar.js:77` re-runs on `isLoggedIn` change.
- **Admin drawers are always mounted** (translated off-screen by CSS), so `/admin/products` fires `fetchAllCategories` 3 times and `/admin/categories` fires `fetchAllParentCategories` twice on load.
- **`orderStats.js:23-34`**: four sequential awaited `fetchAllOrders` calls into the same slice to derive four counters.
- **Undebounced search** refetches on every keystroke: `admin/categories/page.js:132-136`, `admin/products/page.js:135-141`. Category search passes `{searchTerm}` to a thunk that ignores its argument (`allCategoriesSlice.js:9`).
- **Refetch-after-mutation is a `setTimeout(2000)`** instead of awaiting the thunk, in 10 admin sites.
- **`cart.js` (related-products carousel)** on the product page dispatches `fetchAllProducts({searchTerm})` into the *same* `allProducts` slice the shop page paginates, then stores the result in local state and ignores the slice.
- **`shop/card.js:79`** dispatches `fetchProductById` per card into one shared slice; every card watches that slice, so a click on one card can flip state on another (see §4.1).
- **No caching at any layer**: no RTK Query, no `fetch` cache options, no Redis, no HTTP cache headers. Every navigation refetches.
- **Response shapes are guessed per slice**: `response.data.data` in most, `response.data` in `createProduct`/`updateProductData`/`deleteProductById`, `{orders, meta}` re-wrapped in the order/product list slices. Rejection payloads vary between `error.response?.data` (object), `.data.message` (string), `error.status`, `error.message`, and un-caught throws.

---

## 4. Bugs, anti-patterns, dead code

### 4.1 Confirmed bugs (highest impact first)

| # | File:line | Defect |
|---|---|---|
| 1 | `app/(UserPage)/shop/page.js:157,174` | `localStorageUtil` is used but **never imported**. Clicking any category in the shop nav throws `ReferenceError`. |
| 2 | `app/(UserPage)/(checkout)/checkout/page.js:178` vs `:618` | Order submits `totalPrice: cartTotal`; the displayed total includes shipping. **Shipping is never charged.** |
| 3 | `checkout/page.js:181` | `dispatch(createOrder()).unwrap()` without `await` or `.catch` → unhandled rejection; `error` from the slice is never rendered, so a failed order shows nothing. `:182` checks `status === "succeeded"` from the stale closure, so the reset branch is dead. |
| 4 | `checkout/page.js:236-244` | Coupon `<input id="name" value={formState.name}>` shares id and state with the billing name input at `:289`. Typing a coupon overwrites the customer's name. |
| 5 | `checkout/page.js:114-119` | Reads `localStorage.getItem("selectedShipping")` raw although it was written AES-encrypted via `localStorageUtil` → `Number(ciphertext) = NaN`. Masked only because a second effect at `:198-205` reads it correctly afterwards. |
| 6 | `app/(UserPage)/products/[productName]/page.js:62` | Bare `localStorage.getItem` **during render** → `ReferenceError` on server prerender / hydration mismatch. The decrypted `PID` is never used. |
| 7 | `products/[productName]/page.js:623-828` | The entire mobile pane is hardcoded ("A4 File Bag Series 2", `$1350` / `$3500`, "Black, Chocolate") and its ADD TO CART lacks the out-of-stock guard the desktop pane has at `:511`. |
| 8 | `products/[productName]/page.js:72-75` | `window.innerWidth` read during render; `setApi={isLargeScreen && setThumbnailApi}` (`:222,:328`) passes `false` to embla. |
| 9 | `components/ui/components/navBar/navMenu.js:76-78` | Early `return` before `useRef` (`:127`) and `useEffect` (`:129`). A failed category fetch → "Rendered fewer hooks than expected" → the whole layout unmounts. |
| 10 | `components/ui/components/productCart/shoppingCart.js:115-117` | Renders the literal `1` between the −/+ buttons instead of `{item.quantity}`. |
| 11 | `app/(UserPage)/(checkout)/cart/page.js:146,153` | Mobile `onClick={() => { handleDecrementItem }}` references the function without calling it. `:161` shows the whole-cart total as each line's subtotal. |
| 12 | `redux/cart/cartSlicer.js:18` | Stock guard checks `item.availableQuantity <= 0` but no caller sends that field (`shop/card.js:31-39`, product page `:36-44`) → out-of-stock items are addable; `incrementItem` (`:52`) has no cap. `total` is stored separately from `items` and can drift. |
| 13 | `redux/store.js:98-100` | `preloadedState.cart` read from localStorage at module load → server renders empty cart, client hydrates with a filled one → hydration mismatch on every page showing cart state. Cart is also double-JSON-serialised (`:44,:55` + `localStorageUtil`). |
| 14 | `app/(UserPage)/myAccount/orders/page.js:19` | `jwtDecode(token)` with no null check; child effect runs before the layout's redirect → throws for logged-out visitors. |
| 15 | `app/(UserPage)/myAccount/page.js:32-36` | Logout removes `userEmail`, not `accessToken`. The button does nothing. |
| 16 | `app/(UserPage)/(AuthPages)/my-account/page.js:62-90` | Registration generates a `Math.random()` password, never shows or emails it (`templateParams` built and discarded), so the user can never log in again. |
| 17 | `app/(UserPage)/shop/productCategory/[...slug]/page.js:177` | Writes key `"parentCategoryId "` (trailing space); `:129` reads `"parentCategoryId"`. `:337` has `{!parentRes && (...parentRes.length...)}` (inverted, then dereferenced). |
| 18 | `shop/card.js:338` | `<Link href="/product/1">` on every product title; the route is `/products/[slug]`. |
| 19 | `shop/card.js:59-66` vs `sideBar.js:145`, `navMenu.js:119` | Two incompatible product-id handoff schemes (`wc_di` raw AES vs `obfuscatedKey` via `localStorageUtil`); the product page reads only `wc_di` and then discards it. Deep links and refresh depend on localStorage state. |
| 20 | `components/ui/components/cart.js:22-23,86` | `window.innerWidth` during render (hydration), inverted flag name, `slidesToShow` is not an embla option; `:86` tests `products.length` while neighbours test `productResult.length`. |
| 21 | `shop/infiniteScroll.js:39-85` | Effect reads `slug`/`filterSearch` but deps are `[dispatch, pageNumber, maxPages]` → pages 2+ ignore filters applied after mount. `:32-36` self-triggering effect never adopts new `initialProducts` once non-empty. `catch {}` at `:77`. |
| 22 | `shop/rangeBar.js:34`, `eachColorBar.js:42`, `stockStatus.js:34`, `sortingSection.js:25` | Filters sync to the parent via an uncleared `setTimeout(500)` toggling a stale boolean. Rapid clicks lose filters; timers fire after unmount. `rangeBar.js:33` passes `shallow: true`, a Pages-Router-only option. |
| 23 | `components/ui/components/admin/products/deleteVisible.js:1,26` | Dispatches `fetchCategoryById(productId)` and reads `state.productById` → modal shows the wrong (or no) product name and pollutes the category slice. |
| 24 | `admin/mainBanner/*` (3 files) | The whole "Main Banner" feature is wired to the hero-banner slice and thunks; page title says "Hero Banner". `updateMainBanner.js:85` sends `title: undefined`. |
| 25 | `app/(AdminPage)/admin/products/page.js:147,154` | Uses previous state (`categoryId`, `selectedPrice`) instead of the handler argument; sends `sortBy: undefined` → literal `"undefined"` in the query string. |
| 26 | `admin/products/updateProducts.js:365-368,441` | Validates `size`/`warranty` fields that have no inputs; on failure calls `doneUpdate()`, the **success** toast. `addProduct.js:207-208` validation can never fail (`[]` truthy, `"0"` truthy). |
| 27 | `admin/orders/deleteVisible.js:45-46`, `recentOrders.js:179-197` | Success toast fires before the un-awaited PATCH. |
| 28 | `updateCateogories.js:110-121`, `updateParentCategories.js:82-92`, `updateBanner.js:102-113` | When no new file is chosen, the existing Cloudinary URL string is passed to `uploadToCloudinary` as a "file" → duplicate asset on every save. |
| 29 | `updateBanner.js:311,398`, `updateProducts.js:801,934,1106,1193`, `addProduct.js:832`, `updateMainBanner.js:235`, `updateVideoBanner.js:223` | `URL.createObjectURL()` called during render, never revoked → blob leak per keystroke. |
| 30 | `admin/orderNo/[orderId]/page.js:141-163,55,210` | `orderItems.map` returns keyless fragments; `order.orderItems` dereferenced without `?.`; empty `catch`; jsPDF's html2canvas dependency never imported so the PDF button fails silently inside that catch. |
| 31 | 6 admin list components (`allCategories.js:85` etc.) | `{error && <p>Error: {error}</p>}` where `error` is an object → "Objects are not valid as a React child". |
| 32 | 10 slices | `error.response.data` without optional chaining → a network failure throws inside the thunk instead of rejecting cleanly. |
| 33 | `admin/layout.js:18`, `admin/page.js:57`, `app/layout.js:31`, `myAccount/layout.js:17` | `jwtDecode` not in try/catch; a malformed token throws and the redirect never fires. |
| 34 | `app/(UserPage)/(checkout)/cart/style.css:2-14` | Unscoped `table, thead, tbody, tr, td { display:block }` in a globally-applied stylesheet → breaks every table in the app once `/cart` has been visited. |
| 35 | `checkout/page.js:125`, `recentOrders.js:101` | Relative `router.push("checkout/orderReceived/...")` / `push("orderNo/...")`. |
| 36 | `app/layout.js:425` + `my-account/page.js:364` | Two footers on `/my-account`. |
| 37 | `components/ui/components/footer.js:117-134` | Subscribe form has no handler; submits a full-page GET. |
| 38 | `accordionSection.js:38-64` | Failed review POST is swallowed, form cleared, `rating` key dropped, then an un-tried `await` → unhandled rejection. Flowbite accordion never initialised. |
| 39 | `banner.js:36-37` | `heroBanners[0]?.image?.slice(2)` can be `undefined`, later `.length` → crash. |
| 40 | `productCategory` and `shop` page filter effects | `if (!productsFetched)` latch means URL changes don't refetch; child filters reach in and flip the parent's flag via props. |

### 4.2 Structural anti-patterns

- **Client root layout.** `app/layout.js` is 434 lines, `"use client"`, holds the Redux Provider around `<html>`, auth bootstrap, four drawer states, ~340 lines of nav JSX including a dead Flowbite drawer (`:149-303`), and route-based chrome switching (`pathname.startsWith("/admin")`) that route-group layouts should own. `(UserPage)` has no layout of its own.
- **Zero App Router conventions used.** No `metadata`, `generateMetadata`, `loading.js`, `error.js`, `not-found.js`, `global-error.js`, `middleware.js`, route handlers, or server actions. `useSearchParams` is used without `Suspense`, silenced by `experimental.missingSuspenseWithCSRBailout: false` in `next.config.mjs`.
- **Params parsed by hand.** `usePathname().split("/").pop()` instead of `params` in `products/[productName]`, `orderReceived/[orderId]`, `viewOrder/[productId]`, `admin/orderNo/[orderId]`.
- **Route naming.** `/my-account` (login) vs `/myAccount` (dashboard); `viewOrder/[productId]` takes an order id; `productCategory/[...slug]` ignores its slug segments and reads ids from localStorage; `(checkout)/layout.js:9` references non-existent `/order-complete`.
- **One slice per HTTP call** (36 slices, 33 reducers registered) with a bespoke shape each (`isLoading` vs `loading` vs `status`; `error` payload types vary). Slice names collide (`updateOrderSlice` is named `updateCategory`; two `fetchAllCategories`, two `deleteParentCategoryById`, two thunks with type `"order/fetchById"`).
- **Copy-paste at file level.** `shop/page.js` ≈ `productCategory/[...slug]/page.js` (~90 %, already diverged into bugs 1, 17); `addProduct.js` (1213) ≈ `updateProducts.js` (1320); 4 identical `deleteVisible.js` + 1 stub; 2 byte-identical `searchForm.js`; 3 identical banner page shells; `checkout/page.js` billing form ≡ `editAddress/billing/page.js`; `orderDetails.js` ≈ `orderDetailsOnOrderUserPage.js`; `sideBar.js` ≈ `navMenu.js` (search + handlers); 3 login forms; 2 order-detail routes; 2 logout implementations; `getPageNumbers` + pagination block duplicated; click-outside effect ×5; `isValidId` ×10; export/import toolbar ×3; toast options ×14.
- **Inline SVG duplication.** Close-X ×16, chevron ×7, upload-cloud ×10, plus ×6, trash ×5, sidebar bullet ×7, spinner ×5. `components/ui/icon/` holds 2 icons.
- **Oversized files.** `updateProducts.js` 1320, `addProduct.js` 1213, `products/[productName]/page.js` 856, `checkout/page.js` 694, `admin/dashboard/sideBar.js` 626, `ui/sidebar.jsx` 620 (dead), `updateBanner.js` 524, two shop pages ~490 each, `sideBar.js` 478, `admin/categories/page.js` 458, `app/layout.js` 434.
- **Component naming.** Lowercase or anonymous default exports in ~25 files (`function page`, `function cart`, `export default function ()`), so DevTools and Fast Refresh lose names. Filename typo `updateCateogories.js`. `categories/allCategories.js` exports `AllProducts`.
- **Direct state mutation** in `updateMainBanner.js:74-77`, `addProduct.js:104-114,241`, `updateProducts.js:403`; stale-closure `setX(!x)` toggles in ~20 sites.
- **Errors swallowed.** 25+ empty `catch {}` blocks. User feedback is `alert()` (`shop/card.js:27`, `product page:32`, `accordionSection.js:42`) or nothing.
- **Debug residue in UI**: `asdf` (`updateProducts.js:631`, `dashboard/page.js:50`), `"asdfasd"` (`updateBanner.js:55`), `value="sdf"` (`updateCustomer.js:37-49`), `className="radif …"` (`topBar.js:20`).

### 4.3 Dead files (unreachable from any route; verified by import graph)

| File | Lines | Note |
|---|---|---|
| `components/app-sidebar.js` | 20 | shadcn stub |
| `components/shopSideBar.js` | 0 | empty file |
| `components/ui/sidebar.jsx` | 620 | only imported by app-sidebar |
| `components/ui/sheet.jsx`, `tooltip.jsx`, `skeleton.jsx`, `separator.jsx`, `input.jsx` | ~250 | only imported by sidebar.jsx |
| `components/ui/table.jsx` | ~90 | no importers |
| `components/ui/chart.jsx` | 308 | only by `weeklySales.js`, whose import is commented out |
| `components/ui/components/admin/dashboard/weeklySales.js` | 121 | commented-out import at `dashboard/page.js:5` |
| `components/ui/components/collection.js` | ~40 | commented-out at `app/page.js:27` |
| `components/ui/components/shop/topRatedProducts.js` | ~60 | no importers |
| `components/ui/components/admin/parentCategories/searchForm.js` | ~40 | byte-identical to categories/searchForm.js |
| `hooks/use-mobile.jsx` | 19 | only by sidebar.jsx |
| `hooks/useScrollRestoration.js` | 16 | no importers |
| `redux/category/categorySlice.js` | 88 | not registered in store |
| `redux/parentCategory/parentCategorySlice.js` | 53 | not registered in store |

Reachable but effectively dead: the entire admin customers branch (`admin/customers/page.js`, `customer-order/[customerId]/page.js`, 4 customer components; sidebar link commented out at `dashboard/sideBar.js:509-529`); placeholder pages `admin/topBanner`, `admin/midBanner`, `admin/products/[productId]`, `admin/settings`; `myAccount/editAccount` (no handlers), `myAccount/editAddress` (hardcoded PII), `myAccount/editAddress/billing` (no submit); `app/(UserPage)/products/[productName]/style.css` (duplicate of `shop/scrollbar.css`, both imported); `app/globals.css:5-17` legacy theme vars.

Removing the dead subtree also removes the runtime need for `@radix-ui/react-dialog`, `react-separator`, `react-tooltip` and (after replacing the dashboard placeholders) `recharts`.

### 4.4 Unused public assets

`public/` is 58 MB. `public/products/` (44 MB, 100 files) and `public/fonts/` (3.4 MB, Futura TTFs with no `@font-face`) have zero references. Of 45 root-level images only 5 are referenced (`login-office.jpg`, `no-result.svg`, `profile.jpg`, `section2.jpg`, `topRated.jpg`). Roughly 50 MB is shippable dead weight.

### 4.5 Circular imports

None detected (import graph over all source files).

---

## 5. Security

| # | Issue | Where |
|---|---|---|
| S1 | **Backend writes are unauthenticated from the client.** No thunk sends `Authorization`. All admin create/update/delete calls, order status updates, and banner updates are made anonymously. If the backend does not enforce auth independently, anyone can mutate the catalogue. | all `redux/*` slices |
| S2 | **Admin gate is client-side and forgeable.** JWT decoded (not verified) in a `useEffect`; checks `role === 'admin'`; never checks `exp`; not in try/catch. Content renders before the redirect. | `admin/layout.js:14-30` |
| S3 | **Tokens in localStorage.** XSS-exfiltratable. AES wrapping with a bundled constant key is obfuscation, not protection. | `utils/localStorageUtil.js`, 12 call sites |
| S4 | **AES key committed to git** since 2024-10 in 4 commits. Must be rotated and the scheme replaced. | `localStorageUtil.js:3`, `card.js:59`, product page `:59` |
| S5 | **Unsigned Cloudinary preset in the bundle.** Anyone can upload arbitrary files to the account. Folder path is built from unsanitised user input (`Product/${formData.name}`), allowing path injection. No size/MIME validation. | `utils/upload*.js`, 9 admin components |
| S6 | **Two endpoints on plain HTTP** → mixed-content block on HTTPS, cleartext otherwise. | `createRatingSlice.js:10`, `ratingByProductIdSlice.js:10` |
| S7 | **No server-side input validation anywhere.** Forms validate loosely on the client (or not at all: `updateCateogories.js:113` returns silently) and post raw strings. Prices sent as strings; no `discountedPrice <= originalPrice` check. | checkout, admin forms |
| S8 | **Weak generated password** via `Math.random()`, never delivered to the user. | `my-account/page.js:62` |
| S9 | **Real personal data in source.** | `myAccount/editAddress/page.js:15-19` |
| S10 | **No security headers** (`CSP`, `X-Frame-Options`, `Referrer-Policy`, `HSTS` on the app itself). No CORS policy because there are no API routes yet. | `next.config.mjs` |
| S11 | `dangerouslySetInnerHTML` in dead shadcn chart code only. Remote image URLs from the API rendered in raw `<img>` in admin lists, bypassing `next/image`'s host allow-list. | `ui/chart.jsx:61`; `allCategories.js:112` etc. |
| S12 | Plaintext `localStorage.setItem("orderID")` bypassing the util, never read. | `recentOrders.js:100` |

---

## 6. Performance

| # | Issue |
|---|---|
| P1 | **Entire app is client-rendered** because of `app/layout.js:1`. No RSC, no streaming, no static generation, no metadata. Every route ships the Redux store + all 36 slices + MUI + Radix + lucide + react-icons + flowbite. |
| P2 | **No caching at any layer.** Every page load refetches categories 3 to 4 times (§3.2), colors twice, products via multiple slices. |
| P3 | **Serial N+1 in dashboard**: 4 awaited `fetchAllOrders` (`orderStats.js:23-34`). |
| P4 | **Always-mounted drawers** in admin pages run their fetch effects on every page load. |
| P5 | **Per-card timers and images**: `shop/card.js:99-106` starts a 5 s `setInterval` per card on mobile; each card renders two 500×500 images with no `sizes`/`loading` hints; infinite scroll multiplies both. |
| P6 | **LCP hero** uses deprecated `layout="fill"` with no `priority` (`banner.js:87`). No `next/image` in the app sets `sizes`, `priority`, or `placeholder`. 20 raw `<img>` tags in admin. |
| P7 | **Bundle**: four UI kits and two chart libraries declared; MUI barrel imports (`import { Skeleton } from "@mui/material"`) in 7 admin files; `flowbite` imported for a component that never initialises it; `crypto-js` shipped for an obfuscation scheme. |
| P8 | **Blob URL leaks** on every re-render in 5 admin forms (§4.1 #29). |
| P9 | **`experimental.missingSuspenseWithCSRBailout: false`** opts shop routes out of static rendering to silence a missing `Suspense`. |
| P10 | ~50 MB of unreferenced assets in `public/` inflate the deploy artifact. |
| P11 | Undebounced search dispatches on every keystroke in two admin pages; 500 ms/2000 ms `setTimeout` used as synchronisation in 15+ sites. |

---

## 7. TypeScript and lint

- **Not a TypeScript project.** 139 of 140 source files are `.js`/`.jsx`. `typescript`, `@types/react`, `@types/node` sit in `dependencies` with no `tsconfig.json`; `.gitignore` ignores `next-env.d.ts`. `components.json` declares `"tsx": false` while `components/imageEffect.tsx` exists (it is fully typed, no `any`, but lacks `"use client"` and passes `alt=""`). On first `next build` Next will write an untracked `tsconfig.json` with `strict: false` and drop `jsconfig.json`.
- **No ESLint config.** `next lint` has never been run; there is no `.eslintrc*`, no `eslint` or `eslint-config-next` dependency. Running it will prompt interactively.
- **No Prettier.** Mixed 2/4-space indentation, mixed quote styles, mixed semicolon usage across files.
- **Lint violations that a default `next/core-web-vitals` config would flag**: `react-hooks/rules-of-hooks` (navMenu.js:76), `react-hooks/exhaustive-deps` in 20+ effects, `@next/next/no-img-element` ×20, `jsx-a11y/alt-text` (accordionSection.js:211, imageEffect.tsx:54), invalid DOM props (`autocomplete`, `disabled` on `<a>`, `objectFit`/`layout` on `next/image`), controlled inputs with `value` and no `onChange` (settings, updateCustomer), duplicate `id` attributes (7× `id="name"` in editAccount, 2× in checkout), missing `key` props, unused variables in nearly every file (see agent-level lists in §4).
- **Implicit `any` everywhere** by virtue of JS: no request/response types, no props types, no slice state types.
- **`console.*`**: 9 remaining, all in `admin/video/updateVideoBanner.js:33-116`. Three `alert()` calls.

---

## 8. Things that constrain the refactor

1. **The backend is currently down** (HTTP 500 on all probed endpoints, 2026-09-21). Response shapes have been inferred from slice code (`{ data, meta? }`, errors as `{ message }`). Live verification in Phase 4 may need to wait for the backend or use recorded fixtures.
2. **No tests, no lint baseline**: every behaviour-preserving claim must be checked by build + manual/scripted flows.
3. **Backend auth model is unknown**: the login response carries `accessToken` with `email` and `role` claims. Whether the backend enforces `Authorization` on writes cannot be confirmed while it is down. The proxy will attach the token server-side either way.
4. **Cloudinary uploads are unsigned from the browser.** Moving them behind the proxy requires either a signed-upload flow (needs the API secret as a server env var) or keeping the unsigned preset as a `NEXT_PUBLIC_` value. This is a decision for the plan.
5. **The AES localStorage scheme** is load-bearing for auth, cart persistence, shipping selection, and category/product id handoff. Replacing it changes where state lives (cookies, URL params) and must be sequenced carefully.
6. **Bugs 1 to 12** are behaviour defects, not refactor side-effects. The refactor must decide per bug whether to preserve or fix; the plan lists each with a recommendation.
