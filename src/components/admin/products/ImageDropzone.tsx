"use client";

import { useState, type ChangeEvent } from "react";
import SharedImageField from "@/components/admin/ImageField";
import { UploadCloudIcon } from "@/components/ui/icons";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { checkImageSize, type ImageSpec } from "@/lib/image-size";

export interface ImageDropzoneProps {
  id: string;
  /** Only the colour gallery accepts several files at once. */
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  /** Required pixel dimensions, checked before the files reach the caller. */
  spec?: ImageSpec;
}

/**
 * The dashed drop target used by the colour gallery and the leather panel.
 *
 * When a `spec` is given, a wrongly sized file is refused here and never
 * reaches the form state — so it cannot be uploaded to Cloudinary by a later
 * submit.
 */
export function ImageDropzone({ id, multiple = false, onFiles, spec }: ImageDropzoneProps) {
  const [problem, setProblem] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // Let the same file be picked again after it was removed or rejected.
    event.target.value = "";
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
    onFiles(files);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-6 py-6 text-center transition-colors ${
          problem
            ? "border-red-400 bg-red-50/50 dark:border-red-500/60 dark:bg-red-950/20"
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
        }`}
      >
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          className="sr-only"
          onChange={(e) => void handleChange(e)}
        />
        <UploadCloudIcon className="mb-2 h-6 w-6 text-slate-400" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Click to upload{multiple ? " one or more images" : ""}
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
    <div className="relative inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element -- blob/remote previews, no layout known ahead of time */}
      <img
        src={url}
        alt={alt}
        className="h-20 w-20 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
      />
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${alt}`}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow transition-colors hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-red-400"
          onClick={onRemove}
        >
          <svg viewBox="0 0 24 24" fill="none" width="12" height="12" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
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
  spec?: ImageSpec;
}

/**
 * Single-image field for the product form. Delegates to the shared admin
 * field so there is one upload control in the whole dashboard; this wrapper
 * only adapts `File | string` state into the preview URL it expects.
 */
export function ImageField({ id, label, value, onChange, spec }: ImageFieldProps) {
  const preview = useObjectUrl(value);

  return (
    <SharedImageField
      id={id}
      label={label}
      spec={spec}
      preview={preview}
      onSelect={(file) => onChange(file)}
      onClear={() => onChange(null)}
    />
  );
}
