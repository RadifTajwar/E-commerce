"use client";

import { SHIPPING_OPTIONS } from "@/config/constants";

interface ShippingOptionsProps {
  value: number;
  onChange: (cost: number) => void;
}

/** The shipping radio list shown in the cart totals and in the order summary. */
export default function ShippingOptions({ value, onChange }: ShippingOptionsProps) {
  return (
    <>
      <ul className="space-y-4">
        {SHIPPING_OPTIONS.map((option) => (
          <li key={option.id} className="flex items-start justify-end text-end space-x-2">
            <p className="text-sm text-black font-normal">
              {option.label}: ${option.cost.toFixed(2)}
            </p>
            <input
              type="radio"
              name="shipping_method"
              value={option.cost}
              checked={value === option.cost}
              onChange={(e) => onChange(Number(e.target.value))}
              className="shipping_method mt-1"
            />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-700">Selected Shipping Cost: ${value}</p>
    </>
  );
}
