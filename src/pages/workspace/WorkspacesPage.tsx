// // src/pages/WorkspacesPage.tsx
// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { 
//   Search, 
//   Filter, 
//   Plus, 
//   MoreVertical,
//   Building,
//   Users,
//   Mail,
//   Edit,
//   Trash2,
//   Eye,
//   ChevronRight,
//   ArrowLeft,
//   Folder,
//   MessageSquare,
//   Phone,
// } from 'lucide-react';
// import type { Workspace } from '../../types';
// // import type { Workspace } from '../types';
// // import { Workspace } from '../types';

// const WorkspacesPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { accountId } = useParams<{ accountId?: string }>();
//   const [selectedWorkspaces] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'inactive'>('all');
//   const [filterType, setFilterType] = useState<string>('all');

//   // Mock workspaces data
//   const workspaces: Workspace[] = [
//     {
//       id: '1',
//       name: 'Public Works Department',
//       accountId: '1',
//       accountName: 'City of Frisco',
//       type: 'department',
//       status: 'active',
//       description: 'Handles infrastructure, maintenance, and public works projects',
//       usersCount: 12,
//       conversationsCount: 542,
//       departmentsCount: 3,
//       channels: ['email', 'sms', 'voice'],
//       createdAt: '2024-01-15',
//       updatedAt: '2024-01-15',
//       owner: { id: 'owner1', name: 'John Smith' },
//     },
//     {
//       id: '2',
//       name: 'Traffic Management',
//       accountId: '1',
//       accountName: 'City of Frisco',
//       type: 'department',
//       status: 'active',
//       description: 'Traffic signals, road safety, and transportation planning',
//       usersCount: 8,
//       conversationsCount: 321,
//       departmentsCount: 2,
//       channels: ['email', 'sms'],
//       createdAt: '2024-01-20',
//       updatedAt: '2024-01-20',
//       owner: { id: 'owner2', name: 'Jane Doe' },
//     },
//     {
//       id: '3',
//       name: 'Austin High School',
//       accountId: '2',
//       accountName: 'Austin ISD',
//       type: 'project',
//       status: 'active',
//       description: 'High school administration and student services',
//       usersCount: 15,
//       conversationsCount: 789,
//       departmentsCount: 4,
//       channels: ['email', 'whatsapp'],
//       createdAt: '2024-02-10',
//       lastActive: '30 minutes ago',
//       owner: { id: 'owner3', name: 'Alice Johnson' },
//     },
//     {
//       id: '4',
//       name: 'Complaints Division',
//       accountId: '1',
//       accountName: 'City of Frisco',
//       type: 'department',
//       status: 'inactive',
//       description: 'Citizen complaints and feedback management',
//       usersCount: 5,
//       conversationsCount: 234,
//       departmentsCount: 1,
//       channels: ['email'],
//       createdAt: '2024-02-15',
//       lastActive: '1 week ago',
//       owner: { id: 'owner4', name: 'Bob Williams' },  
//     },
//     {
//       id: '5',
//       name: 'North Texas Region',
//       accountId: '3',
//       accountName: 'State of Texas',
//       type: 'regional',
//       status: 'active',
//       description: 'Regional administration for North Texas area',
//       usersCount: 24,
//       conversationsCount: 1024,
//       departmentsCount: 6,
//       channels: ['email', 'sms', 'voice', 'whatsapp'],
//       createdAt: '2024-03-01',
//       lastActive: 'Just now',
//       owner: { id: 'owner5', name: 'Carol Davis' }, 
//     },
//     {
//       id: '6',
//       name: 'Library Services',
//       accountId: '1',
//       accountName: 'City of Frisco',
//       type: 'department',
//       status: 'active',
//       description: 'Public library system and community programs',
//       usersCount: 7,
//       conversationsCount: 189,
//       departmentsCount: 2,
//       channels: ['email', 'sms'],
//       createdAt: '2024-02-28',
//       lastActive: '2 days ago', 
//       owner: { id: 'owner6', name: 'David Martinez' },  
//     },
//   ];

//   // Filter workspaces if accountId is provided
//   const filteredWorkspaces = workspaces
//     .filter(workspace => !accountId || workspace.accountId === accountId)
//     .filter(workspace => {
//     const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                      workspace.accountName?.toLowerCase().includes(searchQuery.toLowerCase());
      
//       const matchesStatus = selectedTab === 'all' || workspace.status === selectedTab;
//         
//       return matchesSearch && matchesStatus;
//     });

//   const stats = [
//   { 
//     label: 'Total Workspaces', 
//     value: filteredWorkspaces.length.toString(), 
//     icon: Building, 
//     change: '+2 this month' 
//   },
//   { 
//     label: 'Active Users', 
//     value: filteredWorkspaces.reduce((sum, w) => sum + (w.usersCount || 0), 0).toString(), 
//     icon: Users, 
//     change: '+15 today' 
//   },
//   { 
//     label: 'Conversations', 
//     value: filteredWorkspaces.reduce((sum, w) => sum + (w.conversationsCount || 0), 0).toLocaleString(), 
//     icon: MessageSquare, 
//     change: '+42 active' 
//   },
//   { 
//     label: 'Departments', 
//     value: filteredWorkspaces.reduce((sum, w) => sum + (w.departmentsCount || 0), 0).toString(), 
//     icon: Folder, 
//     change: '+3 new' 
//   },
// ];

//   const workspaceTypes = [
//     { value: 'all', label: 'All Types' },
//     { value: 'department', label: 'Department', color: 'bg-blue-100 text-blue-800' },
//     { value: 'team', label: 'Team', color: 'bg-green-100 text-green-800' },
//     { value: 'project', label: 'Project', color: 'bg-purple-100 text-purple-800' },
//     { value: 'regional', label: 'Regional', color: 'bg-orange-100 text-orange-800' },
//   ];

//   const getChannelIcon = (channel: Workspace['channels'][0]) => {
//     switch (channel) {
//       case 'email':
//         return <Mail className="h-3 w-3 text-gray-500" />;
//       case 'sms':
//         return <MessageSquare className="h-3 w-3 text-green-500" />;
//       case 'voice':
//         return <Phone className="h-3 w-3 text-blue-500" />;
//       case 'whatsapp':
//         return <MessageSquare className="h-3 w-3 text-green-600" />;
//     }
//   };


//   console.log("accountId:", accountId);
//   const handleCreateWorkspace = () => {
//     if (accountId) {
//       navigate(`/accounts/${accountId}/workspaces/create`);
//     } else {
//       navigate('/workspaces/create');
//     }
//   };

//   const handleViewWorkspace = (workspaceId: string) => {
//     navigate(`/workspaces/${workspaceId}`);
//   };

//   const handleEditWorkspace = (workspaceId: string) => {
//     navigate(`/workspaces/${workspaceId}/edit`);
//   };

//   const handleViewAccount = (accountId: string) => {
//     navigate(`/accounts/${accountId}`);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             {accountId && (
//               <button
//                 onClick={() => navigate('/accounts')}
//                 className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </button>
//             )}
//             <h1 className="text-2xl font-bold text-gray-900">
//               {accountId ? 'Account Workspaces' : 'Workspaces'}
//             </h1>
//           </div>
//           <p className="text-gray-600">
//             {accountId 
//               ? 'Manage workspaces for this organization' 
//               : 'Manage all workspaces across organizations'}
//           </p>
//         </div>
//         <button 
//           onClick={handleCreateWorkspace}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//         >
//           <Plus className="h-5 w-5" />
//           Create Workspace
//         </button>
//       </div>

//       {/* Account Context (if viewing specific account) */}
//       {accountId && (
//         <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//                 <Building className="h-5 w-5 text-indigo-600" />
//               </div>
//               <div>
//                 <h3 className="font-medium text-indigo-900">City of Frisco</h3>
//                 <p className="text-sm text-indigo-700">Viewing workspaces for this organization</p>
//               </div>
//             </div>
//             <button 
//               onClick={() => handleViewAccount(accountId)}
//               className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//             >
//               View Account
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                 <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
//               </div>
//               <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
//                 <stat.icon className="h-6 w-6 text-indigo-600" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <nav className="flex space-x-8 px-6">
//             <button
//               onClick={() => setSelectedTab('all')}
//               className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
//                 selectedTab === 'all'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               All Workspaces
//               <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
//                 {filteredWorkspaces.length}
//               </span>
//             </button>
//             <button
//               onClick={() => setSelectedTab('active')}
//               className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
//                 selectedTab === 'active'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Active
//               <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
//                 {filteredWorkspaces.filter(w => w.status === 'active').length}
//               </span>
//             </button>
//             <button
//               onClick={() => setSelectedTab('inactive')}
//               className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
//                 selectedTab === 'inactive'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Inactive
//               <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
//                 {filteredWorkspaces.filter(w => w.status === 'inactive').length}
//               </span>
//             </button>
//           </nav>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search workspaces by name or account..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div className="flex items-center gap-3">
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
//               >
//                 {workspaceTypes.map((type) => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>
              
//               <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//                 <Filter className="h-4 w-4" />
//                 More Filters
//               </button>
//               <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
//                 <MoreVertical className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Workspaces Grid */}
//         {filteredWorkspaces.length > 0 ? (
//           <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredWorkspaces.map((workspace) => (
//               <div
//                 key={workspace.id}
//                 className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//                       <Folder className="h-5 w-5 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//                           workspace.status === 'active' ? 'bg-green-100 text-green-800' :
//                           workspace.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
//                         </span>
//                         <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//                           workspaceTypes.find(t => t.value === workspace.type)?.color || 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
//                     <MoreVertical className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                   {workspace.description || 'No description provided'}
//                 </p>

//                 <div className="space-y-3 mb-6">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Account:</span>
//                     <span className="font-medium text-gray-900">{workspace.accountName}</span>
//                   </div>
                  
//                   {workspace.owner && (
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">Owner:</span>
//                       <span className="font-medium text-gray-900">{workspace.owner.name}</span>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Created:</span>
//                     <span className="font-medium text-gray-900">{workspace.createdAt}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-600">Channels:</span>
//                     <div className="flex gap-1">
//                       {workspace.channels.map((channel, idx) => (
//                         <div key={idx} className="p-1 bg-gray-100 rounded">
//                           {getChannelIcon(channel)}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Users className="h-4 w-4" />
//                       <span>{workspace.usersCount} Users</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <MessageSquare className="h-4 w-4" />
//                       <span>{workspace.conversationsCount} Conv</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Folder className="h-4 w-4" />
//                       <span>{workspace.departmentsCount} Depts</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <button 
//                     onClick={() => handleViewWorkspace(workspace.id)}
//                     className="text-sm text-gray-600 hover:text-gray-900"
//                   >
//                     View Details
//                   </button>
//                   <div className="flex items-center gap-2">
//                     <button 
//                       onClick={() => handleEditWorkspace(workspace.id)}
//                       className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                       title="Edit"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </button>
//                     <button 
//                       onClick={() => handleViewWorkspace(workspace.id)}
//                       className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                       title="View"
//                     >
//                       <Eye className="h-4 w-4" />
//                     </button>
//                     <button 
//                       onClick={() => console.log('Delete workspace:', workspace.id)}
//                       className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//                       title="Delete"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {/* Add New Workspace Card */}
//             <div 
//               onClick={handleCreateWorkspace}
//               className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer"
//             >
//               <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//                 <Plus className="h-6 w-6 text-indigo-600" />
//               </div>
//               <h3 className="font-medium text-gray-900 mb-1">Add New Workspace</h3>
//               <p className="text-sm text-gray-500 text-center mb-4">
//                 Create a new workspace
//               </p>
//               <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
//                 Create Workspace
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-12 text-center">
//             <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces found</h3>
//             <p className="text-gray-600 mb-6">
//               {searchQuery || selectedTab !== 'all' || filterType !== 'all' 
//                 ? 'Try adjusting your search or filters'
//                 : 'Get started by creating your first workspace'}
//             </p>
//             {(!searchQuery && selectedTab === 'all' && filterType === 'all') && (
//               <button 
//                 onClick={handleCreateWorkspace}
//                 className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//               >
//                 <Plus className="h-5 w-5" />
//                 Create Your First Workspace
//               </button>
//             )}
//           </div>
//         )}

//         {/* Bulk Actions */}
//         {selectedWorkspaces.length > 0 && (
//           <div className="p-6 border-t border-gray-200">
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700">
//                 {selectedWorkspaces.length} workspace{selectedWorkspaces.length > 1 ? 's' : ''} selected
//               </span>
//               <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
//                 Activate Selected
//               </button>
//               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//                 Archive Selected
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Quick Stats */}
//       <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="font-medium text-indigo-900 mb-1">About Workspaces</h3>
//             <p className="text-sm text-indigo-700">
//               Workspaces are isolated environments within an account. Each workspace can have 
//               its own departments, teams, and configuration. Perfect for organizing large 
//               organizations by function or geography.
//             </p>
//           </div>
//           <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
//             Learn More <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkspacesPage;

// src/pages/WorkspacesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Building,
  Users,
  Mail,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  ArrowLeft,
  Folder,
  MessageSquare,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { workspaceApi, type Workspace } from '../../api/workspace.api';



const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'inactive'>('all');
  
  // State for workspaces and loading
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    activeUsers: 0,
    conversations: 0,
    departments: 0
  });

  // Fetch workspaces from API
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!accountId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // const response = await axios.get(`${BASE_URL}/workspaces?accountId=${accountId}`);
         const workspacesResponse = await workspaceApi.getWorkspacesByAccount(accountId);
        console.log('Workspaces API response:', workspacesResponse);
        // Handle response - check if it's an array directly or wrapped in data
        let workspacesData = [];
        if (Array.isArray(workspacesResponse.data)) {
          workspacesData = workspacesResponse.data;
        } else if (workspacesResponse.data?.data && Array.isArray(workspacesResponse.data.data)) {
          workspacesData = workspacesResponse.data.data;
        } else if (workspacesResponse.data?.workspaces && Array.isArray(workspacesResponse.data.workspaces)) {
          workspacesData = workspacesResponse.data.workspaces;
        }

        if (workspacesData.length >= 0) { // Always true for arrays
          const workspacesData = workspacesResponse.data.data || [];
          setWorkspaces(workspacesData);
          
          // Calculate stats
          const totalWorkspaces = workspacesData.length;
          const activeUsers = workspacesData.reduce((sum: number, w: any) => sum + (w.usersCount || 0), 0);
          const conversations = workspacesData.reduce((sum: number, w: any) => sum + (w.conversationsCount || 0), 0);
          const departments = workspacesData.reduce((sum: number, w: any) => sum + (w.departmentsCount || 0), 0);
          
          setStats({
            totalWorkspaces,
            activeUsers,
            conversations,
            departments
          });
        }
      } catch (err: any) {
        console.error('Error fetching workspaces:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch workspaces');
        setWorkspaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [accountId]);

  // Transform backend data to match UI expectations
  const transformedWorkspaces = workspaces.map(workspace => ({
    ...workspace,
    accountName: 'Loading...', // You need to fetch account name separately
    status: (workspace.status as 'active' | 'inactive') || 'active',
    usersCount: workspace.usersCount || 0, // Use backend data if available
    conversationsCount: workspace.conversationsCount || 0,
    departmentsCount: workspace.departmentsCount || 0,
    channels: (workspace.channels as ('email' | 'sms' | 'voice' | 'whatsapp')[]) || [],
    owner: workspace.owner || { id: '', name: '' },
    lastActive: workspace.lastActive || '',
  }));

  // Filter workspaces
  const filteredWorkspaces = transformedWorkspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     workspace.accountName?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedTab === 'all' || workspace.status === selectedTab;
    
    return matchesSearch && matchesStatus;
  });

  const statsData = [
    { 
      label: 'Total Workspaces', 
      value: stats.totalWorkspaces.toString(), 
      icon: Building, 
      change: '+2 this month' 
    },
    { 
      label: 'Active Users', 
      value: stats.activeUsers.toString(), 
      icon: Users, 
      change: '+15 today' 
    },
    { 
      label: 'Conversations', 
      value: stats.conversations.toLocaleString(), 
      icon: MessageSquare, 
      change: '+42 active' 
    },
    { 
      label: 'Departments', 
      value: stats.departments.toString(), 
      icon: Folder, 
      change: '+3 new' 
    },
  ];


  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-3 w-3 text-gray-500" />;
      case 'sms':
        return <MessageSquare className="h-3 w-3 text-green-500" />;
      case 'voice':
        return <Phone className="h-3 w-3 text-blue-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-3 w-3 text-green-600" />;
      default:
        return null;
    }
  };

  const handleCreateWorkspace = () => {
    if (accountId) {
      navigate(`/accounts/${accountId}/workspaces/create`);
    } else {
      navigate('/workspaces/create');
    }
  };

  const handleViewWorkspace = (workspaceId: string) => {
    if (accountId) {
      navigate(`/accounts/${accountId}/workspaces/${workspaceId}`);
    } else {
      // If no account context, show an error or redirect to accounts
      alert('Please access workspaces through their associated account. Navigate to Accounts first.');
      navigate('/accounts');
    }
  };

  const handleEditWorkspace = (workspaceId: string) => {
    if (accountId) {
      navigate(`/accounts/${accountId}/workspaces/${workspaceId}/edit`);
    } else {
      alert('Please access workspaces through their associated account to edit them.');
      navigate('/accounts');
    }
  };

  const handleViewAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  // Delete workspace function
  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!accountId) return;
    
    if (!window.confirm('Are you sure you want to delete this workspace?')) {
      return;
    }

    try {
      // Delete workspace using API
      await workspaceApi.deleteWorkspace(workspaceId, accountId);

      // Refresh workspaces list
      const workspacesResponse = await workspaceApi.getWorkspacesByAccount(accountId);

      // Handle response
      let workspacesData = [];
      if (Array.isArray(workspacesResponse.data)) {
        workspacesData = workspacesResponse.data;
      } else if (workspacesResponse.data?.data && Array.isArray(workspacesResponse.data.data)) {
        workspacesData = workspacesResponse.data.data;
      } else if (workspacesResponse.data?.workspaces && Array.isArray(workspacesResponse.data.workspaces)) {
        workspacesData = workspacesResponse.data.workspaces;
      }

      setWorkspaces(workspacesData);
      alert('Workspace deleted successfully');
    } catch (err) {
      console.error('Failed to delete workspace:', err);
      alert('Failed to delete workspace');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800">Error loading workspaces</h3>
          </div>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No accountId state
  if (!accountId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-800">No Account Selected</h3>
          </div>
          <p className="text-yellow-700">
            Please select an account to view its workspaces.
          </p>
          <button 
            onClick={() => navigate('/accounts')}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Browse Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate('/accounts')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Account Workspaces
            </h1>
          </div>
          <p className="text-gray-600">
            Manage workspaces for this organization
          </p>
        </div>
        <button 
          onClick={handleCreateWorkspace}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Create Workspace
        </button>
      </div>

      {/* Account Context */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-900">Account ID: {accountId}</h3>
              <p className="text-sm text-indigo-700">Viewing workspaces for this organization</p>
            </div>
          </div>
          <button 
            onClick={() => handleViewAccount(accountId)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Account
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
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
              All Workspaces
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                {filteredWorkspaces.length}
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
                {filteredWorkspaces.filter(w => w.status === 'active').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('inactive')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'inactive'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {filteredWorkspaces.filter(w => w.status === 'inactive').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspaces by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-3">
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspaces Grid */}
        {filteredWorkspaces.length > 0 ? (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Folder className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          workspace.status === 'active' ? 'bg-green-100 text-green-800' :
                          workspace.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>


                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Account ID:</span>
                    <span className="font-medium text-gray-900 font-mono text-xs">{workspace.accountId}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {workspace.channels && workspace.channels.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Channels:</span>
                      <div className="flex gap-1">
                        {workspace.channels.map((channel, idx) => (
                          <div key={idx} className="p-1 bg-gray-100 rounded">
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{workspace.usersCount || 0} Users</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleViewWorkspace(workspace.id)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditWorkspace(workspace.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewWorkspace(workspace.id)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Workspace Card */}
            <div 
              onClick={handleCreateWorkspace}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Add New Workspace</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Create a new workspace
              </p>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Create Workspace
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {workspaces.length === 0 ? 'No workspaces found' : 'No matching workspaces'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTab !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first workspace'}
            </p>
            {(!searchQuery && selectedTab === 'all') && (
              <button 
                onClick={handleCreateWorkspace}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="h-5 w-5" />
                Create Your First Workspace
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-indigo-900 mb-1">About Workspaces</h3>
            <p className="text-sm text-indigo-700">
              Workspaces are isolated environments within an account. Each workspace can have 
              its own departments, teams, and configuration. Perfect for organizing large 
              organizations by function or geography.
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

export default WorkspacesPage;