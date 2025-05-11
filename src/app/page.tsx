// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/Authprovider';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si el usuario está autenticado, redirigir al dashboard
      // Si no, redirigir al login
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Mientras se decide, mostrar pantalla de carga
  return <LoadingScreen />;
}