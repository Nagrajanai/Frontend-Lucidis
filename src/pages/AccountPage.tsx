// src/pages/AccountsPage.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Building,
  Users,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../api/accounts.api';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  // Change to:
const [selectedAccounts] = useState<string[]>([]); // or remove the variable if not used
// OR remove it entirely if not needed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'pending'>('all');

  // Mock accounts data
  const accounts: (Account & { type?: string; contactEmail?: string; usersCount?: number; workspacesCount?: number; subscriptionPlan?: string })[] = [
    {
      id: '1',
      name: 'City of Frisco',
      slug: 'city-of-frisco',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      workspaces: 5,
      users: 42,
      type: 'government',
      contactEmail: 'admin@frisco.gov',
      usersCount: 42,
      workspacesCount: 5,
      subscriptionPlan: 'enterprise',
    },
    {
      id: '2',
      name: 'Austin ISD',
      slug: 'austin-isd',
      status: 'active',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      workspaces: 3,
      users: 28,
      type: 'education',
      contactEmail: 'admin@austinisd.org',
      usersCount: 28,
      workspacesCount: 3,
      subscriptionPlan: 'professional',
    },
    {
      id: '3',
      name: 'State of Texas',
      slug: 'state-of-texas',
      status: 'pending',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      workspaces: 0,
      users: 0,
      type: 'government',
      contactEmail: 'admin@texas.gov',
      usersCount: 0,
      workspacesCount: 0,
      subscriptionPlan: 'basic',
    },
    {
      id: '4',
      name: 'University of Texas',
      slug: 'university-of-texas',
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05',
      workspaces: 12,
      users: 156,
      type: 'education',
      contactEmail: 'admin@utexas.edu',
      usersCount: 156,
      workspacesCount: 12,
      subscriptionPlan: 'enterprise',
    },
  ];

  const stats = [
    { label: 'Total Accounts', value: '4', icon: Building, change: '+1 this month' },
    { label: 'Active Accounts', value: '3', icon: CheckCircle, change: '+0 today' },
    { label: 'Pending Activation', value: '1', icon: XCircle, change: '+1 pending' },
    { label: 'Total Users', value: '226', icon: Users, change: '+12 this week' },
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (account.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return matchesSearch && account.status === 'active';
    if (selectedTab === 'pending') return matchesSearch && account.status === 'pending';
    
    return matchesSearch;
  });

  const handleCreateAccount = () => {
    navigate('/accounts/create');
  };

  const handleViewAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  const handleEditAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}/edit`);
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
                {accounts.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('active')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'active'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {accounts.filter(a => a.status === 'active').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('pending')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'pending'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {accounts.filter(a => a.status === 'pending').length}
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
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Accounts Grid */}
        {filteredAccounts.length > 0 ? (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          account.status === 'active' ? 'bg-green-100 text-green-800' :
                          account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          account.type === 'government' ? 'bg-blue-100 text-blue-800' :
                          account.type === 'education' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.type ? account.type.charAt(0).toUpperCase() + account.type.slice(1) : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{account.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {account.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{account.usersCount} Users</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{account.workspacesCount} Workspaces</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleViewAccount(account.id)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditAccount(account.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => console.log('View account:', account.id)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => console.log('Delete account:', account.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default AccountsPage;