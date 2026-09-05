import "../global.css";

import React, { useEffect, useRef } from "react";

import { ThemeProvider } from "@react-navigation/native";

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

SplashScreen.preventAutoHideAsync();

// ==========================================================
// NAVEGACIÓN PRINCIPAL
// ==========================================================

function RootNavigation() {
  const { loading, session, profile } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const [splashTerminado, setSplashTerminado] = React.useState(false);

  const [inicioListo, setInicioListo] = React.useState(false);

  const verificacionInicialRef = useRef(false);

  // ======================================================
  // SPLASH
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashTerminado(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // ======================================================
  // FINALIZAR ARRANQUE
  // ======================================================

  useEffect(() => {
    if (inicioListo) {
      return;
    }

    if (!splashTerminado || loading) {
      return;
    }

    setInicioListo(true);
  }, [splashTerminado, loading, inicioListo]);

  // ======================================================
  // RESETEAR VERIFICACIÓN SI CAMBIA EL USUARIO
  // ======================================================

  useEffect(() => {
    verificacionInicialRef.current = false;
  }, [session?.user.id]);

  // ======================================================
  // AUTENTICACIÓN, ROL Y ENTREVISTA INICIAL
  // ======================================================

  useEffect(() => {
    if (!inicioListo) {
      return;
    }

    // ==============================================
    // EVITAR REPETIR LA REDIRECCIÓN INICIAL
    // ==============================================

    if (verificacionInicialRef.current) {
      return;
    }

    // ==============================================
    // 1. USUARIO NO AUTENTICADO
    // ==============================================

    if (!session) {
      verificacionInicialRef.current = true;

      router.replace("/(auth)/welcome");

      return;
    }

    // ==============================================
    // 2. ESPERAR PERFIL
    // ==============================================

    //
    // Si existe sesión pero profile todavía no se ha
    // cargado, no hacemos ninguna redirección.
    //
    // El efecto volverá a ejecutarse cuando profile
    // esté disponible.
    //

    if (!profile) {
      return;
    }

    // ==============================================
    // 3. PERFIL LISTO
    // ==============================================

    verificacionInicialRef.current = true;

    let cancelado = false;

    const verificarRuta = async () => {
      const rol = profile.rol?.nombre ?? null;

      if (__DEV__) {
        console.log("[AUTH] Usuario:", session.user.id);

        console.log("[AUTH] Perfil:", profile);

        console.log("[AUTH] Rol:", rol);
      }

      // ======================================
      // 4. SUPERADMINISTRADOR
      // ======================================

      if (rol === "superadministrador") {
        const estaEnSuperAdmin =
          pathname === "/superadmin" || pathname.startsWith("/superadmin/");

        if (!estaEnSuperAdmin) {
          router.replace("/superadmin" as never);
        }

        return;
      }

      // ======================================
      // 5. USUARIO NORMAL
      // ======================================

      try {
        const estado = await obtenerEstadoInicialEntrevista();

        if (cancelado) {
          return;
        }

        // ==================================
        // ENTREVISTA COMPLETADA
        // ==================================

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

        // ==================================
        // SIN ENTREVISTA / EN PROGRESO
        // ==================================

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

    verificarRuta();

    return () => {
      cancelado = true;
    };
  }, [inicioListo, session, profile, pathname, router]);

  // ======================================================
  // PROTEGER RUTAS DEL SUPERADMINISTRADOR
  // ======================================================

  useEffect(() => {
    if (!inicioListo) {
      return;
    }

    if (!session) {
      return;
    }

    if (!profile) {
      return;
    }

    const estaEnSuperAdmin =
      pathname === "/superadmin" || pathname.startsWith("/superadmin/");

    if (!estaEnSuperAdmin) {
      return;
    }

    const rol = profile.rol?.nombre ?? null;

    // ==============================================
    // SUPERADMIN AUTORIZADO
    // ==============================================

    if (rol === "superadministrador") {
      return;
    }

    // ==============================================
    // OTRO ROL NO PUEDE ENTRAR
    // ==============================================

    router.replace("/(tabs)/home");
  }, [inicioListo, session, profile, pathname, router]);

  // ======================================================
  // SPLASH PERSONALIZADO
  // ======================================================

  if (!inicioListo) {
    return <AnimatedLogo />;
  }

  // ======================================================
  // STACK PRINCIPAL
  // ======================================================

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
// ROOT LAYOUT
// ==========================================================

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),

    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),

    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
  });

  // ======================================================
  // ERROR AL CARGAR FUENTES
  // ======================================================

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  // ======================================================
  // OCULTAR SPLASH NATIVO
  // ======================================================

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // ======================================================
  // ESPERAR FUENTES
  // ======================================================

  if (!loaded) {
    return null;
  }

  // ======================================================
  // PROVIDERS
  // ======================================================

  return (
    <ThemeModeProvider>
      <AppConTema />
    </ThemeModeProvider>
  );
}
