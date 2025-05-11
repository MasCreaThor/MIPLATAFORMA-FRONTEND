// src/components/resources/ResourceFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FilterIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  XCircleIcon 
} from 'lucide-react';
import { ResourceType, ResourceFilters } from '@/types/resource';
import { Category } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TagBadge } from '@/components/tags/tag-badge';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';

interface ResourceFiltersProps {
  filters: ResourceFilters;
  onFilterChange: (filters: ResourceFilters) => void;
}

export function ResourceFilters({ filters, onFilterChange }: ResourceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(filters.types || []);
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.categoryId || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [isPublic, setIsPublic] = useState<boolean | undefined>(filters.isPublic);
  
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags, isLoading: tagsLoading } = useTags({ limit: 20, popular: true });

  // Aplicar los filtros cuando cambien
  useEffect(() => {
    onFilterChange({
      ...filters,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      categoryId: selectedCategory || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      isPublic,
    });
  }, [selectedTypes, selectedCategory, selectedTags, isPublic]);

  const toggleType = (type: ResourceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleIsPublicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'true') setIsPublic(true);
    else if (value === 'false') setIsPublic(false);
    else setIsPublic(undefined);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategory('');
    setSelectedTags([]);
    setIsPublic(undefined);
  };

  // Determinar si hay filtros activos
  const hasActiveFilters = selectedTypes.length > 0 || 
    selectedCategory || 
    selectedTags.length > 0 || 
    isPublic !== undefined;

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium">Filtros</h3>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {selectedTypes.length + (selectedCategory ? 1 : 0) + selectedTags.length + (isPublic !== undefined ? 1 : 0)}
              </span>
            )}
          </div>
          <div className="flex items-center">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}
                className="mr-2 text-sm text-gray-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Filtro por tipo */}
            <div>
              <h4 className="text-sm font-medium mb-2">Tipo de recurso</h4>
              <div className="flex flex-wrap gap-2">
                {Object.values(ResourceType).map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleType(type)}
                    className="text-xs"
                  >
                    {type === ResourceType.DOCUMENTATION && "Documentación"}
                    {type === ResourceType.TUTORIAL && "Tutorial"}
                    {type === ResourceType.LINK && "Enlace"}
                    {type === ResourceType.FILE && "Archivo"}
                    {type === ResourceType.VIDEO && "Video"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtro por categoría */}
            <div>
              <h4 className="text-sm font-medium mb-2">Categoría</h4>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                disabled={categoriesLoading}
              >
                <option value="">Todas las categorías</option>
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por etiquetas */}
            <div>
              <h4 className="text-sm font-medium mb-2">Etiquetas</h4>
              <div className="flex flex-wrap gap-2">
                {tagsLoading ? (
                  <p className="text-sm text-gray-500">Cargando etiquetas...</p>
                ) : tags?.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay etiquetas disponibles</p>
                ) : (
                  tags?.map((tag) => (
                    <div 
                      key={tag.id} 
                      onClick={() => toggleTag(tag.name)}
                      className={`cursor-pointer ${selectedTags.includes(tag.name) ? 'ring-2 ring-primary-500' : ''}`}
                    >
                      <TagBadge name={tag.name} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Filtro por visibilidad */}
            <div>
              <h4 className="text-sm font-medium mb-2">Visibilidad</h4>
              <select
                value={isPublic === undefined ? '' : isPublic.toString()}
                onChange={handleIsPublicChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Públicos</option>
                <option value="false">Privados</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}