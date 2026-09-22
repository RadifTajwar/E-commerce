"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SHIPPING_COST, STORAGE_KEYS } from "@/config/constants";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * The shipping option chosen on the cart / checkout pages, persisted across
 * the two so the selection survives navigation.
 */
export function useSelectedShipping(): [number, (cost: number) => void] {
  const [selectedShipping, setSelectedShipping] = useState<number>(DEFAULT_SHIPPING_COST);

  useEffect(() => {
    const saved = Number(readStorage<number | null>(STORAGE_KEYS.selectedShipping, null));
    if (Number.isFinite(saved) && saved > 0) setSelectedShipping(saved);
  }, []);

  const selectShipping = (cost: number) => {
    setSelectedShipping(cost);
    writeStorage(STORAGE_KEYS.selectedShipping, cost);
  };

  return [selectedShipping, selectShipping];
}
