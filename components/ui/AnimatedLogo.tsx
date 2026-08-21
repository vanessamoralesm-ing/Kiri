import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

/**
 * Logo animado de Kiri: aparece con fade-in y luego crece
 * con un efecto de resorte (spring).
 *
 * Reutilizable en cualquier pantalla que necesite mostrar
 * el logo con esta animación (splash inicial, loaders, etc).
 */
export default function AnimatedLogo() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F8EF7', // Azul de Kiri
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '95%',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 360,
  },
});