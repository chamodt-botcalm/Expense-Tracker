import { API_URL } from './env';

export const profileApi = {
  getProfile: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/profile/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  updateProfile: async (userId: string, updates: { name?: string; profile_photo?: string; theme?: string }) => {
    const response = await fetch(`${API_URL}/api/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },
};
