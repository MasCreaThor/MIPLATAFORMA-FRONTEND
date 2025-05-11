// src/components/dashboard/recent-activity-widget.tsx
'use client';

import { 
  FileTextIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  FolderIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { RecentActivityData } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RecentActivityWidgetProps {
  activities: RecentActivityData[];
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  // Obtener el icono según el tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'resource':
        return <FileTextIcon className="h-5 w-5 text-blue-500" />;
      case 'knowledge':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'project':
        return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
      case 'category':
        return <FolderIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No hay actividad reciente
          </div>
        ) : (
          <div className="space-y-5">
            {activities.map((activity, index) => (
              <div key={index} className="flex">
                <div className="mr-4 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(activity.date), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}