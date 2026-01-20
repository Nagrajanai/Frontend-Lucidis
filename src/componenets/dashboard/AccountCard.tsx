// src/components/dashboard/AccountCard.tsx
import React from 'react';
import { Building, Users, Settings, ChevronRight } from 'lucide-react';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    workspaces: number;
    users: number;
    status: 'active' | 'inactive' | 'suspended';
  };
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[account.status]}`}>
              {account.status}
            </span>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{account.workspaces} Workspaces</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{account.users} Users</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button className="text-sm text-gray-600 hover:text-gray-900">
          View Details
        </button>
        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Manage <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AccountCard;