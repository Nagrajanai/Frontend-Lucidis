// src/pages/InboxPage.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare,
} from 'lucide-react';
import type { Contact, Conversation } from '../../types';
import ConversationList from '../../componenets/inbox/ConversationList';
import ConversationDetail from '../../componenets/inbox/ConversationDetail';
// import ConversationList from '../componenets/inbox/ConversationList';
// import ConversationDetail from '../componenets/inbox/ConversationDetail';
// import type { Contact, Conversation } from '../types';
// import { Conversation, Contact } from '../types';

const InboxPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations using central types with UI helper fields
  const conversations: Conversation[] = [
    {
      id: '1',
      contactId: 'c1',
      workspaceId: '1',
      status: 'todo',
      channel: 'email',
      priority: 'high',
      unreadCount: 1,
      lastMessageAt: '2024-03-20T10:30:00Z',
      createdAt: '2024-03-20T10:00:00Z',
      assignedTo: 'agent_1',
      departmentId: 'dept_public_works',
      tags: ['permit', 'urgent'],
      contact: {
        id: 'c1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        workspaceId: '1',
        createdAt: '2024-03-01T09:00:00Z'
      } as Contact,
      lastMessage: 'When will my permit be approved? I submitted it last week.',
      starred: true,
      pinned: false
    },
    {
      id: '2',
      contactId: 'c2',
      workspaceId: '1',
      status: 'in_progress',
      channel: 'sms',
      priority: 'medium',
      unreadCount: 0,
      lastMessageAt: '2024-03-19T14:20:00Z',
      createdAt: '2024-03-19T14:00:00Z',
      assignedTo: 'agent_2',
      departmentId: 'dept_public_works',
      tags: ['infrastructure', 'pothole'],
      contact: {
        id: 'c2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 987-6543',
        workspaceId: '1',
        createdAt: '2024-03-01T09:00:00Z'
      } as Contact,
      lastMessage: 'Reported a pothole on Main Street yesterday.',
      starred: false,
      pinned: true
    },
    {
      id: '3',
      contactId: 'c3',
      workspaceId: '1',
      status: 'closed',
      channel: 'voice',
      priority: 'low',
      unreadCount: 0,
      lastMessageAt: '2024-03-18T16:45:00Z',
      createdAt: '2024-03-18T16:00:00Z',
      tags: ['parking', 'feedback'],
      contact: {
        id: 'c3',
        name: 'Robert Chen',
        email: 'robert@example.com',
        phone: '(555) 456-7890',
        workspaceId: '1',
        createdAt: '2024-03-01T09:00:00Z'
      } as Contact,
      lastMessage: 'Thank you for your help with the parking issue!',
      starred: false,
      pinned: false
    },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Conversation List */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              New Message
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                All
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                Unread
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                Assigned to me
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                <Filter className="h-4 w-4" />
                More
              </button>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
            onStar={(id) => console.log('Star conversation:', id)}
            onPin={(id) => console.log('Pin conversation:', id)}
            onArchive={(id) => console.log('Archive conversation:', id)}
          />
        </div>
      </div>

      {/* Right Panel - Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ConversationDetail conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Select a conversation from the list to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
