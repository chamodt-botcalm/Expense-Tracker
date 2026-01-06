import React from 'react';
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme/colors';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <AppText
          style={[
            styles.text,
            variant === 'secondary' && { color: colors.text },
            variant === 'ghost' && { color: colors.accent },
          ]}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontWeight: '700',
    color: colors.bg,
  },
});
