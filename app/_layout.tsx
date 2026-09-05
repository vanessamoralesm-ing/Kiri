import "../global.css";
import React, { useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { AuthProvider, useAuth } from "@/services/authProvider";
import { KiriDarkTheme, KiriLightTheme } from "@/constants/theme";
import { ThemeModeProvider, useThemeMode } from "@/contexts/ThemeModeContext";
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

  // ======================================================
  // SPLASH
  // ======================================================
  useEffect(() => {
    const timer = setTimeout(() => setSplashTerminado(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ======================================================
  // FINALIZAR ARRANQUE
  // ======================================================
  useEffect(() => {
    if (inicioListo) return;
    if (!splashTerminado || loading) return;

    setInicioListo(true);
  }, [splashTerminado, loading, inicioListo]);

  // ======================================================
  // AUTENTICACIÓN, ROL Y ENTREVISTA INICIAL
  // ======================================================
  useEffect(() => {
    if (!inicioListo) {
        return;
    }

    let cancelado = false;

    const verificarRuta = async () => {
        if (!session) {
            router.replace("/(auth)/welcome");
            return;
        }

        try {
            const estado = await obtenerEstadoInicialEntrevista();

            if (cancelado) {
                return;
            }

            if (estado.situacion === "completada") {
                router.replace("/(tabs)/home");
                return;
            }

            if (estado.situacion === "sin_entrevista") {
                router.replace("/(entrevista)/bienvenida");
                return;
            }

            if (estado.situacion === "en_progreso") {
                router.replace("/(entrevista)/bienvenida");
                return;
            }
        } catch (error) {
            console.error(
                "Error verificando entrevista inicial:",
                error
            );
        }
    };

    verificarRuta();

    return () => {
        cancelado = true;
    };
}, [
    inicioListo,
    session?.user.id,
    router,
]);
  
  */


  useEffect(() => {
    if (!inicioListo) {
      return;
    }

    // ==================================================
    // SUPERADMIN
    // ==================================================
    //
    // Por ahora permitimos entrar directamente al
    // módulo de superadministrador para trabajar
    // únicamente en sus vistas.
    //
    // Más adelante aquí agregaremos la validación:
    //
    // profile?.rol?.nombre === "superadministrador"
    //
    // ==================================================

    if (pathname === "/superadmin" || pathname.startsWith("/superadmin/")) {
      return;
    }

    let cancelado = false;

    const verificarRuta = async () => {
      // ==============================================
      // USUARIO NO AUTENTICADO
      // ==============================================

      if (!session) {
        router.replace("/(auth)/welcome");
        return;
      }

      // ==============================================
      // USUARIO AUTENTICADO
      // ==============================================

      try {
        const estado = await obtenerEstadoInicialEntrevista();

        if (cancelado) {
          return;
        }

        // ==========================================
        // ENTREVISTA COMPLETADA
        // ==========================================

        if (estado.situacion === "completada") {
          router.replace("/(tabs)/home");

          return;
        }

        // ==========================================
        // SIN ENTREVISTA
        // ==========================================

        if (estado.situacion === "sin_entrevista") {
          router.replace("/(entrevista)/bienvenida");

          return;
        }

        // ==========================================
        // ENTREVISTA EN PROGRESO
        // ==========================================

        if (estado.situacion === "en_progreso") {
          router.replace("/(entrevista)/bienvenida");

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
  }, [inicioListo, session?.user.id, pathname, router]);

  // ======================================================
  // SPLASH PERSONALIZADO
  // ======================================================
  if (!inicioListo) return <AnimatedLogo />;

  // ======================================================
  // STACK PRINCIPAL
  // ======================================================
  return (
    <Stack screenOptions={{ headerShown: false }}>
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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeModeProvider>
      <AppConTema />
    </ThemeModeProvider>
  );
}