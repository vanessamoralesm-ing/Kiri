import "../global.css";

import React, {
  useEffect,
} from "react";

import {
  ThemeProvider,
} from "@react-navigation/native";

import {
  Stack,
  useRouter,
} from "expo-router";

import {
  StatusBar,
} from "expo-status-bar";

import {
  useFonts,
} from "expo-font";

import * as SplashScreen from "expo-splash-screen";

import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";

import {
  useColorScheme,
} from "@/hooks/use-color-scheme";

import {
  AuthProvider,
  useAuth,
} from "@/services/authProvider";

import {
  KiriDarkTheme,
  KiriLightTheme,
} from "@/constants/theme";


SplashScreen.preventAutoHideAsync();


// ==========================================================
// NAVEGACIÓN PRINCIPAL
// ==========================================================

function RootNavigation() {

  const {
    loading,
    session,
  } =
    useAuth();


  const router =
    useRouter();


  const [
    splashTerminado,
    setSplashTerminado,
  ] =
    React.useState(false);


  const [
    inicioListo,
    setInicioListo,
  ] =
    React.useState(false);


  // ========================================================
  // SPLASH
  // ========================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setSplashTerminado(
          true
        );

      }, 3000);


    return () =>
      clearTimeout(timer);

  }, []);


  // ========================================================
  // FINALIZAR ARRANQUE
  // ========================================================

  useEffect(() => {

    if (inicioListo) {
      return;
    }


    if (
      !splashTerminado ||
      loading
    ) {
      return;
    }


    setInicioListo(true);

  }, [
    splashTerminado,
    loading,
    inicioListo,
  ]);


  // ========================================================
  // AUTENTICACIÓN
  // ========================================================

  useEffect(() => {

    if (!inicioListo) {
      return;
    }


    if (session) {

      router.replace(
        "/(tabs)/home"
      );

      return;
    }


    router.replace(
      "/(auth)/welcome"
    );

  }, [
    inicioListo,
    !!session,
    router,
  ]);


  // ========================================================
  // SPLASH PERSONALIZADO
  // ========================================================

  if (!inicioListo) {

    return (
      <AnimatedLogo />
    );
  }


  // ========================================================
  // STACK
  // ========================================================

  return (

    <Stack
      screenOptions={{
        headerShown:
          false,
      }}
    >

      <Stack.Screen
        name="index"
      />

      <Stack.Screen
        name="(auth)"
      />

      <Stack.Screen
        name="(tabs)"
      />

      <Stack.Screen
        name="(entrevista)"
      />

    </Stack>

  );
}


// ==========================================================
// ROOT LAYOUT
// ==========================================================

export default function RootLayout() {

  const colorScheme =
    useColorScheme();


  const esOscuro =
    colorScheme === "dark";


  const [
    loaded,
    error,
  ] =
    useFonts({

      "Nunito-Medium":
        require(
          "../assets/fonts/Nunito-Medium.ttf"
        ),

      "Nunito-SemiBold":
        require(
          "../assets/fonts/Nunito-SemiBold.ttf"
        ),

      "Nunito-Bold":
        require(
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

      SplashScreen
        .hideAsync();

    }

  }, [loaded]);


  if (!loaded) {
    return null;
  }


  return (

    <ThemeProvider
      value={
        esOscuro
          ? KiriDarkTheme
          : KiriLightTheme
      }
    >

      <AuthProvider>

        <RootNavigation />

      </AuthProvider>


      <StatusBar
        style={
          esOscuro
            ? "light"
            : "dark"
        }
      />

    </ThemeProvider>

  );
}