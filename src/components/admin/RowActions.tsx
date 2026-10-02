"use client";

import { IconButton } from "@/components/admin/ui";

/** Edit / delete buttons shared by every admin list row. */
export default function RowActions({
  onEdit,
  onDelete,
  label,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  /** Names the record for screen readers, e.g. "Women handbag". */
  label: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit && (
        <IconButton onClick={onEdit} title="Edit" aria-label={`Edit ${label}`}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
            <path
              d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      )}
      {onDelete && (
        <IconButton tone="danger" onClick={onDelete} title="Delete" aria-label={`Delete ${label}`}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
            <path
              d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      )}
    </div>
  );
}
