import React, { useState } from 'react';
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';
import type { Task } from '../types';
// import { Task } from '../types';

const TasksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Review permit application #4521',
      description: 'Check zoning requirements for the new downtown project',
      status: 'in_progress',
      priority: 'high',
      type: 'request',
      assignedToId: '1',
      dueDate: '2024-03-25',
      workspaceId: '1',
      createdById: '1',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20'
    },
    {
      id: '2',
      title: 'Update traffic signal schedule',
      description: 'Adjust timing for Main St & 5th Ave intersection',
      status: 'todo',
      priority: 'medium',
      type: 'general',
      assignedToId: '2',
      dueDate: '2024-03-28',
      workspaceId: '1',
      createdById: '1',
      createdAt: '2024-03-21',
      updatedAt: '2024-03-21'
    },
    {
      id: '3',
      title: 'Quarterly maintenance report',
      description: 'Compile maintenance logs for Q1',
      status: 'done',
      priority: 'low',
      type: 'general',
      assignedToId: '1',
      dueDate: '2024-03-15',
      workspaceId: '1',
      createdById: '1',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track team assignments
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <Plus className="h-5 w-5" />
            Create Task
          </button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <span className="p-2 bg-gray-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-gray-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <span className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
              <span className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <span className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">14</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 hover:bg-gray-50 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <button className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'done' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-indigo-500'
                    }`}>
                      {task.status === 'done' && <CheckCircle className="h-3 w-3" />}
                    </button>
                    <div>
                      <h4 className={`text-sm font-medium ${
                        task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {task.dueDate}
                          </span>
                        )}
                        <span className="flex items-center text-xs text-gray-500">
                          <UserIcon className="h-3 w-3 mr-1" />
                          Assignee ID: {task.assignedToId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
