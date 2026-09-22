"use client";

import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { ImageDropzone, ImagePreview } from "./ImageDropzone";
import type { ProductFormLeather } from "./product-form.types";

export interface LeatherSectionProps {
  leather: ProductFormLeather;
  /** Keeps the file-input id unique while both drawers are mounted. */
  idPrefix: string;
  onImageChange: (file: File | null) => void;
  onTitleChange: (index: number, value: string) => void;
  onAddTitle: () => void;
  onRemoveTitle: (index: number) => void;
}

export function LeatherSection({
  leather,
  idPrefix,
  onImageChange,
  onTitleChange,
  onAddTitle,
  onRemoveTitle,
}: LeatherSectionProps) {
  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
        Leather (Image size : 638 x 638)
      </label>

      <div className="col-span-8 sm:col-span-4">
        <div className="col-span-8 sm:col-span-4">
          <ImageDropzone id={`image-leather-${idPrefix}`} onFiles={(files) => onImageChange(files[0] ?? null)} />

          {leather.image ? (
            <aside className="flex flex-row flex-wrap mt-4">
              <ImagePreview source={leather.image} alt="Leather" onRemove={() => onImageChange(null)} />
            </aside>
          ) : null}
        </div>

        {leather.title.map((title, index) => (
          <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
            <div className="grid grid-cols-12 gap-2 mb-2">
              <input
                type="text"
                name={`title-${index}`}
                placeholder="Title"
                className="col-span-3 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                value={title}
                onChange={(event) => onTitleChange(index, event.target.value)}
              />
              <button
                type="button"
                aria-label={`Remove title ${index + 1}`}
                className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                onClick={() => onRemoveTitle(index)}
              >
                <TrashIcon className="mx-auto h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="mt-2 text-sm text-white bg-primary-500 px-3 py-1 rounded-md hover:bg-primary-600 inline-flex items-center"
          onClick={onAddTitle}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Title
        </button>
      </div>
    </div>
  );
}

export default LeatherSection;
