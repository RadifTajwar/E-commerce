import type { ProductDetails } from "@/types";

export type ProductFormMode = "create" | "edit";

/** The three colour fields the form collects per variant. */
export type ColorField = "colorName" | "hex" | "availableQuantity";

/** One colour row, in the shape the API stores colours in. */
export interface ProductFormColor {
  colorId?: string;
  colorName: string;
  hex: string;
  /** Kept as a string so the text input can hold a partially typed number. */
  availableQuantity: string;
}

/**
 * The gallery row belonging to the colour at the same index.
 * `images` mixes already-uploaded URLs (edit mode) with freshly picked files;
 * both are handed to `uploadService.image`, which returns strings untouched.
 */
export interface ProductFormDetail {
  colorId?: string;
  color: string;
  hex: string;
  quantity: number;
  images: Array<File | string>;
}

export interface ProductFormLeather {
  title: string[];
  image: File | string | null;
}

export interface ProductFormState {
  barcode: string;
  name: string;
  slug: string;
  description: string;
  /** Category display name (what the dropdown shows). */
  category: string;
  categoryId: string;
  parentCategoryId: string;
  onSale: boolean;
  originalPrice: string;
  discountedPrice: string;
  imageDefault: File | string | null;
  imageHover: File | string | null;
  leather: ProductFormLeather;
  color: ProductFormColor[];
  additionalDetails: ProductFormDetail[];
  productDetails: ProductDetails;
}

/** A fresh, empty form. A factory so no two forms ever share nested state. */
export function emptyProductForm(): ProductFormState {
  return {
    barcode: "",
    name: "",
    slug: "",
    description: "",
    category: "",
    categoryId: "",
    parentCategoryId: "",
    onSale: false,
    originalPrice: "0",
    discountedPrice: "0",
    imageDefault: null,
    imageHover: null,
    leather: { title: [], image: null },
    color: [],
    additionalDetails: [],
    productDetails: { additionalProductDetails: {}, size: [], warranty: "0" },
  };
}
