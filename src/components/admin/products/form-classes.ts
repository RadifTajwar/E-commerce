/**
 * Class names shared by the product form's sections.
 *
 * Each section used to define its own near-identical copies, so they drifted
 * and only some carried dark-mode colours. Defining them once keeps the whole
 * form on the same palette as the rest of the admin.
 */

/** A label/control row. */
export const ROW = "grid gap-2 sm:grid-cols-6 sm:items-center sm:gap-5 mb-6";

export const ROW_LABEL =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2";

/** The control side of a row. */
export const ROW_FIELD = "sm:col-span-4";

const BASE_INPUT =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-white/10";

export const TEXT_INPUT = BASE_INPUT;
export const VARIANT_INPUT = BASE_INPUT;

/** Price input sits beside a currency prefix, so its left corners are square. */
export const PRICE_INPUT = `${BASE_INPUT} rounded-l-none`;

export const PREFIX =
  "inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";

export const DROPZONE =
  "flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-8 text-center transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50";
