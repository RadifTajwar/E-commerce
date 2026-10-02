"use client";

import { Select } from "@/components/admin/ui";
import { ORDER_STATUSES } from "@/config/constants";

/**
 * Status changer for one order row. Delivered and cancelled orders are final,
 * so the control locks rather than silently allowing a reversal.
 */
export default function OrderStatusSelect({
  status,
  onChange,
  disabled,
}: {
  status: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const final = status === "Delivered" || status === "Cancel";
  return (
    <Select
      aria-label="Order status"
      className="h-9 w-[130px] px-2.5 py-0 text-xs"
      value={status}
      disabled={disabled || final}
      title={final ? `${status} orders cannot be changed` : "Change status"}
      onChange={(e) => onChange(e.target.value)}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
