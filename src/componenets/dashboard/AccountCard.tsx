
/// src/components/dashboard/AccountCard.tsx
import React from 'react';
import { Building, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    slug: string;
    workspaces: Array<any>;  // Account has many Workspaces per PRD
    createdAt?: string;
    updatedAt?: string;
    appOwnerId?: string;
  };
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const navigate = useNavigate();

    const handleViewAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };
  // Get workspace count from array length
  const workspaceCount = account.workspaces ? account.workspaces.length : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            {account.slug && (
              <p className="text-sm text-gray-500 mt-1">ID: {account.slug}</p>
            )}
          </div>
        </div>
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Add settings/management logic
          }}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="h-4 w-4" />
          <span>{workspaceCount} Workspace{workspaceCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {account.createdAt && (
        <div className="text-xs text-gray-500 mb-4">
          Created: {new Date(account.createdAt).toLocaleDateString()}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button 
          className="text-sm text-gray-600 hover:text-gray-900"
         onClick={() => handleViewAccount(account.id)}
        >
          View Details
        </button>
        <button 
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          onClick={() => {
            // TODO: Add manage logic
          }}
        >
          Manage <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AccountCard;