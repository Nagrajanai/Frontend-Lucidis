// src/pages/UsersPage.tsx
import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Building,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  LogIn,
  User as UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'app_owner' | 'account_admin' | 'department_manager' | 'agent' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  accountName: string;
  workspaceName: string;
  departmentName: string;
  teamNames: string[];
  lastLogin: string;
  createdAt: string;
  isImpersonatable: boolean;
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@frisco.gov',
      role: 'account_admin',
      status: 'active',
      accountName: 'City of Frisco',
      workspaceName: 'Public Works',
      departmentName: 'Traffic Management',
      teamNames: ['Traffic Team A', 'Complaints Team'],
      lastLogin: '2 hours ago',
      createdAt: 'Jan 15, 2024',
      isImpersonatable: true,
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@austinis.edu',
      role: 'department_manager',
      status: 'active',
      accountName: 'Austin ISD',
      workspaceName: 'Austin High School',
      departmentName: 'Administration',
      teamNames: ['Office Staff'],
      lastLogin: '1 day ago',
      createdAt: 'Feb 20, 2024',
      isImpersonatable: false,
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@whitegloveai.com',
      role: 'app_owner',
      status: 'active',
      accountName: 'WhitegloveAI',
      workspaceName: 'Platform',
      departmentName: 'Engineering',
      teamNames: ['DevOps', 'Backend'],
      lastLogin: 'Just now',
      createdAt: 'Mar 1, 2024',
      isImpersonatable: false,
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Williams',
      email: 'emma.w@frisco.gov',
      role: 'agent',
      status: 'pending',
      accountName: 'City of Frisco',
      workspaceName: 'Public Works',
      departmentName: 'Customer Service',
      teamNames: ['Support Team'],
      lastLogin: 'Never logged in',
      createdAt: 'Today',
      isImpersonatable: false,
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Davis',
      email: 'robert.d@austinis.edu',
      role: 'viewer',
      status: 'inactive',
      accountName: 'Austin ISD',
      workspaceName: 'Austin High School',
      departmentName: 'Finance',
      teamNames: ['Audit Team'],
      lastLogin: '3 weeks ago',
      createdAt: 'Dec 10, 2023',
      isImpersonatable: true,
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Martinez',
      email: 'lisa.m@texas.gov',
      role: 'account_admin',
      status: 'active',
      accountName: 'State of Texas',
      workspaceName: 'Health & Human',
      departmentName: 'Compliance',
      teamNames: ['Regulatory Team', 'Audit Team'],
      lastLogin: '5 hours ago',
      createdAt: 'Feb 28, 2024',
      isImpersonatable: false,
    },
  ];

  const roleColors: Record<User['role'], string> = {
    app_owner: 'bg-purple-100 text-purple-800',
    account_admin: 'bg-blue-100 text-blue-800',
    department_manager: 'bg-green-100 text-green-800',
    agent: 'bg-indigo-100 text-indigo-800',
    viewer: 'bg-gray-100 text-gray-800',
  };

  const statusColors: Record<User['status'], string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-red-100 text-red-800',
  };

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats for the dashboard
  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, change: '+3 this week' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length.toString(), icon: UserIcon, change: 'Logged in today' },
    { label: 'Pending Invites', value: users.filter(u => u.status === 'pending').length.toString(), icon: Mail, change: 'Awaiting activation' },
    { label: 'Accounts', value: Array.from(new Set(users.map(u => u.accountName))).length.toString(), icon: Building, change: 'Across all accounts' },
  ];

  const handleInviteUser = () => {
    navigate('/users/invite');
  };

  const handleBulkActions = (action: string) => {
    if (selectedUsers.length === 0) return;
    console.log(`Performing ${action} on users:`, selectedUsers);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users across all accounts, workspaces, and departments</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleInviteUser}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <UserPlus className="h-5 w-5" />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
                {filteredUsers.length} Users
              </span>
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => handleBulkActions(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk Actions</option>
                    <option value="activate">Activate</option>
                    <option value="deactivate">Deactivate</option>
                    <option value="resend">Resend Invite</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or account..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="app_owner">App Owner</option>
                <option value="account_admin">Account Admin</option>
                <option value="department_manager">Department Manager</option>
                <option value="agent">Agent</option>
                <option value="viewer">Viewer</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                More Filters
              </button>

              <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
                <Download className="h-5 w-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="pl-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  User
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                  Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Organization
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                  Activity
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="pl-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-indigo-600">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[140px]">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      {user.teamNames && user.teamNames.length > 0 && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.teamNames[0]}
                          {user.teamNames.length > 1 && ` +${user.teamNames.length - 1}`}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[180px]">
                    <div className="space-y-1">
                      <div className="text-sm font-medium truncate flex items-center gap-1">
                        <Building className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        {user.accountName}
                      </div>
                      <div className="text-xs text-gray-600 truncate flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        {user.workspaceName} → {user.departmentName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[120px]">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                        {user.status === 'active' && <CheckCircle className="h-3 w-3" />}
                        {user.status === 'pending' && <Mail className="h-3 w-3" />}
                        {user.status === 'inactive' && <XCircle className="h-3 w-3" />}
                        <span className="capitalize">{user.status}</span>
                      </span>
                      {user.status === 'pending' && (
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline truncate">
                          Resend invite
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[140px]">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 truncate flex items-center gap-1">
                        <LogIn className="h-3 w-3 flex-shrink-0" />
                        {user.lastLogin}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Joined: {user.createdAt}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[100px]">
                    <div className="flex items-center gap-1">
                      {user.isImpersonatable && (
                        <button 
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Impersonate user"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button 
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit user"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {user.status !== 'pending' && (
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="More options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Users className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by inviting your first user'}
            </p>
            <button
              onClick={handleInviteUser}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <UserPlus className="h-5 w-5" />
              Invite User
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;