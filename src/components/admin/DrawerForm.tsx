"use client";

import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/admin/ui";
import { CloseIcon } from "@/components/ui/icons";

export interface DrawerFormProps {
  title: string;
  description?: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  /** Replaces the submit label while a request is in flight. */
  busyLabel?: string;
  isBusy?: boolean;
  children: ReactNode;
}

/**
 * Chrome shared by every admin add/edit drawer: header, scrolling body and a
 * footer pinned to the bottom. Each form used to carry its own copy, which is
 * why they drifted apart and only some of them had dark-mode colours.
 */
export default function DrawerForm({
  title,
  description,
  onClose,
  onSubmit,
  submitLabel,
  busyLabel,
  isBusy = false,
  children,
}: DrawerFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex h-screen w-full flex-col bg-white dark:bg-slate-900"
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">{children}</div>

      <footer className="flex shrink-0 gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isBusy}>
          {isBusy ? (busyLabel ?? "Saving…") : submitLabel}
        </Button>
      </footer>
    </form>
  );
}
