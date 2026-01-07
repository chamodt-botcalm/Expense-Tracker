import { API_URL } from './env';

export const signupApi = {
  sendPasskey: async (email: string) => {
    const response = await fetch(`${API_URL}/api/auth/send-passkey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send passkey');
    return data;
  },

  verifyPasskey: async (email: string, passkey: string) => {
    const response = await fetch(`${API_URL}/api/auth/verify-passkey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passkey }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Verification failed');
    return data;
  },

  setPassword: async (email: string, password: string, signupToken: string) => {
    const response = await fetch(`${API_URL}/api/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, signupToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create account');
    return data;
  },
};
