import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  workspaceApi, 
  type WorkspaceDetail,
  type CreateWorkspaceData 
} from '../api/workspace.api';
import { queryKeys } from '../lib/react-query';

/**
 * Fetch workspaces for an account
 * Cache: 5min stale, 30min cache
 */
export const useWorkspaces = (accountId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.workspaces.list(accountId || ''),
    queryFn: async () => {
      if (!accountId) throw new Error('Account ID is required');
      const response = await workspaceApi.getWorkspacesByAccount(accountId);
      
      // Handle different response formats
      let workspacesData = [];
      if (Array.isArray(response.data)) {
        workspacesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        workspacesData = response.data.data;
      } else if (response.data?.workspaces && Array.isArray(response.data.workspaces)) {
        workspacesData = response.data.workspaces;
      }
      
      // Validate and filter
      return workspacesData.filter((ws: any) => 
        ws && typeof ws === 'object' && typeof ws.id === 'string' && typeof ws.name === 'string'
      );
    },
    enabled: !!accountId, // Only run if accountId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Fetch single workspace by ID
 * Cache: 5min stale, 30min cache
 */
export const useWorkspace = (workspaceId: string | undefined, accountId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(workspaceId || '', accountId || ''),
    queryFn: async () => {
      if (!workspaceId || !accountId) {
        throw new Error('Workspace ID and Account ID are required');
      }
      
      const response = await workspaceApi.getWorkspaceById(workspaceId, accountId);
      
      // Handle different response formats
      let workspaceData = null;
      if (response.data?.data) {
        workspaceData = response.data.data;
      } else if (response.data?.workspace) {
        workspaceData = response.data.workspace;
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        workspaceData = response.data;
      }
      
      if (!workspaceData) {
        throw new Error('Failed to fetch workspace - invalid response format');
      }
      
      return workspaceData;
    },
    enabled: !!workspaceId && !!accountId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Create workspace mutation
 * Invalidates workspaces list cache
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ accountId, data }: { accountId: string; data: CreateWorkspaceData }) =>
      workspaceApi.createWorkspace(accountId, data),
    onSuccess: (_, variables) => {
      // Invalidate workspaces list for this account
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workspaces.list(variables.accountId) 
      });
    },
  });
};

/**
 * Update workspace mutation
 * Updates cache optimistically
 */
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      workspaceId, 
      accountId, 
      data 
    }: { 
      workspaceId: string; 
      accountId: string; 
      data: Partial<CreateWorkspaceData> 
    }) => workspaceApi.updateWorkspace(workspaceId, accountId, data),
    onSuccess: (response, variables) => {
      // Update the specific workspace in cache
      queryClient.setQueryData<WorkspaceDetail>(
        queryKeys.workspaces.detail(variables.workspaceId, variables.accountId),
        (old) => {
          if (!old) return old;
          return { ...old, ...response.data?.data };
        }
      );
      // Invalidate list to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workspaces.list(variables.accountId) 
      });
    },
  });
};

/**
 * Delete workspace mutation
 * Removes from cache and invalidates list
 */
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, accountId }: { workspaceId: string; accountId: string }) =>
      workspaceApi.deleteWorkspace(workspaceId, accountId),
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.workspaces.detail(variables.workspaceId, variables.accountId) 
      });
      // Invalidate list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workspaces.list(variables.accountId) 
      });
    },
  });
};

/**
 * Add user to workspace mutation
 * Refetches workspace details
 */
export const useAddUserToWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      workspaceId, 
      accountId, 
      userData 
    }: { 
      workspaceId: string; 
      accountId: string; 
      userData: { email: string; role: string } 
    }) => workspaceApi.addUserToWorkspace(workspaceId, accountId, userData),
    onSuccess: (_, variables) => {
      // Refetch workspace details to get updated user list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workspaces.detail(variables.workspaceId, variables.accountId) 
      });
    },
  });
};
