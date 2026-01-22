// src/pages/CreateTaskPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Tag,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Folder,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Flag,
  Hash
} from 'lucide-react';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    type: 'general',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    conversationId: '',
    workspaceId: '',
    tags: [] as string[],
    attachments: [] as File[],
  });

  const [tagInput, setTagInput] = useState('');

  const taskTypes = [
    { value: 'general', label: 'General Task', color: 'bg-gray-100 text-gray-800' },
    { value: 'complaint', label: 'Complaint', color: 'bg-red-100 text-red-800' },
    { value: 'request', label: 'Service Request', color: 'bg-blue-100 text-blue-800' },
    { value: 'follow_up', label: 'Follow-up', color: 'bg-green-100 text-green-800' },
    { value: 'escalated', label: 'Escalated', color: 'bg-orange-100 text-orange-800' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', icon: Flag, color: 'text-gray-500' },
    { value: 'medium', label: 'Medium', icon: Flag, color: 'text-blue-500' },
    { value: 'high', label: 'High', icon: Flag, color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-500' },
  ];

  const workspaces = [
    { id: '1', name: 'Public Works Department' },
    { id: '2', name: 'Traffic Management' },
    { id: '3', name: 'Code Enforcement' },
    { id: '4', name: 'Planning Department' },
  ];

  const teamMembers = [
    { id: '1', name: 'John Smith', role: 'Agent', avatarColor: 'bg-blue-500' },
    { id: '2', name: 'Sarah Johnson', role: 'Manager', avatarColor: 'bg-purple-500' },
    { id: '3', name: 'Robert Chen', role: 'Agent', avatarColor: 'bg-green-500' },
    { id: '4', name: 'Maria Garcia', role: 'Specialist', avatarColor: 'bg-pink-500' },
  ];

  const conversations = [
    { id: 'conv_001', title: 'Pothole complaint on Main St', contact: 'John Doe' },
    { id: 'conv_002', title: 'Noise complaint after hours', contact: 'Jane Smith' },
    { id: 'conv_003', title: 'Building permit inquiry', contact: 'Bob Wilson' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task:', formData);
    // API integration will go here
    navigate('/tasks');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600">Create a new task to track work items and citizen requests</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Follow up on pothole complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the task in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {taskTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment & Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment & Timeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assign To
                    </div>
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Link to Conversation
                    </div>
                  </label>
                  <select
                    name="conversationId"
                    value={formData.conversationId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">No conversation link</option>
                    {conversations.map(conv => (
                      <option key={conv.id} value={conv.id}>
                        {conv.title} - {conv.contact}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </div>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Estimated Hours
                    </div>
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workspace & Tags */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Workspace
                  </div>
                </label>
                <select
                  name="workspaceId"
                  value={formData.workspaceId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select workspace</option>
                  {workspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </div>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      <Hash className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Browse Files
              </label>
              {formData.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.attachments.length} file{formData.attachments.length > 1 ? 's' : ''} attached:
                  </p>
                  <ul className="space-y-1">
                    {formData.attachments.map((file, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">Task Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Title:</dt>
                <dd className="font-medium">{formData.title || 'Not set'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Type:</dt>
                <dd className="font-medium capitalize">{formData.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Priority:</dt>
                <dd className="font-medium capitalize">{formData.priority}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Assigned to:</dt>
                <dd className="font-medium">
                  {formData.assignedTo 
                    ? teamMembers.find(m => m.id === formData.assignedTo)?.name || 'Unassigned'
                    : 'Unassigned'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Due date:</dt>
                <dd className="font-medium">{formData.dueDate || 'Not set'}</dd>
              </div>
            </dl>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>

      {/* Task Management Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">Task Management Best Practices</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Use clear, descriptive titles that summarize the task
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Set realistic due dates and time estimates
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Link tasks to conversations for better context
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Use tags to categorize and filter tasks effectively
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateTaskPage;