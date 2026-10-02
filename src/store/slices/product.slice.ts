import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { productService } from "@/services/product.service";
import type { ApiEnvelope, Paginated, PaginationMeta } from "@/types/api";
import type { Product, ProductColor, ProductInput, ProductListQuery } from "@/types/product";
import { createApiThunk, createRequestSlice } from "../create-request-slice";

const emptyMeta: PaginationMeta = { total: 0, limit: 0, page: 0 };

// ---- thunks ------------------------------------------------------------------
export const fetchAllProducts = createApiThunk<{ products: Product[]; meta: PaginationMeta }, ProductListQuery | void>(
  "products/fetchAll",
  async (params) => {
    const res: Paginated<Product> = await productService.list(params ?? undefined);
    return { products: res.items, meta: res.meta };
  },
);
export const fetchProductById = createApiThunk<Product, string>("products/fetchById", (id) =>
  productService.getById(id),
);
export const fetchProductBySlug = createApiThunk<Product, string>("products/fetchBySlug", (slug) =>
  productService.getBySlug(slug),
);
export const createProduct = createApiThunk<ApiEnvelope<Product>, ProductInput>("products/create", (input) =>
  productService.create(input),
);
export const updateProductData = createApiThunk<ApiEnvelope<Product>, { id: string; updatedData: Partial<ProductInput> }>(
  "products/update",
  ({ id, updatedData }) => productService.update(id, updatedData),
);
export const deleteProductById = createApiThunk<ApiEnvelope<Product | null>, string>("products/delete", (id) =>
  productService.remove(id),
);
export const fetchColors = createApiThunk<ProductColor[], void>("colors/fetchColors", () => productService.colors());

// ---- slices ------------------------------------------------------------------
const list = createRequestSlice<"products", Product[], { products: Product[]; meta: PaginationMeta }, ProductListQuery | void, { meta: PaginationMeta }>({
  name: "allProducts",
  thunk: fetchAllProducts,
  dataKey: "products",
  initialData: [],
  initialExtra: { meta: emptyMeta },
  mapResult: (r) => r.products,
  onFulfilled: (state, result) => {
    state.meta = result.meta ?? emptyMeta;
  },
  reducers: {
    /** Reset the product grid (used when switching category / leaving the shop). */
    clearState: (state) => {
      state.products = [];
      state.meta = emptyMeta;
      state.isLoading = false;
      state.error = null;
    },
  },
});

const byId = createRequestSlice({
  name: "productById",
  thunk: fetchProductById,
  dataKey: "productData",
  initialData: null as Product | null,
});

const bySlug = createRequestSlice({
  name: "productBySlug",
  thunk: fetchProductBySlug,
  dataKey: "productData",
  initialData: null as Product | null,
});

const create = createRequestSlice({
  name: "createProduct",
  thunk: createProduct,
  dataKey: "product",
  initialData: null as ApiEnvelope<Product> | null,
  successMessage: "Product created successfully!",
});

const update = createRequestSlice<"result", unknown, ApiEnvelope<Product>, { id: string; updatedData: Partial<ProductInput> }, { success: boolean }>({
  name: "updateProduct",
  thunk: updateProductData,
  dataKey: "result",
  initialData: null,
  initialExtra: { success: false },
  onFulfilled: (state) => {
    state.success = true;
  },
});
const remove = createRequestSlice<"result", unknown, ApiEnvelope<Product | null>, string, { success: boolean }>({
  name: "deleteProduct",
  thunk: deleteProductById,
  dataKey: "result",
  initialData: null,
  initialExtra: { success: false },
  onFulfilled: (state) => {
    state.success = true;
  },
});

const colors = createRequestSlice<"colors", ProductColor[], ProductColor[], void, { status: "idle" | "loading" | "succeeded" | "failed" }>({
  name: "colors",
  thunk: fetchColors,
  dataKey: "colors",
  initialData: [],
  initialExtra: { status: "idle" },
  onPending: (state) => {
    state.status = "loading";
  },
  onFulfilled: (state) => {
    state.status = "succeeded";
  },
  onRejected: (state) => {
    state.status = "failed";
  },
});

export const clearState = list.actions.clearState as unknown as ActionCreatorWithoutPayload;
export const allProductsReducer = list.reducer;
export const productByIdReducer = byId.reducer;
export const productBySlugReducer = bySlug.reducer;
export const createProductReducer = create.reducer;
export const updateProductReducer = update.reducer;
export const deleteProductReducer = remove.reducer;
export const colorsReducer = colors.reducer;
