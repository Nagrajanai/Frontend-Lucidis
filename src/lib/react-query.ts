import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * 
 * Cache Strategy:
 * - staleTime: How long data is considered fresh (no refetch)
 * - cacheTime: How long unused data stays in cache
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Garbage collect unused data after 30 minutes (TanStack Query v5: gcTime)
      gcTime: 30 * 60 * 1000, // 30 minutes
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for keeping data fresh)
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (can be overridden)
      refetchOnReconnect: false,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query keys for better cache management
 */
export const queryKeys = {
  // Accounts
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...queryKeys.accounts.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.accounts.lists(), filters] as const,
    details: () => [...queryKeys.accounts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.accounts.details(), id] as const,
  },
  
  // Workspaces
  workspaces: {
    all: ['workspaces'] as const,
    lists: () => [...queryKeys.workspaces.all, 'list'] as const,
    list: (accountId: string) => [...queryKeys.workspaces.lists(), accountId] as const,
    details: () => [...queryKeys.workspaces.all, 'detail'] as const,
    detail: (workspaceId: string, accountId: string) => 
      [...queryKeys.workspaces.details(), workspaceId, accountId] as const,
  },
  
  // Auth
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
  },
  
  // Stats (if you have stats endpoints)
  stats: {
    all: ['stats'] as const,
    dashboard: (accountId?: string) => [...queryKeys.stats.all, 'dashboard', accountId] as const,
  },
};
