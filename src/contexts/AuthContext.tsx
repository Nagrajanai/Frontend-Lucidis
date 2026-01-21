import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '../api/auth.api';
import type { AppOwner, User } from '../types';
import { tokenStorage } from '../utils/token';

/* =======================
   Types
======================= */
interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface RegisterAppOwnerData {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | AppOwner | null;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (data: RegisterUserData) => Promise<void>;
  registerAppOwner: (data: RegisterAppOwnerData) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Role helpers
  userRole: string | null;
  hasRole: (role: string) => boolean;
  canCreateAccounts: boolean;
  canCreateWorkspaces: boolean;
  canManageUsers: boolean;
  canAccessAllAccounts: boolean;
}

/* Context */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* useAuth Hook  */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

/*  Provider */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | AppOwner | null>(() => {
    const storedUser = tokenStorage.getUser();
    console.log('AuthProvider initializing with user:', storedUser ? 'found' : 'not found');
    return storedUser;
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        console.log('No access token found, user not authenticated');
        setUser(null);
        return;
      }

      // Check if token is expired before making API call
      if (tokenStorage.isTokenExpired(token)) {
        console.log('Access token expired, attempting refresh');
        // Token refresh will be handled by axios interceptor
        // If refresh succeeds, user stays logged in
        // If refresh fails, interceptor will redirect to login
        setUser(null);
        return;
      }

      console.log('Validating user session with API...');
      const response = await authApi.getCurrentUser();
      console.log('API Response:', response.data);

      // Handle different response structures
      const responseData = response.data?.data || response.data;
      const userData = responseData?.user || responseData?.appOwner || responseData;

      if (!userData) {
        console.warn('No user data found in response, keeping stored user');
        const existingUser = tokenStorage.getUser();
        if (existingUser) {
          setUser(existingUser);
          return;
        }
        throw new Error('No user data available');
      }

      // Ensure role is present
      const userWithRole = {
        ...userData,
        role: userData.role || (responseData?.appOwner ? 'app_owner' : 'agent')
      };

      console.log('User session validated successfully');
      tokenStorage.setUser(userWithRole);
      setUser(userWithRole);
    } catch (error: any) {
      console.error('Failed to fetch current user:', error);

      // Only clear tokens on authentication errors, not network/server errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication failed, clearing session');
        tokenStorage.clearAll();
        setUser(null);
      } else {
        // For network errors, server errors, etc., keep user logged in locally
        // The axios interceptor will handle token refresh automatically
        console.log('Network/server error, keeping user logged in locally');
        const existingUser = tokenStorage.getUser();
        if (existingUser) {
          console.log('Using stored user data');
          setUser(existingUser);
        } else {
          console.log('No stored user data available');
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    fetchCurrentUser();
  }, []);



  /*  REGISTER USER  */
  const registerUser = async (data: RegisterUserData) => {
    try {
      setIsLoading(true);

      const res = await authApi.registerUser(data);
      const responseData = res.data.data;

      // Handle user response
      const userData = responseData.user;
      const tokens = responseData.tokens;

      // Ensure we have valid data before storing
      if (userData && tokens?.accessToken && tokens?.refreshToken) {
        // Add role for user registration
        const userWithRole = {
          ...userData,
          role: userData.role || 'agent' // Default role for regular users
        };

        tokenStorage.setUser(userWithRole);
        tokenStorage.setAccessToken(tokens.accessToken);
        tokenStorage.setRefreshToken(tokens.refreshToken);

        setUser(userWithRole);
      } else {
        throw new Error('Invalid response data from register API');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /*  REGISTER APP OWNER  */
  const registerAppOwner = async (data: RegisterAppOwnerData) => {
    try {
      setIsLoading(true);

      const res = await authApi.registerAppOwner(data);
      const responseData = res.data.data;

      // Handle both user and appOwner responses
      const userData = responseData.user || responseData.appOwner;
      const tokens = responseData.tokens;

      // Ensure we have valid data before storing
      if (userData && tokens?.accessToken && tokens?.refreshToken) {
        // Add role for app owner registration
        const userWithRole = {
          ...userData,
          role: 'app_owner' // App owners are always app_owner role
        };

        tokenStorage.setUser(userWithRole);
        tokenStorage.setAccessToken(tokens.accessToken);
        tokenStorage.setRefreshToken(tokens.refreshToken);

        setUser(userWithRole);
      } else {
        throw new Error('Invalid response data from register API');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /*  LOGIN  */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('AuthContext - Starting login for:', email);

      const res = await authApi.login({ email, password });
      console.log('AuthContext - Full API response:', res);
      console.log('AuthContext - Response data:', res.data);

      const data = res.data?.data || res.data;
      console.log('AuthContext - Extracted data:', data);

      // Handle both user and appOwner responses
      const userData = data?.user || data?.appOwner || data;
      const tokens = data?.tokens;

      console.log('AuthContext - Login successful, userData:', userData);
      console.log('AuthContext - Tokens:', tokens);

      // Ensure we have valid data before storing
      if (userData && tokens?.accessToken && tokens?.refreshToken) {
        // Add role if not present (for backward compatibility)
        const userWithRole = {
          ...userData,
          role: userData.role || (data.appOwner ? 'app_owner' : 'agent') // Default role
        };

        console.log('AuthContext - Setting user:', userWithRole);

        tokenStorage.setUser(userWithRole);
        tokenStorage.setAccessToken(tokens.accessToken);
        tokenStorage.setRefreshToken(tokens.refreshToken);

        setUser(userWithRole);
        console.log('AuthContext - Login successful, tokens stored, role:', userWithRole.role);
        console.log('AuthContext - User state should now be updated');
      } else {
        console.error('AuthContext - Invalid login response:', { userData, tokens });
        throw new Error('Invalid login response from server');
      }
    } catch (error) {
      console.error('AuthContext - Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ========= LOGOUT ========= */
  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } finally {
      tokenStorage.clearAll();
      setUser(null);
    }
  };

  /* ========= ROLE HELPERS ========= */
  const userRole = user?.role || null;

  const hasRole = (role: string): boolean => {
    // If no user, check stored user
    if (!user) {
      const storedUser = tokenStorage.getUser();
      return storedUser?.role === role;
    }
    return user.role === role;
  };

  const canCreateAccounts = hasRole('app_owner');
  const canCreateWorkspaces = ['app_owner', 'account_admin'].includes(userRole || '');
  const canManageUsers = ['app_owner', 'account_admin', 'department_manager'].includes(userRole || '');
  const canAccessAllAccounts = hasRole('app_owner');

  return (
  <AuthContext.Provider
    value={{
      user,
      login,
      registerUser,
      registerAppOwner,
      logout,
      fetchCurrentUser,
      isAuthenticated: !!user,
      isLoading,
      // Role helpers
      userRole,
      hasRole,
      canCreateAccounts,
      canCreateWorkspaces,
      canManageUsers,
      canAccessAllAccounts,
    }}
  >
    {children}
  </AuthContext.Provider>
  );
};
