// src/types/knowledge.ts
export enum KnowledgeItemType {
    WIKI = 'wiki',
    NOTE = 'note',
    SNIPPET = 'snippet',
    COMMAND = 'command',
    SOLUTION = 'solution',
  }
  
  export interface SolutionDetails {
    problem?: string;
    solution?: string;
    context?: string;
  }
  
  export interface KnowledgeItem {
    id: string;
    title: string;
    type: KnowledgeItemType;
    categoryId?: string;
    content?: string;
    codeContent?: string;
    codeLanguage?: string;
    solutionDetails?: SolutionDetails;
    tags?: string[];
    relatedItems?: string[];
    references?: string[];
    peopleId: string;
    isPublic: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface KnowledgeItemFilters {
    search?: string;
    types?: KnowledgeItemType[];
    categoryId?: string;
    tags?: string[];
    isPublic?: boolean;
    relatedTo?: string;
    referencesResource?: string;
  }