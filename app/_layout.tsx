import "../global.css";

import React, { useEffect } from "react";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import {
  Stack,
  useRouter,
} from "expo-router";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";

import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  AuthProvider,
  useAuth,
} from "@/services/authProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { loading, session } = useAuth();
  const router = useRouter();

  // Controla el tiempo mínimo del splash
  const [splashTerminado, setSplashTerminado] =
    React.useState(false);

  // Indica que el arranque inicial ya terminó
  const [inicioListo, setInicioListo] =
    React.useState(false);

  // 1. Tiempo mínimo del splash inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashTerminado(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 2. El arranque termina cuando:
  // - ya pasaron los 3 segundos
  // - AuthProvider terminó de cargar
  useEffect(() => {
    if (inicioListo) return;

    if (!splashTerminado || loading) return;

    setInicioListo(true);
  }, [
    splashTerminado,
    loading,
    inicioListo,
  ]);

  // 3. Navegación según autenticación
  useEffect(() => {
    if (!inicioListo) return;

    if (session) {
      router.replace("/(tabs)/home");
      return;
    }

    router.replace("/(auth)/welcome");
  }, [
    inicioListo,
    !!session,
    router,
  ]);

  // 4. Splash SOLO durante el arranque inicial
  if (!inicioListo) {
    return <AnimatedLogo />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(entrevista)" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    "Nunito-Medium": require(
      "../assets/fonts/Nunito-Medium.ttf"
    ),

    "Nunito-SemiBold": require(
      "../assets/fonts/Nunito-SemiBold.ttf"
    ),

    "Nunito-Bold": require(
      "../assets/fonts/Nunito-Bold.ttf"
    ),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}