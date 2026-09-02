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
  AuthProvider,
  useAuth,
} from "@/services/authProvider";

import {
  KiriDarkTheme,
  KiriLightTheme,
} from "@/constants/theme";

import {
  ThemeModeProvider,
  useThemeMode,
} from "@/contexts/ThemeModeContext";


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
    React.useState(
      false
    );


  const [
    inicioListo,
    setInicioListo,
  ] =
    React.useState(
      false
    );


  // ========================================================
  // SPLASH
  // ========================================================

  useEffect(
    () => {

      const timer =
        setTimeout(
          () => {

            setSplashTerminado(
              true
            );

          },
          3000
        );


      return () =>
        clearTimeout(
          timer
        );

    },
    []
  );


  // ========================================================
  // FINALIZAR ARRANQUE
  // ========================================================

  useEffect(
    () => {

      if (
        inicioListo
      ) {
        return;
      }


      if (
        !splashTerminado ||
        loading
      ) {
        return;
      }


      setInicioListo(
        true
      );

    },
    [
      splashTerminado,
      loading,
      inicioListo,
    ]
  );


  // ========================================================
  // AUTENTICACIÓN
  // ========================================================

  useEffect(
    () => {

      if (
        !inicioListo
      ) {
        return;
      }


      if (
        session
      ) {

        router.replace(
          "/(tabs)/home"
        );

        return;

      }


      router.replace(
        "/(auth)/welcome"
      );

    },
    [
      inicioListo,
      !!session,
      router,
    ]
  );


  // ========================================================
  // SPLASH PERSONALIZADO
  // ========================================================

  if (
    !inicioListo
  ) {

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
// APLICACIÓN CON TEMA
// ==========================================================

function AppConTema() {

  const {
    isDarkMode,
  } =
    useThemeMode();


  return (

    <ThemeProvider
      value={
        isDarkMode
          ? KiriDarkTheme
          : KiriLightTheme
      }
    >

      <AuthProvider>

        <RootNavigation />

      </AuthProvider>


      <StatusBar
        style={
          isDarkMode
            ? "light"
            : "dark"
        }
      />

    </ThemeProvider>

  );

}


// ==========================================================
// ROOT LAYOUT
// ==========================================================

export default function RootLayout() {

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


  // ========================================================
  // ERROR AL CARGAR FUENTES
  // ========================================================

  useEffect(
    () => {

      if (
        error
      ) {

        throw error;

      }

    },
    [
      error,
    ]
  );


  // ========================================================
  // OCULTAR SPLASH NATIVO
  // ========================================================

  useEffect(
    () => {

      if (
        loaded
      ) {

        SplashScreen
          .hideAsync();

      }

    },
    [
      loaded,
    ]
  );


  // ========================================================
  // ESPERAR FUENTES
  // ========================================================

  if (
    !loaded
  ) {

    return null;

  }


  // ========================================================
  // PROVIDERS
  // ========================================================

  return (

    <ThemeModeProvider>

      <AppConTema />

    </ThemeModeProvider>

  );

}