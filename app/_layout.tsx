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

function RootNavigation() {
  const { loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.replace("/(entrevista)/bienvenida");
      return;
    }

    router.replace("/(auth)/welcome");
  }, [loading, session, router]);

  if (loading) {
    return <AnimatedLogo />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}