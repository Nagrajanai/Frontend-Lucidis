// import { api } from './axios';

// const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';
// console.log('API Base URL:', BASE_URL);


// export interface CreateWorkspaceData {
//   name: string;
//   slug: string;
//   accountId: string;
//   type?: 'department' | 'team' | 'project' | 'regional';
//   description?: string;
//   // channels?: ('email' | 'sms' | 'voice' | 'whatsapp')[];
// }

// export interface Workspace {
//   id: string;
//   name: string;
//   accountId: string;
//   accountName: string;
//   type: 'department' | 'team' | 'project' | 'regional';
//   status: 'active' | 'inactive' | 'suspended';
//   description?: string;
//   usersCount?: number;
//   conversationsCount?: number;
//   departmentsCount?: number;
//   channels: ('email' | 'sms' | 'voice' | 'whatsapp')[];
//   createdAt: string;
//   updatedAt?: string;
//   owner?: any;
//   lastActive?: string;
// }


// export const workspaceApi = {

//     // Workspace endpoints
//     getWorkspacesByAccount: (accountId: string) =>
//       api.get(`${BASE_URL}/workspaces?accountId=${accountId}`),

//     createWorkspace: (accountId: string, data: CreateWorkspaceData) =>
//       api.post(`${BASE_URL}/workspaces?accountId=${accountId}`, data),

//     getWorkspaceById: (workspaceId: string, accountId: string) =>
//       api.get(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`),

//     updateWorkspace: (workspaceId: string, accountId: string, data: Partial<CreateWorkspaceData>) =>
//       api.put(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`, data),

//     deleteWorkspace: (workspaceId: string, accountId: string) =>
//       api.delete(`${BASE_URL}/workspaces/${workspaceId}?accountId=${accountId}`),
// };


import { api } from './axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export interface CreateWorkspaceData {
  name: string;
  slug?: string;
  accountId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug?: string;
  accountId: string;
  status?: 'active' | 'inactive' | 'suspended';
  usersCount?: number;
  conversationsCount?: number;
  departmentsCount?: number;
  channels?: ('email' | 'sms' | 'voice' | 'whatsapp')[];
  createdAt: string;
  updatedAt?: string;
  owner?: any;
  lastActive?: string;
}

export interface WorkspaceUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  status?: string;
}

export interface WorkspaceDepartment {
  id: string;
  name: string;
  description?: string;
}

export interface WorkspaceDetail extends Workspace {
  departments?: WorkspaceDepartment[];
  workspaceUsers?: WorkspaceUser[];
}


export const workspaceApi = {
  // Match Postman collection exactly
  getWorkspacesByAccount: (accountId: string) =>
    api.get(`${BASE_URL}/workspaces`, { params: { accountId } }),

  createWorkspace: (accountId: string, data: CreateWorkspaceData) =>
    api.post(`${BASE_URL}/workspaces`, data, { params: { accountId } }),

  getWorkspaceById: (workspaceId: string, accountId: string) =>
    api.get(`${BASE_URL}/workspaces/${workspaceId}`, { params: { accountId } }),

  updateWorkspace: (workspaceId: string, accountId: string, data: Partial<CreateWorkspaceData>) =>
    api.put(`${BASE_URL}/workspaces/${workspaceId}`, data, { params: { accountId } }),

  deleteWorkspace: (workspaceId: string, accountId: string) =>
    api.delete(`${BASE_URL}/workspaces/${workspaceId}`, { params: { accountId } }),

  // Add user to workspace (from Postman collection)
  addUserToWorkspace: (workspaceId: string, accountId: string, userData: { email: string; role: string }) =>
    api.post(`${BASE_URL}/workspaces/${workspaceId}/users`, userData, { params: { accountId } }),
};