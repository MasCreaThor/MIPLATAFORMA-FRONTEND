// src/types/resource.ts
export enum ResourceType {
    DOCUMENTATION = 'documentation',
    TUTORIAL = 'tutorial',
    LINK = 'link',
    FILE = 'file',
    VIDEO = 'video',
  }
  
  export interface Resource {
    id: string;
    title: string;
    description?: string;
    type: ResourceType;
    content?: string;
    url?: string;
    filePath?: string;
    fileSize?: number;
    fileType?: string;
    thumbnailUrl?: string;
    tags?: string[];
    categoryId?: string;
    peopleId: string;
    isPublic: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ResourceFilters {
    search?: string;
    types?: ResourceType[];
    categoryId?: string;
    tags?: string[];
    isPublic?: boolean;
  }