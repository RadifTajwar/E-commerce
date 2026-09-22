"use client";

import { CloseIcon } from "@/components/ui/icons";
import CategoryDropdown from "./CategoryDropdown";
import ColorVariantList from "./ColorVariantList";
import { ImageField } from "./ImageDropzone";
import LeatherSection from "./LeatherSection";
import PriceFields from "./PriceFields";
import type { ProductFormMode } from "./product-form.types";
import { useProductForm } from "./useProductForm";

const ROW = "grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6";
const TEXT_INPUT =
  "block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500";

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
  const busyLabel = mode === "create" ? "Creating..." : "Updating...";
  const submitLabel = mode === "create" ? "Create Product" : "Update Product";

  return (
    <div className="drawer-content">
      <button
        type="button"
        aria-label="Close"
        className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
        onClick={() => form.cancel()}
      >
        <CloseIcon className="mx-auto h-4 w-4" />
      </button>

      <div className="flex flex-col w-full h-screen justify-between">
        <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 min-h-0">
          <div className="flex md:flex-row flex-col justify-between mr-20">
            <div>
              <h4 className="text-xl font-medium dark:text-gray-300">Create Product</h4>
              <p className="mb-0 text-sm font-normal dark:text-gray-300">
                Create your Product necessary information from here
              </p>
            </div>
          </div>
        </div>

        <div className="w-full relative  dark:bg-gray-700 dark:text-gray-200  overflow-hidden h-full  bg-white">
          <div className="absolute inset-0  mr-0 mb-0 w-full">
            <form className="w-full" onSubmit={form.handleSubmit}>
              <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">
                {/* product name */}
                <div className={`${ROW} flex items-center`}>
                  <label
                    htmlFor={`product-name-${idPrefix}`}
                    className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-normal text-sm"
                  >
                    Product Title/Name
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <input
                      id={`product-name-${idPrefix}`}
                      className={TEXT_INPUT}
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={form.handleInputChange}
                    />
                  </div>
                </div>

                {/* product barcode */}
                <div className={ROW}>
                  <label
                    htmlFor={`product-barcode-${idPrefix}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
                  >
                    Product Barcode
                  </label>
                  <div className="col-span-6 sm:col-span-4">
                    <input
                      id={`product-barcode-${idPrefix}`}
                      className={TEXT_INPUT}
                      type="text"
                      name="barcode"
                      placeholder="Name"
                      value={formData.barcode}
                      onChange={form.handleInputChange}
                    />
                  </div>
                </div>

                <CategoryDropdown
                  categories={form.categories}
                  value={formData.category}
                  onSelect={form.handleCategorySelect}
                />

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

                <LeatherSection
                  leather={formData.leather}
                  idPrefix={idPrefix}
                  onImageChange={form.setLeatherImage}
                  onTitleChange={form.handleTitleChange}
                  onAddTitle={form.handleAddTitle}
                  onRemoveTitle={form.handleRemoveTitle}
                />

                <ImageField
                  id={`image-default-${idPrefix}`}
                  label="Product Default Image"
                  value={formData.imageDefault}
                  onChange={(file) => form.setImage("imageDefault", file)}
                />

                <ImageField
                  id={`image-hover-${idPrefix}`}
                  label="Product Hover Image"
                  value={formData.imageHover}
                  onChange={(file) => form.setImage("imageHover", file)}
                />

                <PriceFields
                  originalPrice={formData.originalPrice}
                  discountedPrice={formData.discountedPrice}
                  onChange={form.handleInputChange}
                />

                <div className={ROW}>
                  <label
                    htmlFor={`on-sale-${idPrefix}`}
                    className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                  >
                    On Sale
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="flex flex-row">
                      <input
                        id={`on-sale-${idPrefix}`}
                        type="checkbox"
                        name="onSale"
                        className="h-6 w-6"
                        checked={formData.onSale}
                        onChange={form.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom_section absolute z-10 bottom-0 w-full right-0 pt-4 pb-32 lg:pb-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150  focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 h-12  w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700 font-normal"
                    type="button"
                    onClick={() => form.cancel()}
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-normal focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12"
                    type="submit"
                    disabled={form.isBusy}
                  >
                    <span> {form.isBusy ? busyLabel : submitLabel}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
