// src/data/staticStats.ts - Updated for Phase 1
export interface DashboardStats {
  totalAccounts: number;
  systemHealth: number;
  pendingSetup: number;
}

// Phase 1 only stats
export const STATIC_STATS: DashboardStats = {
  totalAccounts: 0, // Will be replaced with real count
  systemHealth: 100,
  pendingSetup: 0, // Will be calculated from accounts
};

// Phase 1 Stats Items - ONLY 3 cards
export const STATIC_STATS_ITEMS = [
  {
    label: 'Client Accounts',
    key: 'totalAccounts' as keyof DashboardStats,
    icon: 'Building',
    format: 'number'
  },
  {
    label: 'Platform Status',
    key: 'systemHealth' as keyof DashboardStats,
    icon: 'Activity',
    format: 'percentage'
  },
  {
    label: 'Pending Setup',
    key: 'pendingSetup' as keyof DashboardStats,
    icon: 'AlertCircle',
    format: 'number'
  }
] as const;