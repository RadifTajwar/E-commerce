"use client";

import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { SQUARE_IMAGE } from "@/lib/image-size";
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
    <div className="space-y-4">
      <div>
        <div>
          <ImageDropzone
            id={`image-leather-${idPrefix}`}
            spec={SQUARE_IMAGE}
            onFiles={(files) => onImageChange(files[0] ?? null)}
          />

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
                className="col-span-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
          onClick={onAddTitle}
        >
          <PlusIcon className="h-4 w-4" />
          Add Title
        </button>
      </div>
    </div>
  );
}

export default LeatherSection;
