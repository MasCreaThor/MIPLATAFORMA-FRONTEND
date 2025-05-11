// src/components/dashboard/activity-timeline-widget.tsx
'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { TimeSeriesData } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ActivityTimelineWidgetProps {
  data: TimeSeriesData[];
}

export function ActivityTimelineWidget({ data }: ActivityTimelineWidgetProps) {
  // Asegurar que tenemos datos para los últimos 30 días
  const ensureCompleteData = () => {
    const today = new Date();
    const result: TimeSeriesData[] = [];
    
    // Crear un mapa con los datos existentes
    const dataMap = new Map(
      data.map(item => [format(new Date(item.date), 'yyyy-MM-dd'), item.count])
    );
    
    // Generar datos para los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = dataMap.get(dateStr) || 0;
      
      result.push({
        date,
        count,
      });
    }
    
    return result;
  };
  
  const completeData = ensureCompleteData();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Cronología de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={completeData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: es })}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={(value) => value.toString()}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: es })}
                formatter={(value: number) => [value, 'Actividades']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorActivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}