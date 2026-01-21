// import { api } from "./axios";

// const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

// export interface Account {
//   id: string;
//   name: string;
//   slug: string;
//   status: 'active' | 'inactive' | 'pending';
//   createdAt: string;
//   updatedAt: string;
//   workspaces?: number;
//   users?: number;
// }

// export interface CreateAccountData {
//   name: string;
//   slug: string;
// }

// export interface InviteUserData {
//   email: string;
//   role: string;
// }

// export const accountsApi = {
//   // Get all accounts
//   getAllAccounts: () =>
//     api.get(`${BASE_URL}/accounts`),

//   // Get single account by ID
//   getAccountById: (accountId: string) =>
//     api.get(`${BASE_URL}/accounts/${accountId}`),

//   // Create new account
//   createAccount: (data: CreateAccountData) =>
//     api.post(`${BASE_URL}/accounts`, data),

//   // Update account
//   updateAccount: (accountId: string, data: Partial<CreateAccountData>) =>
//     api.put(`${BASE_URL}/accounts/${accountId}`, data),

//   // Delete account
//   deleteAccount: (accountId: string) =>
//     api.delete(`${BASE_URL}/accounts/${accountId}`),

//   // Invite user to account
//   inviteUser: (accountId: string, data: InviteUserData) =>
//     api.post(`${BASE_URL}/accounts/${accountId}/users`, data),
// };