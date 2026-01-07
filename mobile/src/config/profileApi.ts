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

  uploadToCloudinary: async (imageUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Upload failed');
    return data.secure_url;
  },
};
