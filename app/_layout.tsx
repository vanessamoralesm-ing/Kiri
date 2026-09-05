import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

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
    if (!inicioListo) return;

    let cancelado = false;

    const verificarRuta = async () => {
      // ==============================================
      // 1. USUARIO NO AUTENTICADO
      // ==============================================
      if (!session) {
        router.replace("/(auth)/welcome");
        return;
      }
      // ==============================================
      // 2. ESPERAR PERFIL DE PUBLIC.USUARIO
      // ==============================================
      // El AuthProvider obtiene: auth.users -> public.usuario -> public.rol
      // Por eso no necesitamos consultar nuevamente la base de datos.
      if (!profile) return;

      // ==============================================
      // 3. OBTENER ROL
      // ==============================================
      const rol = profile.rol?.nombre ?? null;
      if (__DEV__) {
        console.log("[AUTH] Usuario:", session.user.id);
        console.log("[AUTH] Rol:", rol);
      }

      // ==============================================
      // 4. SUPERADMINISTRADOR
      // ==============================================
      if (rol === "superadministrador") {
        router.replace("/(superadmin)/superadmin" as any);
        return;
      }

      // ==============================================
      // 5. USUARIO NORMAL
      // ==============================================
      try {
        const estado = await obtenerEstadoInicialEntrevista();
        if (cancelado) return;

        // ENTREVISTA COMPLETADA
        if (estado.situacion === "completada") {
          router.replace("/(tabs)/home");
          return;
        }

        // SIN ENTREVISTA / EN PROGRESO
        if (estado.situacion === "sin_entrevista" || estado.situacion === "en_progreso") {
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
  }, [inicioListo, session?.user.id, profile?.rol?.nombre, router]);

  // ======================================================
  // PROTEGER RUTAS DEL SUPERADMINISTRADOR
  // ======================================================
  useEffect(() => {
    if (!inicioListo || !session || !profile) return;

    const estaEnSuperAdmin = pathname === "/superadmin" || pathname.startsWith("/superadmin/");
    if (!estaEnSuperAdmin) return;

    const rol = profile.rol?.nombre ?? null;
    if (rol === "superadministrador") return;

    // OTRO ROL NO PUEDE ENTRAR
    router.replace("/(tabs)/home");
  }, [inicioListo, session, profile, pathname, router]);

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