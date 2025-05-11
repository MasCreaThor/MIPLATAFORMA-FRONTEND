// src/app/dashboard/knowledge/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { knowledgeService } from '@/services/knowledgeService';
import { KnowledgeDetail } from '@/components/knowledge/KnowledgeDetail';
import { RelatedItems } from '@/components/knowledge/RelatedItems';
import { Alert } from '@/components/ui/alert';
import { KnowledgeItem } from '@/types/knowledge';
import { LoadingSpinner } from '@/components/ui/skeleton';

export default function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [knowledgeItem, setKnowledgeItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeItem = async () => {
      setIsLoading(true);
      try {
        const item = await knowledgeService.getKnowledgeItemById(params.id);
        setKnowledgeItem(item);
        
        // Incrementar contador de uso
        await knowledgeService.incrementUsage(params.id);
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

  const handleRelatedItemClick = (id: string) => {
    router.push(`/dashboard/knowledge/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Detalle de Conocimiento</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {error ? (
        <Alert variant="destructive">
          {error}
        </Alert>
      ) : (
        <div className="space-y-6">
          {knowledgeItem && (
            <>
              <KnowledgeDetail item={knowledgeItem} isLoading={isLoading} />
              <RelatedItems itemId={params.id} onItemClick={handleRelatedItemClick} />
            </>
          )}
        </div>
      )}
    </div>
  );
}