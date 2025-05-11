// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types/dashboard';
import { dashboardService } from '@/services/dashboardService';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResourceStatsWidget } from '@/components/dashboard/resource-stats-widget';
import { KnowledgeStatsWidget } from '@/components/dashboard/knowledge-stats-widget';
import { ProjectStatsWidget } from '@/components/dashboard/project-stats-widget';
import { RecentActivityWidget } from '@/components/dashboard/recent-activity-widget';
import { PopularTagsWidget } from '@/components/dashboard/popular-tags-widget';
import { ActivityTimelineWidget } from '@/components/dashboard/activity-timeline-widget';
import { KnowledgeInsightsWidget } from '@/components/dashboard/knowledge-insights-widget';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error al cargar estadísticas del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 bg-red-50 border-red-200">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats && (
          <>
            <ResourceStatsWidget stats={stats.resources} />
            <KnowledgeStatsWidget stats={stats.knowledge} />
            <ProjectStatsWidget stats={stats.projects} />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {stats && <ActivityTimelineWidget data={stats.activityTimeline} />}
        </div>
        <div>
          {stats && <PopularTagsWidget tags={stats.popularTags} totalTags={stats.totalTags} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {stats && <RecentActivityWidget activities={stats.recentActivity} />}
        </div>
        <div>
          <KnowledgeInsightsWidget limit={5} />
        </div>
      </div>
    </div>
  );
}

// Skeleton de carga para el dashboard
function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-8 w-48" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-16 w-full" />
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}