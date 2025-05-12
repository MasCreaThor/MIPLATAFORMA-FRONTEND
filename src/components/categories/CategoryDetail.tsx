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
  LockIcon,
  ShieldIcon,
  UserIcon
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
    // No permitir editar categorías del sistema
    if (category.isSystem) {
      setError('No se pueden editar las categorías del sistema');
      return;
    }
    
    router.push(`/dashboard/categories/edit/${category.id}`);
  };

  const handleDelete = async () => {
    // No permitir eliminar categorías del sistema
    if (category.isSystem) {
      setError('No se pueden eliminar las categorías del sistema');
      return;
    }
    
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

  // Componente para mostrar un badge con el tipo de categoría
  const CategoryTypeBadge = () => {
    if (category.isSystem) {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center">
          <ShieldIcon className="h-3 w-3 mr-1" />
          Sistema
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center">
          <UserIcon className="h-3 w-3 mr-1" />
          Personal
        </Badge>
      );
    }
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
          <div className="ml-2 flex space-x-2">
            <CategoryTypeBadge />
            
            {!category.isPublic && !category.isSystem && (
              <Badge className="bg-gray-100 text-gray-800 flex items-center">
                <LockIcon className="h-3 w-3 mr-1" />
                Privada
              </Badge>
            )}
            
            {category.isPublic && !category.isSystem && (
              <Badge className="bg-green-100 text-green-800 flex items-center">
                <UsersIcon className="h-3 w-3 mr-1" />
                Pública
              </Badge>
            )}
          </div>
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleEdit}
            disabled={category.isSystem}
            title={category.isSystem ? "No se pueden editar categorías del sistema" : "Editar categoría"}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting || category.isSystem}
            title={category.isSystem ? "No se pueden eliminar categorías del sistema" : "Eliminar categoría"}
          >
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
              
              {category.isSystem && (
                <div className="p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                  <p>Esta es una categoría del sistema que sirve como categoría principal. Puedes crear tus propias subcategorías personalizadas bajo esta categoría.</p>
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
                showControls={true}
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
                  <div className="flex items-center flex-1">
                    <span className="font-medium mr-2">Tipo:</span>
                    {category.isSystem ? (
                      <span className="flex items-center">
                        <ShieldIcon className="h-4 w-4 text-blue-600 mr-1" />
                        Sistema
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserIcon className="h-4 w-4 text-green-600 mr-1" />
                        Personal
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <div className="flex items-center flex-1">
                    <span className="font-medium mr-2">Visibilidad:</span>
                    {category.isPublic || category.isSystem ? (
                      <span className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-green-600 mr-1" />
                        {category.isSystem ? 'Visible para todos los usuarios' : 'Pública'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LockIcon className="h-4 w-4 text-gray-600 mr-1" />
                        Privada (solo tú puedes verla)
                      </span>
                    )}
                  </div>
                </div>
                
                {!category.isSystem && (
                  <>
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Creado: {formatDate(category.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Actualizado: {formatDate(category.updatedAt)}</span>
                    </div>
                  </>
                )}

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