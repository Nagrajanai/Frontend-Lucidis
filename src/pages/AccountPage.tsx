
// src/pages/AccountsPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Building,
  Users,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { authApi, type Account } from '../api/auth.api';
import AccountCard from '../componenets/dashboard/AccountCard';
import { accountsApi, type Account } from '../api/accounts.api';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'pending'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const accountsResponse = await accountsApi.getAllAccounts();

      if (accountsResponse.data.success) {
        const accountsData = accountsResponse.data.data;
        const validAccounts = Array.isArray(accountsData)
          ? accountsData.filter(
              (account) =>
                account &&
                typeof account === "object" &&
                typeof account.id === "string" &&
                typeof account.name === "string",
            )
          : [];

        setAccounts(validAccounts);
      }
    } catch (error: any) {
      console.error("Failed to fetch accounts:", error);
      setError(error?.message || "Failed to load accounts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Check for success message from navigation state
  useEffect(() => {
    const state = location.state as { message?: string; type?: string } | null;
    if (state?.message && state?.type === 'success') {
      setSuccessMessage(state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location.state]);

  const stats = [
    { label: 'Total Accounts', value: '4', icon: Building, change: '+1 this month' },
    { label: 'Active Accounts', value: '3', icon: CheckCircle, change: '+0 today' },
    { label: 'Pending Activation', value: '1', icon: XCircle, change: '+1 pending' },
    { label: 'Total Users', value: '226', icon: Users, change: '+12 this week' },
  ];

  const handleCreateAccount = () => {
    navigate('/accounts/create');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage client organizations and subscriptions</p>
        </div>
        <button 
          onClick={handleCreateAccount}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Create Account
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto p-1 hover:bg-green-100 rounded"
          >
            <X className="h-4 w-4 text-green-600" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Accounts
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                {loading ? '...' : accounts.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              disabled={loading}
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading accounts...</h3>
            <p className="text-gray-600">Please wait while we fetch your accounts data</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load accounts</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchAccounts}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Loader2 className="h-5 w-5" />
              Retry Loading Accounts
            </button>
          </div>
        ) : accounts.length > 0 ? (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={{
                  id: account.id,
                  name: account.name,
                  slug: account.slug,
                  workspaces: Array.isArray(account.workspaces)
                    ? account.workspaces
                    : [],
                }}
              />     
            ))}
            
            {/* Add New Account Card */}
            <div 
              onClick={handleCreateAccount}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Add New Account</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Create a new client organization
              </p>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTab !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first account'}
            </p>
            {(!searchQuery && selectedTab === 'all') && (
              <button 
                onClick={handleCreateAccount}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="h-5 w-5" />
                Create Your First Account
              </button>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedAccounts.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''} selected
              </span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Activate Selected
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Suspend Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {!loading && !error && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-indigo-900 mb-1">Pro Tip</h3>
              <p className="text-sm text-indigo-700">
                Government and education accounts get special SOC 2 compliant features. 
                Make sure to verify their domain for full platform access.
              </p>
            </div>
            <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
              Learn More <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;