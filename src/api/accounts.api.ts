import { api } from "./axios";


export interface Account {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  workspaces?: number;
  users?: number;
}

export interface CreateAccountData {
  name: string;
  slug: string;
}

export const accountsApi = {
  // Get all accounts
  getAllAccounts: () => 
    api.get<{ success: boolean; data: Account[]; message?: string }>('/accounts'),

  // Get single account by ID
  getAccountById: (accountId: string) =>
    api.get<{ success: boolean; data: Account; message?: string }>(`/accounts/${accountId}`),

  // Create new account
  createAccount: (data: CreateAccountData) =>
    api.post<{ success: boolean; data: Account; message?: string }>('/accounts', data),

  // Update account
  updateAccount: (accountId: string, data: Partial<CreateAccountData>) =>
    api.put<{ success: boolean; data: Account; message?: string }>(`/accounts/${accountId}`, data),

  // Delete account
  deleteAccount: (accountId: string) =>
    api.delete<{ success: boolean; message?: string }>(`/accounts/${accountId}`),
};