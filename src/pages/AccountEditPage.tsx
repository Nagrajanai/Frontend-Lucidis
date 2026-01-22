// src/pages/AccountEditPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
// import { authApi, type Account } from "../api/auth.api";
import { accountsApi, type Account } from "../api/accounts.api";

const AccountEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Load account data
  useEffect(() => {
    const loadAccount = async () => {
      if (!accountId) {
        setError("No account ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await accountsApi.getAccountById(accountId);

        if (response.data.success) {
          const accountData = response.data.data;
          setAccount(accountData);
          setFormData({
            name: accountData.name || "",
            slug: accountData.slug || "",
          });
        } else {
          setError(response.data.message || "Failed to load account");
        }
      } catch (err: any) {
        console.error("Failed to load account:", err);
        setError(err.response?.data?.message || "Failed to load account data");
      } finally {
        setIsLoading(false);
      }
    };

    loadAccount();
  }, [accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Name and slug are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await accountsApi.updateAccount(accountId!, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
      });

      if (response.data.success) {
        navigate(`/accounts/${accountId}`);
      } else {
        setError(response.data.message || "Failed to update account");
      }
    } catch (err: any) {
      console.error("Failed to update account:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!accountId) {
      setError("Account ID is missing. Cannot delete account.");
      setShowDeleteModal(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log("Deleting account:", accountId);

      const response = await accountsApi.deleteAccount(accountId);

      console.log("Delete response:", response);

      // Handle different response formats (some APIs return 204 No Content)
      if (response.status === 204 || response.status === 200) {
        console.log("Account deleted successfully");
        // Close modal before navigation
        setShowDeleteModal(false);
        // Navigate back to accounts list
        navigate("/accounts", {
          state: {
            message: `Account "${account?.name}" has been successfully deleted.`,
            type: "success",
          },
        });
      } else if (response.data?.success) {
        console.log("Account deleted successfully (success response)");
        setShowDeleteModal(false);
        navigate("/accounts", {
          state: {
            message: `Account "${account?.name}" has been successfully deleted.`,
            type: "success",
          },
        });
      } else {
        // API returned success: false
        const errorMessage =
          response.data?.message || "Failed to delete account";
        console.error("Delete failed:", errorMessage);
        setError(errorMessage);
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      console.error("Failed to delete account:", err);

      let errorMessage = "Failed to delete account. Please try again.";

      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (err.response?.status === 403) {
        errorMessage = "You do not have permission to delete this account.";
      } else if (err.response?.status === 404) {
        errorMessage = "Account not found. It may have already been deleted.";
      } else if (err.response?.status === 409) {
        errorMessage =
          "Cannot delete account. It may have associated data that prevents deletion.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setShowDeleteModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slug || prev.slug,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading account details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Account
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/accounts")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Back to Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/accounts/${accountId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account Details
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Account</h1>
        <p className="text-gray-600">Update account information and settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Organization Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="e.g., City of Frisco"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    lucidis.app/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      }))
                    }
                    required
                    disabled={isSubmitting}
                    className="w-full pl-24 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed font-mono text-sm"
                    placeholder="city-of-frisco"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in URLs and cannot be changed later
                </p>
              </div>
            </div>
          </div>

          {/* Account Information Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Current Account Information
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Created:</dt>
                <dd className="font-medium">{account?.createdAt || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Last Updated:</dt>
                <dd className="font-medium">{account?.updatedAt || "N/A"}</dd>  
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Workspaces:</dt>
                <dd className="font-medium">{account?.users || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Users:</dt>
                <dd className="font-medium">{account?.users || 0}</dd>
              </div>
            </dl>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteConfirmation("");
              }}
              disabled={isSubmitting}
              className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Delete Account
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/accounts/${accountId}`)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting || !formData.name.trim() || !formData.slug.trim()
                }
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Updating..." : "Update Account"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-gray-200 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Account
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              <p className="text-sm text-gray-700">
                You are about to permanently delete{" "}
                <strong className="text-gray-900">{account?.name}</strong>. This
                will immediately remove all associated data.
              </p>

              {/* Impact */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="mb-3 text-sm font-medium text-red-900">
                  This includes:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-red-800">
                  <li>• {account?.users || 0} workspaces & teams</li>
                  <li>• {account?.users || 0} users & access</li>
                  <li>• Conversations & chat history</li>
                  <li>• Tasks, workflows & automations</li>
                  <li>• Forms, campaigns & settings</li>
                  <li>• Integrations & custom fields</li>
                </ul>
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type{" "}
                  <span className="font-semibold text-gray-900">
                    {account?.name}
                  </span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={account?.name}
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isSubmitting || deleteConfirmation !== account?.name}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Deleting…" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">
          Security & Compliance
        </h3>
        <p className="text-sm text-blue-700">
          Account modifications are logged for audit purposes. All data remains
          encrypted and secure. Government accounts maintain SOC 2 compliance
          standards.
        </p>
      </div>
    </div>
  );
};

export default AccountEditPage;
