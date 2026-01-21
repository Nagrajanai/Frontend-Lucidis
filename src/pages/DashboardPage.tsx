// // src/pages/DashboardPage.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   Building,
//   Plus,
//   MessageSquare,
//   Activity,
//   AlertCircle,
//   RefreshCw,
//   type LucideIcon,
// } from "lucide-react";
// import { accountsApi, type Account } from "../api/accounts.api";
// import { STATIC_STATS, STATIC_STATS_ITEMS } from "../data/staticStats";
// import StatsCard from "../componenets/dashboard/StatsCard";
// import AccountCard from "../componenets/dashboard/AccountCard";
// import type { Workspace } from "../types";

// // Helper to get icon component
// const getIconComponent = (iconName: string): LucideIcon => {
//   switch (iconName) {
//     case "Users":
//       return Users;
//     case "Building":
//       return Building;
//     case "MessageSquare":
//       return MessageSquare;
//     case "Activity":
//       return Activity;
//     case "AlertCircle":
//       return AlertCircle;
//     default:
//       return Building;
//   }
// };

// // Helper to format value
// const formatValue = (key: keyof typeof STATIC_STATS, value: number): string => {
//   const item = STATIC_STATS_ITEMS.find((item) => item.key === key);

//   if (item?.format === "percentage") {
//     return `${value}%`;
//   }

//   if (key === "totalConversations") {
//     return value.toLocaleString();
//   }

//   return value.toString();
// };

// // Helper to get change text
// const getChangeText = (key: keyof typeof STATIC_STATS): string => {
//   const item = STATIC_STATS_ITEMS.find((item) => item.key === key);

//   switch (key) {
//     case "totalAccounts":
//       return `${STATIC_STATS.accountsGrowth > 0 ? "+" : ""}${STATIC_STATS.accountsGrowth} this ${item?.period}`;
//     case "activeWorkspaces":
//       return `${STATIC_STATS.workspacesGrowth > 0 ? "+" : ""}${STATIC_STATS.workspacesGrowth} this ${item?.period}`;
//     case "activeUsers":
//       return `${STATIC_STATS.usersGrowth > 0 ? "+" : ""}${STATIC_STATS.usersGrowth} this ${item?.period}`;
//     case "totalConversations":
//       return `${STATIC_STATS.conversationsGrowth > 0 ? "+" : ""}${STATIC_STATS.conversationsGrowth} this ${item?.period}`;
//     case "systemHealth":
//       return STATIC_STATS.systemHealthChange;
//     case "pendingActions":
//       return STATIC_STATS.pendingActionsChange;
//     default:
//       return "";
//   }
// };

// // Helper to get status
// const getStatus = (
//   key: keyof typeof STATIC_STATS,
//   value: number,
// ): "default" | "warning" | "success" => {
//   switch (key) {
//     case "systemHealth":
//       return value >= 99 ? "success" : value >= 95 ? "warning" : "default";
//     case "pendingActions":
//       return value > 0 ? "warning" : "success";
//     default:
//       return value > 0 ? "success" : "default";
//   }
// };

// // Helper to get trend
// const getTrend = (key: keyof typeof STATIC_STATS): number | undefined => {
//   switch (key) {
//     case "totalAccounts":
//       return STATIC_STATS.accountsGrowth;
//     case "activeWorkspaces":
//       return STATIC_STATS.workspacesGrowth;
//     case "activeUsers":
//       return STATIC_STATS.usersGrowth;
//     case "totalConversations":
//       return STATIC_STATS.conversationsGrowth;
//     default:
//       return undefined;
//   }
// };

// const DashboardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<"accounts" | "workspaces">(
//     "accounts",
//   );
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [workspaces] = useState<Workspace[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdated, setLastUpdated] = useState<string>("");

//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch REAL accounts from your existing API
//       const accountsResponse = await accountsApi.getAllAccounts();
//       console.log("Accounts API Response:", accountsResponse.data);
//       if (accountsResponse.data.success) {
//         const accountsData = accountsResponse.data.data;
//         console.log("Accounts data:", accountsData);
//         console.log("Response structure:", {
//           success: accountsResponse.data.success,
//           data: accountsResponse.data.data,
//           dataType: typeof accountsResponse.data.data,
//           isArray: Array.isArray(accountsResponse.data.data),
//         });

//         // Debug: Check each account object
//         if (Array.isArray(accountsData)) {
//           accountsData.forEach((account, index) => {
//             console.log(`Account ${index}:`, account);
//             console.log(`Account ${index} types:`, {
//               id: typeof account?.id,
//               name: typeof account?.name,
//               slug: typeof account?.slug,
//               status: typeof account?.status,
//             });
//             if (account?.status && typeof account.status === "object") {
//               console.error(
//                 `Account ${index} status is an object:`,
//                 account.status,
//               );
//             }
//           });
//         }

//         // Ensure it's an array and filter out invalid accounts
//         const validAccounts = Array.isArray(accountsData)
//           ? accountsData.filter(
//               (account) =>
//                 account &&
//                 typeof account === "object" &&
//                 typeof account.id === "string" &&
//                 typeof account.name === "string" &&
//                 (typeof account.status === "string" || !account.status),
//             )
//           : [];
//         console.log("Valid accounts:", validAccounts);
//         setAccounts(validAccounts);
//       }

//       setLastUpdated(new Date().toLocaleTimeString());
//     } catch (error: any) {
//       console.error("Failed to fetch accounts:", error);
//       setError(error?.message || "Failed to load accounts data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   // Generate stats items from static data
//   const statsItems = STATIC_STATS_ITEMS.map((item) => ({
//     label: item.label,
//     value: formatValue(item.key, STATIC_STATS[item.key] as number),
//     icon: getIconComponent(item.icon),
//     change: getChangeText(item.key),
//     status: getStatus(item.key, STATIC_STATS[item.key] as number),
//     trend: getTrend(item.key),
//   }));

//   return (
//     <div className="p-6 space-y-6">
//       {/* Error Banner */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//           <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}

//       {/* Info Banner - Static Data */}
//       {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Database className="h-5 w-5 text-blue-600 flex-shrink-0" />
//           <div>
//             <p className="text-sm text-blue-800 font-medium">
//               Development Mode
//             </p>
//             <p className="text-sm text-blue-700">
//               Dashboard stats are static. Real-time analytics coming in Phase 2.
//             </p>
//           </div>
//         </div>
//         {lastUpdated && (
//           <span className="text-xs text-blue-600">
//             Accounts updated: {lastUpdated}
//           </span>
//         )}
//       </div> */}

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             App Owner Dashboard
//           </h1>
//           <p className="text-gray-600">
//             Manage accounts, workspaces, and users across all organizations
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={fetchAccounts}
//             disabled={loading}
//             className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
//           >
//             <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
//             Refresh Accounts
//           </button>
//           <button
//             onClick={() => navigate("/accounts/create")}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//           >
//             <Plus className="h-5 w-5" />
//             Create Account
//           </button>
//         </div>
//       </div>

//       {/* Stats Grid - ALL FROM STATIC FILE */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//         {statsItems.map((stat) => (
//           <StatsCard
//             key={stat.label}
//             label={stat.label}
//             value={stat.value}
//             icon={stat.icon}
//             change={stat.change}
//             status={stat.status}
//             trend={stat.trend}
//           />
//         ))}
//       </div>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         {/* Header with Tabs */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">
//               System Management
//             </h2>
//             <div className="flex items-center gap-2">
//               <span className="bg-gray-100 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
//                 {activeTab === "accounts"
//                   ? (accounts || []).length
//                   : (workspaces || []).length}{" "}
//                 {activeTab === "accounts" ? "Accounts" : "Workspaces"}
//               </span>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-8">
//             <button
//               onClick={() => setActiveTab("accounts")}
//               className={`flex items-center gap-2 py-2 px-1 font-medium text-sm border-b-2 transition ${
//                 activeTab === "accounts"
//                   ? "border-indigo-500 text-indigo-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <Building className="h-4 w-4" />
//               Accounts
//             </button>
//             <button
//               onClick={() => setActiveTab("workspaces")}
//               className={`flex items-center gap-2 py-2 px-1 font-medium text-sm border-b-2 transition ${
//                 activeTab === "workspaces"
//                   ? "border-indigo-500 text-indigo-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <Users className="h-4 w-4" />
//               Workspaces
//             </button>
//           </div>
//         </div>

//         {/* Content based on active tab */}
//         {activeTab === "accounts" && (
//           <div className="p-6">
//             <p className="text-sm text-gray-600 mb-6">
//               Create and manage client organizations. Each account can have
//               multiple workspaces.
//             </p>

//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {accounts.map((account) => (
//                 <AccountCard
//                   key={account.id}
//                   account={{
//                     id: account.id,
//                     name: account.name,
//                     slug: account.slug, // Make sure to pass slug!
//                     workspaces: account.workspaces || 0,
//                     users: account.users || 0,
//                     status: account.status as "active" | "inactive" | "pending",
//                   }}
//                 />
//               ))}

//               {/* Add New Account Card */}
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer">
//                 <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//                   <Plus className="h-6 w-6 text-indigo-600" />
//                 </div>
//                 <h3 className="font-medium text-gray-900 mb-1">
//                   Add New Account
//                 </h3>
//                 <p className="text-sm text-gray-500 text-center mb-4">
//                   Create a new client organization
//                 </p>
//                 <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
//                   Create Account
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "workspaces" && (
//           <div className="p-6">
//             <p className="text-sm text-gray-600 mb-6">
//               Monitor and manage workspaces across all accounts. Workspaces are
//               isolated environments for teams and departments.
//             </p>

//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {/* {workspaces.map((workspace: Workspace) => (
//                 <WorkspaceCard key={workspace.id} workspace={workspace} />
//               ))} */}
//               {accounts
//                 .filter(
//                   (account) =>
//                     account &&
//                     typeof account.id === "string" &&
//                     typeof account.name === "string",
//                 )
//                 .map((account) => (
//                   <div key={account.id} className="border rounded-lg p-4">
//                     {/* Simple rendering to test */}
//                     <h3>
//                       {typeof account.name === "string"
//                         ? account.name
//                         : "Invalid Name"}
//                     </h3>
//                     <p>
//                       ID:{" "}
//                       {typeof account.id === "string"
//                         ? account.id
//                         : "Invalid ID"}
//                     </p>
//                     <p>
//                       Status:{" "}
//                       {typeof account.status === "string"
//                         ? account.status
//                         : "unknown"}
//                     </p>
//                   </div>
//                 ))}

//               {/* Add New Workspace Card */}
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer">
//                 <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//                   <Plus className="h-6 w-6 text-indigo-600" />
//                 </div>
//                 <h3 className="font-medium text-gray-900 mb-1">
//                   Add New Workspace
//                 </h3>
//                 <p className="text-sm text-gray-500 text-center mb-4">
//                   Create a new workspace for a team or department
//                 </p>
//                 <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
//                   Create Workspace
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default DashboardPage;

// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Plus,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
// import { authApi, type Account } from "../api/accounts.api";
import StatsCard from "../componenets/dashboard/StatsCard";
import AccountCard from "../componenets/dashboard/AccountCard";
import { authApi, type Account } from "../api/auth.api";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"accounts" | "workspaces">("accounts");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL accounts from API
      const accountsResponse = await authApi.getAllAccounts();
      
      if (accountsResponse.data.success) {
        const accountsData = accountsResponse.data.data;
        
        // Ensure it's an array and filter out invalid accounts
        const validAccounts = Array.isArray(accountsData)
          ? accountsData.filter(
              (account) =>
                account &&
                typeof account === "object" &&
                typeof account.id === "string" &&
                typeof account.name === "string"
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

  // Phase 1 Stats - Only 3 cards with real data
  const getPhase1Stats = () => {
    const pendingAccounts = accounts.filter(a => a.status === 'pending').length;
    
    return [
      {
        label: 'Client Accounts',
        value: accounts.length.toString(),
        icon: Building,
        change: accounts.length > 0 ? `${accounts.length} active organizations` : 'No accounts yet',
        status: (accounts.length > 0 ? 'success' : 'default') as 'default' | 'warning' | 'success'
      },
      {
        label: 'Platform Status',
        value: '100%',
        icon: Activity,
        change: 'All systems operational',
        status: 'success' as 'default' | 'warning' | 'success'
      },
      {
        label: 'Pending Setup',
        value: pendingAccounts.toString(),
        icon: AlertCircle,
        change: pendingAccounts > 0 ? `${pendingAccounts} accounts awaiting activation` : 'All set up complete',
        status: (pendingAccounts > 0 ? 'warning' : 'success') as 'default' | 'warning' | 'success'
      }
    ];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            App Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Manage accounts, workspaces, and users across all organizations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            Refresh Accounts
          </button>
          <button
            onClick={() => navigate("/accounts/create")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Create Account
          </button>
        </div>
      </div>

      {/* PHASE 1 STATS - ONLY 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getPhase1Stats().map((stat) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            status={stat.status}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header with Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              System Management
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
                {accounts.length} {activeTab === "accounts" ? "Accounts" : "Workspaces"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("accounts")}
              className={`flex items-center gap-2 py-2 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === "accounts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building className="h-4 w-4" />
              Accounts
            </button>
            <button
              onClick={() => setActiveTab("workspaces")}
              className={`flex items-center gap-2 py-2 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === "workspaces"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building className="h-4 w-4" />
              Workspaces (Phase 2)
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "accounts" && (
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-6">
              Create and manage client organizations. Each account can have multiple workspaces.
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading accounts...</p>
              </div>
            ) : accounts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={{
                      id: account.id,
                      name: account.name,
                      slug: account.slug,
                      workspaces: account.workspaces || 0,
                      users: account.users || 0,
                      status: account.status as "active" | "inactive" | "pending",
                    }}
                  />
                ))}
                
                {/* Add New Account Card */}
                <div 
                  onClick={() => navigate("/accounts/create")}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer"
                >
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Add New Account
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Create a new client organization
                  </p>
                  <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                    Create Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first client organization.</p>
                <button 
                  onClick={() => navigate("/accounts/create")}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5" />
                  Create First Account
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "workspaces" && (
          <div className="p-6">
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workspace Management</h3>
              <p className="text-gray-600 mb-4">
                Workspace features are planned for <strong>Phase 2</strong>.
                <br />
                Currently focusing on Account Management for Phase 1.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block max-w-md">
                <p className="text-sm text-blue-800 font-medium">Phase 2 Preview</p>
                <p className="text-sm text-blue-700 mt-1">
                  Workspaces will allow you to create departments and teams within each account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
