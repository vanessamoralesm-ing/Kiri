import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();

  // Animación basica para el logo esta aparece y luego crece
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    // En esta parte se inicia la animacion del logo
    logoOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withSpring(1);

    //Esperar 3 segundos e ir a la pantalla de Bienvenida
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome' as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Estilo animado del logo
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
    backgroundColor: '#4685F6', // Azul de Kiri
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