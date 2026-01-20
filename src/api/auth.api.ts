// src/api/auth.api.ts
import { api } from './axios';

const BASE_URL = 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export const authApi = {
  registerAppOwner: (data: { name: string; email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/register/app-owner`, data),

  login: (data: { email: string; password: string }) =>
    api.post(`${BASE_URL}/auth/login`, data),

  logout: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/logout`, data),

  getCurrentUser: () =>
    api.get(`${BASE_URL}/auth/me`),

  refreshToken: (data: { refreshToken: string }) =>
    api.post(`${BASE_URL}/auth/refresh-token`, data),
};
