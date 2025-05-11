// src/components/knowledge/KnowledgeDetail.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpenIcon, 
  FileTextIcon, 
  CodeIcon, 
  TerminalIcon, 
  LightbulbIcon, 
  EditIcon, 
  TrashIcon, 
  LinkIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon,
} from 'lucide-react';
import { KnowledgeItem, KnowledgeItemType } from '@/types/knowledge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TagBadge } from '@/components/tags/tag-badge';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteKnowledgeItem } from '@/hooks/useKnowledge';

interface KnowledgeDetailProps {
  item: KnowledgeItem;
  isLoading?: boolean;
}

export function KnowledgeDetail({ item, isLoading = false }: KnowledgeDetailProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteKnowledgeItem();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24 inline-block" />
            <Skeleton className="h-10 w-24 inline-block" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/dashboard/knowledge/edit/${item.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.')) {
      try {
        await deleteItem(item.id);
        router.push('/dashboard/knowledge');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar el elemento');
      }
    }
  };

  const getItemIcon = (type: KnowledgeItemType) => {
    switch (type) {
      case KnowledgeItemType.WIKI:
        return <BookOpenIcon className="h-6 w-6 text-blue-500" />;
      case KnowledgeItemType.NOTE:
        return <FileTextIcon className="h-6 w-6 text-green-500" />;
      case KnowledgeItemType.SNIPPET:
        return <CodeIcon className="h-6 w-6 text-purple-500" />;
      case KnowledgeItemType.COMMAND:
        return <TerminalIcon className="h-6 w-6 text-orange-500" />;
      case KnowledgeItemType.SOLUTION:
        return <LightbulbIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <FileTextIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getItemTypeName = (type: KnowledgeItemType) => {
    switch (type) {
      case KnowledgeItemType.WIKI:
        return 'Wiki';
      case KnowledgeItemType.NOTE:
        return 'Nota';
      case KnowledgeItemType.SNIPPET:
        return 'Snippet de código';
      case KnowledgeItemType.COMMAND:
        return 'Comando';
      case KnowledgeItemType.SOLUTION:
        return 'Solución';
      default:
        return 'Elemento';
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          {getItemIcon(item.type)}
          <span className="ml-2">{item.title}</span>
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <EditIcon className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Contenido principal según el tipo */}
          <Card>
            <CardHeader>
              <CardTitle>{getItemTypeName(item.type)}</CardTitle>
            </CardHeader>
            <CardContent>
              {(item.type === KnowledgeItemType.WIKI || item.type === KnowledgeItemType.NOTE) && (
                <div className="whitespace-pre-wrap">
                  {item.content || 'Sin contenido'}
                </div>
              )}

              {(item.type === KnowledgeItemType.SNIPPET) && (
                <div>
                  <div className="mb-2 text-sm text-gray-500">
                    <span className="font-medium">Lenguaje:</span> {item.codeLanguage || 'No especificado'}
                  </div>
                  <div className="p-4 bg-gray-100 rounded-md overflow-auto">
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {item.codeContent || 'Sin código'}
                    </pre>
                  </div>
                </div>
              )}

              {(item.type === KnowledgeItemType.COMMAND) && (
                <div>
                  <div className="p-4 bg-gray-800 text-white rounded-md overflow-auto">
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {item.codeContent || 'Sin comando'}
                    </pre>
                  </div>
                </div>
              )}

              {(item.type === KnowledgeItemType.SOLUTION) && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Problema</h3>
                    <div className="p-4 bg-red-50 rounded-md">
                      {item.solutionDetails?.problem || 'Sin descripción del problema'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Solución</h3>
                    <div className="p-4 bg-green-50 rounded-md">
                      {item.solutionDetails?.solution || 'Sin solución definida'}
                    </div>
                  </div>
                  {item.solutionDetails?.context && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contexto</h3>
                      <div className="p-4 bg-blue-50 rounded-md">
                        {item.solutionDetails.context}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Información y metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <EyeIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{item.isPublic ? 'Público' : 'Privado'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Usado {item.usageCount} veces</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Creado: {formatDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Actualizado: {formatDate(item.updatedAt)}</span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div>
                    <div className="flex items-center text-sm mb-2">
                      <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Etiquetas:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.tags.map((tag) => (
                        <TagBadge key={tag} name={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}