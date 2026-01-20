// src/components/inbox/ConversationList.tsx
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  MessageSquare,
  Phone,
  User,
  Star,
  Pin,
  Archive,
  MoreVertical,
} from 'lucide-react';
import type { Conversation } from '../../types';
// import { Conversation } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
  onStar?: (conversationId: string) => void;
  onPin?: (conversationId: string) => void;
  onArchive?: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  selectedId, 
  onSelect,
  onStar,
  onPin,
  onArchive
}) => {
  const getStatusIcon = (status: Conversation['status']) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'in_progress':
        return <AlertCircle className="h-3 w-3 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'escalated':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Conversation['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Conversation['status']) => {
    switch (status) {
      case 'todo':
        return 'Todo';
      case 'in_progress':
        return 'In Progress';
      case 'closed':
        return 'Closed';
      case 'escalated':
        return 'Escalated';
      default:
        return 'Todo';
    }
  };

  const getChannelIcon = (channel: Conversation['channel']) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-3 w-3 text-gray-500" />;
      case 'sms':
        return <MessageSquare className="h-3 w-3 text-green-500" />;
      case 'voice':
        return <Phone className="h-3 w-3 text-blue-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-3 w-3 text-green-600" />;
      case 'web':
        return <MessageSquare className="h-3 w-3 text-purple-500" />;
      default:
        return <MessageSquare className="h-3 w-3 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority?: Conversation['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300';
      case 'high':
        return 'bg-orange-100 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'low':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityText = (priority?: Conversation['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'URGENT';
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return 'STANDARD';
    }
  };

  const formatMessagePreview = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getAvatarColor = (name: string) => {
    // Generate consistent color from name
    const colors = [
      'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleStarClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    onStar?.(conversationId);
  };

  const handlePinClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    onPin?.(conversationId);
  };

  const handleArchiveClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    onArchive?.(conversationId);
  };

  return (
    <div className="space-y-1 p-2">
      {conversations.length === 0 ? (
        <div className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
          <p className="text-gray-600">When conversations arrive, they'll appear here.</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`relative group cursor-pointer rounded-lg p-4 transition-all ${
              selectedId === conversation.id
                ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                : 'hover:bg-gray-50 border-l-4 border-l-transparent'
            }`}
          >
            {/* Priority indicator */}
            {conversation.priority && conversation.priority !== 'low' && (
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(conversation.priority)}`}>
                {getPriorityText(conversation.priority)}
              </div>
            )}

            {/* Star and Pin actions */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => handleStarClick(e, conversation.id)}
                className="p-1 hover:bg-yellow-100 rounded"
                title={conversation.starred ? "Unstar" : "Star"}
              >
                <Star className={`h-4 w-4 ${conversation.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={(e) => handlePinClick(e, conversation.id)}
                className="p-1 hover:bg-gray-200 rounded"
                title={conversation.pinned ? "Unpin" : "Pin"}
              >
                <Pin className={`h-4 w-4 ${conversation.pinned ? 'fill-gray-600 text-gray-600' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Main content */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAvatarColor(conversation.contact?.name ?? 'Unknown')} text-white font-medium`}>
                  {(conversation.contact?.name ?? 'Un').split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conversation.contact?.name ?? 'Unknown'}
                    </h4>
                    
                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                      {getStatusIcon(conversation.status)}
                      {getStatusText(conversation.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                    {conversation.pinned && (
                      <Pin className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Message preview */}
                <p className={`text-sm mb-2 truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {formatMessagePreview(conversation.lastMessage ?? '')}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Channel */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {getChannelIcon(conversation.channel)}
                      <span className="capitalize">{conversation.channel}</span>
                    </div>

                    {/* Department */}
                    {conversation.departmentId && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {conversation.departmentId}
                      </span>
                    )}

                    {/* Tags */}
                    {conversation.tags && conversation.tags.length > 0 && (
                      <div className="flex gap-1">
                        {conversation.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {conversation.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{conversation.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side indicators */}
                  <div className="flex items-center gap-2">
                    {/* Unread indicator */}
                    {conversation.unreadCount > 0 && (
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    )}

                    {/* Assigned indicator */}
                    {conversation.assignedTo && (
                      <div className="text-xs text-gray-500">
                        <User className="h-3 w-3 inline mr-1" />
                        Assigned
                      </div>
                    )}

                    {/* More actions dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle dropdown toggle
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action bar (appears on hover) */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => handleArchiveClick(e, conversation.id)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Archive"
              >
                <Archive className="h-4 w-4" />
              </button>
              
                {conversation.unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mark as read
                  }}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-xs font-medium"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))
      )}
      </div>
  );
};

export default ConversationList;

