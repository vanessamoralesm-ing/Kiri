import "../global.css";
import React, { useEffect, useRef, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/services/authProvider";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { loading, session } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const [splashTerminado, setSplashTerminado] = useState(false);
  const resolviendoRuta = useRef(false);
  const usuarioProcesado = useRef<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplashTerminado(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !splashTerminado) return;
    const grupoActual = segments[0];

    if (!session) {
      resolviendoRuta.current = false;
      usuarioProcesado.current = null;
      if (grupoActual !== "(auth)") router.replace("/(auth)/welcome");
      return;
    }

    if (grupoActual === "(tabs)" || grupoActual === "(entrevista)") return;

    const idUsuario = session.user.id;
    if (resolviendoRuta.current || usuarioProcesado.current === idUsuario) return;

    resolviendoRuta.current = true;
    let activo = true;

    async function resolverRutaInicial() {
      try {
        const { data, error } = await supabase
          .from("entrevista_realizada")
          .select("id_entrevista")
          .eq("id_usuario", idUsuario)
          .limit(1);

        if (error) throw error;
        if (!activo) return;

        usuarioProcesado.current = idUsuario;
        const yaTieneEntrevistas = (data?.length ?? 0) > 0;
        console.log("Usuario tiene entrevistas:", yaTieneEntrevistas);

        if (!yaTieneEntrevistas) {
          router.replace("/(entrevista)/bienvenida");
          return;
        }
        router.replace("/(tabs)/home");
      } catch (error) {
        console.error("Error resolviendo ruta inicial:", error);
        if (activo) router.replace("/(tabs)/home");
      } finally {
        resolviendoRuta.current = false;
      }
    }

    resolverRutaInicial();
    return () => { activo = false; };
  }, [loading, splashTerminado, session?.user.id, segments, router]);

  if (loading || !splashTerminado) return <AnimatedLogo />;

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
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}