"use client";

import { useEffect, type RefObject } from "react";

/** Calls `onOutside` when a pointer-down happens outside every ref in `refs`. */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const handler = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const inside = list.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [refs, onOutside, enabled]);
}
