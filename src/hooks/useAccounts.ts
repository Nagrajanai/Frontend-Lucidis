import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { accountsApi, type Account, type CreateAccountData } from '../api/accounts.api';
import { queryKeys } from '../lib/react-query';

/**
 * Fetch all accounts
 * Cache: 5min stale, 30min cache
 */
export const useAccounts = (): UseQueryResult<Account[], Error> => {
  return useQuery<Account[], Error, Account[], ReturnType<typeof queryKeys.accounts.lists>>({
    queryKey: queryKeys.accounts.lists(),
    queryFn: async () => {
      const response = await accountsApi.getAllAccounts();
      if (response.data.success) {
        const accountsData = response.data.data;
        return Array.isArray(accountsData)
          ? accountsData.filter(
              (account) =>
                account &&
                typeof account === 'object' &&
                typeof account.id === 'string' &&
                typeof account.name === 'string',
            )
          : [];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes 
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Fetch single account by ID
 * Cache: 5min stale, 30min cache
 */
export const useAccount = (accountId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.accounts.detail(accountId || ''),
    queryFn: async () => {
      if (!accountId) throw new Error('Account ID is required');
      const response = await accountsApi.getAccountById(accountId);
      return response.data?.data || response.data;
    },
    enabled: !!accountId, //
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Create account mutation
 * Invalidates accounts list cache
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAccountData) => accountsApi.createAccount(data),
    onSuccess: () => {
      // Invalidate and refetch accounts list
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
};

/**
 * Update account mutation
 * Updates cache optimistically
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ accountId, data }: { accountId: string; data: Partial<CreateAccountData> }) =>
      accountsApi.updateAccount(accountId, data),
    onSuccess: (response, variables) => {
      // Update the specific account in cache
      queryClient.setQueryData<Account>(
        queryKeys.accounts.detail(variables.accountId),
        (old) => {
          if (!old) return old;
          return { ...old, ...response.data?.data };
        }
      );
      // Invalidate list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
};

/**
 * Delete account mutation
 * Removes from cache and invalidates list
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (accountId: string) => accountsApi.deleteAccount(accountId),
    onSuccess: (_, accountId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.accounts.detail(accountId) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
};
