// src/components/categories/CategoryDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderIcon, 
  EditIcon, 
  TrashIcon,
  CalendarIcon,
  EyeIcon,
  FolderPlusIcon,
  UsersIcon,
  LockIcon
} from 'lucide-react';
import { Category } from '@/services/categoryService';
import { formatDate, stringToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteCategory, useCategoryChildren } from '@/hooks/useCategoryOperations';
import { Badge } from '@/components/ui/badge';
import { CategoryList } from './CategoryList';

interface CategoryDetailProps {
  category: Category;
  isLoading?: boolean;
}

export function CategoryDetail({ category, isLoading = false }: CategoryDetailProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  
  // Obtener categorías hijas
  const { 
    data: childCategories, 
    isLoading: childrenLoading, 
    error: childrenError
  } = useCategoryChildren(category?.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24 inline-block" />
            <Skeleton className="h-10 w-24 inline-block" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/dashboard/categories/edit/${category.id}`);
  };

  const handleDelete = async () => {
    if (!category.id) {
      setError('Error: ID de categoría no disponible');
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteCategory(category.id);
        router.push('/dashboard/categories');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar la categoría');
      }
    }
  };

  const handleAddChild = () => {
    // Navegar a nueva categoría con el ID del padre preseleccionado
    router.push(`/dashboard/categories/new?parentId=${category.id}`);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <FolderIcon 
            className="mr-2 h-6 w-6" 
            style={{ color: category.color || stringToColor(category.name) }}
          />
          <span>{category.name}</span>
          {category.isPublic && (
            <Badge className="ml-2 bg-green-100 text-green-800">
              Pública
            </Badge>
          )}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <EditIcon className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Descripción e información principal */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la categoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                <p className="mt-1">
                  {category.description || 'Esta categoría no tiene descripción.'}
                </p>
              </div>
              
              {category.parentId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Categoría Padre</h3>
                  <p className="mt-1">
                    {/* Nota: Podríamos mostrar el nombre del padre, pero necesitaríamos 
                        hacer una consulta adicional para obtenerlo */}
                    ID: {category.parentId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subcategorías (categorías hijas) */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Subcategorías</h2>
              <Button onClick={handleAddChild}>
                <FolderPlusIcon className="mr-2 h-4 w-4" />
                Añadir subcategoría
              </Button>
            </div>
            
            {childrenLoading ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-center items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-32 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ) : childrenError ? (
              <Alert variant="destructive">
                Error al cargar subcategorías
              </Alert>
            ) : !childCategories || childCategories.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No hay subcategorías en esta categoría
                </CardContent>
              </Card>
            ) : (
              <CategoryList 
                categories={childCategories} 
                showControls={false}
              />
            )}
          </div>
        </div>

        <div>
          {/* Información adicional y metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  {category.isPublic ? (
                    <>
                      <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Visible para todos los usuarios</span>
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Privada (solo tú puedes verla)</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Creado: {formatDate(category.createdAt)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Actualizado: {formatDate(category.updatedAt)}</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-2">Color</h3>
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded mr-2" 
                      style={{ backgroundColor: category.color || stringToColor(category.name) }}
                    ></div>
                    <span className="text-sm">{category.color || 'Generado automáticamente'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}