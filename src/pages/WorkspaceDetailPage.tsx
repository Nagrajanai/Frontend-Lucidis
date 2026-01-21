// src/pages/WorkspaceDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Folder,
  Users,
  MessageSquare,
  Building,
  Settings,
  Edit,
  Plus,
  Mail,
  Phone,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserPlus,
  Hash,
  Clock
} from 'lucide-react';
import type { Workspace, User, Conversation } from '../types';

const WorkspaceDetailPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'conversations' | 'departments' | 'settings'>('overview');

  // Mock workspace data
  useEffect(() => {
    if (!workspaceId) return;

    // Simulate API call
    setTimeout(() => {
      const mockWorkspace: Workspace = {
        id: workspaceId,
        name: workspaceId === '1' ? 'Public Works Department' : workspaceId === '2' ? 'Traffic Management' : 'Library Services',
        accountId: '1',
        accountName: 'City of Frisco',
        type: 'department',
        status: 'active',
        description: workspaceId === '1'
          ? 'Handles infrastructure, maintenance, and public works projects'
          : workspaceId === '2'
          ? 'Traffic signals, road safety, and transportation planning'
          : 'Public library system and community programs',
        usersCount: workspaceId === '1' ? 12 : workspaceId === '2' ? 8 : 7,
        conversationsCount: workspaceId === '1' ? 542 : workspaceId === '2' ? 321 : 189,
        departmentsCount: workspaceId === '1' ? 3 : workspaceId === '2' ? 2 : 2,
        channels: workspaceId === '1' ? ['email', 'sms', 'voice'] : workspaceId === '2' ? ['email', 'sms'] : ['email', 'sms'],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        owner: { id: 'owner1', name: 'John Smith' },
        lastActive: 'Just now',
      };

      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@frisco.gov',
          role: 'department_manager',
          status: 'active',
          accountId: '1',
          accountName: 'City of Frisco',
          workspaceId: workspaceId,
          workspaceName: mockWorkspace.name,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          lastLogin: '2024-01-20T10:30:00Z',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@frisco.gov',
          role: 'agent',
          status: 'active',
          accountId: '1',
          accountName: 'City of Frisco',
          workspaceId: workspaceId,
          workspaceName: mockWorkspace.name,
          createdAt: '2024-01-16',
          updatedAt: '2024-01-19',
          lastLogin: '2024-01-19T14:45:00Z',
        },
      ];

      const mockConversations: Conversation[] = [
        {
          id: '1',
          contactId: 'contact1',
          workspaceId: workspaceId!,
          status: 'in_progress',
          channel: 'email',
          priority: 'high',
          unreadCount: 2,
          lastMessageAt: '2024-01-20T10:30:00Z',
          createdAt: '2024-01-18T09:00:00Z',
          assignedTo: '1',
          tags: ['urgent', 'infrastructure'],
          contact: {
            id: 'contact1',
            name: 'Bob Johnson',
            email: 'bob.johnson@email.com',
            workspaceId: workspaceId!,
            createdAt: '2024-01-18T09:00:00Z',
          },
          lastMessage: 'Following up on the pothole repair request...',
        },
        {
          id: '2',
          contactId: 'contact2',
          workspaceId: workspaceId!,
          status: 'todo',
          channel: 'sms',
          priority: 'medium',
          unreadCount: 0,
          lastMessageAt: '2024-01-19T16:20:00Z',
          createdAt: '2024-01-19T14:00:00Z',
          assignedTo: '2',
          tags: ['maintenance'],
          contact: {
            id: 'contact2',
            name: 'Alice Brown',
            phone: '+1234567890',
            workspaceId: workspaceId!,
            createdAt: '2024-01-19T14:00:00Z',
          },
          lastMessage: 'Street light is out on Main Street',
        },
      ];

      setWorkspace(mockWorkspace);
      setUsers(mockUsers);
      setConversations(mockConversations);
      setLoading(false);
    }, 500);
  }, [workspaceId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'suspended':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: Workspace['channels'][0]) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'voice':
        return <Phone className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditWorkspace = () => {
    navigate(`/workspaces/${workspaceId}/edit`);
  };

  const handleViewAccount = () => {
    if (workspace?.accountId) {
      navigate(`/accounts/${workspace.accountId}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Workspace Not Found</h2>
          <p className="text-gray-600 mb-6">The workspace you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/workspaces')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workspaces')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Workspaces
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Folder className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">in {workspace.accountName}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(workspace.status)}`}>
                  {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  workspace.type === 'department' ? 'bg-blue-100 text-blue-800' :
                  workspace.type === 'team' ? 'bg-green-100 text-green-800' :
                  workspace.type === 'project' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewAccount}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Building className="h-4 w-4" />
            View Account
          </button>
          <button
            onClick={handleEditWorkspace}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit Workspace
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{workspace.usersCount || 0}</p>
              <p className="text-sm text-gray-500 mt-1">+2 this week</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{workspace.conversationsCount || 0}</p>
              <p className="text-sm text-gray-500 mt-1">+24 today</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{workspace.departmentsCount || 0}</p>
              <p className="text-sm text-gray-500 mt-1">No change</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Hash className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Workspace Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(workspace.status)}
                <span className="text-lg font-bold text-gray-900 capitalize">{workspace.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Last active: {workspace.lastActive || 'Unknown'}</p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Folder },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'conversations', label: 'Conversations', icon: MessageSquare },
              { id: 'departments', label: 'Departments', icon: Hash },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 font-medium text-sm border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Workspace Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                      <p className="text-gray-900">{workspace.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                      <p className="text-gray-900">{workspace.accountName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        workspace.type === 'department' ? 'bg-blue-100 text-blue-800' :
                        workspace.type === 'team' ? 'bg-green-100 text-green-800' :
                        workspace.type === 'project' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workspace.status)}
                        <span className="capitalize">{workspace.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-900">{workspace.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                      <p className="text-gray-900">{workspace.owner?.name || 'Unassigned'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                      <div className="flex gap-2">
                        {workspace.channels.map((channel, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            {getChannelIcon(channel)}
                            <span className="capitalize">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                      <p className="text-gray-900">{workspace.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <UserPlus className="h-6 w-6 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Add User</p>
                      <p className="text-sm text-gray-600">Invite new team member</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Start Conversation</p>
                      <p className="text-sm text-gray-600">Create new conversation</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <Hash className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Add Department</p>
                      <p className="text-sm text-gray-600">Create new department</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Users ({users.length})</h3>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </button>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                      <p>Joined: {user.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Active Conversations ({conversations.length})</h3>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                  New Conversation
                </button>
              </div>

              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {conversation.contact?.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{conversation.contact?.name}</h4>
                          <p className="text-sm text-gray-600">
                            {conversation.contact?.email || conversation.contact?.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          conversation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          conversation.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                          conversation.status === 'closed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {conversation.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{conversation.lastMessage}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(conversation.lastMessageAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          {conversation.channel === 'email' ? <Mail className="h-3 w-3" /> :
                           conversation.channel === 'sms' ? <MessageSquare className="h-3 w-3" /> :
                           <Phone className="h-3 w-3" />}
                          {conversation.channel}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {conversation.unreadCount} unread
                          </span>
                        )}
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Departments ({workspace.departmentsCount || 0})</h3>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                  Add Department
                </button>
              </div>

              <div className="text-center py-12">
                <Hash className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No departments yet</h3>
                <p className="text-gray-600 mb-6">
                  Departments help organize conversations and assign responsibilities within this workspace.
                </p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Create First Department
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Workspace Settings</h3>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Workspace Details</h4>
                  <p className="text-sm text-gray-600 mb-4">Update workspace name, description, and basic settings.</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Edit Details
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Communication Channels</h4>
                  <p className="text-sm text-gray-600 mb-4">Configure email, SMS, voice, and other communication channels.</p>
                  <div className="flex gap-2 mb-4">
                    {workspace.channels.map((channel, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {getChannelIcon(channel)}
                        {channel}
                      </span>
                    ))}
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Manage Channels
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">User Permissions</h4>
                  <p className="text-sm text-gray-600 mb-4">Manage user roles and access permissions for this workspace.</p>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Manage Permissions
                  </button>
                </div>

                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">Irreversible actions that affect this workspace.</p>
                  <div className="flex gap-3">
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                      Archive Workspace
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;