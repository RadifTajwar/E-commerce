"use client";

import type { ReactNode } from "react";

export interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Panel width from `sm` up. Product forms use the wider panel. */
  width?: "half" | "wide";
  children: ReactNode;
}

/**
 * The slide-in panel (plus its click-away overlay) shared by every admin
 * add/update form. Children stay mounted so the forms keep fetching the
 * record they were handed, exactly as before.
 */
export function AdminDrawer({ isOpen, onClose, width = "half", children }: AdminDrawerProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose} />}

      <div
        className={`drawer-content-wrapper w-full ${
          width === "wide" ? "sm:w-8/12" : "sm:w-1/2"
        } fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default AdminDrawer;
