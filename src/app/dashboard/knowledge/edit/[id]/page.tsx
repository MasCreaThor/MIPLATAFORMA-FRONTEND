// src/app/dashboard/knowledge/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { knowledgeService } from '@/services/knowledgeService';
import { KnowledgeForm } from '@/components/knowledge/KnowledgeForm';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/skeleton';
import { KnowledgeItem } from '@/types/knowledge';

export default function EditKnowledgePage({ params }: { params: { id: string } }) {
  const [knowledgeItem, setKnowledgeItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeItem = async () => {
      setIsLoading(true);
      try {
        const item = await knowledgeService.getKnowledgeItemById(params.id);
        setKnowledgeItem(item);
      } catch (err: any) {
        console.error('Error fetching knowledge item:', err);
        setError(err.response?.data?.message || 'Error al cargar el elemento de conocimiento');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchKnowledgeItem();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Editar Elemento de Conocimiento</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Editar Elemento de Conocimiento</h1>
        <Alert variant="destructive">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Elemento de Conocimiento</h1>
      
      <Card className="p-6">
      <KnowledgeForm initialData={knowledgeItem ? knowledgeItem : undefined} isEdit={true} />
      </Card>
    </div>
  );
}