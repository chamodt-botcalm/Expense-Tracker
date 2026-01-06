import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AppText from '../components/AppText';
import { colors, radius } from '../theme/colors';

export default function SplashScreen({ onDone }: { onDone?: () => void }) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => onDone?.(), 900);
    return () => clearTimeout(t);
  }, [onDone, opacity, scale]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.logo, { transform: [{ scale }], opacity }]}>
        <AppText title style={{ color: colors.bg }}>
          ₿
        </AppText>
      </Animated.View>

      <Animated.View style={{ opacity, marginTop: 18 }}>
        <AppText title>PulseSpend</AppText>
        <AppText muted style={{ marginTop: 6 }}>
          Track • Control • Grow
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: radius.xl,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
});
