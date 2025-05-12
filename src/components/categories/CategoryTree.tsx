// src/components/categories/CategoryTree.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FolderIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  PlusIcon,
  Loader2Icon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category } from '@/services/categoryService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { stringToColor } from '@/lib/utils';
import { useRootCategories, useCategoryChildren } from '@/hooks/useCategoryOperations';

interface CategoryNodeProps {
  category: Category;
  level: number;
  onSelect?: (category: Category) => void;
}

const CategoryNode = ({ category, level, onSelect }: CategoryNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { data: categoryChildren, isLoading: childrenLoading } = useCategoryChildren(
    expanded ? category.id : ''
  );

  useEffect(() => {
    if (categoryChildren) {
      setChildren(categoryChildren);
      setIsLoading(false);
    }
  }, [categoryChildren]);

  const toggleExpand = async () => {
    if (!expanded && children.length === 0) {
      setIsLoading(true);
    }
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(category);
    } else {
      router.push(`/dashboard/categories/${category.id}`);
    }
  };

  return (
    <div className="category-node">
      <div 
        className={`flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer ${level > 0 ? 'ml-6' : ''}`}
        style={{ paddingLeft: `${(level) * 0.5 + 0.5}rem` }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-6 w-6 mr-2"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isLoading || childrenLoading ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : expanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
        
        <div 
          className="flex items-center flex-1 py-1" 
          onClick={handleSelect}
        >
          <FolderIcon 
            className="h-5 w-5 mr-2" 
            style={{ color: category.color || stringToColor(category.name) }}
          />
          <span className="truncate">{category.name}</span>
          
          {category.isPublic && (
            <Badge className="ml-2 bg-green-100 text-green-800">
              Pública
            </Badge>
          )}
        </div>
      </div>
      
      {expanded && children.length > 0 && (
        <div className="children">
          {children.map((child) => (
            <CategoryNode 
              key={child.id} 
              category={child} 
              level={level + 1} 
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryTreeProps {
  onSelectCategory?: (category: Category) => void;
}

export function CategoryTree({ onSelectCategory }: CategoryTreeProps) {
  const { data: rootCategories, isLoading, error } = useRootCategories();
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Jerarquía de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2Icon className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Cargando categorías...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Jerarquía de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-500">
            Error al cargar categorías. Por favor, intente de nuevo.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Jerarquía de Categorías</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/dashboard/categories/new')}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nueva
        </Button>
      </CardHeader>
      <CardContent>
        {!rootCategories || rootCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay categorías disponibles
          </div>
        ) : (
          <div className="space-y-1">
            {rootCategories.map((category) => (
              <CategoryNode 
                key={category.id} 
                category={category} 
                level={0}
                onSelect={onSelectCategory}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}