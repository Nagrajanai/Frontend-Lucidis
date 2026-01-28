// src/api/auth.api.ts
import { api } from './axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';
console.log('API Base URL:', BASE_URL);


export const authApi = {                  
  registerUser: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post(`${BASE_URL}/auth/register/user`, data),

  registerAppOwner: (data: { name: string; email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/register/app-owner`, data),

  login: (data: { email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/login`, data),

  logout: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/logout`, data),

  refreshToken: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/refresh-token`, data),

  getCurrentUser: () =>
    api.get(`${BASE_URL}/auth/me`),

  acceptInvitation: (token: string) =>
    api.get(`${BASE_URL}/auth/accept-invitation/user`, {
      params: { token },
    }),
};