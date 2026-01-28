// src/pages/auth/UserRegister.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Mail, User } from 'lucide-react';
import { authApi } from '../../api/auth.api';

interface InvitationInfo {
  email: string;
  accountName?: string;
  role?: string;
}

const UserRegister: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token') || '';

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState<boolean>(!!token);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteError('Invalid or missing invitation token.');
      setLoadingInvitation(false);
      return;
    }

    const loadInvitation = async () => {
      try {
        setLoadingInvitation(true);
        setInviteError(null);

        const res = await authApi.acceptInvitation(token);
        // Be defensive about backend response shape
        const raw = (res as any)?.data ?? res;
        const data = raw?.data ?? raw;

        const email: string = String(data?.email || '');
        const accountName: string | undefined = data?.accountName || data?.account?.name;
        const role: string | undefined = data?.role || data?.userRole;

        if (!email) {
          throw new Error('Invitation does not contain an email address.');
        }

        setInvitation({ email, accountName, role });
        setFormData((prev) => ({ ...prev, email }));
      } catch (error: any) {
        console.error('Failed to accept invitation:', error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'This invitation link is invalid or has expired.';
        setInviteError(message);
      } finally {
        setLoadingInvitation(false);
      }
    };

    loadInvitation();
  }, [token]);

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!invitation || !invitation.email) {
      setSubmitError('Invitation is not valid. Please request a new invite.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      // Use the standard user registration endpoint, with invited email
      await authApi.registerUser({
        email: invitation.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });

      // After successful registration, redirect to login
      navigate('/login', {
        state: {
          message: 'Your account has been created. You can now log in.',
          type: 'success',
        },
      });
    } catch (error: any) {
      console.error('User registration failed:', error);
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Account</h1>
          <p className="text-gray-600">
            {invitation?.accountName
              ? `You were invited to join ${invitation.accountName}.`
              : 'You were invited to join an account.'}
          </p>
        </div>

        {/* Invitation load state / error */}
        {loadingInvitation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex">
            <AlertTriangle className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800">Validating your invitation link...</p>
          </div>
        )}

        {inviteError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-sm text-red-800">{inviteError}</p>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-lg shadow border p-6">
          {!inviteError && (
            <>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email (locked) */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 py-2 border rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>

                {/* First name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">First name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>

                {/* Last name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Last name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="relative">
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="+1234525550"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loadingInvitation || !!inviteError}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

