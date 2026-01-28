import { api } from './axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export interface TeamPayload {
  name: string;
  slug?: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  departmentId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const teamApi = {
  /**
   * List teams for a department.
   * Backend: GET /api/v1/teams?departmentId={departmentId}&workspaceId={workspaceId}&accountId={accountId}
   */
  getTeamsByDepartment: (
    departmentId: string,
    workspaceId: string,
    accountId: string,
  ) =>
    api.get(`${BASE_URL}/teams`, {
      params: { departmentId, workspaceId, accountId },
    }),

  /**
   * Create a team in a department.
   * Backend: POST /api/v1/teams?departmentId={departmentId}&workspaceId={workspaceId}&accountId={accountId}
   */
  createTeam: (
    departmentId: string,
    workspaceId: string,
    accountId: string,
    data: TeamPayload,
  ) =>
    api.post(`${BASE_URL}/teams`, data, {
      params: { departmentId, workspaceId, accountId },
    }),

  /**
   * Update a team.
   * Backend: PUT /api/v1/teams/{teamId}?departmentId={departmentId}&workspaceId={workspaceId}&accountId={accountId}
   */
  updateTeam: (
    teamId: string,
    departmentId: string,
    workspaceId: string,
    accountId: string,
    data: Partial<TeamPayload>,
  ) =>
    api.put(`${BASE_URL}/teams/${teamId}`, data, {
      params: { departmentId, workspaceId, accountId },
    }),

  /**
   * Delete a team.
   * Backend: DELETE /api/v1/teams/{teamId}?departmentId={departmentId}&workspaceId={workspaceId}&accountId={accountId}
   */
  deleteTeam: (
    teamId: string,
    departmentId: string,
    workspaceId: string,
    accountId: string,
  ) =>
    api.delete(`${BASE_URL}/teams/${teamId}`, {
      params: { departmentId, workspaceId, accountId },
    }),
};

