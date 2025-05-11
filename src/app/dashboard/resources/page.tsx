// src/app/dashboard/resources/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resourcesService } from '@/services/resourceService';
import { Resource, ResourceType } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { ResourceList } from '@/components/resources/ResourceList';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { CreateResourceDialog } from '@/components/resources/CreateResourceDialog';
import { PlusIcon } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    types: [] as ResourceType[],
    categoryId: '',
    tags: [] as string[],
  });
  
  const router = useRouter();

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await resourcesService.getResources(filters);
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResource = async (resource: Resource) => {
    setShowCreateDialog(false);
    await fetchResources();
  };

  const handleResourceClick = (id: string) => {
    router.push(`/dashboard/resources/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recursos</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Recurso
        </Button>
      </div>

      <ResourceFilters filters={filters} onFilterChange={setFilters} />
      
      <ResourceList 
        resources={resources} 
        isLoading={isLoading} 
        onResourceClick={handleResourceClick} 
      />
      
      <CreateResourceDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateResource}
      />
    </div>
  );
}