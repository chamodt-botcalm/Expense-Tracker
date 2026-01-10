import { API_URL } from './env';

export const profileApi = {
  getProfile: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/profile/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  updateProfile: async (userId: string, updates: { name?: string; profile_photo?: string; theme?: string; currency?: string; date_format?: string }) => {
    const response = await fetch(`${API_URL}/api/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/api/profile/${userId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update password');
    return data;
  },
};
