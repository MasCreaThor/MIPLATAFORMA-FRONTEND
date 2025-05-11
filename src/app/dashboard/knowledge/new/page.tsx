// src/app/dashboard/knowledge/new/page.tsx

'use client';

import { KnowledgeForm } from '@/components/knowledge/KnowledgeForm';
import { Card } from '@/components/ui/card';

export default function NewKnowledgePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Elemento de Conocimiento</h1>
      
      <Card className="p-6">
        <KnowledgeForm />
      </Card>
    </div>
  );
}