// src/types/dashboard.ts
export interface ResourceStats {
    total: number;
    documentation: number;
    tutorial: number;
    link: number;
    file: number;
    video: number;
  }
  
  export interface KnowledgeStats {
    total: number;
    wiki: number;
    note: number;
    snippet: number;
    command: number;
    solution: number;
  }
  
  export interface ProjectStats {
    total: number;
    active: number;
    completed: number;
    archived: number;
  }
  
  export interface TimeSeriesData {
    date: Date;
    count: number;
  }
  
  export interface PopularTag {
    name: string;
    count: number;
  }
  
  export interface RecentActivityData {
    type: string;
    title: string;
    id: string;
    date: Date;
  }
  
  export interface DashboardStats {
    resources: ResourceStats;
    knowledge: KnowledgeStats;
    projects: ProjectStats;
    totalTags: number;
    popularTags: PopularTag[];
    activityTimeline: TimeSeriesData[];
    recentActivity: RecentActivityData[];
  }
  
  export interface DashboardWidget {
    id: string;
    type: string;
    title: string;
    configuration: Record<string, any>;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  
  export interface DashboardConfig {
    id: string;
    peopleId: string;
    widgets: DashboardWidget[];
    layout: Record<string, any>;
    theme: string;
  }
  