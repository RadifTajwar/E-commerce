"use client";

import { CloseIcon, TrashIcon } from "@/components/ui/icons";

export interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  /** Name (or id) of the record, shown in red inside the question. */
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** Sentence before the highlighted name. */
  question?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
}

/**
 * The "Are you sure?" modal that used to exist as four near-identical
 * `deleteVisible.js` copies (categories, parent categories, products, orders).
 * Overlay and positioning live here too, so a page only owns the open state.
 */
export function ConfirmDeleteDialog({
  isOpen,
  name,
  onCancel,
  onConfirm,
  question = "Are You Sure! Want to Delete",
  description = "Do you really want to delete these records? You can't view this in your list anymore if you delete!",
  cancelLabel = "No, Keep It",
  confirmLabel = "Yes, Delete It",
  isSubmitting = false,
}: ConfirmDeleteDialogProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onCancel} />}

      <div
        className={`fixed w-[576px] h-[306px] top-1/2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-in-out
    ${isOpen ? "-translate-y-1/2 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
      >
        <div
          className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg  sm:max-w-xl custom-modal"
          role="dialog"
          aria-modal="true"
        >
          <header className="flex justify-end">
            <button
              className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
              aria-label="close"
              type="button"
              onClick={onCancel}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </header>

          <div className="mb-6 text-sm text-gray-700 dark:text-gray-400 text-center custom-modal px-8 pt-6 pb-4">
            <span className="flex justify-center text-3xl mb-6 text-red-500">
              <TrashIcon className="h-[1em] w-[1em]" />
            </span>
            <h2 className="text-xl font-medium mb-2">
              {question} <span className="text-red-500">{name}</span>?
            </h2>
            <p>{description}</p>
          </div>

          <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row bg-gray-50 dark:bg-gray-800 justify-center">
            <button
              className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 w-full sm:w-auto hover:bg-white hover:border-gray-50"
              type="button"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <div className="flex justify-end">
              <button
                className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12 sm:w-auto"
                type="button"
                disabled={isSubmitting}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default ConfirmDeleteDialog;
