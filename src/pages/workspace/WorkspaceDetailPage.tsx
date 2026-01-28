// src/pages/WorkspaceDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  Users,
  Building,
  Edit,
  Loader2,
  AlertCircle,
  UserPlus,
  Mail,
  Calendar,
  Hash,
  Plus,
} from "lucide-react";
import { workspaceApi, type WorkspaceDetail } from "../../api/workspace.api";
import { departmentApi } from "../../api/department.api";
import { teamApi, type Team } from "../../api/team.api";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import DepartmentForm from "../../componenets/management/DepartmentForm";
import TeamForm from "../../componenets/management/TeamForm";
import { GlobalROLES } from "../../types";

const WorkspaceDetailPage: React.FC = () => {
  const { workspaceId, accountId } = useParams<{
    workspaceId: string;
    accountId?: string;
  }>();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "departments"
  >("overview");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [activeDepartmentForTeams, setActiveDepartmentForTeams] = useState<string | null>(null);
  const [teamsByDepartment, setTeamsByDepartment] = useState<Record<string, Team[]>>({});
  const [isSavingDepartment, setIsSavingDepartment] = useState(false);
  const [isSavingTeam, setIsSavingTeam] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newUserData, setNewUserData] = useState({ email: "", role: "MEMBER" });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!workspaceId) {
        setError("Workspace ID is required");
        setLoading(false);
        return;
      }

      if (!accountId) {
        setError("Account ID is required to view workspace details");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await workspaceApi.getWorkspaceById(
          workspaceId,
          accountId,
        );

        // Handle response - check various response formats
        let workspaceData = null;
        if (response.data?.data) {
          workspaceData = response.data.data;
        } else if (response.data?.workspace) {
          workspaceData = response.data.workspace;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          response.data.id
        ) {
          workspaceData = response.data;
        }

        if (workspaceData) {
          setWorkspace(workspaceData);
        } else {
          setError("Failed to fetch workspace - invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching workspace:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch workspace",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, accountId]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !accountId || !newUserData.email.trim()) return;

    try {
      const response = await workspaceApi.addUserToWorkspace(
        workspaceId!,
        accountId!,
        { email: newUserData.email.trim(), role: newUserData.role },
      );

      // Handle response - check various formats
      let success = false;
      if (response.data?.success !== false) {
        success = true;
      }

      if (success) {
        // Refresh workspace data
        const workspaceResponse = await workspaceApi.getWorkspaceById(
          workspaceId!,
          accountId!,
        );

        let workspaceData = null;
        if (workspaceResponse.data?.data) {
          workspaceData = workspaceResponse.data.data;
        } else if (workspaceResponse.data?.workspace) {
          workspaceData = workspaceResponse.data.workspace;
        } else if (
          workspaceResponse.data &&
          typeof workspaceResponse.data === "object" &&
          workspaceResponse.data.id
        ) {
          workspaceData = workspaceResponse.data;
        }

        if (workspaceData) {
          setWorkspace(workspaceData);
        }

        setShowAddUser(false);
        setNewUserData({ email: "", role: GlobalROLES.MEMBER });
        alert("User added successfully!");
      } else {
        alert(response.data?.message || "Failed to add user");
      }
    } catch (err: any) {
      console.error("Error adding user:", err);
      alert(err.response?.data?.message || err.message || "Failed to add user");
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || !accountId || !workspace) return;

    setIsDeleting(true);
    try {
      const response = await workspaceApi.deleteWorkspace(
        workspaceId!,
        accountId!,
      );

      // Handle response - check various formats
      let success = false;
      if (response.data?.success !== false) {
        success = true;
      }

      if (success) {
        navigate(accountId ? `/accounts/${accountId}` : "/workspaces");
      } else {
        alert(response.data?.message || "Failed to delete workspace");
      }
    } catch (err: any) {
      console.error("Error deleting workspace:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete workspace",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCreateDepartment = async (values: {
    name: string;
    slug: string;
    description?: string;
  }) => {
    if (!workspaceId || !accountId) return;
    try {
      setIsSavingDepartment(true);
      await departmentApi.createDepartment(workspaceId, accountId, values);

      const workspaceResponse = await workspaceApi.getWorkspaceById(
        workspaceId,
        accountId,
      );

      let workspaceData = null;
      if (workspaceResponse.data?.data) {
        workspaceData = workspaceResponse.data.data;
      } else if (workspaceResponse.data?.workspace) {
        workspaceData = workspaceResponse.data.workspace;
      } else if (
        workspaceResponse.data &&
        typeof workspaceResponse.data === "object" &&
        workspaceResponse.data.id
      ) {
        workspaceData = workspaceResponse.data;
      }

      if (workspaceData) {
        setWorkspace(workspaceData);
      }

      setShowAddDepartment(false);
      alert("Department created successfully!");
    } catch (err: any) {
      console.error("Error creating department:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to create department",
      );
    } finally {
      setIsSavingDepartment(false);
    }
  };

  const loadTeamsForDepartment = async (departmentId: string) => {
    if (!workspaceId || !accountId) return;
    try {
      const response = await teamApi.getTeamsByDepartment(
        departmentId,
        workspaceId,
        accountId,
      );
      let teams: Team[] = [];
      if (Array.isArray(response.data)) {
        teams = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        teams = response.data.data;
      } else if (response.data?.teams && Array.isArray(response.data.teams)) {
        teams = response.data.teams;
      }
      setTeamsByDepartment((prev) => ({ ...prev, [departmentId]: teams }));
    } catch (err) {
      console.error("Error loading teams for department:", err);
    }
  };

  const handleCreateTeam = async (
    departmentId: string,
    values: { name: string; slug: string; description?: string },
  ) => {
    if (!workspaceId || !accountId) return;
    try {
      setIsSavingTeam(true);
      await teamApi.createTeam(departmentId, workspaceId, accountId, values);
      await loadTeamsForDepartment(departmentId);
      alert("Team created successfully!");
    } catch (err: any) {
      console.error("Error creating team:", err);
      alert(
        err.response?.data?.message || err.message || "Failed to create team",
      );
    } finally {
      setIsSavingTeam(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800">
              Error loading workspace
            </h3>
          </div>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/accounts")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Browse Accounts
          </button>
        </div>
      </div>
    );
  }

  if (!accountId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-800">
              Account Context Required
            </h3>
          </div>
          <p className="text-yellow-700 mb-4">
            To view workspace details, you need to access it through its
            associated account. Workspaces are organized under specific accounts
            for proper access control.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/accounts")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Browse Accounts
            </button>
            <button
              onClick={() => navigate("/workspaces")}
              className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
            >
              View All Workspaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-800">
              Loading workspace...
            </h3>
          </div>
          <p className="text-gray-700">
            Please wait while we fetch the workspace details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() =>
            navigate(accountId ? `/accounts/${accountId}` : "/workspaces")
          }
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {accountId ? "Account" : "Workspaces"}
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Folder className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {workspace.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">
                  Workspace ID: {workspace.slug || workspace.id}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(
                  `/accounts/${accountId}/workspaces/${workspaceId}/edit`,
                )
              }
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit Workspace
            </button>
            {/* <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {["overview", "users", "departments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "users" && workspace.workspaceUsers && (
                  <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {workspace.workspaceUsers.length}
                  </span>
                )}
                {tab === "departments" && workspace.departments && (
                  <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {workspace.departments.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        {activeTab === "overview" && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Workspace Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <p className="text-gray-900 font-medium">{workspace.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {workspace.slug || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs">
                    {workspace.accountId}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Users
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {workspace.workspaceUsers?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">Team members</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departments
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {workspace.departments?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Organizational units
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {new Date(workspace.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
                {workspace.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">
                        {new Date(workspace.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {workspace.channels && workspace.channels.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {workspace.channels.map((channel, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full capitalize"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({workspace.workspaceUsers?.length || 0})
              </h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Add User to Workspace
                </h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={newUserData.email}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            email: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={newUserData.role}
                      onChange={(e) =>
                        setNewUserData({ ...newUserData, role: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            {workspace.workspaceUsers && workspace.workspaceUsers.length > 0 ? (
              <div className="space-y-4">
                {workspace.workspaceUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user.name || user.email.split("@")[0]}
                        </h4>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800 capitalize">
                            {user.role}
                          </span>
                          {user.status && (
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add users to collaborate in this workspace.
                </p>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add First User
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "departments" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Departments ({workspace.departments?.length || 0})
              </h2>
              <button
                onClick={() => setShowAddDepartment(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Department
              </button>
            </div>

            {showAddDepartment && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Create Department
                </h3>
                <DepartmentForm
                  loading={isSavingDepartment}
                  onSubmit={handleCreateDepartment}
                  onCancel={() => setShowAddDepartment(false)}
                />
              </div>
            )}

            {workspace.departments && workspace.departments.length > 0 ? (
              <div className="space-y-4">
                {workspace.departments!.map((dept) => {
                  const teams = teamsByDepartment[dept.id] || [];
                  const isExpanded = activeDepartmentForTeams === dept.id;
                  return (
                    <div
                      key={dept.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Hash className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {dept.name}
                            </h4>
                            {dept.description && (
                              <p className="text-sm text-gray-600">
                                {dept.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                          onClick={async () => {
                            const next =
                              activeDepartmentForTeams === dept.id ? null : dept.id;
                            setActiveDepartmentForTeams(next);
                            if (next) {
                              await loadTeamsForDepartment(dept.id);
                            }
                          }}
                        >
                          {isExpanded ? "Hide Teams" : "Manage Teams"}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 border-t border-gray-200 pt-3 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-900">
                              Teams ({teams.length})
                            </h5>
                          </div>

                          {teams.length > 0 ? (
                            <div className="space-y-2">
                              {teams.map((team) => (
                                <div
                                  key={team.id}
                                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                      {team.name}
                                    </span>
                                    {team.description && (
                                      <span className="text-xs text-gray-500">
                                        {team.description}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No teams yet in this department.
                            </p>
                          )}

                          <div className="mt-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
                            <h6 className="text-sm font-medium text-gray-900 mb-2">
                              Add Team
                            </h6>
                            <TeamForm
                              loading={isSavingTeam}
                              onSubmit={(values) =>
                                handleCreateTeam(dept.id, values)
                              }
                              onCancel={() => setActiveDepartmentForTeams(null)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No departments yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Departments help organize work within this workspace.
                </p>
                <button
                  onClick={() => setShowAddDepartment(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create First Department
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteWorkspaceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteWorkspace}
        workspaceName={workspace?.name || ""}
        isDeleting={isDeleting}
      />

      {/* API Info */}
      {/* <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 mb-1">API Endpoint Used</h3>
        <p className="text-sm text-gray-700 font-mono">
          GET {BASE_URL}/workspaces/{workspaceId}?accountId={accountId}
        </p>
      </div> */}
    </div>
  );
};

export default WorkspaceDetailPage;
