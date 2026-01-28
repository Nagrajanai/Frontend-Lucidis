import type { InviteUserRequest } from "../types";
import { api } from "./axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bubblier-confiscable-janey.ngrok-free.dev/api/v1';

export const invitationApi = {
  // Invite user to account
  inviteUserToAccount: async (accountId: string, data: InviteUserRequest) => {
    const response = await api.post(`${BASE_URL}/accounts/${accountId}/users`, data);
    return response.data;
  },

  // Get pending invitations for account
  // Backend: GET /api/v1/accounts/invitations (no accountId in path)
  getAccountInvitations: async () => {
    const response = await api.get(`${BASE_URL}/accounts/invitations`);
    return response.data;
  },

  // Resend invitation
  resendInvitation: async (accountId: string, invitationId: string) => {
    const response = await api.post(
      `${BASE_URL}/accounts/${accountId}/invitations/${invitationId}/resend`,
      {}
    );
    return response.data;
  },

  // Cancel invitation
  cancelInvitation: async (accountId: string, invitationId: string) => {
    const response = await api.delete(
      `${BASE_URL}/accounts/${accountId}/invitations/${invitationId}`,
    );
    return response.data;
  }
};