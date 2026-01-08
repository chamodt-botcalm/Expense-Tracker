import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/store/auth';
import { TransactionsProvider } from './src/store/transactions';
import { ThemeProvider } from './src/store/theme';
import { ProfileProvider } from './src/store/profile';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <AuthProvider>
          <ProfileProvider>
            <TransactionsProvider>
              <RootNavigator />
            </TransactionsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
