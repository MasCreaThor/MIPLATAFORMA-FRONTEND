// src/components/dashboard/knowledge-stats-widget.tsx
'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { KnowledgeStats } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KnowledgeStatsWidgetProps {
  stats: KnowledgeStats;
}

export function KnowledgeStatsWidget({ stats }: KnowledgeStatsWidgetProps) {
  const data = useMemo(() => [
    { name: 'Wiki', value: stats.wiki, color: '#3B82F6' },
    { name: 'Notas', value: stats.note, color: '#10B981' },
    { name: 'Snippets', value: stats.snippet, color: '#8B5CF6' },
    { name: 'Comandos', value: stats.command, color: '#F97316' },
    { name: 'Soluciones', value: stats.solution, color: '#EF4444' },
  ], [stats]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Conocimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="font-bold text-3xl">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total de elementos</div>
        </div>

        <div className="h-[180px] mt-4">
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}`, 'Cantidad']}
                  cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}