// src/components/categories/CategoryList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderIcon, 
  SearchIcon,
  PlusIcon,
  FolderTreeIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  ChevronRightIcon,
  ShieldIcon,
  LockIcon,
  UserIcon
} from 'lucide-react';
import { Category } from '@/services/categoryService';
import { formatDate, stringToColor } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteCategory } from '@/hooks/useCategoryOperations';
import { Badge } from '@/components/ui/badge';

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
  showControls?: boolean;
  onCategoryClick?: (id: string) => void;
}

export function CategoryList({ 
  categories, 
  isLoading = false,
  showControls = true,
  onCategoryClick
}: CategoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // Asegurarse de que nunca sea undefined
  const safeCategories = categories || [];

  // Filtrar categorías por búsqueda
  const filteredCategories = safeCategories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Función para manejar cuando se hace clic en una categoría
  const handleCategoryClick = (id?: string) => {
    if (!id) {
      console.error('Error: ID de categoría no disponible');
      return;
    }
    
    if (onCategoryClick) {
      onCategoryClick(id);
    } else {
      router.push(`/dashboard/categories/${id}`);
    }
  };

  // Función para crear una subcategoría
  const handleCreateSubcategory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/dashboard/categories/new?parentId=${id}`);
  };

  // Función para editar una categoría
  const handleEditCategory = (e: React.MouseEvent, id: string, isSystem: boolean) => {
    e.stopPropagation();
    
    // No permitir editar categorías del sistema
    if (isSystem) {
      alert('Las categorías del sistema no pueden ser editadas');
      return;
    }
    
    router.push(`/dashboard/categories/edit/${id}`);
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = (e: React.MouseEvent, id: string, name: string, isSystem: boolean) => {
    e.stopPropagation();
    
    // No permitir eliminar categorías del sistema
    if (isSystem) {
      alert('Las categorías del sistema no pueden ser eliminadas');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)) {
      deleteCategory(id, {
        onSuccess: () => {
          // La invalidación de la caché ya se maneja en el hook useDeleteCategory
        },
        onError: (error) => {
          console.error('Error deleting category:', error);
          alert('Error al eliminar la categoría. Puede que tenga elementos asociados.');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showControls && (
          <div className="flex mb-4">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Leyenda de iconos */}
            <div className="flex items-center mr-4 text-xs text-gray-500 space-x-3">
              <div className="flex items-center">
                <ShieldIcon className="h-3 w-3 text-blue-600 mr-1" />
                <span>Sistema</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-3 w-3 text-green-600 mr-1" />
                <span>Personal</span>
              </div>
            </div>
            
            {/* Botón para añadir sólo si hay categorías del sistema */}
            {filteredCategories.some(category => category.isSystem) && (
              <Button 
                onClick={() => router.push('/dashboard/categories/new')}
              >
                <span className="flex items-center">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nueva Subcategoría
                </span>
              </Button>
            )}
          </div>
        </div>
      )}
      
      {filteredCategories.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No se encontraron categorías</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category, index) => (
            <Card 
              key={category.id || `category-${index}`}
              className="p-4 h-full hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <FolderIcon 
                    className="h-5 w-5 mr-2" 
                    style={{ color: category.color || stringToColor(category.name) }} 
                  />
                  <div className="flex items-center">
                    <h3 className="font-medium">{category.name}</h3>
                    
                    {/* Icono para indicar si es del sistema o personal */}
                    <div className="ml-2">
                      {category.isSystem ? (
                        <span>
                          <ShieldIcon className="h-4 w-4 text-blue-600" aria-label="Categoría del sistema" />
                          <span className="sr-only">Categoría del sistema</span>
                        </span>
                      ) : (
                        <span>
                          <UserIcon className="h-4 w-4 text-green-600" aria-label="Categoría personal" />
                          <span className="sr-only">Categoría personal</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Icono de privacidad */}
                    {!category.isPublic && !category.isSystem && (
                      <span>
                        <LockIcon className="h-4 w-4 ml-1 text-gray-500" aria-label="Categoría privada" />
                        <span className="sr-only">Categoría privada</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                {category.description || 'Sin descripción'}
              </p>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {category.isSystem ? 'Categoría del sistema' : `Creado: ${formatDate(category.createdAt)}`}
                </span>
                
                {showControls && (
                  <div className="flex space-x-2">
                    {/* Botón para crear subcategoría (siempre disponible) */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleCreateSubcategory(e, category.id)}
                      className="h-8 w-8 p-0"
                      aria-label="Añadir subcategoría"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    
                    {/* Botón para ver detalles */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleCategoryClick(category.id)}
                      className="h-8 w-8 p-0"
                      aria-label="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    
                    {/* Botón para editar (solo para categorías del usuario) */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleEditCategory(e, category.id, Boolean(category.isSystem))}
                      className={`h-8 w-8 p-0 ${category.isSystem ? 'text-gray-300 cursor-not-allowed' : ''}`}
                      aria-label={category.isSystem ? 'No se puede editar categoría del sistema' : 'Editar categoría'}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    
                    {/* Botón para eliminar (solo para categorías del usuario) */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleDeleteCategory(e, category.id, category.name, Boolean(category.isSystem))}
                      className={`h-8 w-8 p-0 ${category.isSystem ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                      disabled={isDeleting || Boolean(category.isSystem)}
                      aria-label={category.isSystem ? 'No se puede eliminar categoría del sistema' : 'Eliminar categoría'}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}