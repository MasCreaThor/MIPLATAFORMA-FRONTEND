// src/app/dashboard/categories/page.tsx
'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategoryOperations';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryTree } from '@/components/categories/CategoryTree';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InfoIcon, ListIcon, FolderTreeIcon } from 'lucide-react';

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <p className="text-gray-500 mt-1">
          Organiza tus recursos y conocimientos mediante categorías jerárquicas.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <InfoIcon className="h-4 w-4 mr-2" />
            <div>
              <p>Error al cargar categorías. Por favor, intente de nuevo.</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="list" 
            onClick={() => setViewMode('list')}
            className="flex items-center"
          >
            <ListIcon className="h-4 w-4 mr-2" />
            Vista de Lista
          </TabsTrigger>
          <TabsTrigger 
            value="tree" 
            onClick={() => setViewMode('tree')}
            className="flex items-center"
          >
            <FolderTreeIcon className="h-4 w-4 mr-2" />
            Vista de Árbol
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <CategoryList 
            categories={categories || []} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="tree">
          <CategoryTree />
        </TabsContent>
      </Tabs>
    </div>
  );
}