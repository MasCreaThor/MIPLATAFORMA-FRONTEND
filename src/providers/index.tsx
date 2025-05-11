// src/providers/index.tsx
'use client';

import { QueryProvider } from './query-provider';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}