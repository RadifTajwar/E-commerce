"use client";

import CategoryDropdown from "./CategoryDropdown";
import ColorVariantList from "./ColorVariantList";
import { ImageField } from "./ImageDropzone";
import LeatherSection from "./LeatherSection";
import PriceFields from "./PriceFields";
import type { ProductFormMode } from "./product-form.types";
import { useProductForm } from "./useProductForm";
import { Field, Input, Section } from "@/components/admin/ui";
import { SQUARE_IMAGE } from "@/lib/image-size";
import DrawerForm from "@/components/admin/DrawerForm";


export interface ProductFormProps {
  mode: ProductFormMode;
  /** The product to load and save. Edit mode only. */
  productId?: string | null;
  /** Closes the drawer (and clears the parent's selected id in edit mode). */
  onCancel: () => void;
  /** Called only after the product was actually saved. */
  onSuccess: () => void;
}

/**
 * The admin "create product" / "update product" drawer. Both modes render the
 * same fields; edit mode loads the product by id and pre-fills them.
 */
export function ProductForm({ mode, productId, onCancel, onSuccess }: ProductFormProps) {
  const form = useProductForm({ mode, productId, onCancel, onSuccess });
  const { formData } = form;
  // Both drawers are mounted at once, so every input id has to stay unique.
  const idPrefix = mode === "create" ? "upload" : "update";
  const busyLabel = mode === "create" ? "Creating…" : "Saving…";
  const submitLabel = mode === "create" ? "Create product" : "Save changes";

  return (
    <DrawerForm
      title={mode === "create" ? "Create product" : "Edit product"}
      description={
        mode === "create"
          ? "Add a product to the catalogue."
          : "Update this product's details, images and colour variants."
      }
      onClose={() => form.cancel()}
      onSubmit={form.handleSubmit}
      submitLabel={submitLabel}
      busyLabel={busyLabel}
      isBusy={form.isBusy}
    >
      <Section title="Basics" description="What the product is called and where it sits.">
        <Field label="Product name" htmlFor={`product-name-${idPrefix}`}>
          <Input
            id={`product-name-${idPrefix}`}
            name="name"
            placeholder="e.g. Classic Tote"
            value={formData.name}
            onChange={form.handleInputChange}
          />
        </Field>

        <Field label="Barcode" htmlFor={`product-barcode-${idPrefix}`}>
          <Input
            id={`product-barcode-${idPrefix}`}
            name="barcode"
            placeholder="e.g. 123456"
            value={formData.barcode}
            onChange={form.handleInputChange}
          />
        </Field>

        <CategoryDropdown
          idPrefix={idPrefix}
          categories={form.categories}
          value={formData.category}
          onSelect={form.handleCategorySelect}
        />
      </Section>

      <Section title="Pricing">
        <PriceFields
          idPrefix={idPrefix}
          originalPrice={formData.originalPrice}
          discountedPrice={formData.discountedPrice}
          onChange={form.handleInputChange}
        />

        <label
          htmlFor={`on-sale-${idPrefix}`}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
        >
          <input
            id={`on-sale-${idPrefix}`}
            type="checkbox"
            name="onSale"
            className="h-4 w-4 rounded border-slate-300 accent-slate-900 dark:border-slate-600 dark:accent-white"
            checked={formData.onSale}
            onChange={form.handleInputChange}
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Show this product as on sale
          </span>
        </label>
      </Section>

      <Section
        title="Images"
        description={`Storefront artwork. Both must be exactly ${SQUARE_IMAGE.label} pixels.`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageField
            id={`image-default-${idPrefix}`}
            label="Default image"
            value={formData.imageDefault}
            spec={SQUARE_IMAGE}
            onChange={(file) => form.setImage("imageDefault", file)}
          />
          <ImageField
            id={`image-hover-${idPrefix}`}
            label="Hover image"
            value={formData.imageHover}
            spec={SQUARE_IMAGE}
            onChange={(file) => form.setImage("imageHover", file)}
          />
        </div>
      </Section>

      <Section title="Colour variants" description="Each colour carries its own stock and gallery.">
        <ColorVariantList
          colors={formData.color}
          details={formData.additionalDetails}
          idPrefix={idPrefix}
          onColorChange={form.handleColorChange}
          onAddColor={form.handleAddColor}
          onRemoveColor={form.handleRemoveColor}
          onAddImages={form.handleAddColorImages}
          onRemoveImage={form.handleRemoveColorImage}
        />
      </Section>

      <Section title="Leather" description="The material panel shown on the product page.">
        <LeatherSection
          leather={formData.leather}
          idPrefix={idPrefix}
          onImageChange={form.setLeatherImage}
          onTitleChange={form.handleTitleChange}
          onAddTitle={form.handleAddTitle}
          onRemoveTitle={form.handleRemoveTitle}
        />
      </Section>

    </DrawerForm>
  );
}

export default ProductForm;
