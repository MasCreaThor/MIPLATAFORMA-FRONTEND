// src/components/dashboard/project-stats-widget.tsx
'use client';

import { useMemo } from 'react';
import { ProjectStats } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProjectStatsWidgetProps {
  stats: ProjectStats;
}

export function ProjectStatsWidget({ stats }: ProjectStatsWidgetProps) {
  const statusItems = useMemo(() => [
    { name: 'Activos', value: stats.active, color: '#10B981' },
    { name: 'Completados', value: stats.completed, color: '#3B82F6' },
    { name: 'Archivados', value: stats.archived, color: '#6B7280' },
  ], [stats]);

  // Calcular porcentajes
  const calculatePercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Proyectos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="font-bold text-3xl">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total de proyectos</div>
        </div>

        <div className="space-y-4 mt-6">
          {statusItems.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-medium">{calculatePercentage(item.value)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${calculatePercentage(item.value)}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.value} proyectos</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}