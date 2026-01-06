import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';

type Props = ViewProps & {
  children: ReactNode;
  padded?: boolean;
};

export default function Card({ children, padded = true, style, ...props }: Props) {
  return (
    <View {...props} style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  padded: {
    padding: 16,
  },
});
