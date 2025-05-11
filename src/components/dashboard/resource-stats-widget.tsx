// src/components/dashboard/resource-stats-widget.tsx
'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ResourceStats } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ResourceStatsWidgetProps {
  stats: ResourceStats;
}

export function ResourceStatsWidget({ stats }: ResourceStatsWidgetProps) {
  const data = useMemo(() => [
    { name: 'Documentación', value: stats.documentation, color: '#3B82F6' },
    { name: 'Tutoriales', value: stats.tutorial, color: '#10B981' },
    { name: 'Enlaces', value: stats.link, color: '#8B5CF6' },
    { name: 'Archivos', value: stats.file, color: '#F97316' },
    { name: 'Videos', value: stats.video, color: '#EF4444' },
  ], [stats]);

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F97316', '#EF4444'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recursos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="font-bold text-3xl">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total de recursos</div>
        </div>

        <div className="h-[180px] mt-4">
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}`, 'Cantidad']}
                  labelFormatter={(index) => data[index].name}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}