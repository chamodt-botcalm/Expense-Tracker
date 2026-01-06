import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme/colors';
import { Tx } from '../store/transactions';
import { formatMoney } from '../utils/money';

export default function TransactionItem({
  item,
  onPress,
}: {
  item: Tx;
  onPress?: () => void;
}) {
  const isIncome = item.amount > 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <View style={[styles.dot, { backgroundColor: isIncome ? colors.success : colors.danger }]} />
      <View style={{ flex: 1 }}>
        <AppText style={{ fontWeight: '700' }}>{item.title}</AppText>
        <AppText muted style={{ marginTop: 2 }}>
          {item.category} • {item.dateISO}
        </AppText>
      </View>
      <AppText mono style={{ fontWeight: '800', color: isIncome ? colors.success : colors.text }}>
        {formatMoney(item.amount)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
