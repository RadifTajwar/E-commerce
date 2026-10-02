/* eslint-disable @next/next/no-img-element */

/** Small square preview for a catalogue or banner image. */
export default function Thumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 dark:bg-slate-800">
        —
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-10 w-10 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
    />
  );
}
