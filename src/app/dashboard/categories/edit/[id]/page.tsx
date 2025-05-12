// src/app/dashboard/categories/edit/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCategory } from '@/hooks/useCategoryOperations';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/skeleton';
import { InfoIcon } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: category, isLoading, error } = useCategory(params.id);

  useEffect(() => {
    // Si hay error (como 404) y ya terminó de cargar, ir a la página principal
    if (error && !isLoading) {
      console.error('Error loading category for edit:', error);
      setTimeout(() => {
        router.push('/dashboard/categories');
      }, 3000);
    }
  }, [error, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner />
          <span className="ml-2">Cargando categoría...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4 mr-2" />
          <div>
            <p>Error al cargar la categoría. Redirigiendo...</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
      
      {category && (
        <Card className="p-6">
          <CategoryForm initialData={category} isEdit={true} />
        </Card>
      )}
    </div>
  );
}