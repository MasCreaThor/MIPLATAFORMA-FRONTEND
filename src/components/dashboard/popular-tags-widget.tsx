// src/components/dashboard/popular-tags-widget.tsx
'use client';

import { TagIcon } from 'lucide-react';
import { PopularTag } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { stringToColor } from '@/lib/utils';

interface PopularTagsWidgetProps {
  tags: PopularTag[];
  totalTags: number;
}

export function PopularTagsWidget({ tags, totalTags }: PopularTagsWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Etiquetas Populares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="font-bold text-3xl">{totalTags}</div>
          <div className="text-sm text-muted-foreground">Total de etiquetas</div>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No hay etiquetas disponibles
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {tags.map((tag) => {
              const color = stringToColor(tag.name);
              return (
                <div key={tag.name} className="flex items-center">
                  <div className="mr-3">
                    <TagIcon 
                      className="h-5 w-5" 
                      style={{ color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium truncate">{tag.name}</p>
                      <p className="text-sm font-medium text-gray-500">{tag.count}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.min(100, (tag.count / (tags[0]?.count || 1)) * 100)}%`,
                          backgroundColor: color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}