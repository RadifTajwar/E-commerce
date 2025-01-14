'use client'
import SideBar from '@/components/ui/components/admin/dashboard/sideBar';
import TopBar from '@/components/ui/components/admin/dashboard/topBar';
import localStorageUtil from '@/utils/localStorageUtil';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  
  const isAdminRoot = pathname === '/admin';
  useEffect(() => {
      // Retrieve userEmail from localStorage whenever pathname changes
      const storedEmail = localStorageUtil.getItem('userEmail');
      console.log("storedEmail:", storedEmail);

      if (!storedEmail) {
          // Redirect to 'admin' if userEmail is missing
          router.push('/admin');
      }
  }, [pathname]); 

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Sidebar */}
      {!isAdminRoot && (
        <>
          {/* Overlay when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
            ></div>
          )}

          {/* Sidebar Component */}
          <SideBar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            className={`fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out 
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
          />
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Topbar */}
        {!isAdminRoot && (
          <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}

        {/* Page Content */}
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
