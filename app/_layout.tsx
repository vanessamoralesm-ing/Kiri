import "../global.css";

import React, { useEffect, useRef, useState } from "react";

import { ThemeProvider } from "expo-router/react-navigation";

import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { KiriDarkTheme, KiriLightTheme } from "@/constants/theme";
import { ThemeModeProvider, useThemeMode } from "@/contexts/ThemeModeContext";
import { AuthProvider, useAuth } from "@/services/authProvider";
import { obtenerEstadoInicialEntrevista } from "@/services/entrevista/entrevistaService";

// ==========================================================
// SPLASH NATIVO
// ==========================================================
//
// Mantener visible el splash nativo de Expo mientras
// se cargan las fuentes y la preferencia del tema.
//

void SplashScreen.preventAutoHideAsync();

// ==========================================================
// NAVEGACIÓN PRINCIPAL
// ==========================================================

function RootNavigation() {
  const { loading, session, profile } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const [splashTerminado, setSplashTerminado] = useState(false);
  const [inicioListo, setInicioListo] = useState(false);

  const verificacionInicialRef = useRef(false);

  // ========================================================
  // SPLASH PERSONALIZADO
  // ========================================================
  //
  // El AnimatedLogo permanecerá visible durante 3 segundos.
  //

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashTerminado(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // ========================================================
  // FINALIZAR ARRANQUE
  // ========================================================

  useEffect(() => {
    if (inicioListo) {
      return;
    }

    if (!splashTerminado || loading) {
      return;
    }

    setInicioListo(true);
  }, [splashTerminado, loading, inicioListo]);

  // ========================================================
  // RESETEAR VERIFICACIÓN SI CAMBIA EL USUARIO
  // ========================================================

  useEffect(() => {
    verificacionInicialRef.current = false;
  }, [session?.user.id]);

  // ========================================================
  // AUTENTICACIÓN, ROL Y ENTREVISTA INICIAL
  // ========================================================

  useEffect(() => {
    if (!inicioListo) {
      return;
    }

    // Evitar repetir la redirección inicial.
    if (verificacionInicialRef.current) {
      return;
    }

    // ======================================================
    // 1. USUARIO NO AUTENTICADO
    // ======================================================

    if (!session) {
      verificacionInicialRef.current = true;

      router.replace("/(auth)/welcome");

      return;
    }

    // ======================================================
    // 2. ESPERAR PERFIL
    // ======================================================

    if (!profile) {
      return;
    }

    // ======================================================
    // 3. PERFIL LISTO
    // ======================================================

    verificacionInicialRef.current = true;

    let cancelado = false;

    const verificarRuta = async () => {
      const rol = profile.rol?.nombre ?? null;

      // ====================================================
      // 4. SUPERADMINISTRADOR
      // ====================================================

      if (rol === "superadministrador") {
        const estaEnSuperAdmin =
          pathname === "/superadmin" || pathname.startsWith("/superadmin/");

        if (!estaEnSuperAdmin) {
          router.replace("/superadmin" as never);
        }

        return;
      }

      // ====================================================
      // 5. USUARIO NORMAL
      // ====================================================

      try {
        const estado = await obtenerEstadoInicialEntrevista();

        if (cancelado) {
          return;
        }

        // ==================================================
        // ENTREVISTA COMPLETADA
        // ==================================================

        if (estado.situacion === "completada") {
          const estaEnTabs =
            pathname.startsWith("/home") ||
            pathname.startsWith("/diario") ||
            pathname.startsWith("/educacion") ||
            pathname.startsWith("/tecnicas") ||
            pathname.startsWith("/perfil") ||
            pathname.startsWith("/foro") ||
            pathname.startsWith("/cuestionarios");

          if (!estaEnTabs) {
            router.replace("/(tabs)/home");
          }

          return;
        }

        // ==================================================
        // SIN ENTREVISTA / EN PROGRESO
        // ==================================================

        if (
          estado.situacion === "sin_entrevista" ||
          estado.situacion === "en_progreso"
        ) {
          const estaEnEntrevista =
            pathname.startsWith("/bienvenida") ||
            pathname.startsWith("/entrevista");

          if (!estaEnEntrevista) {
            router.replace("/(entrevista)/bienvenida");
          }

          return;
        }
      } catch {
        // La verificación inicial no debe
        // romper el árbol de navegación.
      }
    };

    void verificarRuta();

    return () => {
      cancelado = true;
    };
  }, [inicioListo, session, profile, pathname, router]);

  // ========================================================
  // PROTEGER RUTAS DEL SUPERADMINISTRADOR
  // ========================================================

  useEffect(() => {
    if (!inicioListo) {
      return;
    }

    if (!session || !profile) {
      return;
    }

    const estaEnSuperAdmin =
      pathname === "/superadmin" || pathname.startsWith("/superadmin/");

    if (!estaEnSuperAdmin) {
      return;
    }

    const rol = profile.rol?.nombre ?? null;

    // Superadministrador autorizado.
    if (rol === "superadministrador") {
      return;
    }

    // Otros roles no pueden acceder.
    router.replace("/(tabs)/home");
  }, [inicioListo, session, profile, pathname, router]);

  // ========================================================
  // STACK PRINCIPAL
  // ========================================================
  //
  // IMPORTANTE:
  // El Stack se monta inmediatamente.
  //
  // Esto permite que Expo Router monte su árbol de
  // navegación desde el inicio y evita bloquear el
  // ContextNavigator mientras esperamos autenticación,
  // perfil y splash.
  //

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(entrevista)" />
        <Stack.Screen name="(tecnica)" />
        <Stack.Screen name="(superadmin)/superadmin" />
      </Stack>

      {/* Splash visual personalizado de Kiri */}
      {!inicioListo && <AnimatedLogo />}
    </>
  );
}

// ==========================================================
// APLICACIÓN CON TEMA
// ==========================================================

function AppConTema() {
  const { isDarkMode } = useThemeMode();

  const navigationTheme = isDarkMode ? KiriDarkTheme : KiriLightTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ThemeProvider>
  );
}

// ==========================================================
// CONTENIDO RAÍZ
// ==========================================================

function RootAppContent() {
  const { isThemeReady } = useThemeMode();

  // ========================================================
  // OCULTAR SPLASH NATIVO
  // ========================================================
  //
  // El splash nativo de Expo se mantiene hasta que
  // conocemos la preferencia de tema.
  //
  // Después se oculta y aparece el AnimatedLogo.
  //

  useEffect(() => {
    if (!isThemeReady) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [isThemeReady]);

  // ========================================================
  // IMPORTANTE
  // ========================================================
  //
  // NO bloquear el montaje de Expo Router mientras se
  // recupera la preferencia del tema.
  //
  // Esto permite que ContextNavigator se monte desde el
  // inicio y evita la condición de carrera de useLinking.
  //

  return <AppConTema />;
}

// ==========================================================
// ROOT LAYOUT
// ==========================================================

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
  });

  // ========================================================
  // ERROR AL CARGAR FUENTES
  // ========================================================

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  // ========================================================
  // ESPERAR FUENTES
  // ========================================================

  if (!loaded) {
    return null;
  }

  // ========================================================
  // PROVIDER DEL TEMA DE LA APLICACIÓN
  // ========================================================

  return (
    <ThemeModeProvider>
      <RootAppContent />
    </ThemeModeProvider>
  );
}
