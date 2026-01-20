// src/pages/CreateWorkspacePage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Folder,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle,
} from 'lucide-react';

const CreateWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId?: string }>();
  const [formData, setFormData] = useState({
    name: '',
    type: 'department',
    description: '',
    accountId: accountId || '',
    channels: {
      email: true,
      sms: false,
      voice: false,
      whatsapp: false,
    },
    settings: {
      autoAssign: true,
      aiEnabled: true,
      notifications: true,
      requireApproval: false,
    },
    ownerEmail: '',
  });

  const workspaceTypes = [
    { value: 'department', label: 'Department', description: 'Functional department (e.g., Public Works)' },
    { value: 'team', label: 'Team', description: 'Cross-functional team or working group' },
    { value: 'project', label: 'Project', description: 'Temporary project workspace' },
    { value: 'regional', label: 'Regional', description: 'Geographic region or location' },
  ];

  const accounts = [
    { id: '1', name: 'City of Frisco', type: 'government' },
    { id: '2', name: 'Austin ISD', type: 'education' },
    { id: '3', name: 'State of Texas', type: 'government' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      if (name.startsWith('channels.')) {
        const channelName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          channels: {
            ...prev.channels,
            [channelName]: target.checked
          }
        }));
      } else if (name.startsWith('settings.')) {
        const settingName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            [settingName]: target.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating workspace:', formData);
    // API integration will go here
    if (accountId) {
      navigate(`/accounts/${accountId}/workspaces`);
    } else {
      navigate('/workspaces');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => accountId ? navigate(`/accounts/${accountId}/workspaces`) : navigate('/workspaces')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Workspace</h1>
        <p className="text-gray-600">
          Set up a new workspace {accountId ? 'for this account' : 'for an organization'}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Public Works Department"
                  />
                </div>
              </div>

              {!accountId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account *
                  </label>
                  <select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select an account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workspaceTypes.map((type) => (
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
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the purpose of this workspace..."
                />
              </div>
            </div>
          </div>

          {/* Communication Channels */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.channels).map(([channel, enabled]) => (
                <label
                  key={channel}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {channel === 'email' && <Mail className="h-5 w-5 text-gray-500" />}
                    {channel === 'sms' && <MessageSquare className="h-5 w-5 text-green-500" />}
                    {channel === 'voice' && <Phone className="h-5 w-5 text-blue-500" />}
                    {channel === 'whatsapp' && <MessageSquare className="h-5 w-5 text-green-600" />}
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {channel === 'whatsapp' ? 'WhatsApp' : channel}
                      </div>
                      <div className="text-sm text-gray-500">
                        {channel === 'email' && 'Email communication with citizens'}
                        {channel === 'sms' && 'Text message conversations'}
                        {channel === 'voice' && 'Voice calls and voicemail'}
                        {channel === 'whatsapp' && 'WhatsApp Business integration'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name={`channels.${channel}`}
                    checked={enabled}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Workspace Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.settings).map(([setting, enabled]) => (
                <label
                  key={setting}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {setting === 'autoAssign' && 'Automatically assign incoming conversations'}
                      {setting === 'aiEnabled' && 'Enable AI agent for this workspace'}
                      {setting === 'notifications' && 'Send notifications for new messages'}
                      {setting === 'requireApproval' && 'Require approval for external communications'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name={`settings.${setting}`}
                    checked={enabled}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Workspace Owner */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Owner</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="owner@organization.gov"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This user will be set as the workspace administrator
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
              <div className="flex justify-between">
                <dt className="text-gray-600">Type:</dt>
                <dd className="font-medium capitalize">{formData.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Account:</dt>
                <dd className="font-medium">
                  {accountId 
                    ? 'Current Account' 
                    : accounts.find(a => a.id === formData.accountId)?.name || 'Not selected'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Channels:</dt>
                <dd className="font-medium">
                  {Object.entries(formData.channels)
                    .filter(([, enabled]) => enabled)
                    .map(([channel]) => channel === 'whatsapp' ? 'WhatsApp' : channel)
                    .join(', ') || 'None selected'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => accountId ? navigate(`/accounts/${accountId}/workspaces`) : navigate('/workspaces')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>

      {/* Security Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">Workspace Security</h3>
        <p className="text-sm text-blue-700">
          Each workspace is isolated with its own data, users, and settings. 
          Workspace administrators can only manage resources within their assigned workspace. 
          All communications are encrypted and logged for compliance.
        </p>
      </div>
    </div>
  );
};

export default CreateWorkspacePage;