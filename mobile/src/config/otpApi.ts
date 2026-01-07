import { API_URL } from './env';

export const otpApi = {
  sendOTP: async (email: string) => {
    const response = await fetch(`${API_URL}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
    return data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_URL}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Verification failed');
    return data;
  },
};
