import { categoryService } from "@/services/category.service";
import type { Category, CategoryInput } from "@/types/category";
import { createApiThunk, createRequestSlice } from "../create-request-slice";

// ---- thunks (same names as before) -------------------------------------------
export const fetchAllCategories = createApiThunk<Category[], void>("categories/fetchAll", () =>
  categoryService.list(),
);
export const fetchCategoryById = createApiThunk<Category, string>("categories/fetchById", (id) =>
  categoryService.getById(id),
);
export const createCategory = createApiThunk<Category, CategoryInput & { image?: string }>(
  "categories/create",
  (input) => categoryService.create({ ...input, image: input.image ?? "" }),
);
export const updateCategoryData = createApiThunk<Category, { id: string; categoryData: Partial<CategoryInput> }>(
  "categories/update",
  ({ id, categoryData }) => categoryService.update(id, categoryData),
);
export const deleteCategoryById = createApiThunk<Category | null, string>("categories/delete", (id) =>
  categoryService.remove(id),
);

// ---- slices (one per store key, shapes unchanged) ----------------------------
const list = createRequestSlice({
  name: "categories",
  thunk: fetchAllCategories,
  dataKey: "categories",
  initialData: [] as Category[],
});

const byId = createRequestSlice({
  name: "categoryById",
  thunk: fetchCategoryById,
  dataKey: "categoryData",
  initialData: null as Category | null,
});

const create = createRequestSlice({
  name: "createCategory",
  thunk: createCategory,
  dataKey: "category",
  initialData: null as Category | null,
  successMessage: "Category created successfully!",
});

const update = createRequestSlice({
  name: "updateCategoryData",
  thunk: updateCategoryData,
  dataKey: "categoryData",
  initialData: null as Category | null,
});

const remove = createRequestSlice({
  name: "deleteCategoryById",
  thunk: deleteCategoryById,
  dataKey: "deleted",
  initialData: null as Category | null,
  successMessage: "Category deleted successfully!",
});

export const categoriesReducer = list.reducer;
export const categoryByIdReducer = byId.reducer;
export const createCategoryReducer = create.reducer;
export const updateCategoryReducer = update.reducer;
export const deleteCategoryReducer = remove.reducer;
