"use client";

import { useState } from "react";
import { Button, Input, Mono } from "@/components/admin/ui";

/**
 * Tracking number: shown once set, otherwise an inline entry field.
 * Locked on finished orders, where a courier reference no longer applies.
 */
export default function TrackCodeCell({
  status,
  trackCode,
  onSave,
}: {
  status: string;
  trackCode?: string;
  onSave: (code: string) => void;
}) {
  const [value, setValue] = useState("");
  const locked = status === "Delivered" || status === "Cancel";

  if (trackCode) return <Mono>{trackCode}</Mono>;
  if (locked) return <span className="text-xs text-slate-400 dark:text-slate-500">—</span>;

  return (
    <form
      className="flex items-center gap-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        const code = value.trim();
        if (code) onSave(code);
      }}
    >
      <Input
        aria-label="Tracking number"
        className="h-9 w-[150px] px-2.5 py-0 text-xs"
        placeholder="Add tracking"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        type="submit"
        variant="secondary"
        disabled={!value.trim()}
        className="h-9 px-3 py-0 text-xs"
      >
        Save
      </Button>
    </form>
  );
}
