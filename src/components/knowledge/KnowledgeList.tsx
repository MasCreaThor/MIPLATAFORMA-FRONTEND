// src/components/knowledge/KnowledgeList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpenIcon, 
  FileTextIcon, 
  CodeIcon, 
  TerminalIcon, 
  LightbulbIcon, 
  SearchIcon,
  PlusIcon
} from 'lucide-react';
import { KnowledgeItem, KnowledgeItemType } from '@/types/knowledge';
import { formatDate, truncateText } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/tags/tag-badge';
import { Skeleton } from '@/components/ui/skeleton';

interface KnowledgeListProps {
  items: KnowledgeItem[];
  isLoading?: boolean;
  showFilters?: boolean;
  onItemClick?: (id: string) => void;
}

export function KnowledgeList({ 
  items, 
  isLoading = false, 
  showFilters = true,
  onItemClick
}: KnowledgeListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

// Asegurarse de que nunca sea undefined
const safeItems = items || [];

// Usar safeItems en el filtrado
const filteredItems = safeItems.filter(item => 
  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (item.codeContent && item.codeContent.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
);

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

  const handleItemClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    } else {
      router.push(`/dashboard/knowledge/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="flex mb-4">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar conocimiento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button onClick={() => router.push('/dashboard/knowledge/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo Elemento
          </Button>
        </div>
      )}
      
      {filteredItems.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No se encontraron elementos de conocimiento</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id || `knowledge-item-${index}`}
              className="cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              <Card className="p-4 h-full hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getItemIcon(item.type)}
                    <h3 className="ml-2 font-medium">{item.title}</h3>
                  </div>
                </div>
                
                {item.type === KnowledgeItemType.SNIPPET && (
                  <div className="my-2 p-2 bg-gray-100 rounded text-sm font-mono overflow-hidden">
                    {truncateText(item.codeContent || '', 100)}
                  </div>
                )}
                
                {(item.type === KnowledgeItemType.WIKI || item.type === KnowledgeItemType.NOTE) && (
                  <p className="text-sm text-gray-500 mb-3">
                    {truncateText(item.content || 'Sin contenido', 100)}
                  </p>
                )}
                
                {item.type === KnowledgeItemType.COMMAND && (
                  <div className="my-2 p-2 bg-gray-800 text-white rounded text-sm font-mono overflow-hidden">
                    {truncateText(item.codeContent || '', 100)}
                  </div>
                )}
                
                {item.type === KnowledgeItemType.SOLUTION && (
                  <p className="text-sm text-gray-500 mb-3">
                    {truncateText(item.solutionDetails?.problem || 'Sin problema definido', 100)}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags && item.tags.map((tag) => (
                    <TagBadge key={tag} name={tag} />
                  ))}
                </div>
                
                <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span>Creado: {formatDate(item.createdAt)}</span>
                  <span>Usos: {item.usageCount}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}