/**
 * Token management utilities for secure authentication
 */

const TOKEN_KEYS = {
  ACCESS: 'lucidis_access_token',
  REFRESH: 'lucidis_refresh_token',
  USER: 'lucidis_user',
} as const;

/**
 * Secure token storage and retrieval
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEYS.ACCESS);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  },

  setAccessToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEYS.ACCESS, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  },

  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEYS.REFRESH);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEYS.REFRESH, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  },

  getUser: (): any => {
    try {
      const userData = localStorage.getItem(TOKEN_KEYS.USER);
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      // Clear corrupted data
      tokenStorage.clearUser();
      return null;
    }
  },

  setUser: (user: any): void => {
    try {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  clearUser: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEYS.USER);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },

  clearTokens: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_KEYS.REFRESH);
      tokenStorage.clearUser();
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  clearAll: (): void => {
    tokenStorage.clearTokens();
  },

  hasValidTokens: (): boolean => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    return !!(accessToken && refreshToken);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true; // Assume expired if we can't check
    }
  },
};

/**
 * Token validation utilities
 */
export const tokenValidation = {
  isAccessTokenValid: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;

    return !tokenStorage.isTokenExpired(token);
  },

  isRefreshTokenValid: (): boolean => {
    const token = tokenStorage.getRefreshToken();
    if (!token) return false;

    return !tokenStorage.isTokenExpired(token);
  },

  shouldRefreshToken: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeToExpiry = payload.exp - currentTime;

      // Refresh if token expires in less than 5 minutes
      return timeToExpiry < 300;
    } catch (error) {
      console.error('Failed to check token refresh timing:', error);
      return true;
    }
  },
};

/**
 * Authentication state helpers
 */
export const authHelpers = {
  isAuthenticated: (): boolean => {
    return tokenStorage.hasValidTokens() && !!tokenStorage.getUser();
  },

  getUserRole: (): string | null => {
    const user = tokenStorage.getUser();
    return user?.role || null;
  },

  hasRole: (role: string): boolean => {
    return authHelpers.getUserRole() === role;
  },

  canAccessRoute: (role: string, route: string): boolean => {
    // App Owner can access everything
    if (role === 'app_owner') return true;

    // Account Admin routes
    if (role === 'account_admin') {
      const accountAdminRoutes = ['/account-dashboard', '/workspaces', '/users'];
      return accountAdminRoutes.some(r => route.startsWith(r));
    }

    // Department Manager routes
    if (role === 'department_manager') {
      const deptManagerRoutes = ['/workspace-dashboard', '/teams', '/users', '/workflows'];
      return deptManagerRoutes.some(r => route.startsWith(r));
    }

    // Agent/Viewer routes (most restricted)
    if (role === 'agent' || role === 'viewer') {
      const agentRoutes = ['/inbox', '/tasks'];
      return agentRoutes.some(r => route.startsWith(r));
    }

    return false;
  },

  getDashboardRoute: (role: string): string => {
    switch (role) {
      case 'app_owner':
        return '/dashboard';
      case 'account_admin':
        return '/account-dashboard';
      case 'department_manager':
        return '/workspace-dashboard';
      case 'agent':
      case 'viewer':
        return '/inbox';
      default:
        return '/dashboard';
    }
  },
};