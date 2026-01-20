// src/pages/DashboardPage.tsx
import React from 'react';
import {
  Users,
  Building,
  Plus
} from 'lucide-react';
import StatsCard from '../componenets/dashboard/StatsCard';
import AccountCard from '../componenets/dashboard/AccountCard';


const DashboardPage: React.FC = () => {
  
  // Mock data - you'll replace with API data
  const accounts = [
    { id: '1', name: 'City of Frisco', workspaces: 5, users: 42, status: 'active' as const },
    { id: '2', name: 'Austin ISD', workspaces: 3, users: 28, status: 'active' as const },
    { id: '3', name: 'State of Texas', workspaces: 12, users: 156, status: 'active' as const },
  ];

  // Phase 1: Foundation - Focus on organizational hierarchy
  const stats = [
    { label: 'Total Accounts', value: '3', icon: Building, change: '+1 this month' },
    { label: 'Total Workspaces', value: '20', icon: Building, change: '+3 this week' },
    { label: 'Active Users', value: '226', icon: Users, change: '+12 today' },
    { label: 'Pending Setup', value: '2', icon: Users, change: 'accounts' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">App Owner Dashboard</h1>
          <p className="text-gray-600">Manage accounts, workspaces, and users across all organizations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <Plus className="h-5 w-5" />
            Create Account
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.label} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            change={stat.change} 
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header - Phase 1: Focus on Accounts */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account Management</h2>
            <span className="bg-gray-100 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
              {accounts.length} Accounts
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage client organizations. Each account can have multiple workspaces.
          </p>
        </div>


        {/* Accounts Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
          
          {/* Add New Account Card */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer">
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
      </div>
    </div>
  );
};

export default DashboardPage;