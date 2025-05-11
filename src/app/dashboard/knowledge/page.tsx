// src/app/dashboard/knowledge/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { KnowledgeItemFilters, KnowledgeItem } from '@/types/knowledge';
import { knowledgeService } from '@/services/knowledgeService';
import { KnowledgeList } from '@/components/knowledge/KnowledgeList';
import { KnowledgeFilters } from '@/components/knowledge/KnowledgeFilters';
import { Alert } from '@/components/ui/alert';

export default function KnowledgePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KnowledgeItemFilters>({});

  useEffect(() => {
    fetchKnowledgeItems();
  }, [filters]);

  const fetchKnowledgeItems = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching knowledge items with filters:", filters);
      const data = await knowledgeService.getKnowledgeItems(filters);
      console.log("Received knowledge items:", data);
      setKnowledgeItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching knowledge items:', error);
      setError(error?.message || 'Error al cargar los elementos de conocimiento');
      setKnowledgeItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: KnowledgeItemFilters) => {
    console.log("Filters changed:", newFilters);
    setFilters(current => ({
      ...current,
      ...newFilters
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Conocimiento</h1>
        <p className="text-gray-500">Gestiona tus wikis, notas, snippets, comandos y soluciones.</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      <KnowledgeFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <KnowledgeList 
        items={knowledgeItems} 
        isLoading={isLoading}
      />
    </div>
  );
}