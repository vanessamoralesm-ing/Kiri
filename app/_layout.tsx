import "../global.css";
import "../lib/nativewind-interop";
import "react-native-reanimated";

import React, { useEffect, useRef, useState } from "react";

import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import ThemeScope from "@/components/theme-scope";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { ButtonSizeContext } from "@/components/ui/Button";

import { KiriDarkTheme, KiriLightTheme } from "@/constants/theme";
import { ThemeModeProvider, useThemeMode } from "@/contexts/ThemeModeContext";
import { ModalProvider } from "@/contexts/ModalContext";

import { AuthProvider, useAuth } from "@/services/authProvider";
import { obtenerEstadoInicialEntrevista } from "@/services/entrevista/entrevistaService";

void SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { loading, session, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [splashTerminado, setSplashTerminado] = useState(false);
  const [inicioListo, setInicioListo] = useState(false);
  const verificacionInicialRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashTerminado(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!inicioListo && splashTerminado && !loading) setInicioListo(true);
  }, [splashTerminado, loading, inicioListo]);

  useEffect(() => {
    verificacionInicialRef.current = false;
  }, [session?.user.id]);

  useEffect(() => {
    if (!inicioListo || verificacionInicialRef.current) return;

    if (!session) {
      verificacionInicialRef.current = true;
      router.replace("/(auth)/welcome");
      return;
    }

    if (!profile) return;

    verificacionInicialRef.current = true;
    let cancelado = false;

    const verificarRuta = async () => {
      const rol = profile.rol?.nombre ?? null;

      if (rol === "superadministrador") {
        const estaEnSuperAdmin = pathname === "/superadmin" || pathname.startsWith("/superadmin/");

        if (!estaEnSuperAdmin) router.replace("/superadmin" as never);
        return;
      }

      try {
        const estado = await obtenerEstadoInicialEntrevista();
        if (cancelado) return;

        if (estado.situacion === "completada") {
          const estaEnTabs =
            pathname.startsWith("/home") ||
            pathname.startsWith("/diario") ||
            pathname.startsWith("/educacion") ||
            pathname.startsWith("/tecnicas") ||
            pathname.startsWith("/perfil") ||
            pathname.startsWith("/foro") ||
            pathname.startsWith("/cuestionarios");

          if (!estaEnTabs) router.replace("/(tabs)/home");
          return;
        }

        if (estado.situacion === "sin_entrevista" || estado.situacion === "en_progreso") {
          const estaEnEntrevista =
            pathname.startsWith("/bienvenida") || pathname.startsWith("/entrevista");

          if (!estaEnEntrevista) router.replace("/(entrevista)/bienvenida");
        }
      } catch {
        // La verificación inicial no debe romper la navegación.
      }
    };

    void verificarRuta();

    return () => {
      cancelado = true;
    };
  }, [inicioListo, session, profile, pathname, router]);

  useEffect(() => {
    if (!inicioListo || !session || !profile) return;

    const estaEnSuperAdmin = pathname === "/superadmin" || pathname.startsWith("/superadmin/");

    if (estaEnSuperAdmin && profile.rol?.nombre !== "superadministrador") {
      router.replace("/(tabs)/home");
    }
  }, [inicioListo, session, profile, pathname, router]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(entrevista)" />
        <Stack.Screen name="(tecnica)" />
        <Stack.Screen name="(superadmin)/superadmin" />
      </Stack>

      {!inicioListo && <AnimatedLogo />}
    </>
  );
}

function AppConTema() {
  const { isDarkMode } = useThemeMode();
  const pathname = usePathname();
  const esPanel = pathname === "/superadmin" || pathname.startsWith("/superadmin/");
  const navigationTheme = isDarkMode ? KiriDarkTheme : KiriLightTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <ThemeScope>
        <ButtonSizeContext.Provider value={esPanel ? "sm" : "md"}>
          <ModalProvider>
            <AuthProvider>
              <RootNavigation />
            </AuthProvider>
          </ModalProvider>

          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </ButtonSizeContext.Provider>
      </ThemeScope>
    </ThemeProvider>
  );
}

function RootAppContent() {
  const { isThemeReady } = useThemeMode();

  useEffect(() => {
    if (isThemeReady) void SplashScreen.hideAsync();
  }, [isThemeReady]);

  return <AppConTema />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <ThemeModeProvider>
      <RootAppContent />
    </ThemeModeProvider>
  );
}
