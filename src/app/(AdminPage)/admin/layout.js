"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ROUTES } from "@/config/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminRoot = pathname === ROUTES.admin.login;
  // Admin access is enforced server-side in middleware.ts (role "admin").

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* One toast host for the whole admin area. */}
      <ToastContainer />

      {!isAdminRoot && (
        <>
          {/* Overlay when sidebar is open */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
          )}

          <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {!isAdminRoot && <AdminTopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

        <main className="h-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
