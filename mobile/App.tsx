import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/store/auth';
import { TransactionsProvider } from './src/store/transactions';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <AuthProvider>
        <TransactionsProvider>
          <RootNavigator />
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
