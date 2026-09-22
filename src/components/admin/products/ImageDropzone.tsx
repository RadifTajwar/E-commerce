"use client";

import type { ChangeEvent } from "react";
import { CloseIcon, UploadCloudIcon } from "@/components/ui/icons";
import { useObjectUrl } from "@/hooks/useObjectUrl";

const ROW = "grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6";
const ROW_LABEL = "block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium";

export interface ImageDropzoneProps {
  id: string;
  /** Only the colour gallery accepts several files at once. */
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

/** The dashed "drag your images here" box. */
export function ImageDropzone({ id, multiple = false, onFiles }: ImageDropzoneProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onFiles(files);
    // Let the same file be picked again after it was removed.
    event.target.value = "";
  };

  return (
    <div className="w-full text-center mb-4">
      <label
        htmlFor={id}
        className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <UploadCloudIcon className="text-blue-500 mb-2 h-8 w-8" />
        <p className="text-sm">Drag your images here</p>
        <em className="text-xs text-gray-400">(Only *.jpeg, *.webp and *.png images will be accepted)</em>
      </label>
    </div>
  );
}

export interface ImagePreviewProps {
  /** A picked File or an already-uploaded URL. */
  source: File | string | null;
  alt: string;
  onRemove?: () => void;
}

/**
 * One preview thumbnail. The object URL is created (and revoked) by
 * `useObjectUrl` instead of during render, which used to leak a blob per keystroke.
 */
export function ImagePreview({ source, alt, onRemove }: ImagePreviewProps) {
  const url = useObjectUrl(source);
  if (!url) return null;

  return (
    <div draggable className="relative inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- blob/remote previews, no layout known ahead of time */}
      <img className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2" src={url} alt={alt} />
      {onRemove ? (
        <button type="button" className="absolute top-0 right-0 text-red-500 focus:outline-none" onClick={onRemove}>
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export interface ImageFieldProps {
  id: string;
  label: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
}

/** A full labelled form row holding a single-image dropzone and its preview. */
export function ImageField({ id, label, value, onChange }: ImageFieldProps) {
  return (
    <div className={ROW}>
      <label htmlFor={id} className={ROW_LABEL}>
        {label}
      </label>
      <div className="col-span-8 sm:col-span-4">
        <ImageDropzone id={id} onFiles={(files) => onChange(files[0] ?? null)} />
        {value ? (
          <aside className="flex flex-row flex-wrap mt-4">
            <ImagePreview source={value} alt={label} onRemove={() => onChange(null)} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
