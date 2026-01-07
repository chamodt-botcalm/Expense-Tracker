import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme/colors';
import { TransactionsContext } from '../../store/transactions';
import { AuthContext } from '../../store/auth';
import TransactionItem from '../../components/TransactionItem';

export default function TransactionsScreen() {
  const { items, removeTx, fetchTransactions } = useContext(TransactionsContext);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);

  const handleDelete = async (id: string) => {
    try {
      await removeTx(id);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to delete transaction');
    }
  };

  return (
    <View style={styles.wrap}>
      <AppText title style={{ marginBottom: 14 }}>
        Transactions
      </AppText>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onPress={() => {
              Alert.alert('Transaction', 'Delete this item?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
              ]);
            }}
          />
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
    paddingTop: 18,
  },
});
