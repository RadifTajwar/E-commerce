"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isObjectId } from "@/config/constants";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import type { RequestStateBase } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllCategories } from "@/store/slices/category.slice";
import { createProduct, fetchProductById, updateProductData } from "@/store/slices/product.slice";
import type { Category, Product, ProductColorDetail, ProductInput } from "@/types";
import {
  emptyProductForm,
  type ColorField,
  type ProductFormColor,
  type ProductFormDetail,
  type ProductFormMode,
  type ProductFormState,
} from "./product-form.types";

// ---- helpers -----------------------------------------------------------------

/**
 * `createRequestSlice` builds its state from a runtime `dataKey`, so `RootState`
 * only knows about the common request fields. This re-states the data field for
 * the two slices this form reads.
 */
type SliceWithData<K extends string, T> = RequestStateBase & { [key in K]: T };

/** The rejection of a thunk's `.unwrap()` is a plain message string or an Error. */
function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Colours come back either as plain names or as the stored colour objects. */
function toFormColor(raw: unknown): ProductFormColor {
  if (typeof raw === "string") return { colorName: raw, hex: "", availableQuantity: "0" };
  const value = (raw ?? {}) as Partial<ProductFormColor> & { color?: string; availableQuantity?: number | string };
  return {
    colorId: value.colorId,
    colorName: value.colorName ?? value.color ?? "",
    hex: value.hex ?? "",
    availableQuantity: String(value.availableQuantity ?? 0),
  };
}

function toFormDetail(detail: ProductColorDetail): ProductFormDetail {
  return {
    colorId: detail.colorId,
    color: detail.color ?? "",
    hex: detail.hex ?? "",
    quantity: Number(detail.quantity ?? detail.availableQuantity ?? 0) || 0,
    images: Array.isArray(detail.images) ? [...detail.images] : [],
  };
}

/**
 * Colour rows and gallery rows are addressed by the same index everywhere in
 * the form, so they are built as two arrays of exactly the same length.
 */
function buildColorRows(product: Product): {
  color: ProductFormColor[];
  additionalDetails: ProductFormDetail[];
} {
  const details = (product.additionalDetails ?? []).map(toFormDetail);
  const rawColors: unknown[] = Array.isArray(product.color) ? product.color : [];
  const rows = Math.max(rawColors.length, details.length);

  const color: ProductFormColor[] = [];
  for (let i = 0; i < rows; i += 1) {
    const raw = rawColors[i];
    const detail = details[i];
    color.push(
      raw !== undefined
        ? toFormColor(raw)
        : {
            colorId: detail?.colorId,
            colorName: detail?.color ?? "",
            hex: detail?.hex ?? "",
            availableQuantity: String(detail?.quantity ?? 0),
          },
    );
  }

  const additionalDetails = color.map((entry, i) => {
    const detail = details[i];
    return {
      colorId: detail?.colorId ?? entry.colorId,
      color: entry.colorName,
      hex: entry.hex,
      quantity: Number(entry.availableQuantity) || 0,
      images: detail?.images ?? [],
    };
  });

  return { color, additionalDetails };
}

function mapProductToForm(product: Product, categories: Category[]): ProductFormState {
  const matched =
    categories.find((category) => category.id === product.categoryId) ??
    categories.find((category) => category.name === product.category);
  const { color, additionalDetails } = buildColorRows(product);

  return {
    barcode: product.barcode ?? "",
    name: product.name ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    category: matched?.name ?? product.category ?? "",
    categoryId: matched?.id ?? product.categoryId ?? "",
    parentCategoryId: matched?.parentCategoryId ?? product.parentCategoryId ?? "",
    onSale: Boolean(product.onSale),
    originalPrice: String(product.originalPrice ?? 0),
    discountedPrice: String(product.discountedPrice ?? 0),
    imageDefault: product.imageDefault ?? null,
    imageHover: product.imageHover ?? null,
    leather: {
      title: product.leather?.title ?? [],
      image: product.leather?.image ?? null,
    },
    color,
    additionalDetails,
    productDetails: {
      additionalProductDetails: product.productDetails?.additionalProductDetails ?? {},
      size: product.productDetails?.size ?? [],
      warranty: product.productDetails?.warranty ?? "0",
    },
  };
}

type Validated = { ok: true; imageDefault: File | string } | { ok: false; message: string };

/**
 * Only the fields the form actually collects are validated. `size` and
 * `warranty` used to be checked here even though no input ever sets them.
 */
function validateProductForm(form: ProductFormState): Validated {
  if (!form.name.trim()) return { ok: false, message: "Product name is required." };
  if (!form.categoryId) return { ok: false, message: "Please choose a category." };

  const original = Number(form.originalPrice);
  if (!form.originalPrice.trim() || !Number.isFinite(original) || original <= 0) {
    return { ok: false, message: "Enter a valid product price." };
  }

  const discounted = Number(form.discountedPrice);
  if (!form.discountedPrice.trim() || !Number.isFinite(discounted) || discounted < 0) {
    return { ok: false, message: "Enter a valid sell price." };
  }
  if (discounted > original) {
    return { ok: false, message: "Sell price must be less than or equal to the original price." };
  }

  if (!form.color.some((entry) => entry.colorName.trim())) {
    return { ok: false, message: "Add at least one colour with a colour name." };
  }
  if (!form.imageDefault) {
    return { ok: false, message: "A default product image is required." };
  }
  return { ok: true, imageDefault: form.imageDefault };
}

// ---- hook --------------------------------------------------------------------

export interface UseProductFormOptions {
  mode: ProductFormMode;
  productId?: string | null;
  /** Closes the drawer (and clears the parent's selected id in edit mode). */
  onCancel: () => void;
  /** Called only after the product was actually saved. */
  onSuccess: () => void;
}

export interface UseProductForm {
  formData: ProductFormState;
  categories: Category[];
  isBusy: boolean;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCategorySelect: (categoryName: string) => void;
  handleColorChange: (index: number, field: ColorField, value: string) => void;
  handleAddColor: () => void;
  handleRemoveColor: (index: number) => void;
  handleAddColorImages: (index: number, files: File[]) => void;
  handleRemoveColorImage: (colorIndex: number, imageIndex: number) => void;
  setImage: (field: "imageDefault" | "imageHover", file: File | null) => void;
  setLeatherImage: (file: File | null) => void;
  handleTitleChange: (index: number, value: string) => void;
  handleAddTitle: () => void;
  handleRemoveTitle: (index: number) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  cancel: () => void;
}

export function useProductForm({ mode, productId, onCancel, onSuccess }: UseProductFormOptions): UseProductForm {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProductFormState>(emptyProductForm);
  const [imageUploading, setImageUploading] = useState(false);

  const { categories } = useAppSelector((state) => state.categories as SliceWithData<"categories", Category[]>);
  const { productData } = useAppSelector((state) => state.productById as SliceWithData<"productData", Product | null>);
  const { isLoading: createLoading } = useAppSelector((state) => state.createNewProduct);
  const { isLoading: updateLoading } = useAppSelector((state) => state.updateProductData);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (mode !== "edit" || !isObjectId(productId)) return;
    dispatch(fetchProductById(productId));
  }, [mode, productId, dispatch]);

  useEffect(() => {
    if (mode !== "edit" || !productData || categories.length === 0) return;
    setFormData(mapProductToForm(productData, categories));
  }, [mode, productData, categories]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => {
      switch (name) {
        case "name":
          return { ...prev, name: value };
        case "barcode":
          return { ...prev, barcode: value };
        case "originalPrice":
          return { ...prev, originalPrice: value };
        case "discountedPrice":
          return { ...prev, discountedPrice: value };
        case "onSale":
          return { ...prev, onSale: type === "checkbox" ? checked : Boolean(value) };
        default:
          return prev;
      }
    });
  }, []);

  const handleCategorySelect = useCallback(
    (categoryName: string) => {
      const selected = categories.find((category) => category.name === categoryName);
      if (!selected) return;
      setFormData((prev) => ({
        ...prev,
        category: selected.name,
        categoryId: selected.id,
        parentCategoryId: selected.parentCategoryId,
      }));
    },
    [categories],
  );

  const handleColorChange = useCallback((index: number, field: ColorField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.map((entry, i) => {
        if (i !== index) return entry;
        if (field === "colorName") return { ...entry, colorName: value };
        if (field === "hex") return { ...entry, hex: value };
        return { ...entry, availableQuantity: value };
      }),
      additionalDetails: prev.additionalDetails.map((detail, i) => {
        if (i !== index) return detail;
        if (field === "colorName") return { ...detail, color: value };
        if (field === "hex") return { ...detail, hex: value };
        return { ...detail, quantity: Number.parseInt(value, 10) || 0 };
      }),
    }));
  }, []);

  const handleAddColor = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      color: [...prev.color, { colorName: "", hex: "", availableQuantity: "0" }],
      additionalDetails: [...prev.additionalDetails, { color: "", hex: "", quantity: 0, images: [] }],
    }));
  }, []);

  const handleRemoveColor = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index),
      additionalDetails: prev.additionalDetails.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddColorImages = useCallback((index: number, files: File[]) => {
    if (files.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      additionalDetails: prev.additionalDetails.map((detail, i) =>
        i === index ? { ...detail, images: [...detail.images, ...files] } : detail,
      ),
    }));
  }, []);

  const handleRemoveColorImage = useCallback((colorIndex: number, imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetails: prev.additionalDetails.map((detail, i) =>
        i === colorIndex ? { ...detail, images: detail.images.filter((_, j) => j !== imageIndex) } : detail,
      ),
    }));
  }, []);

  const setImage = useCallback((field: "imageDefault" | "imageHover", file: File | null) => {
    setFormData((prev) => (field === "imageDefault" ? { ...prev, imageDefault: file } : { ...prev, imageHover: file }));
  }, []);

  const setLeatherImage = useCallback((file: File | null) => {
    setFormData((prev) => ({ ...prev, leather: { ...prev.leather, image: file } }));
  }, []);

  const handleTitleChange = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      leather: { ...prev.leather, title: prev.leather.title.map((title, i) => (i === index ? value : title)) },
    }));
  }, []);

  const handleAddTitle = useCallback(() => {
    setFormData((prev) => ({ ...prev, leather: { ...prev.leather, title: [...prev.leather.title, ""] } }));
  }, []);

  const handleRemoveTitle = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      leather: { ...prev.leather, title: prev.leather.title.filter((_, i) => i !== index) },
    }));
  }, []);

  const cancel = useCallback(() => {
    setFormData(emptyProductForm());
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validated = validateProductForm(formData);
      if (!validated.ok) {
        notify.error(validated.message);
        return;
      }
      if (mode === "edit" && !isObjectId(productId)) {
        notify.error("This product can no longer be identified. Close the panel and try again.");
        return;
      }

      const folderName = `Product/${formData.name}`;
      setImageUploading(true);

      try {
        // Strings (images already on the CDN) are returned untouched, so
        // existing artwork is never re-uploaded.
        const [imageDefault, imageHover, leatherImage] = await Promise.all([
          uploadService.image(validated.imageDefault, folderName),
          formData.imageHover ? uploadService.image(formData.imageHover, folderName) : Promise.resolve(""),
          formData.leather.image ? uploadService.image(formData.leather.image, folderName) : Promise.resolve(null),
        ]);

        const additionalDetails: ProductColorDetail[] = await Promise.all(
          formData.additionalDetails.map(async (detail) => {
            const colorFolderName = `${folderName}/${detail.color}`;
            const images = await Promise.all(
              detail.images.map((image) => uploadService.image(image, colorFolderName)),
            );
            return {
              ...(detail.colorId ? { colorId: detail.colorId } : {}),
              color: detail.color,
              hex: detail.hex,
              quantity: detail.quantity,
              images,
            };
          }),
        );

        const payload = {
          barcode: formData.barcode,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          category: formData.category,
          categoryId: formData.categoryId,
          parentCategoryId: formData.parentCategoryId,
          inStock: formData.additionalDetails.some((detail) => Number(detail.quantity) > 0),
          onSale: formData.onSale,
          originalPrice: Number(formData.originalPrice),
          discountedPrice: Number(formData.discountedPrice),
          imageDefault,
          imageHover,
          leather: { title: formData.leather.title, image: leatherImage },
          color: formData.color.map((entry) => ({
            ...(entry.colorId ? { colorId: entry.colorId } : {}),
            colorName: entry.colorName,
            hex: entry.hex,
            availableQuantity: Number(entry.availableQuantity) || 0,
          })),
          additionalDetails,
          productDetails: formData.productDetails,
        };

        // `ProductInput["color"]` is declared as `string[]`, but the API has
        // always stored the richer colour objects this form edits, so the
        // payload is widened once here instead of dropping colour metadata.
        const input = payload as unknown as ProductInput;

        if (mode === "edit" && productId) {
          await dispatch(updateProductData({ id: productId, updatedData: input })).unwrap();
        } else {
          await dispatch(createProduct(input)).unwrap();
        }

        cancel();
        onSuccess();
      } catch (error) {
        notify.error(
          errorMessage(error, mode === "edit" ? "Could not update the product." : "Could not create the product."),
        );
      } finally {
        setImageUploading(false);
      }
    },
    [cancel, dispatch, formData, mode, onSuccess, productId],
  );

  return {
    formData,
    categories,
    isBusy: imageUploading || createLoading || updateLoading,
    handleInputChange,
    handleCategorySelect,
    handleColorChange,
    handleAddColor,
    handleRemoveColor,
    handleAddColorImages,
    handleRemoveColorImage,
    setImage,
    setLeatherImage,
    handleTitleChange,
    handleAddTitle,
    handleRemoveTitle,
    handleSubmit,
    cancel,
  };
}
