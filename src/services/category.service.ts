import { API } from "@/config/constants";
import type { ApiEnvelope } from "@/types/api";
import type { Category, CategoryInput, ParentCategory, ParentCategoryInput } from "@/types/category";
import { http, unwrap } from "./_shared";

export const categoryService = {
  list: () => http.get<ApiEnvelope<Category[]>>(API.categories).then(unwrap),
  getById: (id: string) => http.get<ApiEnvelope<Category>>(API.category(id)).then(unwrap),
  create: (input: CategoryInput) => http.post<ApiEnvelope<Category>>(API.categories, input).then(unwrap),
  update: (id: string, input: Partial<CategoryInput>) =>
    http.patch<ApiEnvelope<Category>>(API.category(id), input).then(unwrap),
  remove: (id: string) => http.delete<ApiEnvelope<Category | null>>(API.category(id)).then(unwrap),
};

export const parentCategoryService = {
  list: () => http.get<ApiEnvelope<ParentCategory[]>>(API.parentCategories).then(unwrap),
  getById: (id: string) => http.get<ApiEnvelope<ParentCategory>>(API.parentCategory(id)).then(unwrap),
  create: (input: ParentCategoryInput) =>
    http.post<ApiEnvelope<ParentCategory>>(API.parentCategories, input).then(unwrap),
  update: (id: string, input: Partial<ParentCategoryInput>) =>
    http.patch<ApiEnvelope<ParentCategory>>(API.parentCategory(id), input).then(unwrap),
  remove: (id: string) => http.delete<ApiEnvelope<ParentCategory | null>>(API.parentCategory(id)).then(unwrap),
};
