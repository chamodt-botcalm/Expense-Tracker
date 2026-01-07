import React, { useContext, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import { colors, spacing, radius } from '../../theme/colors';
import { TransactionsContext } from '../../store/transactions';
import { AuthContext } from '../../store/auth';
import { formatMoney } from '../../utils/money';
import TransactionItem from '../../components/TransactionItem';
import { scaleHeight } from '../../constants/size';

export default function HomeScreen({ navigation }: any) {
  const { items, fetchTransactions } = useContext(TransactionsContext);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);

  const stats = useMemo(() => {
    const income = items.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const expense = items.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
    const balance = income + expense;
    return { income, expense, balance };
  }, [items]);

  const recent = items.slice(0, 5);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <AppText title>PulseSpend</AppText>
      </View>

      <Card style={{ marginTop: 14 }}>
        <AppText muted>Balance</AppText>
        <AppText title mono style={{ marginTop: 8 }}>
          {formatMoney(stats.balance)}
        </AppText>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <View style={[styles.pill, { backgroundColor: 'rgba(77,255,136,0.12)' }]}>
            <AppText muted>Income</AppText>
            <AppText mono style={{ marginTop: 4, fontWeight: '800', color: colors.success }}>
              {formatMoney(stats.income)}
            </AppText>
          </View>
          <View style={[styles.pill, { backgroundColor: 'rgba(255,77,77,0.10)' }]}>
            <AppText muted>Expense</AppText>
            <AppText mono style={{ marginTop: 4, fontWeight: '800' }}>
              {formatMoney(stats.expense)}
            </AppText>
          </View>
        </View>
      </Card>

      <View style={styles.sectionRow}>
        <AppText style={{ fontWeight: '800' }}>Recent</AppText>
        <Pressable onPress={() => navigation.navigate('Transactions')} hitSlop={10}>
          <AppText style={{ color: colors.accent, fontWeight: '800' }}>View all</AppText>
        </Pressable>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={() => navigation.navigate('Transactions')} />
        )}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    marginTop: scaleHeight(50),
  },
  header: {
    alignItems: 'center',
    marginBottom: scaleHeight(20),
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flex: 1,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sectionRow: {
    marginTop: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
