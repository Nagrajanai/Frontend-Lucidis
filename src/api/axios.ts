import axios from 'axios';
import { tokenStorage } from '../utils/token';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Attach access token and account header
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add x-account-id header if accountId is provided in params or query
  if (config.params?.accountId) {
    config.headers['x-account-id'] = config.params.accountId;
  }

  return config;
});

// Handle token refresh with robust error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401 errors and if not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const accessToken = tokenStorage.getAccessToken();

        // Check if we have both tokens
        if (!refreshToken || !accessToken) {
          throw new Error('Missing tokens');
        }

        console.log(' Attempting token refresh...');

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { timeout: 10000 } // 10 second timeout
        );

        if (refreshResponse.data?.data?.accessToken) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

          // Store new tokens using token utilities
          tokenStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken);
          }

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log('Token refresh successful, retrying original request');
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh response');
        }

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear all auth data using token utilities
        tokenStorage.clearAll();

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other error types
    if (error.response?.status === 403) {
      console.warn('Forbidden access - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    } else if (!error.response) {
      console.error('Network error - check internet connection');
    }

    return Promise.reject(error);
  }
);
