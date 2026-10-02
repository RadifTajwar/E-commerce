export interface ParentCategory {
  id: string;
  _id?: string;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  image?: string;
  description?: string;
  parentCategoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInput {
  name: string;
  parentCategoryId: string;
  image?: string;
  description?: string;
}

export interface ParentCategoryInput {
  name: string;
  image?: string;
  description?: string;
}
