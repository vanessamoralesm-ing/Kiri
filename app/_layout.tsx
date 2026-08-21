import "../global.css";
import React, { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/services/authProvider";

SplashScreen.preventAutoHideAsync();

// NAVEGACIÓN PRINCIPAL
function RootNavigation() {
  const { loading, session } = useAuth();
  const router = useRouter();

  // REDIRECCIÓN SEGÚN SESIÓN
  useEffect(() => {
    // Esperar a que AuthProvider termine authLoading y profileLoading
    if (loading) return;

    // USUARIO AUTENTICADO
    if (session) {
      router.replace("/(tabs)/home");
      return;
    }

    // USUARIO NO AUTENTICADO
    router.replace("/(auth)/welcome");
  }, [loading, session, router]);

  // CARGANDO AUTENTICACIÓN
  if (loading) {
    return <AnimatedLogo />;
  }

  // NAVEGADOR
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(bienvenida)" />
    </Stack>
  );
}

// ROOT LAYOUT
export default function RootLayout() {
  const colorScheme = useColorScheme();

  // FUENTES
  const [loaded, error] = useFonts({
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
  });

  // ERROR DE FUENTES
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // OCULTAR SPLASH NATIVO
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Mientras cargan las fuentes mantenemos el SplashScreen nativo
  if (!loaded) {
    return null;
  }

  // APP
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}