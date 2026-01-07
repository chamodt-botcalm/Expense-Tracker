const API_URL = 'http://10.190.92.27:5001';

export const api = {
  signUp: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Sign up failed');
    return data;
  },

  signIn: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Sign in failed');
    return data;
  },

  createTransaction: async (title: string, amount: number, category: string, user_id: string) => {
    const response = await fetch(`${API_URL}/api/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount, category, user_id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create transaction');
    return data;
  },

  getTransactions: async (user_id: string) => {
    const response = await fetch(`${API_URL}/api/transaction/${user_id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch transactions');
    return data;
  },

  deleteTransaction: async (id: string) => {
    const response = await fetch(`${API_URL}/api/transaction/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete transaction');
    return data;
  },
};
