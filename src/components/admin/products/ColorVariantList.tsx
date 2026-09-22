"use client";

import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { ImageDropzone, ImagePreview } from "./ImageDropzone";
import type { ColorField, ProductFormColor, ProductFormDetail } from "./product-form.types";

const VARIANT_INPUT =
  "px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm";

export interface ColorVariantListProps {
  colors: ProductFormColor[];
  details: ProductFormDetail[];
  /** Keeps the file-input ids unique while both drawers are mounted. */
  idPrefix: string;
  onColorChange: (index: number, field: ColorField, value: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onAddImages: (index: number, files: File[]) => void;
  onRemoveImage: (colorIndex: number, imageIndex: number) => void;
}

export function ColorVariantList({
  colors,
  details,
  idPrefix,
  onColorChange,
  onAddColor,
  onRemoveColor,
  onAddImages,
  onRemoveImage,
}: ColorVariantListProps) {
  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
        Product Colors
      </label>
      <div className="col-span-8 sm:col-span-4">
        {colors.map((color, index) => {
          const images = details[index]?.images ?? [];
          return (
            <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
              <div className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  name={`colorName-${index}`}
                  placeholder="Color Name"
                  className={`col-span-4 ${VARIANT_INPUT}`}
                  value={color.colorName}
                  onChange={(event) => onColorChange(index, "colorName", event.target.value)}
                />
                <input
                  type="text"
                  name={`hex-${index}`}
                  placeholder="Hex Code"
                  className={`col-span-4 ${VARIANT_INPUT}`}
                  value={color.hex}
                  onChange={(event) => onColorChange(index, "hex", event.target.value)}
                />
                <input
                  type="text"
                  name={`availableQuantity-${index}`}
                  placeholder="Quantity"
                  className={`col-span-3 ${VARIANT_INPUT}`}
                  value={color.availableQuantity}
                  onChange={(event) => onColorChange(index, "availableQuantity", event.target.value)}
                />
                <button
                  type="button"
                  aria-label={`Remove colour ${index + 1}`}
                  className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                  onClick={() => onRemoveColor(index)}
                >
                  <TrashIcon className="mx-auto h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 dark:text-gray-400 font-medium mb-1">
                  Upload Images for {color.colorName}
                </label>
                <ImageDropzone
                  id={`color-image-${idPrefix}-${index}`}
                  multiple
                  onFiles={(files) => onAddImages(index, files)}
                />

                {images.length > 0 ? (
                  <aside className="flex flex-row flex-wrap mt-4">
                    {images.map((image, imageIndex) => (
                      <ImagePreview
                        key={`${typeof image === "string" ? image : image.name}-${imageIndex}`}
                        source={image}
                        alt={`${color.colorName} Image ${imageIndex + 1}`}
                        onRemove={() => onRemoveImage(index, imageIndex)}
                      />
                    ))}
                  </aside>
                ) : null}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="mt-2 text-sm text-white bg-primary-500 px-3 py-1 rounded-md hover:bg-primary-600 inline-flex items-center"
          onClick={onAddColor}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Color
        </button>
      </div>
    </div>
  );
}

export default ColorVariantList;
