'use client'
import SideBar from '@/components/ui/components/admin/dashboard/sideBar';
import TopBar from '@/components/ui/components/admin/dashboard/topBar';
import { usePathname } from 'next/navigation';

export default function layout({ children }) {
  const pathname = usePathname();

  // Check if the pathname is exactly "/admin"
  const isAdminRoot = pathname === '/admin';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Conditionally render SideBar */}
      {!isAdminRoot && <SideBar />}

      <div className="full_container flex flex-col flex-1 w-full">
        {/* Conditionally render TopBar */}
        {!isAdminRoot && <TopBar />}

        {/* Main content area */}
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
