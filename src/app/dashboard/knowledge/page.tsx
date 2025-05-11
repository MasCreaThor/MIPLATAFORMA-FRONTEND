// src/app/dashboard/knowledge/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { KnowledgeItemFilters, KnowledgeItem } from '@/types/knowledge';
import { knowledgeService } from '@/services/knowledgeService';
import { KnowledgeList } from '@/components/knowledge/KnowledgeList';
import { KnowledgeFilters } from '@/components/knowledge/KnowledgeFilters';

export default function KnowledgePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<KnowledgeItemFilters>({
    search: '',
    types: [],
    categoryId: '',
    tags: [],
  });

  useEffect(() => {
    fetchKnowledgeItems();
  }, [filters]);

  const fetchKnowledgeItems = async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeService.getKnowledgeItems(filters);
      setKnowledgeItems(data);
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: KnowledgeItemFilters) => {
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
      </div>

      <KnowledgeFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <KnowledgeList 
        items={knowledgeItems} 
        isLoading={isLoading}
      />
    </div>
  );
}