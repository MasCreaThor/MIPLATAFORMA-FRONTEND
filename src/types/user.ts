// src/types/user.ts
export interface User {
    id: string;
    email: string;
    peopleId: string;
    profile: People;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface People {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    personalEmail?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    birthDate?: string;
    profileImageUrl?: string;
    additionalInfo?: Record<string, any>;
    username: string;
    roles: string[];
    isActive: boolean;
    lastLogin?: string;
    preferences: {
      theme?: string;
      language?: string;
      dashboardLayout?: any[];
      notifications?: boolean;
    };
    createdAt: string;
    updatedAt: string;
  }