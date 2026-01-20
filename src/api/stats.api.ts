import { api } from "./axios";


export interface DashboardStats {
  totalAccounts: number;
  totalWorkspaces: number;
  activeUsers: number;
  pendingSetup: number;
  accountsGrowth: number;
  workspacesGrowth: number;
  usersGrowth: number;
}

export const statsApi = {
  getDashboardStats: () =>
    api.get<{ success: boolean; data: DashboardStats; message?: string }>('/stats/dashboard'),
};