import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius } from '../theme/colors';

type Props = TextInputProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function AppInput({ left, right, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      {left ? <View style={styles.side}>{left}</View> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        {...props}
        style={[styles.input, style]}
      />
      {right ? <View style={styles.side}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: 12,
    gap: 10,
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
});
