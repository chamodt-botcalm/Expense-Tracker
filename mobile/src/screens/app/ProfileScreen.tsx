import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import { colors, spacing } from '../../theme/colors';
import { AuthContext } from '../../store/auth';

export default function ProfileScreen() {
  const { userEmail, signOut } = useContext(AuthContext);

  return (
    <View style={styles.wrap}>
      <AppText title>Profile</AppText>
      <AppText muted style={{ marginTop: 6 }}>
        Manage your account.
      </AppText>

      <Card style={{ marginTop: 14 }}>
        <AppText muted>Email</AppText>
        <AppText style={{ marginTop: 6, fontWeight: '800' }}>{userEmail ?? '-'}</AppText>

        <AppText muted style={{ marginTop: 14 }}>
          Tip
        </AppText>
        <AppText style={{ marginTop: 6 }}>
          This is demo auth (local storage). Hook it to your backend later.
        </AppText>

        <AppButton title="Sign out" variant="secondary" onPress={signOut} style={{ marginTop: 16 }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    paddingTop: 18,
  },
});
