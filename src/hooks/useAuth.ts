import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { queryKeys } from '../lib/react-query';

/**
 * Fetch current user
 * Cache: 30s stale, 5min cache (user data changes infrequently but should be fresh)
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      
      // Handle different response structures
      const responseData = response.data?.data || response.data;
      const userData = responseData?.user || responseData?.appOwner || responseData;
      
      if (!userData) {
        throw new Error('No user data available');
      }
      
      // Ensure role is present
      return {
        ...userData,
        role: userData.role || (responseData?.appOwner ? 'app_owner' : 'agent')
      };
    },
    staleTime: 30 * 1000, // 30 seconds - user data should be relatively fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  });
};

/**
 * Login mutation
 * Invalidates current user cache on success
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: () => {
      // Invalidate current user to refetch after login
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
    },
  });
};

/**
 * Logout mutation
 * Clears auth cache
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { refreshToken: string }) => authApi.logout(data),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
};
