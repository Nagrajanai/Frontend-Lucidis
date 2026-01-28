// src/types/index.ts

// --- Auth & User Types ---
export const GlobalROLES = {
  APP_OWNER: 'app_owner',
  ACCOUNT_ADMIN: 'account_admin',
  DEPARTMENT_MANAGER: 'department_manager',
  AGENT: 'agent',
  VIEWER: 'viewer',
  // Simplified workspace roles
  ADMIN: 'admin',
  MEMBER: 'member',
};
export interface User {
  id: string;
  // New backend shape
  fullName?: string;
  globalRole?: 'APP_OWNER' | 'USER';
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

  // Optional auth/multi-tenant context (from /auth/login, /auth/me)
  context?: {
    accounts: { accountId: string; role: string }[];
    workspaces: any[];
    departments: any[];
    teams: any[];
  };
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

export interface AppOwner {
  id: string;
  email: string;
  name: string;
  role: 'app_owner';
  // Has many Accounts
  accounts?: Account[];
}

export interface Account {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  // Belongs to AppOwner
  ownerId?: string;
  // Has many Workspaces
  workspaces?: Workspace[];
  // Has many Users
  users?: User[];
  
  // UI helpers
  workspacesCount?: number;
  usersCount?: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  createdAt: string;
  updatedAt?: string;
  lastActive?: string;
  
  // Belongs to Account
  accountId: string;
  accountName?: string;
  
  // Has many Departments
  departments?: Department[];
  // Has many Inboxes (channels)
  channels?: ('email' | 'sms' | 'voice' | 'whatsapp')[];
  // Has many Workflows
  workflows?: any[]; // Placeholder for Workflow type
  
  // UI helpers
  departmentsCount?: number;
  usersCount?: number;
  conversationsCount?: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  
  // Belongs to Workspace
  workspaceId: string;
  
  // Has many Teams
  teams?: Team[];
  
  // UI helpers
  teamsCount?: number;
  usersCount?: number;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  
  // Belongs to Department
  departmentId: string;
  
  // Has many Users
  users?: User[];
  
  // UI helpers
  usersCount?: number;
}

// --- Communication Types ---

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarColor?: string; // UI helper
  createdAt: string;
  updatedAt: string;
  
  // Belongs to Workspace
  workspaceId: string;
  
  // Has many Conversations
  conversations?: Conversation[];
  
  customFields?: Record<string, any>;
}

export interface Conversation {
  id: string;
  status: 'todo' | 'in_progress' | 'closed' | 'escalated';
  channel: 'email' | 'sms' | 'voice' | 'web' | 'whatsapp';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  tags: string[];
  
  // Belongs to Contact
  contactId: string;
  contact?: Contact;
  
  // Belongs to Workspace (implied via Contact, but often denormalized)
  workspaceId: string;
  
  // Optional relations
  assignedTo?: string; // User ID
  departmentId?: string;
  
  // Has many Messages
  messages?: Message[];
  
  // UI Helpers
  lastMessage?: string; // Preview
  pinned?: boolean;
  starred?: boolean;
}

export interface Message {
  id: string;
  senderType: 'contact' | 'agent' | 'system' | 'bot';
  senderId?: string;
  content: string; // Text or JSON for rich content
  contentType: 'text' | 'image' | 'file' | 'audio';
  createdAt: string;
  readAt?: string;
  
  // Belongs to Conversation
  conversationId: string;
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
  createdAt: string;
  updatedAt: string;
  
  // Linked to Workspace
  workspaceId: string;
  workspace?: Workspace;
  
  // Linked to Conversation (optional)
  conversationId?: string;
  
  // Linked to Contact (optional)
  contactId?: string;
  
  // Assignments
  assignedToId?: string;
  assignedTo?: User;
  createdById: string;
  createdBy?: User;
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


export const INVITATION_ROLES = {
  ADMIN: 'ADMIN',      // For Account Admin invitations
  MEMBER: 'MEMBER'     // For regular user invitations
} as const;

export type InvitationRole = typeof INVITATION_ROLES[keyof typeof INVITATION_ROLES];

// Back-compat alias used across the app
export const ROLES = INVITATION_ROLES;

export interface InviteUserRequest {
  email: string;
  role: InvitationRole;
}