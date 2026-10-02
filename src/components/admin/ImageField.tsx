"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { CircleXIcon } from "@/components/admin/icons";
import { Label } from "@/components/admin/ui";
import { UploadCloudIcon } from "@/components/ui/icons";
import { checkImageSize, type ImageSpec } from "@/lib/image-size";

export interface ImageFieldProps {
  id: string;
  label: string;
  /** Existing URL or an object URL for a freshly picked file. */
  preview?: string | null;
  onSelect: (file: File) => void;
  onClear?: () => void;
  accept?: string;
  /** Required pixel dimensions. Shown up front and checked on selection. */
  spec?: ImageSpec;
  multiple?: boolean;
  onSelectMany?: (files: File[]) => void;
}

/**
 * Upload area with preview, shared by the category, parent and banner forms.
 *
 * When a `spec` is given the requirement is stated before the file picker
 * opens and checked the moment a file is chosen, so a wrongly sized image is
 * refused here rather than after a round trip to Cloudinary.
 */
export default function ImageField({
  id,
  label,
  preview,
  onSelect,
  onClear,
  accept = "image/png,image/jpeg,image/webp",
  spec,
  multiple = false,
  onSelectMany,
}: ImageFieldProps) {
  const [problem, setProblem] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    setProblem(null);
    if (!files.length) return;

    if (spec) {
      for (const file of files) {
        const failure = await checkImageSize(file, spec);
        if (failure) {
          setProblem(failure);
          return;
        }
      }
    }

    if (multiple && onSelectMany) onSelectMany(files);
    else onSelect(files[0]!);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {spec && (
          <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {spec.label} px
          </span>
        )}
      </div>

      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          problem
            ? "border-red-400 bg-red-50/50 dark:border-red-500/60 dark:bg-red-950/20"
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
        }`}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            void handleFiles(Array.from(e.target.files ?? []));
            // Allow re-picking the same file after a rejection.
            e.target.value = "";
          }}
        />
        <UploadCloudIcon className="mb-2 h-6 w-6 text-slate-400" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Click to upload{multiple ? " one or more files" : ""}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          PNG, JPEG or WebP{spec ? ` · exactly ${spec.label}` : ""}
        </p>
      </label>

      {problem && (
        <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
          {problem}
        </p>
      )}

      {preview && (
        <div className="relative mt-4 inline-block">
          <img
            src={preview}
            alt={label}
            className="h-24 w-24 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
          />
          {onClear && (
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => {
                setProblem(null);
                onClear();
              }}
              className="absolute -right-2 -top-2 rounded-full bg-white text-slate-500 shadow transition-colors hover:text-red-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-red-400"
            >
              <CircleXIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
