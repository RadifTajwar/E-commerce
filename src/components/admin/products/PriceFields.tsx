"use client";

import type { ChangeEvent } from "react";
import { Field, Input } from "@/components/admin/ui";
import { CURRENCY_SYMBOL } from "@/config/constants";
import { PREFIX, PRICE_INPUT } from "./form-classes";

export interface PriceFieldsProps {
  originalPrice: string;
  discountedPrice: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Create and edit drawers are mounted at the same time, so a bare id would
   * appear twice and every `<label for>` would point at the other form.
   */
  idPrefix: string;
}

/** Currency-prefixed price inputs, side by side so the pair reads as a pair. */
export function PriceFields({ originalPrice, discountedPrice, onChange, idPrefix }: PriceFieldsProps) {
  const overpriced =
    Number(discountedPrice) > 0 &&
    Number(originalPrice) > 0 &&
    Number(discountedPrice) > Number(originalPrice);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Regular price" htmlFor={`product-original-price-${idPrefix}`}>
        <div className="flex">
          <span className={PREFIX}>{CURRENCY_SYMBOL}</span>
          <Input
            id={`product-original-price-${idPrefix}`}
            className={PRICE_INPUT}
            inputMode="decimal"
            name="originalPrice"
            placeholder="0.00"
            value={originalPrice}
            onChange={onChange}
          />
        </div>
      </Field>

      <Field
        label="Sale price"
        htmlFor={`product-sale-price-${idPrefix}`}
        hint={overpriced ? undefined : "Must be lower than the regular price."}
        error={overpriced ? "Sale price is higher than the regular price." : undefined}
      >
        <div className="flex">
          <span className={PREFIX}>{CURRENCY_SYMBOL}</span>
          <Input
            id={`product-sale-price-${idPrefix}`}
            className={PRICE_INPUT}
            inputMode="decimal"
            name="discountedPrice"
            placeholder="0.00"
            value={discountedPrice}
            onChange={onChange}
          />
        </div>
      </Field>
    </div>
  );
}

export default PriceFields;
