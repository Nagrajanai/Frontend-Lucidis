import { api } from './axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export interface DepartmentPayload {
  name: string;
  slug?: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  workspaceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const departmentApi = {
  /**
   * List departments for a workspace.
   * Backend: GET /api/v1/departments?workspaceId={workspaceId}&accountId={accountId}
   */
  getDepartments: (workspaceId: string, accountId: string) =>
    api.get(`${BASE_URL}/departments`, {
      params: { workspaceId, accountId },
    }),

  /**
   * Create a department in a workspace.
   * Backend: POST /api/v1/departments?workspaceId={workspaceId}&accountId={accountId}
   */
  createDepartment: (
    workspaceId: string,
    accountId: string,
    data: DepartmentPayload,
  ) =>
    api.post(`${BASE_URL}/departments`, data, {
      params: { workspaceId, accountId },
    }),

  /**
   * Update a department.
   * Backend: PUT /api/v1/departments/{departmentId}?workspaceId={workspaceId}&accountId={accountId}
   */
  updateDepartment: (
    departmentId: string,
    workspaceId: string,
    accountId: string,
    data: Partial<DepartmentPayload>,
  ) =>
    api.put(`${BASE_URL}/departments/${departmentId}`, data, {
      params: { workspaceId, accountId },
    }),

  /**
   * Delete a department.
   * Backend: DELETE /api/v1/departments/{departmentId}?workspaceId={workspaceId}&accountId={accountId}
   */
  deleteDepartment: (
    departmentId: string,
    workspaceId: string,
    accountId: string,
  ) =>
    api.delete(`${BASE_URL}/departments/${departmentId}`, {
      params: { workspaceId, accountId },
    }),
};

