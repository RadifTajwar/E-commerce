"use client";

/** The dimmed backdrop behind the login / sidebar / cart drawers. */
export interface DrawerOverlayProps {
  open: boolean;
  onClick: () => void;
}

export default function DrawerOverlay({ open, onClick }: DrawerOverlayProps) {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClick} />;
}
