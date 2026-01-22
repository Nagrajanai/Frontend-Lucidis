// src/pages/AccountDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Users,
  Folder,
  MessageSquare,
  Settings,
  Edit,
  Plus,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserPlus,
  X
} from 'lucide-react';
import type { User } from '../types';
// import type { Account, Workspace } from '../api/auth.api';
// import { authApi, type Account } from '../api/auth.api';
import { accountsApi, type Account } from '../api/accounts.api';
import { workspaceApi, type Workspace } from '../api/workspace.api';




const mockUsersBase: Omit<User, 'accountId' | 'accountName'>[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@frisco.gov',
    role: 'account_admin',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    lastLogin: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@frisco.gov',
    role: 'department_manager',
    status: 'active',
    workspaceId: '1',
    workspaceName: 'Public Works Department',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-19',
    lastLogin: '2024-01-19T14:45:00Z',
  },
];

const AccountDetailPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [account, setAccount] = useState<Account | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]= useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'users' | 'settings'>('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  
  // Mock account data
useEffect(() => {
  if (!accountId) {
    setError("No account ID in URL");
    setLoading(false);
    return;
  }

  let isMounted = true;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load account data
      const accountResponse = await accountsApi.getAccountById(accountId);
      console.log('Account API response:', accountResponse);
      console.log('Account response data:', accountResponse.data);
      console.log('Account response data.data:', accountResponse.data?.data);

      let realAccount = accountResponse.data?.data || accountResponse.data;

      // Debug: Check what we actually received
      console.log('Raw realAccount before validation:', realAccount);
      console.log('Type of realAccount:', typeof realAccount);

      // Ensure realAccount is an object with expected properties
      if (!realAccount || typeof realAccount !== 'object') {
        console.error('realAccount is not an object:', realAccount);
        throw new Error('Invalid account data received from API');
      }

      // Check if it's an array or has unexpected structure
      if (Array.isArray(realAccount)) {
        console.error('realAccount is an array:', realAccount);
        throw new Error('API returned array instead of account object');
      }

      // Log all keys to see what we have
      console.log('realAccount keys:', Object.keys(realAccount));

      // Validate required fields
      if (!realAccount.id || !realAccount.name) {
        console.warn('Account object missing required fields. Available keys:', Object.keys(realAccount));
        console.warn('Full object:', realAccount);

        // Try to fix common API response issues
        if (realAccount.account) {
          console.log('Trying realAccount.account');
          realAccount = realAccount.account;
        } else if (realAccount.data) {
          console.log('Trying realAccount.data');
          realAccount = realAccount.data;
        } else {
          console.error('Cannot find valid account object in response');
          throw new Error('Account object structure is invalid');
        }
      }

      console.log('Final validated account object:', realAccount);
      console.log('Final account keys:', Object.keys(realAccount));

      if (!isMounted) return;

      setAccount(realAccount);

      // Load real workspace data for this account
      try {
        console.log('Loading workspaces for account:', accountId);
        const workspacesResponse = await workspaceApi.getWorkspacesByAccount(accountId);
        console.log('Workspaces API response:', workspacesResponse);

        const realWorkspaces = workspacesResponse.data?.data || workspacesResponse.data || [];
        console.log('Raw workspaces data:', realWorkspaces);

        // Ensure workspaces is an array and filter out invalid data
        const validWorkspaces = Array.isArray(realWorkspaces)
          ? realWorkspaces.filter((ws: any) => {
              const isValid = ws &&
                typeof ws === "object" &&
                typeof ws.id === "string" &&
                typeof ws.name === "string";
              if (!isValid) {
                console.warn('Invalid workspace object:', ws);
              }
              return isValid;
            })
          : [];

        console.log('Valid workspaces:', validWorkspaces);
        setWorkspaces(validWorkspaces);
      } catch (workspaceError) {
        // If workspace API fails, fall back to empty array (don't break the whole page)
        console.warn('Failed to load workspaces, using empty array:', workspaceError);
        setWorkspaces([]);
      }

      // ── Keep mock users for now (will be replaced with real API later) ───────────
      const patchedUsers: User[] = mockUsersBase.map(user => ({
        ...user,
        accountId,
        accountName: realAccount.name,
      }));

      setUsers(patchedUsers);

    } catch (err: any) {
      if (isMounted) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Could not load account information"
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadData();

  return () => {
    isMounted = false;
  };
}, [accountId]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditAccount = () => {
    navigate(`/accounts/${accountId}/edit`);
  };

  const handleCreateWorkspace = () => {
    navigate(`/accounts/${accountId}/workspaces/create`);
  };

  const handleViewWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`);
  };

if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

if (error || !account) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Account Not Found'}
        </h2>
        <p className="text-gray-600 mb-6">
          {error
            ? 'Something went wrong. Please try again later.'
            : "The account you're looking for doesn't exist or has been deleted."}
        </p>
        <button
          onClick={() => navigate('/accounts')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          Back to Accounts
        </button>
      </div>
    );
  }

  // Additional safety check for account object structure
  if (!account || typeof account !== 'object') {
    console.error('Account is not an object:', account);
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Invalid Account Data
        </h2>
        <p className="text-gray-600 mb-6">
          The account data received is not an object. Please contact support.
        </p>
        <button
          onClick={() => navigate('/accounts')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          Back to Accounts
        </button>
      </div>
    );
  }

  // Check if account has the wrong structure (like a workspace object)
  if ('accountId' in account) {
    console.error('Account object has accountId - this looks like workspace data:', account);
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Data Structure Error
        </h2>
        <p className="text-gray-600 mb-6">
          Received workspace-like data instead of account data. Please check the API response.
        </p>
        <button
          onClick={() => navigate('/accounts')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          Back to Accounts
        </button>
      </div>
    );
  }
  // Emergency safety check - prevent rendering if account data is malformed
  try {
    // Test if we can safely access account properties
    const testAccess = account?.name || account?.slug || 'test';
    if (typeof testAccess === 'object') {
      throw new Error('Account property access returns object instead of string');
    }
  } catch (safetyError) {
    console.error('Safety check failed:', safetyError);
    console.error('Account object:', account);
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Data Rendering Error
        </h2>
        <p className="text-gray-600 mb-6">
          There was an error rendering the account data. Check the console for details.
        </p>
        <button
          onClick={() => navigate('/accounts')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          Back to Accounts
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/accounts')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Accounts
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{account?.name || 'Unknown Account'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor('active')}`}>
                  {/* {account.status?.charAt(0).toUpperCase() + account.status.slice(1)} */}
                  Active
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{account?.slug || 'No slug'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEditAccount}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit Account
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
              <p className="text-sm text-gray-600">Total Workspaces</p>
              {/* <p className="text-2xl font-bold text-gray-900 mt-1">{account?.workspaces || 0}</p> */}
              <p className="text-2xl font-bold text-gray-900 mt-1">{workspaces.length}</p>

              <p className="text-sm text-gray-500 mt-1">+1 this month</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              {/* <p className="text-2xl font-bold text-gray-900 mt-1">{account?.users || 0}</p> */}
              <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>

              <p className="text-sm text-gray-500 mt-1">+5 this week</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
              <p className="text-sm text-gray-500 mt-1">+142 today</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon('active')}
                <span className="text-lg font-bold text-gray-900 capitalize">Active</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Created {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
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
              { id: 'overview', label: 'Overview', icon: Building },
              { id: 'workspaces', label: 'Workspaces', icon: Folder },
              { id: 'users', label: 'Users', icon: Users },
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
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                      <p className="text-gray-900">{account?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <p className="text-gray-900">{account?.slug || 'No slug'}</p>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(account?.status || 'active')}
                        <span className="capitalize">{account?.status || 'active'}</span>
                      </div>
                    </div> */}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                      <p className="text-gray-900">
                        {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                      <p className="text-gray-900">
                        {account?.updatedAt ? new Date(account.updatedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserPlus className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New user added</p>
                      <p className="text-sm text-gray-600">Jane Doe was added to Public Works Department</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Workspace created</p>
                      <p className="text-sm text-gray-600">Traffic Management workspace was created</p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspaces' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Workspaces ({workspaces.length})</h3>
                <button
                  onClick={handleCreateWorkspace}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{workspace.name}</h4>
                        <p className="text-sm text-gray-600">{workspace.description}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(workspace.status)}`}>
                        {workspace.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{workspace.usersCount} users</span>
                      <span>{workspace.conversationsCount} conversations</span>
                      <span>{workspace.departmentsCount} departments</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Created {workspace.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                      <button
                        onClick={() => handleViewWorkspace(workspace.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
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
                      <p>Created: {user.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Details</h4>
                  <p className="text-sm text-gray-600 mb-4">Update basic account information and settings.</p>
                  <button
                    onClick={handleEditAccount}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Edit Account Details
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Security & Access</h4>
                  <p className="text-sm text-gray-600 mb-4">Manage authentication, permissions, and security settings.</p>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Manage Security
                  </button>
                </div>

                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">Irreversible actions that affect this account.</p>
                  <div className="flex gap-3">
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                      Suspend Account
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Delete Account
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

export default AccountDetailPage;