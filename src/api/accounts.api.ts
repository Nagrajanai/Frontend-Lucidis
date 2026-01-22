import { api } from "./axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';
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

export interface InviteUserData {
  email: string;
  role: string;
}
export const accountsApi = {
  getAllAccounts: () =>
    api.get(`${BASE_URL}/accounts`),

  getAccountById: (accountId: string) =>
    api.get(`${BASE_URL}/accounts/${accountId}`),

  createAccount: (data: CreateAccountData) =>
    api.post(`${BASE_URL}/accounts`, data),


  updateAccount: (accountId: string, data: Partial<CreateAccountData>) =>
    api.put(`${BASE_URL}/accounts/${accountId}`, data),


  deleteAccount: (accountId: string) =>
    api.delete(`${BASE_URL}/accounts/${accountId}`),


  inviteUser: (accountId: string, data: InviteUserData) =>
    api.post(`${BASE_URL}/accounts/${accountId}/users`, data),
};