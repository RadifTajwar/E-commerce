import type { CSSProperties } from "react";

/**
 * One shimmering placeholder block. Route-level `loading.tsx` files build their
 * skeletons out of these so a navigation shows the shape of the page that is
 * coming instead of freezing on the previous one.
 */
export default function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-pulse rounded bg-gray-200/70 ${className}`}
    />
  );
}
