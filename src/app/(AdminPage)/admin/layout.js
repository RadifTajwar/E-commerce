"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminThemeScope from "@/components/admin/AdminThemeScope";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ROUTES } from "@/config/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Admin shell: fixed sidebar, sticky top bar, scrolling content.
 *
 * Content spans the full width of the pane with a single gutter rather than
 * the old centred `max-w-4xl`, which left tables stranded in the middle of a
 * wide screen with empty space either side.
 */
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminRoot = pathname === ROUTES.admin.login;
  // Admin access is enforced server-side in middleware.ts (role "admin").

  if (isAdminRoot) {
    return (
      <>
        <AdminThemeScope />
        <ToastContainer position="bottom-right" theme="colored" />
        {children}
      </>
    );
  }

  return (
    <div className="flex h-[100svh] overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AdminThemeScope />
      <ToastContainer position="bottom-right" theme="colored" />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
        {/* Fixed height, no page scroll: each screen lays itself out as a
            column and hands the scroll to its list. */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
