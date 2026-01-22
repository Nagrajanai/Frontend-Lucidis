// src/pages/WorkspaceEditPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { workspaceApi, type WorkspaceDetail } from "../../api/workspace.api";

const WorkspaceEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, workspaceId } = useParams<{ accountId: string; workspaceId: string }>();
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");


  // Load workspace data
  useEffect(() => {
    const loadWorkspace = async () => {
      if (!workspaceId || !accountId) {
        setError("No workspace or account ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await workspaceApi.getWorkspaceById(workspaceId, accountId);

        // Handle response - check various formats
        let workspaceData = null;
        if (response.data?.data) {
          workspaceData = response.data.data;
        } else if (response.data?.workspace) {
          workspaceData = response.data.workspace;
        } else if (response.data && typeof response.data === 'object' && response.data.id) {
          workspaceData = response.data;
        }

        if (workspaceData) {
          setWorkspace(workspaceData);
          setFormData({
            name: workspaceData.name || "",
            slug: workspaceData.slug || "",
          });
        } else {
          setError("Failed to load workspace data");
        }
      } catch (err: any) {
        console.error("Error loading workspace:", err);
        setError(err.response?.data?.message || err.message || "Failed to load workspace");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspace();
  }, [workspaceId, accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !accountId) return;

    if (!formData.name.trim()) {
      alert("Workspace name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await workspaceApi.updateWorkspace(workspaceId, accountId, {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
      });

      // Handle response - check various formats
      let success = false;
      if (response.data?.success !== false) {
        success = true;
      }

      if (success) {
        navigate(`/accounts/${accountId}/workspaces/${workspaceId}`, {
          state: { message: "Workspace updated successfully", type: "success" },
        });
      } else {
        setError(response.data?.message || "Failed to update workspace");
      }
    } catch (err: any) {
      console.error("Error updating workspace:", err);
      setError(err.response?.data?.message || err.message || "Failed to update workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || !accountId || !workspace) return;

    if (deleteConfirmation !== workspace.name) {
      alert("Please type the workspace name exactly to confirm deletion");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await workspaceApi.deleteWorkspace(workspaceId, accountId);

      // Handle response - check various formats
      let success = false;
      if (response.data?.success !== false) {
        success = true;
      }

      if (success) {
        navigate(`/accounts/${accountId}`, {
          state: { message: "Workspace deleted successfully", type: "success" },
        });
      } else {
        alert(response.data?.message || "Failed to delete workspace");
      }
    } catch (err: any) {
      console.error("Error deleting workspace:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete workspace");
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Auto-generate slug from name
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug || prev.slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error && !workspace) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800">Error loading workspace</h3>
          </div>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate(`/accounts/${accountId}/workspaces/${workspaceId}`)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  if (!workspace) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/accounts/${accountId}/workspaces/${workspaceId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Folder className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Workspace</h1>
              <p className="text-gray-600">Update workspace information and settings</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name *
                  </label>
                  <div className="relative">
                    <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="e.g., Public Works Department"
                    />
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      workspace/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="public-works-dept"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from name. Used in URLs.
                  </p>
                </div>
              </div>


            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/accounts/${accountId}/workspaces/${workspaceId}`)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Workspace"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Workspace</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">This action cannot be undone</h4>
                    <p className="text-sm text-red-700 mb-3">
                      This will permanently delete the workspace <strong>"{workspace.name}"</strong> and remove all associated data including users, conversations, and settings.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Type <strong>{workspace.name}</strong> to confirm:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Enter workspace name"
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={isSubmitting || deleteConfirmation !== workspace.name}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Deleting..." : "Delete Workspace"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceEditPage;