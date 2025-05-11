// src/components/knowledge/RelatedItems.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  TrashIcon, 
  BookOpenIcon, 
  FileTextIcon, 
  CodeIcon, 
  TerminalIcon, 
  LightbulbIcon,
  SearchIcon,
  XIcon
} from 'lucide-react';
import { KnowledgeItem, KnowledgeItemType } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useRelatedKnowledgeItems, 
  useAddRelatedItem, 
  useRemoveRelatedItem,
  useKnowledgeItems 
} from '@/hooks/useKnowledge';

interface RelatedItemsProps {
  itemId: string;
  onItemClick?: (id: string) => void;
}

export function RelatedItems({ itemId, onItemClick }: RelatedItemsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Consultar elementos relacionados
  const { 
    data: relatedItems, 
    isLoading: relatedLoading 
  } = useRelatedKnowledgeItems(itemId);
  
  // Mutaciones para agregar o eliminar relaciones
  const { mutateAsync: addRelated, isPending: isAdding } = useAddRelatedItem(itemId);
  const { mutateAsync: removeRelated, isPending: isRemoving } = useRemoveRelatedItem(itemId);

  // Búsqueda de elementos para agregar
  const { 
    data: allItems,
    isLoading: allItemsLoading 
  } = useKnowledgeItems(
    { search: searchQuery },
    { enabled: showAddDialog }
  );

  // Filtrar los elementos que no están ya relacionados
  const nonRelatedItems = allItems?.filter(
    item => item.id !== itemId && !relatedItems?.some(related => related.id === item.id)
  ) || [];

  const handleAddItem = async (relatedId: string) => {
    try {
      await addRelated(relatedId);
      setShowAddDialog(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding related item:', error);
    }
  };

  const handleRemoveItem = async (relatedId: string) => {
    try {
      await removeRelated(relatedId);
    } catch (error) {
      console.error('Error removing related item:', error);
    }
  };

  const getItemIcon = (type: KnowledgeItemType) => {
    switch (type) {
      case KnowledgeItemType.WIKI:
        return <BookOpenIcon className="h-5 w-5 text-blue-500" />;
      case KnowledgeItemType.NOTE:
        return <FileTextIcon className="h-5 w-5 text-green-500" />;
      case KnowledgeItemType.SNIPPET:
        return <CodeIcon className="h-5 w-5 text-purple-500" />;
      case KnowledgeItemType.COMMAND:
        return <TerminalIcon className="h-5 w-5 text-orange-500" />;
      case KnowledgeItemType.SOLUTION:
        return <LightbulbIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Elementos relacionados</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setShowAddDialog(!showAddDialog)}
          className="ml-auto"
        >
          {showAddDialog ? (
            <XIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {showAddDialog ? (
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar elementos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {allItemsLoading ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : nonRelatedItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No se encontraron elementos
                </p>
              ) : (
                <ul className="space-y-2">
                  {nonRelatedItems.map((item) => (
                    <li 
                      key={item.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        {getItemIcon(item.type)}
                        <span className="ml-2 truncate">{item.title}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAddItem(item.id)}
                        disabled={isAdding}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : relatedLoading ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !relatedItems || relatedItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay elementos relacionados
          </p>
        ) : (
          <ul className="space-y-2">
            {relatedItems.map((item) => (
              <li 
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <div 
                  className="flex items-center flex-1 min-w-0 cursor-pointer"
                  onClick={() => onItemClick ? onItemClick(item.id) : window.location.href = `/dashboard/knowledge/${item.id}`}
                >
                  {getItemIcon(item.type)}
                  <span className="ml-2 truncate">{item.title}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isRemoving}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}