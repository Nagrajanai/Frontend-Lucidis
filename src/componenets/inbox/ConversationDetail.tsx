// src/components/inbox/ConversationDetail.tsx
import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  Tag, 
  Paperclip, 
  Send, 
  Smile,
  MoreVertical,
  Phone,
  Mail
} from 'lucide-react';

interface ConversationDetailProps {
  conversationId: string;
}

// Mark conversationId as intentionally unused with underscore prefix
const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversationId: _conversationId }) => {
  const [message, setMessage] = useState('');

  // Mock messages
  const messages = [
    { id: '1', text: 'Hello, I need help with my permit application.', sender: 'contact', timestamp: '10:30 AM' },
    { id: '2', text: 'Hi John! I can help you with that. Could you share your application ID?', sender: 'agent', timestamp: '10:32 AM' },
    { id: '3', text: 'My application ID is PER-2024-00123.', sender: 'contact', timestamp: '10:35 AM' },
    { id: '4', text: 'Thanks! Your application is under review. Expected approval time is 2-3 business days.', sender: 'agent', timestamp: '10:36 AM' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // API call will go here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  // MessageBubble component
  const MessageBubble: React.FC<{ 
    message: { 
      id: string; 
      text: string; 
      sender: string; 
      timestamp: string 
    } 
  }> = ({ message }) => {
    const isAgent = message.sender === 'agent';
    
    return (
      <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isAgent 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}>
          <p className="mb-1">{message.text}</p>
          <p className={`text-xs ${isAgent ? 'text-indigo-200' : 'text-gray-500'}`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Conversation Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">John Smith</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>john@example.com</span>
                <span>•</span>
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
              Create Task
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">Status:</span>
            <select className="border-0 bg-transparent font-medium text-gray-900 focus:ring-0">
              <option>Todo</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">Assigned to:</span>
            <select className="border-0 bg-transparent font-medium text-gray-900 focus:ring-0">
              <option>Unassigned</option>
              <option>Agent Smith</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">First response:</span>
            <span className="font-medium">2 minutes</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 border border-gray-300 rounded-lg bg-white">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-3 resize-none focus:outline-none min-h-[60px]"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    // Mock API call for demo
                    console.log('Sending mock message');
                    setMessage('This is a mock response from AI');
                  }}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Mock AI Response
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Real-time indicator */}
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time updates active</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;