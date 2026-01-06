import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthContext } from '../store/auth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/SplashScreen';
import { colors } from '../theme/colors';

export default function RootNavigator() {
  const { userEmail, isLoading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  // If storage is still loading, keep splash
  useEffect(() => {
    if (!isLoading) {
      // keep a tiny delay for nicer feel
      const t = setTimeout(() => setShowSplash(false), 300);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

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

  if (isLoading || showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer theme={theme}>
      {userEmail ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
