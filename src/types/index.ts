// src/types/index.ts

// --- Auth & User Types ---

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // role: 'account_admin' | 'department_manager' | 'agent' | 'viewer';
   role: 'app_owner' | 'account_admin' | 'department_manager' | 'agent' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  
  // Hierarchy properties
  accountId?: string;
  accountName?: string;
  workspaceId?: string;
  workspaceName?: string;
  departmentId?: string;
  departmentName?: string;
  
  // Team properties
  teamIds?: string[];
  
  updatedAt: string;
  teamNames?: string[];
  
  // Timestamps
  lastLogin?: string | null;
  createdAt: string;
  
  // Impersonation
  isImpersonatable?: boolean;

    metadata?: {
    isEmailVerified?: boolean;
    lastLoginAt?: string;
    // etc.
  };
}

export interface AppOwner {
  id: string;
  email: string;
  name: string;
  role: 'app_owner';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  status: string;
  data: {
    tokens: AuthTokens;
    user?: User;
    appOwner?: AppOwner;
  };
}

// --- Organization Types ---

// export interface Account {
//   id: string;
//   name: string;
//   type: 'government' | 'education' | 'other';
//   status: 'active' | 'pending' | 'suspended' | 'inactive';
//   contactEmail: string;
//   subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
//   createdAt: string;
//   updatedAt: string;
//   ownerId?: string;
//   // Stats for UI
//   usersCount?: number;
//   workspacesCount?: number;
// }


// interface Account {
//   id: string;
//   name: string;
//   slug: string;
//   status: 'active' | 'inactive' | 'pending';
//   created_at: string;
//   updated_at: string;
//   workspaces_count?: number;
//   users_count?: number;
// }

// interface DashboardStats {
//   totalAccounts: number;
//   totalWorkspaces: number;
//   activeUsers: number;
//   pendingSetup: number;
//   accountsChange: string;
//   workspacesChange: string;
//   usersChange: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export interface Workspace {
//   owner: any;
//   id: string;
//   name: string;
//   accountId: string;
//   accountName?: string; 
//   type: 'department' | 'team' | 'project' | 'regional';
//   status: 'active' | 'inactive' | 'archived';
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
//   channels: ('email' | 'sms' | 'voice' | 'whatsapp')[];
//   usersCount?: number;
//   conversationsCount?: number;
//   departmentsCount?: number;
// }

export interface Workspace {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  type: 'department' | 'team' | 'project' | 'regional';
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  
  // Optional counts
  usersCount?: number;
  conversationsCount?: number;
  departmentsCount?: number;
  
  channels: ('email' | 'sms' | 'voice' | 'whatsapp')[];
  createdAt: string;
  updatedAt?: string;
  
  // Optional owner reference
  owner?: any;
  
  // Optional timestamp
  lastActive?: string;
}





// --- Communication Types ---

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  workspaceId: string;
  avatarColor?: string; // UI helper
  createdAt: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  workspaceId: string;
  status: 'todo' | 'in_progress' | 'closed' | 'escalated';
  channel: 'email' | 'sms' | 'voice' | 'web' | 'whatsapp';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  assignedTo?: string; // User ID
  departmentId?: string;
  tags: string[];
  
  // UI Helpers (hydrated data)
  contact?: Contact;
  lastMessage?: string; // Preview
  pinned?: boolean;
  starred?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'contact' | 'agent' | 'system' | 'bot';
  senderId?: string;
  content: string; // Text or JSON for rich content
  contentType: 'text' | 'image' | 'file' | 'audio';
  createdAt: string;
  readAt?: string;
}

// --- Task Types ---

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'general' | 'complaint' | 'request' | 'follow_up' | 'escalated';
  dueDate?: string;
  workspaceId: string;
  assignedToId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  
  // UI Helpers
  assignedTo?: User;
  createdBy?: User;
  workspace?: Workspace;
  conversationId?: string;
}

// --- Form Types (PRD Section 21) ---

export interface FormField {
  id: string;
  type: 'text' | 'paragraph' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'file' | 'signature';
  label: string;
  required: boolean;
  options?: string[]; // For select/radio
  placeholder?: string;
}

export interface Form {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// --- Campaign Types (PRD Section 7) ---

export interface CampaignStep {
  id: string;
  type: 'email' | 'sms';
  templateId?: string;
  content?: string;
  delay?: number; // seconds
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  audienceFilter: Record<string, any>;
  steps: CampaignStep[];
  createdAt: string;
  scheduledAt?: string;
}
