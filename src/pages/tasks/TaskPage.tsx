// src/pages/TasksPage.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Edit,
  Trash2,
  ChevronRight,
  Folder,
  MessageSquare,
  CheckSquare,
  Square
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'general' | 'complaint' | 'request' | 'follow_up' | 'escalated';
  assignedTo?: {
    id: string;
    name: string;
    avatarColor: string;
  };
  createdBy: {
    id: string;
    name: string;
    avatarColor: string;
  };
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  conversationId?: string;
  workspace?: {
    id: string;
    name: string;
  };
  tags: string[];
  estimatedHours?: number;
  timeSpent?: number;
  attachments?: number;
  comments?: number;
}

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'my' | 'overdue' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Follow up on pothole complaint #12345',
      description: 'Citizen reported a pothole on Main Street. Need to check repair status.',
      status: 'in_progress',
      priority: 'high',
      type: 'complaint',
      assignedTo: {
        id: '2',
        name: 'John Smith',
        avatarColor: 'bg-blue-500'
      },
      createdBy: {
        id: '1',
        name: 'System',
        avatarColor: 'bg-gray-500'
      },
      dueDate: '2024-03-15',
      createdAt: '2024-03-10',
      updatedAt: '2 hours ago',
      conversationId: 'conv_001',
      workspace: {
        id: '1',
        name: 'Public Works'
      },
      tags: ['infrastructure', 'pothole', 'public_safety'],
      estimatedHours: 2,
      timeSpent: 1.5,
      attachments: 3,
      comments: 5
    },
    {
      id: '2',
      title: 'Approve building permit application',
      description: 'Review and approve permit application for new commercial building.',
      status: 'review',
      priority: 'medium',
      type: 'request',
      assignedTo: {
        id: '3',
        name: 'Sarah Johnson',
        avatarColor: 'bg-purple-500'
      },
      createdBy: {
        id: '4',
        name: 'Robert Chen',
        avatarColor: 'bg-green-500'
      },
      dueDate: '2024-03-12',
      createdAt: '2024-03-05',
      updatedAt: '1 day ago',
      workspace: {
        id: '2',
        name: 'Planning Dept'
      },
      tags: ['permit', 'construction', 'approval'],
      estimatedHours: 4,
      timeSpent: 3,
      attachments: 5,
      comments: 2
    },
    {
      id: '3',
      title: 'Investigate noise complaint',
      description: 'Multiple complaints about construction noise after hours.',
      status: 'todo',
      priority: 'urgent',
      type: 'complaint',
      createdBy: {
        id: '1',
        name: 'System',
        avatarColor: 'bg-gray-500'
      },
      dueDate: '2024-03-11',
      createdAt: '2024-03-10',
      updatedAt: 'Just now',
      conversationId: 'conv_002',
      workspace: {
        id: '3',
        name: 'Code Enforcement'
      },
      tags: ['noise', 'complaint', 'construction'],
      estimatedHours: 3,
      comments: 0
    },
    {
      id: '4',
      title: 'Prepare quarterly report',
      description: 'Compile statistics and prepare Q1 public works report.',
      status: 'in_progress',
      priority: 'medium',
      type: 'general',
      assignedTo: {
        id: '2',
        name: 'John Smith',
        avatarColor: 'bg-blue-500'
      },
      createdBy: {
        id: '5',
        name: 'Manager',
        avatarColor: 'bg-orange-500'
      },
      dueDate: '2024-03-20',
      createdAt: '2024-03-01',
      updatedAt: '3 hours ago',
      workspace: {
        id: '1',
        name: 'Public Works'
      },
      tags: ['report', 'quarterly', 'statistics'],
      estimatedHours: 8,
      timeSpent: 4,
      attachments: 2,
      comments: 3
    },
    {
      id: '5',
      title: 'Follow up on resolved complaint',
      description: 'Check in with citizen after complaint resolution.',
      status: 'done',
      priority: 'low',
      type: 'follow_up',
      assignedTo: {
        id: '3',
        name: 'Sarah Johnson',
        avatarColor: 'bg-purple-500'
      },
      createdBy: {
        id: '2',
        name: 'John Smith',
        avatarColor: 'bg-blue-500'
      },
      dueDate: '2024-03-09',
      createdAt: '2024-03-08',
      updatedAt: '1 day ago',
      conversationId: 'conv_003',
      workspace: {
        id: '1',
        name: 'Public Works'
      },
      tags: ['follow_up', 'customer_service'],
      estimatedHours: 1,
      timeSpent: 0.5,
      comments: 1
    },
    {
      id: '6',
      title: 'Escalated: Water main break',
      description: 'Major water main break reported. Needs immediate attention.',
      status: 'in_progress',
      priority: 'urgent',
      type: 'escalated',
      assignedTo: {
        id: '2',
        name: 'John Smith',
        avatarColor: 'bg-blue-500'
      },
      createdBy: {
        id: '1',
        name: 'System',
        avatarColor: 'bg-gray-500'
      },
      dueDate: '2024-03-10',
      createdAt: '2024-03-10',
      updatedAt: '30 minutes ago',
      conversationId: 'conv_004',
      workspace: {
        id: '1',
        name: 'Public Works'
      },
      tags: ['emergency', 'water', 'infrastructure'],
      estimatedHours: 6,
      timeSpent: 2,
      attachments: 4,
      comments: 8
    },
  ];

  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks.length.toString(), 
      icon: CheckSquare, 
      change: '+3 today' 
    },
    { 
      label: 'Overdue', 
      value: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length.toString(), 
      icon: AlertCircle, 
      change: '+1 urgent' 
    },
    { 
      label: 'In Progress', 
      value: tasks.filter(t => t.status === 'in_progress').length.toString(), 
      icon: Clock, 
      change: '+2 active' 
    },
    { 
      label: 'Completed', 
      value: tasks.filter(t => t.status === 'done').length.toString(), 
      icon: CheckCircle, 
      change: '+5 this week' 
    },
  ];

  const taskTypes = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'complaint', label: 'Complaint', color: 'bg-red-100 text-red-800' },
    { value: 'request', label: 'Request', color: 'bg-blue-100 text-blue-800' },
    { value: 'follow_up', label: 'Follow-up', color: 'bg-green-100 text-green-800' },
    { value: 'escalated', label: 'Escalated', color: 'bg-orange-100 text-orange-800' },
  ];

  const priorities = [
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  ];

  const statuses = [
    { value: 'todo', label: 'To Do', icon: Square, color: 'bg-gray-100 text-gray-800' },
    { value: 'in_progress', label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-800' },
    { value: 'review', label: 'Review', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'done', label: 'Done', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
  ];

  const getStatusIcon = (status: Task['status']) => {
    const statusObj = statuses.find(s => s.value === status);
    const Icon = statusObj?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTypeColor = (type: Task['type']) => {
    const typeObj = taskTypes.find(t => t.value === type);
    return typeObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesTab = true;
    if (selectedTab === 'my') {
      matchesTab = task.assignedTo?.name === 'John Smith'; // Replace with current user
    } else if (selectedTab === 'overdue') {
      matchesTab = new Date(task.dueDate) < new Date() && task.status !== 'done';
    } else if (selectedTab === 'completed') {
      matchesTab = task.status === 'done';
    }
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesTab && matchesPriority;
  });

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleToggleComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle complete:', taskId);
  };

  const handleQuickAssign = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Quick assign:', taskId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and track work items across the organization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Board View
            </button>
          </div>
          <button 
            onClick={handleCreateTask}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Create Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Tasks
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('my')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'my'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assigned to Me
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.assignedTo?.name === 'John Smith').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('overdue')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'overdue'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overdue
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('completed')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                selectedTab === 'completed'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === 'done').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
              >
                <option value="all">All Priorities</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleViewTask(task.id)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks([...selectedTasks, task.id]);
                        } else {
                          setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                        }
                      }}
                      className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleToggleComplete(task.id, e)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {task.status === 'done' ? (
                            <CheckSquare className="h-5 w-5 text-green-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {/* Status */}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1).replace('_', ' ')}
                      </span>

                      {/* Priority */}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>

                      {/* Status */}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusIcon(task.status)}
                        {task.status === 'in_progress' ? 'In Progress' : 
                         task.status === 'todo' ? 'To Do' :
                         task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                      </span>

                      {/* Tags */}
                      {task.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
                      )}
                    </div>

                    {/* Task Details */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        {/* Assigned To */}
                        <div className="flex items-center gap-2">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs ${task.assignedTo.avatarColor}`}>
                                {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm text-gray-600">{task.assignedTo.name}</span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleQuickAssign(task.id, e)}
                              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                            >
                              <User className="h-4 w-4" />
                              <span>Assign</span>
                            </button>
                          )}
                        </div>

                        {/* Workspace */}
                        {task.workspace && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Folder className="h-4 w-4" />
                            <span>{task.workspace.name}</span>
                          </div>
                        )}

                        {/* Due Date */}
                        <div className={`flex items-center gap-2 text-sm ${
                          new Date(task.dueDate) < new Date() && task.status !== 'done'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          <Calendar className="h-4 w-4" />
                          <span>Due: {task.dueDate}</span>
                        </div>

                        {/* Time Tracking */}
                        {task.estimatedHours && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{task.timeSpent || 0}h / {task.estimatedHours}h</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {task.conversationId && (
                          <button 
                            onClick={() => navigate(`/conversations/${task.conversationId}`)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View Conversation"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditTask(task.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => console.log('Delete task:', task.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTab !== 'all' || filterPriority !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first task'}
            </p>
            {(!searchQuery && selectedTab === 'all' && filterPriority === 'all') && (
              <button 
                onClick={handleCreateTask}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="h-5 w-5" />
                Create Your First Task
              </button>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
              </span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Assign Selected
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Mark as Done
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Change Priority
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-indigo-900 mb-1">Task Management Tips</h3>
            <p className="text-sm text-indigo-700">
              Use tasks to track citizen requests, complaints, and internal work items. 
              Link tasks to conversations for better context and assign them to team members 
              to ensure nothing falls through the cracks.
            </p>
          </div>
          <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
            Learn More <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;