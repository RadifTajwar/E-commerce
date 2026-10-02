"use client";

import { useEffect } from "react";
import { Button } from "@/components/admin/ui";
import { CloseIcon, TrashIcon } from "@/components/ui/icons";

export interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  /** Name (or id) of the record, shown inside the question. */
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** Sentence before the highlighted name. */
  question?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  /** "danger" for deletes (default), "neutral" for reversible actions. */
  tone?: "danger" | "neutral";
}

/**
 * Confirmation for a destructive action. Centred, dismissible by overlay click
 * or Escape, and sized to its content rather than the old fixed 576×306 box
 * that clipped longer descriptions.
 */
export function ConfirmDeleteDialog({
  isOpen,
  name,
  onCancel,
  onConfirm,
  question = "Are you sure? You are about to delete",
  description = "This record will no longer appear in your list. This cannot be undone.",
  cancelLabel = "No, keep it",
  confirmLabel = "Yes, delete it",
  isSubmitting = false,
  tone = "danger",
}: ConfirmDeleteDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-10 text-center">
          <div
            className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
              tone === "danger"
                ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <TrashIcon className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {question}{" "}
            <span className={tone === "danger" ? "text-red-600 dark:text-red-400" : ""}>
              {name}
            </span>
            ?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-800/40">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;
