import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthContext } from '../store/auth';
import { TransactionsContext } from '../store/transactions';
import { ProfileContext } from '../store/profile';
import { ThemeContext } from '../store/theme';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../views/SplashScreen';
import { colors } from '../theme/colors';
import { ProfileService } from '../services/ProfileService';

export default function RootNavigator() {
  const { userEmail, isLoading, userId } = useContext(AuthContext);
  const { fetchTransactions, clearTransactions } = useContext(TransactionsContext);
  const { loadProfile, clearProfile, isLoading: profileLoading } = useContext(ProfileContext);
  const { setTheme } = useContext(ThemeContext);
  const [showSplash, setShowSplash] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Clear data when user logs out
  useEffect(() => {
    if (!userId) {
      clearProfile();
      clearTransactions();
      setDataLoaded(false);
    }
  }, [userId, clearProfile, clearTransactions]);

  // Load all data when user is authenticated
  useEffect(() => {
    if (userId && !dataLoaded) {
      (async () => {
        try {
          const [profileData] = await Promise.all([
            ProfileService.getProfile(userId),
            fetchTransactions(userId),
          ]);
          await loadProfile(userId);
          if (profileData.theme) setTheme(profileData.theme);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        } finally {
          setDataLoaded(true);
        }
      })();
    }
  }, [userId, dataLoaded, fetchTransactions, loadProfile, setTheme]);

  // Hide splash when auth loaded and data fetched (or no user)
  useEffect(() => {
    if (!isLoading && (!userId || dataLoaded)) {
      const t = setTimeout(() => setShowSplash(false), 300);
      return () => clearTimeout(t);
    }
  }, [isLoading, userId, dataLoaded]);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bg,
      card: colors.bg,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  if (isLoading || showSplash || (userId && !dataLoaded)) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={theme}>
      {userEmail ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
