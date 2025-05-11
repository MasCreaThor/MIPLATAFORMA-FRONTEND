// src/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Sidebar';
import { Header } from '@/components/layouts/Header';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redireccionar al login si no está autenticado
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPath={pathname}
      />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}