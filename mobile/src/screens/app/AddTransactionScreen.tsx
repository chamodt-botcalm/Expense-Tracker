import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import AppText from '../../components/AppText';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { colors, spacing, radius } from '../../theme/colors';
import { TransactionsContext, Tx } from '../../store/transactions';
import { AuthContext } from '../../store/auth';
import { scaleHeight } from '../../constants/size';

const categories: Tx['category'][] = ['Food', 'Transport', 'Bills', 'Shopping', 'Income', 'Other'];

export default function AddTransactionScreen({ navigation }: any) {
  const { addTx } = useContext(TransactionsContext);
  const { userId } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [amountRaw, setAmountRaw] = useState('');
  const [category, setCategory] = useState<Tx['category']>('Food');
  const [isIncome, setIsIncome] = useState(false);
  const [saving, setSaving] = useState(false);

  const amount = useMemo(() => {
    const n = Number(amountRaw);
    return Number.isFinite(n) ? n : 0;
  }, [amountRaw]);

  const canSave = title.trim().length >= 2 && amount > 0 && userId;

  const save = async () => {
    if (!canSave) {
      Alert.alert('Missing info', 'Enter a title and amount.');
      return;
    }
    try {
      setSaving(true);
      const dateISO = new Date().toISOString().slice(0, 10);
      await addTx(
        {
          title: title.trim(),
          category: isIncome ? 'Income' : category,
          amount: isIncome ? amount : -amount,
          dateISO,
        },
        userId!,
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <AppText title>Add</AppText>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <AppText style={{ color: colors.accent, fontWeight: '800' }}>Close</AppText>
        </Pressable>
      </View>

      <Card style={{ marginTop: 14 }}>
        <AppText muted style={{ marginBottom: 8 }}>
          Title
        </AppText>
        <AppInput value={title} onChangeText={setTitle} placeholder="e.g., Uber, Rent, Groceries" />

        <View style={{ height: 14 }} />

        <AppText muted style={{ marginBottom: 8 }}>
          Amount
        </AppText>
        <AppInput
          value={amountRaw}
          onChangeText={setAmountRaw}
          keyboardType="decimal-pad"
          placeholder="e.g., 12.50"
        />

        <View style={{ height: 14 }} />

        <View style={styles.chipsRow}>
          <Pressable onPress={() => setIsIncome(false)} style={[styles.chip, !isIncome && styles.chipActive]}>
            <AppText style={{ fontWeight: '800', color: !isIncome ? colors.bg : colors.text }}>Expense</AppText>
          </Pressable>
          <Pressable onPress={() => setIsIncome(true)} style={[styles.chip, isIncome && styles.chipActive]}>
            <AppText style={{ fontWeight: '800', color: isIncome ? colors.bg : colors.text }}>Income</AppText>
          </Pressable>
        </View>

        {!isIncome ? (
          <>
            <AppText muted style={{ marginTop: 12, marginBottom: 8 }}>
              Category
            </AppText>
            <View style={styles.catWrap}>
              {categories
                .filter((c) => c !== 'Income')
                .map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.cat, category === c && styles.catActive]}
                  >
                    <AppText style={{ fontWeight: '700', color: category === c ? colors.bg : colors.text }}>{c}</AppText>
                  </Pressable>
                ))}
            </View>
          </>
        ) : null}

        <AppButton title="Save transaction" onPress={save} disabled={!canSave} loading={saving} style={{ marginTop: 16 }} />
      </Card>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(30),
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
  catWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cat: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  catActive: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
});
