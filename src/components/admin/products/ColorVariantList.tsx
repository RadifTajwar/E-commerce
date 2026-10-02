"use client";

import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { SQUARE_IMAGE } from "@/lib/image-size";
import { ImageDropzone, ImagePreview } from "./ImageDropzone";
import type { ColorField, ProductFormColor, ProductFormDetail } from "./product-form.types";
import { VARIANT_INPUT } from "./form-classes";


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
    <div className="space-y-4">
      <div>
        {colors.map((color, index) => {
          const images = details[index]?.images ?? [];
          return (
            <div key={index} className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Upload Images for {color.colorName}
                </label>
                <ImageDropzone
                  spec={SQUARE_IMAGE}
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
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
          onClick={onAddColor}
        >
          <PlusIcon className="h-4 w-4" />
          Add Color
        </button>
      </div>
    </div>
  );
}

export default ColorVariantList;
