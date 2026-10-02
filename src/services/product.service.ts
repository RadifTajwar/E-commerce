import { API } from "@/config/constants";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type { Product, ProductColor, ProductInput, ProductListQuery, Rating, RatingInput } from "@/types/product";
import { http, unwrap, unwrapPaginated } from "./_shared";

/** Only send the filters the backend understands, and only when set. */
function toQuery(params: ProductListQuery = {}) {
  const hasRange = params.startPrice !== undefined && params.endPrice !== undefined;
  return {
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    categoryId: params.categoryId,
    parentCategoryId: params.parentCategoryId,
    startPrice: hasRange ? Number(params.startPrice) : undefined,
    endPrice: hasRange ? Number(params.endPrice) : undefined,
    colorName: params.colorName,
    sortBy: params.sortOrder ? params.sortBy : undefined,
    sortOrder: params.sortOrder,
    inStock: params.inStock,
    onSale: params.onSale,
  };
}

export const productService = {
  list: (params?: ProductListQuery): Promise<Paginated<Product>> =>
    http.get<ApiEnvelope<Product[]>>(API.products, { query: toQuery(params) }).then(unwrapPaginated),

  getBySlug: (slug: string) => http.get<ApiEnvelope<Product>>(API.productBySlug(slug)).then(unwrap),

  getById: (id: string) => http.get<ApiEnvelope<Product>>(API.product(id)).then(unwrap),

  create: (input: ProductInput) => http.post<ApiEnvelope<Product>>(API.products, input),

  update: (id: string, input: Partial<ProductInput>) => http.patch<ApiEnvelope<Product>>(API.product(id), input),

  remove: (id: string) => http.delete<ApiEnvelope<Product | null>>(API.product(id)),

  colors: () => http.get<ApiEnvelope<ProductColor[]>>(API.productColors).then(unwrap),

  ratings: (productId: string) => http.get<ApiEnvelope<Rating[]>>(API.productRatings(productId)).then(unwrap),

  createRating: (input: RatingInput) =>
    http.post<ApiEnvelope<Rating>>(API.productRatings(input.productId), input).then(unwrap),
};
