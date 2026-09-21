import { parentCategoryService } from "@/services/category.service";
import type { ParentCategory, ParentCategoryInput } from "@/types/category";
import { createApiThunk, createRequestSlice } from "../create-request-slice";

export const fetchAllParentCategories = createApiThunk<ParentCategory[], void>("parentCategories/fetchAll", () =>
  parentCategoryService.list(),
);
export const fetchParentCategoryById = createApiThunk<ParentCategory, string>("parentCategories/fetchById", (id) =>
  parentCategoryService.getById(id),
);
export const createParentCategory = createApiThunk<ParentCategory, ParentCategoryInput>(
  "parentCategories/create",
  (input) => parentCategoryService.create(input),
);
export const updateParentCategoryData = createApiThunk<
  ParentCategory,
  { id: string; categoryData: Partial<ParentCategoryInput> }
>("parentCategories/update", ({ id, categoryData }) => parentCategoryService.update(id, categoryData));
export const deleteParentCategoryById = createApiThunk<ParentCategory | null, string>(
  "parentCategories/delete",
  (id) => parentCategoryService.remove(id),
);

const list = createRequestSlice({
  name: "parentCategories",
  thunk: fetchAllParentCategories,
  dataKey: "parentCategories",
  initialData: [] as ParentCategory[],
});
const byId = createRequestSlice({
  name: "parentCategoryById",
  thunk: fetchParentCategoryById,
  dataKey: "parentCategoryData",
  initialData: null as ParentCategory | null,
});
const create = createRequestSlice({
  name: "createParentCategory",
  thunk: createParentCategory,
  dataKey: "parentCategory",
  initialData: null as ParentCategory | null,
  successMessage: "Parent category created successfully!",
});
const update = createRequestSlice({
  name: "updateParentCategoryData",
  thunk: updateParentCategoryData,
  dataKey: "parentCategoryData",
  initialData: null as ParentCategory | null,
});
const remove = createRequestSlice({
  name: "deleteParentCategoryById",
  thunk: deleteParentCategoryById,
  dataKey: "deleted",
  initialData: null as ParentCategory | null,
  successMessage: "Parent category deleted successfully!",
});

export const parentCategoriesReducer = list.reducer;
export const parentCategoryByIdReducer = byId.reducer;
export const createParentCategoryReducer = create.reducer;
export const updateParentCategoryReducer = update.reducer;
export const deleteParentCategoryReducer = remove.reducer;
