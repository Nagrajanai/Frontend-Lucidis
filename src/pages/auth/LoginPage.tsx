
// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if coming from successful setup
  const setupMessage = location.state?.setupComplete
    ? 'Platform setup complete! Please login with your App Owner credentials.'
    : location.state?.message;

  // Handle redirect when authentication state changes
  useEffect(() => {
    console.log('LoginPage - isAuthenticated changed to:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginPage - User is now authenticated, redirecting to dashboard');
      const state = location.state as { from?: { pathname: string } } | null;
      const redirectTo = state?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Redirect if already authenticated - moved after hooks
  if (isAuthenticated) {
    const state = location.state as { from?: { pathname: string } } | null;
    const redirectTo = state?.from?.pathname ?? '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }


  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  try {
    console.log('LoginPage: Attempting login for:', email);
    console.log('LoginPage: Current isAuthenticated before login:', isAuthenticated);
    await login(email, password);

    console.log('LoginPage: Login completed successfully');

  } catch (err: any) {
    console.error('LoginPage: Login failed:', err);
    console.error('LoginPage: Error response:', err.response);

    let errorMessage = 'Login failed. Please check your credentials.';

    if (err.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot connect to server. Please check your internet connection and API configuration.';
    } else if (err.response?.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (err.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Key className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lucidis Platform</h1>
          <p className="text-gray-600">  
            AI-Powered Citizen Relationship Management
          </p>
        </div>

        {/* Setup Success Message */}
        {setupMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Key className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{setupMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@whitegloveai.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Keep me signed in
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* User Types Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <strong>User Types:</strong> App Owner • Account Admin • Department Manager • Agent
            </p>
          </div>
        </div>

        {/* No Registration Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Lucidis Platform is invitation-only.{' '}
            <a 
              href="mailto:support@whitegloveai.com" 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contact Support
            </a>{' '}
            for access.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            For Citizens: Use ID.me verification on client portals
          </p>
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-gray-400">
            <span>• JWT Authentication</span>
            <span>• TLS 1.3</span>
            <span>• SOC 2 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
