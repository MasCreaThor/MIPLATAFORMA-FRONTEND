// src/components/layouts/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/Authprovider';
import { 
  HomeIcon, 
  FileTextIcon, 
  BookOpenIcon, 
  FolderIcon, 
  TagIcon, 
  LayoutDashboardIcon, 
  BriefcaseIcon, 
  BellIcon, 
  UsersIcon, 
  SettingsIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, currentPath }: SidebarProps) {
  const { user } = useAuth();

  // Definir enlaces de navegación
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Recursos', href: '/dashboard/resources', icon: FileTextIcon },
    { name: 'Conocimiento', href: '/dashboard/knowledge', icon: BookOpenIcon },
    { name: 'Proyectos', href: '/dashboard/projects', icon: BriefcaseIcon },
    { name: 'Categorías', href: '/dashboard/categories', icon: FolderIcon },
    { name: 'Etiquetas', href: '/dashboard/tags', icon: TagIcon },
    { name: 'Actividad', href: '/dashboard/activity', icon: LayoutDashboardIcon },
    { name: 'Notificaciones', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Configuración', href: '/dashboard/settings', icon: SettingsIcon },
  ];

  // Mobile sidebar
  const MobileSidebar = () => (
    <div className={`lg:hidden fixed inset-0 z-40 flex ${sidebarOpen ? 'visible' : 'invisible'}`}>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Cerrar sidebar</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        
        {/* Contenido del sidebar para móvil */}
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-xl font-bold text-primary-600">Mi Plataforma</span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPath.startsWith(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-4 h-6 w-6 ${
                    currentPath.startsWith(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Perfil de usuario para móvil */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link href="/dashboard/profile" className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={user?.profile?.profileImageUrl || "https://via.placeholder.com/40"}
                  alt={`${user?.profile?.firstName || 'Usuario'} ${user?.profile?.lastName || ''}`}
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.profile?.firstName || 'Usuario'} {user?.profile?.lastName || ''}
                </p>
                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {user?.email || 'usuario@email.com'}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* Force sidebar to shrink to fit close icon */}
      </div>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-primary-600">Mi Plataforma</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    currentPath.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      currentPath.startsWith(item.href)
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Perfil de usuario para desktop */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link href="/dashboard/profile" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.profile?.profileImageUrl || "https://via.placeholder.com/36"}
                    alt={`${user?.profile?.firstName || 'Usuario'} ${user?.profile?.lastName || ''}`}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.profile?.firstName || 'Usuario'} {user?.profile?.lastName || ''}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 truncate max-w-[180px]">
                    {user?.email || 'usuario@email.com'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}