// src/components/dashboard/knowledge-insights-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpenIcon, 
  FileTextIcon, 
  CodeIcon, 
  TerminalIcon, 
  LightbulbIcon,
  ArrowRightIcon
} from 'lucide-react';
import { KnowledgeItem, KnowledgeItemType } from '@/types/knowledge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { knowledgeService } from '@/services/knowledgeService';

interface KnowledgeInsightsWidgetProps {
  limit?: number;
}

export function KnowledgeInsightsWidget({ limit = 5 }: KnowledgeInsightsWidgetProps) {
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<KnowledgeItem[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<KnowledgeItemType, number>>({
    [KnowledgeItemType.WIKI]: 0,
    [KnowledgeItemType.NOTE]: 0,
    [KnowledgeItemType.SNIPPET]: 0,
    [KnowledgeItemType.COMMAND]: 0,
    [KnowledgeItemType.SOLUTION]: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Obtener elementos recientes
        const items = await knowledgeService.getKnowledgeItems({ 
          // No filters, but will be sorted by date in backend
        });
        
        // Tomar los más recientes hasta el límite
        setRecentItems(items.slice(0, limit));
        
        // Contar por tipo
        const counts = {
          [KnowledgeItemType.WIKI]: 0,
          [KnowledgeItemType.NOTE]: 0,
          [KnowledgeItemType.SNIPPET]: 0,
          [KnowledgeItemType.COMMAND]: 0,
          [KnowledgeItemType.SOLUTION]: 0,
        };
        
        items.forEach(item => {
          counts[item.type]++;
        });
        
        setTypeCounts(counts);
      } catch (error) {
        console.error('Error fetching knowledge insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  const getTypeIcon = (type: KnowledgeItemType) => {
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
    }
  };

  const getTypeName = (type: KnowledgeItemType) => {
    switch (type) {
      case KnowledgeItemType.WIKI:
        return 'Wikis';
      case KnowledgeItemType.NOTE:
        return 'Notas';
      case KnowledgeItemType.SNIPPET:
        return 'Snippets';
      case KnowledgeItemType.COMMAND:
        return 'Comandos';
      case KnowledgeItemType.SOLUTION:
        return 'Soluciones';
    }
  };

  const handleItemClick = (id: string) => {
    router.push(`/dashboard/knowledge/${id}`);
  };

  const totalItems = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conocimiento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Distribución por tipo</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center space-x-2">
                    {getTypeIcon(type as KnowledgeItemType)}
                    <div>
                      <div className="text-sm font-medium">{getTypeName(type as KnowledgeItemType)}</div>
                      <div className="text-xs text-gray-500">{count} elementos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Elementos recientes</h3>
              {recentItems.length === 0 ? (
                <p className="text-sm text-gray-500">No hay elementos de conocimiento</p>
              ) : (
                <ul className="space-y-2">
                  {recentItems.map((item) => (
                    <li 
                      key={item.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleItemClick(item.id)}
                    >
                      {getTypeIcon(item.type)}
                      <span className="ml-2 text-sm truncate">{item.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/dashboard/knowledge')}
        >
          Ver todos los elementos ({totalItems})
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}