// src/app/dashboard/categories/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Card } from '@/components/ui/card';
import { useCategory } from '@/hooks/useCategoryOperations';

export default function NewCategoryPage() {
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');
  const [initialData, setInitialData] = useState<any>({});
  
  // Si hay un parentId en la URL, obtener la categoría padre para mostrar información
  const { data: parentCategory } = useCategory(parentId || '');
  
  useEffect(() => {
    // Si hay una categoría padre, establecerla como parentId en el formulario
    if (parentId) {
      setInitialData({ parentId });
    }
  }, [parentId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Crear Nueva Categoría</h1>
      
      {parentCategory && (
        <p className="text-gray-500 mb-6">
          Creando subcategoría en: <strong>{parentCategory.name}</strong>
        </p>
      )}
      
      <Card className="p-6">
        <CategoryForm initialData={initialData} />
      </Card>
    </div>
  );
}