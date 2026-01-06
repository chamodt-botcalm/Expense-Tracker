import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = TextProps & {
  muted?: boolean;
  title?: boolean;
  mono?: boolean;
};

export default function AppText({ style, muted, title, mono, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        muted && styles.muted,
        title && styles.title,
        mono && styles.mono,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  muted: {
    color: colors.muted,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  mono: {
    fontVariant: ['tabular-nums'],
  },
});
