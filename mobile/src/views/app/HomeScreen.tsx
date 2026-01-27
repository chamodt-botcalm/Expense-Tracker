import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import { spacing, radius } from '../../theme/colors';
import { TransactionsContext } from '../../store/transactions';
import { AuthContext } from '../../store/auth';
import { ProfileContext } from '../../store/profile';
import { formatMoney } from '../../utils/money';
import TransactionItem from '../../components/TransactionItem';
import { scaleHeight } from '../../constants/size';
import { ThemeContext } from '../../store/theme';
import { images } from '../../constants/images';

export default function HomeScreen({ navigation }: any) {
  const { items } = useContext(TransactionsContext);
  const { userEmail } = useContext(AuthContext);
  const { name, profilePhoto, currency } = useContext(ProfileContext);
  const { colors } = useContext(ThemeContext);

  const stats = useMemo(() => {
    const income = items.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const expense = items.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
    const balance = income + expense;
    return { income, expense, balance };
  }, [items]);

  const recent = items.slice(0, 5);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profilePlaceholder, { backgroundColor: colors.accent }]}>
            <AppText style={[styles.profileInitial, { color: colors.bg }]}>{name.charAt(0).toUpperCase() || 'U'}</AppText>
          </View>
        )}
        <View style={styles.profileInfo}>
          <AppText style={[styles.greeting, { color: colors.text }]}>Hi, {name || 'User'}!</AppText>
          <AppText style={[styles.email, { color: colors.muted }]}>{userEmail}</AppText>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Card style={[styles.statsCard, { backgroundColor: colors.surface }]} elevated>
          <AppText style={[styles.balanceLabel, { color: colors.muted }]}>Total Balance</AppText>
          <AppText style={[styles.balanceAmount, { color: colors.text,paddingVertical:10, height: 50, fontSize: 36 }]}>
            {formatMoney(stats.balance, currency)}
          </AppText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                <Image source={images.income} style={[styles.statIconImage, { tintColor: colors.success }]} />
              </View>
              <View>
                <AppText style={[styles.statLabel, { color: colors.muted }]}>Income</AppText>
                <AppText style={[styles.statAmount, { color: colors.success }]}>
                  {formatMoney(stats.income, currency)}
                </AppText>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.danger + '20' }]}>
                <Image source={images.expense} style={[styles.statIconImage, { tintColor: colors.danger }]} />
              </View>
              <View>
                <AppText style={[styles.statLabel, { color: colors.muted }]}>Expenses</AppText>
                <AppText style={[styles.statAmount, { color: colors.text, fontWeight: '800', fontSize: 16 }]}>
                  {formatMoney(stats.expense, currency)}
                </AppText>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <AppText style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</AppText>
        <Pressable onPress={() => navigation.navigate('Transactions')} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
          <AppText style={{ color: colors.accent, fontWeight: '700' }}>View All</AppText>
        </Pressable>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 130 }}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={() => navigation.navigate('Transactions')} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <AppText muted>No transactions yet</AppText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.lg,
    marginTop: scaleHeight(50),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  profilePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    marginTop: 3,
    fontSize: 13,
  },
  statsContainer: {
    marginTop: 20,
  },
  statsCard: {
    padding: spacing.lg,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmount: {
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  statLabel: {
    fontSize: 12,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabText: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: -2,
  },
});
