import "../global.css";

import React, { useEffect, useRef, useState } from "react";

import { ThemeProvider } from "@react-navigation/native";

import { useFonts } from "expo-font";

import { Stack, usePathname, useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";

import { KiriDarkTheme, KiriLightTheme } from "@/constants/theme";

import { AuthProvider, useAuth } from "@/services/authProvider";

import { ThemeModeProvider, useThemeMode } from "@/contexts/ThemeModeContext";

import { obtenerEstadoInicialEntrevista } from "@/services/entrevista/entrevistaService";

// Mantener visible el splash nativo hasta que
// las fuentes y la preferencia del tema estén listas.
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

      if (__DEV__) {
        console.log("[AUTH] Usuario:", session.user.id);

        console.log("[AUTH] Perfil:", profile);

        console.log("[AUTH] Rol:", rol);
      }

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
      } catch (error) {
        console.error("Error verificando entrevista inicial:", error);
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
  // SPLASH PERSONALIZADO
  // ========================================================

  if (!inicioListo) {
    return <AnimatedLogo />;
  }

  // ========================================================
  // STACK PRINCIPAL
  // ========================================================

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

      <Stack.Screen name="(tecnica)" />

      <Stack.Screen name="(superadmin)" />
    </Stack>
  );
}

// ==========================================================
// APLICACIÓN CON TEMA
// ==========================================================

function AppConTema() {
  const { isDarkMode } = useThemeMode();

  return (
    <ThemeProvider value={isDarkMode ? KiriDarkTheme : KiriLightTheme}>
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

  // Ocultar el splash nativo una vez recuperada
  // la preferencia del tema.
  useEffect(() => {
    if (isThemeReady) {
      void SplashScreen.hideAsync();
    }
  }, [isThemeReady]);

  // Evitar mostrar un tema incorrecto mientras
  // se recupera la preferencia guardada.
  if (!isThemeReady) {
    return null;
  }

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
  // PROVIDER DEL TEMA
  // ========================================================

  return (
    <ThemeModeProvider>
      <RootAppContent />
    </ThemeModeProvider>
  );
}
