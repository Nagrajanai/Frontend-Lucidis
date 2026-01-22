// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Activity, AlertCircle, RefreshCw } from "lucide-react";
import StatsCard from "../componenets/dashboard/StatsCard";
import AccountCard from "../componenets/dashboard/AccountCard";
// import { authApi, type Account } from "../api/auth.api";
import { accountsApi, type Account } from "../api/accounts.api";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"accounts" | "workspaces">(
    "accounts",
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch REAL accounts from API
      const accountsResponse = await accountsApi.getAllAccounts();

      if (accountsResponse.data.success) {
        const accountsData = accountsResponse.data.data;

        // Ensure it's an array and filter out invalid accounts
        const validAccounts = Array.isArray(accountsData)
          ? accountsData.filter(
              (account) =>
                account &&
                typeof account === "object" &&
                typeof account.id === "string" &&
                typeof account.name === "string",
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
    const pendingAccounts = accounts.filter(
      (a) => a.status === "pending",
    ).length;

    return [
      {
        label: "Client Accounts",
        value: accounts.length.toString(),
        icon: Building,
        change:
          accounts.length > 0
            ? `${accounts.length} active organizations`
            : "No accounts yet",
        status: (accounts.length > 0 ? "success" : "default") as
          | "default"
          | "warning"
          | "success",
      },
      {
        label: "Platform Status",
        value: "100%",
        icon: Activity,
        change: "All systems operational",
        status: "success" as "default" | "warning" | "success",
      },
      {
        label: "Pending Setup",
        value: pendingAccounts.toString(),
        icon: AlertCircle,
        change:
          pendingAccounts > 0
            ? `${pendingAccounts} accounts awaiting activation`
            : "All set up complete",
        status: (pendingAccounts > 0 ? "warning" : "success") as
          | "default"
          | "warning"
          | "success",
      },
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
                {accounts.length}{" "}
                {activeTab === "accounts" ? "Accounts" : "Workspaces"}
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
              Create and manage client organizations. Each account can have
              multiple workspaces.
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
                      workspaces: Array.isArray(account.workspaces)
                        ? account.workspaces
                        : [],
                     
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No accounts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first client organization.
                </p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Workspace Management
              </h3>
              <p className="text-gray-600 mb-4">
                Workspace features are planned for <strong>Phase 2</strong>.
                <br />
                Currently focusing on Account Management for Phase 1.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block max-w-md">
                <p className="text-sm text-blue-800 font-medium">
                  Phase 2 Preview
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Workspaces will allow you to create departments and teams
                  within each account.
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
