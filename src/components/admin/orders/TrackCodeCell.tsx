"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button, IconButton, Input, Mono } from "@/components/admin/ui";

/** Suggested delivery companies; any other name can still be typed. */
const COURIERS = [
  "Pathao Courier",
  "Steadfast Courier",
  "RedX",
  "Sundarban Courier Service",
  "SA Paribahan",
  "eCourier",
  "Paperfly",
  "Delivery Tiger",
];
const COURIER_LIST_ID = "courier-options";

/** Render once per page: the suggestion list every courier field points to. */
export function CourierOptions() {
  return (
    <datalist id={COURIER_LIST_ID}>
      {COURIERS.map((name) => (
        <option key={name} value={name} />
      ))}
    </datalist>
  );
}

export interface Tracking {
  courier: string;
  trackCode: string;
}

/**
 * Delivery company and its tracking ID. Shown once set, with an edit button:
 * a mistyped ID must be fixable, and saving a change emails the customer the
 * corrected details. Locked on finished orders, where tracking no longer applies.
 */
export default function TrackCodeCell({
  status,
  trackCode,
  courier,
  onSave,
}: {
  status: string;
  trackCode?: string;
  courier?: string;
  /** Resolves true once saved, so the editor only closes on success. */
  onSave: (tracking: Tracking) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Tracking>({ courier: "", trackCode: "" });
  const locked = status === "Delivered" || status === "Cancel";

  if (trackCode && !editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="min-w-0">
          {courier && (
            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{courier}</span>
          )}
          <Mono>{trackCode}</Mono>
        </div>
        {!locked && (
          <IconButton
            aria-label="Edit tracking"
            title="Edit tracking"
            onClick={() => {
              setDraft({ courier: courier ?? "", trackCode });
              setEditing(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </IconButton>
        )}
      </div>
    );
  }
  if (locked) return <span className="text-xs text-slate-400 dark:text-slate-500">—</span>;

  const next = { courier: draft.courier.trim(), trackCode: draft.trackCode.trim() };
  const complete = Boolean(next.courier && next.trackCode);
  const unchanged = next.courier === (courier ?? "") && next.trackCode === (trackCode ?? "");

  return (
    <form
      className="flex flex-wrap items-center gap-1.5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!complete || saving) return;
        // Saving identical details would only re-send the customer the same email.
        if (unchanged) return setEditing(false);
        setSaving(true);
        const saved = await onSave(next);
        setSaving(false);
        if (saved) setEditing(false);
      }}
    >
      <Input
        aria-label="Delivery company"
        list={COURIER_LIST_ID}
        className="h-9 w-[150px] px-2.5 py-0 text-xs"
        placeholder="Courier"
        value={draft.courier}
        onChange={(e) => setDraft((d) => ({ ...d, courier: e.target.value }))}
      />
      <Input
        aria-label="Tracking ID"
        className="h-9 w-[140px] px-2.5 py-0 text-xs"
        placeholder="Tracking ID"
        value={draft.trackCode}
        onChange={(e) => setDraft((d) => ({ ...d, trackCode: e.target.value }))}
      />
      <Button
        type="submit"
        variant="secondary"
        disabled={!complete || saving}
        className="h-9 px-3 py-0 text-xs"
      >
        {saving ? "Saving…" : "Save"}
      </Button>
      {editing && (
        <Button
          type="button"
          variant="ghost"
          disabled={saving}
          className="h-9 px-2.5 py-0 text-xs"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      )}
    </form>
  );
}
