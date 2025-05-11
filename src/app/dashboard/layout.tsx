// src/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Sidebar';
import { Header } from '@/components/layouts/Header';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  // No renderizar el contenido si no hay usuario
  if (!user) {
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