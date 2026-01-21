// src/components/dashboard/WorkspaceCard.tsx
import React from 'react';
import { Folder, Users, MessageSquare, Building, Settings, ChevronRight } from 'lucide-react';
import type { Workspace } from '../../types';

interface WorkspaceCardProps {
  workspace: Workspace;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
  };

  const typeColors = {
    department: 'bg-blue-100 text-blue-800',
    team: 'bg-green-100 text-green-800',
    project: 'bg-purple-100 text-purple-800',
    regional: 'bg-orange-100 text-orange-800',
  };

  const getChannelIcon = (channel: Workspace['channels'][0]) => {
    switch (channel) {
      case 'email':
        return '📧';
      case 'sms':
        return '💬';
      case 'voice':
        return '📞';
      case 'whatsapp':
        return '💬';
      default:
        return '💬';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Folder className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[workspace.status]}`}>
                {workspace.status}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[workspace.type]}`}>
                {workspace.type}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {workspace.description || 'No description provided'}
      </p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{workspace.usersCount || 0} Users</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>{workspace.conversationsCount || 0} Conv</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <span>Channels:</span>
          {workspace.channels.slice(0, 3).map((channel, idx) => (
            <span key={idx} className="text-xs" title={channel}>
              {getChannelIcon(channel)}
            </span>
          ))}
          {workspace.channels.length > 3 && (
            <span className="text-xs text-gray-400">+{workspace.channels.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="h-4 w-4" />
          <span>{workspace.accountName}</span>
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

export default WorkspaceCard;