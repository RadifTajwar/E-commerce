import type { ListQuery, SortOrder } from "./api";

/** One colour variant of a product. */
export interface ProductColorDetail {
  colorId?: string;
  _id?: string;
  color: string;
  hex?: string;
  images: string[];
  quantity?: number;
  availableQuantity?: number;
}

export interface ProductDetails {
  additionalProductDetails?: Record<string, string>;
  size?: string[];
  warranty?: string;
}

export interface ProductLeather {
  title: string[];
  image: string | null;
}

/** Colour summary shown on cards and the product page. */
export interface ProductColorSummary {
  id?: string;
  colorName: string;
  hex?: string;
  availableQuantity?: number;
}

export interface Product {
  id: string;
  _id?: string;
  barcode?: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  categoryId?: string;
  parentCategoryId?: string;
  inStock: boolean;
  onSale?: boolean;
  originalPrice: number;
  discountedPrice: number;
  imageDefault: string;
  imageHover?: string;
  leather?: ProductLeather;
  color?: ProductColorSummary[];
  additionalDetails: ProductColorDetail[];
  productDetails?: ProductDetails;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload accepted by create/update. Images are already uploaded URLs. */
export type ProductInput = Omit<Product, "id" | "_id" | "createdAt" | "updatedAt" | "rating"> & {
  originalPrice: number | string;
  discountedPrice: number | string;
};

export interface ProductListQuery extends ListQuery {
  categoryId?: string;
  parentCategoryId?: string;
  startPrice?: number | string;
  endPrice?: number | string;
  colorName?: string;
  sortBy?: string;
  sortOrder?: SortOrder | "default";
  inStock?: boolean | string;
  onSale?: boolean | string;
}

export interface ProductColor {
  colorName: string;
  hex?: string;
  count?: number;
}

export interface Rating {
  _id?: string;
  productId: string;
  userName: string;
  userEmail: string;
  ratingStar: number;
  reviewText?: string;
  createdAt?: string;
}

export type RatingInput = Omit<Rating, "_id" | "createdAt">;
