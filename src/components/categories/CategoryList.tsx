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
  ChevronRightIcon
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
  const handleCategoryClick = (id: string) => {
    if (onCategoryClick) {
      onCategoryClick(id);
    } else {
      router.push(`/dashboard/categories/${id}`);
    }
  };

  // Función para editar una categoría
  const handleEditCategory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/dashboard/categories/edit/${id}`);
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
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
          
          <Button onClick={() => router.push('/dashboard/categories/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>
      )}
      
      {filteredCategories.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No se encontraron categorías</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id}
              className="p-4 h-full hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <FolderIcon 
                    className="h-5 w-5 mr-2" 
                    style={{ color: category.color || stringToColor(category.name) }} 
                  />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                {category.isPublic && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Pública
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                {category.description || 'Sin descripción'}
              </p>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Creado: {formatDate(category.createdAt)}
                </span>
                
                {showControls && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleCategoryClick(category.id)}
                      className="h-8 w-8 p-0"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleEditCategory(e, category.id)}
                      className="h-8 w-8 p-0"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleDeleteCategory(e, category.id, category.name)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      disabled={isDeleting}
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