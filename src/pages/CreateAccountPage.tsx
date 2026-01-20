// src/pages/CreateAccountPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
} from 'lucide-react';

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'government',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    adminEmail: '',
    adminName: '',
    subscriptionPlan: 'basic',
    sendInvite: true,
  });

  const accountTypes = [
    { value: 'government', label: 'Government Agency', icon: '🏛️' },
    { value: 'education', label: 'Educational Institution', icon: '🎓' },
    { value: 'other', label: 'Other Public Sector', icon: '🏢' },
  ];

  const subscriptionPlans = [
    { value: 'free', label: 'Free Trial', price: '$0/mo' },
    { value: 'basic', label: 'Basic', price: '$299/mo' },
    { value: 'professional', label: 'Professional', price: '$699/mo', recommended: true },
    { value: 'enterprise', label: 'Enterprise', price: 'Custom' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating account:', formData);
    // API integration will go here
    navigate('/accounts');
  };

  return (
    <div className="p-6 max-w-4lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/accounts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Accounts
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Account</h1>
        <p className="text-gray-600">Set up a new client organization on the Lucidis platform</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h2>
            
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
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., City of Frisco"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {accountTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        formData.type === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                      </div>
                      {formData.type === type.value && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="admin@organization.gov"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="organization.gov"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan) => (
                <label
                  key={plan.value}
                  className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${
                    formData.subscriptionPlan === plan.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="subscriptionPlan"
                    value={plan.value}
                    checked={formData.subscriptionPlan === plan.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-gray-900">{plan.label}</div>
                        <div className="text-lg font-bold text-gray-900">{plan.price}</div>
                      </div>
                      {plan.recommended && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Administrator */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Administrator</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john@organization.gov"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="sendInvite"
                  checked={formData.sendInvite}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Send invitation email
                  </label>
                  <p className="text-sm text-gray-500">
                    The administrator will receive setup instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Organization:</dt>
                <dd className="font-medium">{formData.name || 'Not set'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Type:</dt>
                <dd className="font-medium capitalize">{formData.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Plan:</dt>
                <dd className="font-medium capitalize">{formData.subscriptionPlan}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Admin:</dt>
                <dd className="font-medium">{formData.adminName || 'Not set'}</dd>
              </div>
            </dl>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/accounts')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      {/* Security Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">Security & Compliance</h3>
        <p className="text-sm text-blue-700">
          Government and education accounts are automatically set up with SOC 2 compliance features. 
          All data is encrypted at rest and in transit. The administrator will need to complete 
          identity verification before accessing sensitive citizen data.
        </p>
      </div>
    </div>
  );
};

export default CreateAccountPage;