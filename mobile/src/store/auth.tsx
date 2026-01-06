import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/api';

type AuthState = {
  userEmail: string | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const KEY = 'expense_tracker_auth_v1';

export const AuthContext = createContext<AuthContextValue>({
  userEmail: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserEmail(parsed?.email ?? null);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.signIn(email, password);
    await AsyncStorage.setItem(KEY, JSON.stringify({ email: response.user.email }));
    setUserEmail(response.user.email);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await api.signUp(email, password);
    await AsyncStorage.setItem(KEY, JSON.stringify({ email: response.user.email }));
    setUserEmail(response.user.email);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({ userEmail, isLoading, signIn, signUp, signOut }),
    [userEmail, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
