// src/components/UserInvitationModal.tsx
import React, { useState } from 'react';
import {
  X,
  Mail,
  Loader2,
  Shield,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { invitationApi } from '../../api/invitation.api';
import { ROLES, type InviteUserRequest } from '../../types';

interface UserInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  onInvitationSent?: (data: {
    email: string;
    role: string;
    message: string;
  }) => void;
}

const UserInvitationModal: React.FC<UserInvitationModalProps> = ({
  isOpen,
  onClose,
  accountId,
  onInvitationSent
}) => {
  // Form state
  const [inviteData, setInviteData] = useState<InviteUserRequest>({
    email: '',
    role: ROLES.MEMBER
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    email: string;
    role: string;
  } | null>(null);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId) {
      setError('Account ID is missing');
      return;
    }
    
    // Validate email
    if (!inviteData.email || !inviteData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Send invitation
      const response = await invitationApi.inviteUserToAccount(accountId, inviteData);
      
      // Extract data from response
      const { email, role } = response.data;
      
      const successData = {
        message: 'Invitation sent successfully!',
        email,
        role
      };
      
      setSuccess(successData);
      
      // Notify parent component
      if (onInvitationSent) {
        onInvitationSent(successData);
      }
      
      // Reset form
      setInviteData({
        email: '',
        role: ROLES.MEMBER
      });
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to send invitation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset and close modal
  const handleClose = () => {
    setInviteData({ email: '', role: ROLES.MEMBER });
    setError(null);
    setSuccess(null);
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Role options
  const roleOptions = [
    { value: ROLES.ADMIN },
    { value: ROLES.MEMBER }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invite User</h3>
                <p className="text-sm text-gray-600">Send invitation to join this account</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              disabled={loading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-2">{success.message}</p>
                    <div className="text-sm text-green-700 space-y-1">
                      <div className="flex gap-2">
                        <span className="font-medium">Email:</span>
                        <span>{success.email}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium">Role:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          success.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {success.role === 'ADMIN' ? '👑 Admin' : '👤 Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Auto-close notice */}
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-green-600 text-center">
                    This modal will close automatically in a few seconds...
                  </p>
                </div>
              </div>
            )}

            {/* Form Fields (only show when no success) */}
            {!success && (
              <>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={inviteData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    User will receive an email invitation to join
                  </p>
                </div>

                {/* Role Field */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={inviteData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:bg-gray-100"
                    disabled={loading}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value === ROLES.ADMIN ? '👑 Admin' : '👤 Member'}
                      </option>
                    ))}
                  </select>
                  
                  {/* Role Description */}
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {inviteData.role === ROLES.ADMIN ? (
                        <Shield className="h-4 w-4 text-purple-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {inviteData.role === ROLES.ADMIN ? 'Admin Permissions:' : 'Member Permissions:'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {inviteData.role === ROLES.ADMIN 
                        ? 'Full account access including workspace creation, user management, and settings'
                        : 'Access to assigned workspaces, can respond to conversations and create tasks'
                      }
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !inviteData.email}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Show close button when success is shown */}
            {success && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close Now
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInvitationModal;