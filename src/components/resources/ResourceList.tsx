// src/components/resources/ResourceList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileIcon, 
  LinkIcon, 
  BookOpenIcon, 
  VideoIcon, 
  FileTextIcon, 
  SearchIcon,
  PlusIcon
} from 'lucide-react';
import { Resource, ResourceType } from '@/types/resource';
import { formatDate, truncateText } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/tags/tag-badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ResourceListProps {
  resources: Resource[];
  isLoading?: boolean;
  showFilters?: boolean;
  onResourceClick?: (id: string) => void;
}

export function ResourceList({ 
  resources, 
  isLoading = false, 
  showFilters = true,
  onResourceClick
}: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredResources = resources?.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  ) || [];

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.DOCUMENTATION:
        return <FileTextIcon className="h-5 w-5 text-blue-500" />;
      case ResourceType.TUTORIAL:
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case ResourceType.LINK:
        return <LinkIcon className="h-5 w-5 text-purple-500" />;
      case ResourceType.FILE:
        return <FileIcon className="h-5 w-5 text-orange-500" />;
      case ResourceType.VIDEO:
        return <VideoIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleResourceClick = (id: string) => {
    if (onResourceClick) {
      onResourceClick(id);
    } else {
      router.push(`/dashboard/resources/${id}`);
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
              placeholder="Buscar recursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button onClick={() => router.push('/dashboard/resources/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo Recurso
          </Button>
        </div>
      )}
      
      {filteredResources.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No se encontraron recursos</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              className="cursor-pointer"
              onClick={() => handleResourceClick(resource.id)}
            >
              <Card className="p-4 h-full hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getResourceIcon(resource.type)}
                    <h3 className="ml-2 font-medium">{resource.title}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  {truncateText(resource.description || 'Sin descripción', 100)}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {resource.tags && resource.tags.map((tag) => (
                    <TagBadge key={tag} name={tag} />
                  ))}
                </div>
                
                <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span>Creado: {formatDate(resource.createdAt)}</span>
                  <span>Usos: {resource.usageCount}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}