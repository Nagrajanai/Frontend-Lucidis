
// src/pages/CreateWorkspacePage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Folder,
  Loader2
} from 'lucide-react';
import { workspaceApi, type CreateWorkspaceData } from '../../api/workspace.api';

const CreateWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    accountId: accountId || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Auto-generate slug from name (optional enhancement)
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug || prev.slug
      }));
    } else if (name === 'slug') {
      // Clean slug input (only allow lowercase letters, numbers, and hyphens)
      const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({
        ...prev,
        slug: cleanSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    setError('Workspace name is required');
    return;
  }
    if (!formData.slug.trim()) { // slug is now required
    setError('Workspace slug is required');
    return;
  }

  if (!accountId) {
    setError('Account ID is required');
    return;
  }

  try {
    setIsSubmitting(true);
    setError(null);

    // Prepare data matching backend's expected format (matches Postman collection)
    const workspaceData: CreateWorkspaceData = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || undefined,
      accountId: accountId, // Required as per Postman collection
    };

    console.log('Creating workspace for account:', accountId);
    console.log('Workspace data:', workspaceData);

    // Use updated API structure
    const response = await workspaceApi.createWorkspace(accountId, workspaceData);

    // Handle response - check various response formats
    let createdWorkspace = null;
    if (response.data?.data) {
      createdWorkspace = response.data.data;
    } else if (response.data?.workspace) {
      createdWorkspace = response.data.workspace;
    } else if (response.data && typeof response.data === 'object' && response.data.id) {
      createdWorkspace = response.data;
    }

    if (createdWorkspace) {
      console.log('Workspace created successfully:', createdWorkspace);

      navigate(`/accounts/${accountId}`, {
        state: {
          message: `Workspace "${createdWorkspace.name || workspaceData.name}" created successfully.`,
          type: 'success'
        }
      });
    } else {
      setError('Failed to create workspace - invalid response format');
    }
  } catch (err: any) {
    console.error('Failed to create workspace:', err);
    setError(
      err.response?.data?.message ||
      err.message ||
      'Failed to create workspace. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/accounts/${accountId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Workspace</h1>
        <p className="text-gray-600">
          Create a new workspace within this account
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information - Only required field per PRD */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h2>
            
            <div className="space-y-4">
              {/* REQUIRED: Name field (the only PRD requirement) */}
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
                    maxLength={100}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This is the only required field to create a workspace
                </p>
              </div>

              {/* OPTIONAL: Slug field (not in PRD but backend accepts) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug (Optional)
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
                    className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed font-mono text-sm"
                    placeholder="public-works-dept"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from name. Used in URLs. Only lowercase letters, numbers, and hyphens.
                </p>
              </div>


            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">Workspace Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Name:</dt>
                <dd className="font-medium">{formData.name || 'Not set'}</dd>
              </div>
              {formData.slug && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Slug:</dt>
                  <dd className="font-medium font-mono text-sm">{formData.slug}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Account ID:</dt>
                <dd className="font-medium font-mono text-xs">{accountId}</dd>
              </div>
            </dl>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* PRD Compliance Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-1">PRD Phase 1 Compliance</h3>
        <p className="text-sm text-blue-700">
          According to the PRD Phase 1 requirements, only the <strong>Workspace Name</strong> field is required. 
          Additional fields (slug, type, description) are optional enhancements that your backend supports.
        </p>
        <div className="mt-2 text-xs text-blue-600">
          <strong>Reference:</strong> PRD Section 2.2 - POST /api/v1/accounts/{"{accountId}"}/workspaces
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspacePage;
