// src/api/auth.api.ts
import { api } from './axios';

// Update your .env file with the new ngrok URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';
console.log('API Base URL:', BASE_URL);


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

export interface CreateWorkspaceData {
  name: string;
  slug: string;
  accountId: string;
  type?: 'department' | 'team' | 'project' | 'regional';
  description?: string;
  channels?: ('email' | 'sms' | 'voice' | 'whatsapp')[];
}

export interface Workspace {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  type: 'department' | 'team' | 'project' | 'regional';
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  usersCount?: number;
  conversationsCount?: number;
  departmentsCount?: number;
  channels: ('email' | 'sms' | 'voice' | 'whatsapp')[];
  createdAt: string;
  updatedAt?: string;
  owner?: any;
  lastActive?: string;
}

export const authApi = {
  // Register endpoints
  registerUser: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post(`${BASE_URL}/auth/register/user`, data),

  registerAppOwner: (data: { name: string; email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/register/app-owner`, data),

  // Authentication endpoints
  login: (data: { email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/login`, data),

  logout: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/logout`, data),

  refreshToken: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/refresh-token`, data),

  getCurrentUser: () =>
    api.get(`${BASE_URL}/auth/me`),

    getAllAccounts: () =>
      api.get(`${BASE_URL}/accounts`),
  
    // Get single account by ID
    getAccountById: (accountId: string) =>
      api.get(`${BASE_URL}/accounts/${accountId}`),
  
    // Create new account
    createAccount: (data: CreateAccountData) =>
      api.post(`${BASE_URL}/accounts`, data),
  
    // Update account
    updateAccount: (accountId: string, data: Partial<CreateAccountData>) =>
      api.put(`${BASE_URL}/accounts/${accountId}`, data),
  
    // Delete account
    deleteAccount: (accountId: string) =>
      api.delete(`${BASE_URL}/accounts/${accountId}`),
  
    // Invite user to account
    inviteUser: (accountId: string, data: InviteUserData) =>
      api.post(`${BASE_URL}/accounts/${accountId}/users`, data),

    // Workspace endpoints
    getWorkspacesByAccount: (accountId: string) =>
      api.get(`${BASE_URL}/workspaces?accountId=${accountId}`),

    createWorkspace: (accountId: string, data: CreateWorkspaceData) =>
      api.post(`${BASE_URL}/workspaces?accountId=${accountId}`, data),

    getWorkspaceById: (workspaceId: string, accountId: string) =>
      api.get(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`),

    updateWorkspace: (workspaceId: string, accountId: string, data: Partial<CreateWorkspaceData>) =>
      api.put(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`, data),

    deleteWorkspace: (workspaceId: string, accountId: string) =>
      api.delete(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`),
};
