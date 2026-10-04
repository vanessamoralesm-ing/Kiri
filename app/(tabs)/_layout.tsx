import React from "react";

import { Tabs, usePathname, useRouter } from "expo-router";

import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";

import { BarraNavegacionCurva } from "@/components/ui/BarraNavegacionCurva";

import { SidebarDesktop } from "@/components/ui/SideBarDesktop";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeMode } from "@/contexts/ThemeModeContext";

// ==========================================================
// FAB DEL FORO
// ==========================================================

function FabForo({ esEscritorio }: { esEscritorio: boolean }) {
  const router = useRouter();

  const { esTelefono, esTablet } = useResponsiveLayout();

  const primaryColor = useThemeColor({}, "primary");

  const tamanio = esEscritorio ? 64 : esTablet ? 62 : 58;

  const crearPublicacion = () => {
    router.push("/(tabs)/foro/crear" as never);
  };

  return (
    <Pressable
      onPress={crearPublicacion}
      accessibilityRole="button"
      accessibilityLabel="Crear nueva publicación"
      accessibilityHint="Abre la pantalla para crear una nueva publicación en el foro"
      hitSlop={12}
      style={({ pressed }) => ({
        width: tamanio,
        height: tamanio,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: tamanio,
          height: tamanio,
          borderRadius: tamanio / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primaryColor,

          ...Platform.select({
            ios: {
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },

            android: {
              elevation: 12,
            },

            web: {
              boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
            },
          }),
        }}
      >
        <Ionicons name="add" size={esTelefono ? 32 : 34} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

// ==========================================================
// TABS
// ==========================================================

interface PestanasProps {
  backgroundColor: string;
  esEscritorio: boolean;
  mostrarBarraMovil: boolean;
}

function Pestanas({
  backgroundColor,
  esEscritorio,
  mostrarBarraMovil,
}: PestanasProps) {
  return (
    <Tabs
      tabBar={
        esEscritorio
          ? () => null
          : mostrarBarraMovil
            ? (props) => <BarraNavegacionCurva {...props} />
            : () => null
      }
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor,
          flex: 1,
        },

        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,

          // IMPORTANTE:
          // En foro/crear y foro/[id] eliminamos completamente
          // el contenedor del tab bar.
          display: mostrarBarraMovil ? "flex" : "none",
        },
      }}
    >
      {/* ==================================================
          TABS PRINCIPALES
      ================================================== */}

      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
        }}
      />

      <Tabs.Screen
        name="diario"
        options={{
          title: "Diario",
        }}
      />

      <Tabs.Screen
        name="educacion/index"
        options={{
          title: "Educación",
        }}
      />

      <Tabs.Screen
        name="tecnicas"
        options={{
          title: "Técnicas",
        }}
      />

      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Perfil",
        }}
      />

      {/* ==================================================
          RUTAS SECUNDARIAS
      ================================================== */}

      <Tabs.Screen
        name="cuestionarios"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="foro"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="progreso"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

// ==========================================================
// LAYOUT PRINCIPAL
// ==========================================================

export default function LayoutPestanas() {
  const pathname = usePathname();

  const { esEscritorio, esTablet } = useResponsiveLayout();

  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");

  const { themeMode } = useThemeMode();

  // ========================================================
  // RUTAS
  // ========================================================

  const estamosEnForoPrincipal = pathname === "/foro" || pathname === "/foro/";

  const estamosEnForoSecundario =
    pathname.startsWith("/foro/") && !estamosEnForoPrincipal;

  /*
   * La barra curva solamente existe en las pantallas
   * principales.
   *
   * /foro
   * /home
   * /diario
   * /educacion
   * /tecnicas
   * /perfil
   *
   * NO existe en:
   *
   * /foro/crear
   * /foro/[id]
   */
  const mostrarBarraMovil = !estamosEnForoSecundario;

  // ========================================================
  // FAB
  // ========================================================

  const fabPaddingRight = esEscritorio ? 32 : esTablet ? 28 : 20;

  const fabPaddingBottom = esEscritorio
    ? 32
    : Math.max(insets.bottom + 92, 100);

  // ========================================================
  // DESKTOP
  // ========================================================

  if (esEscritorio) {
    return (
      <View
        style={[
          styles.desktopRoot,
          {
            backgroundColor,
          },
        ]}
      >
        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <SidebarDesktop />

        {/* ==================================================
            CONTENIDO
        ================================================== */}

        <View
          style={[
            styles.desktopContent,
            {
              backgroundColor,
            },
          ]}
        >
          <AppHeader />

          {/* ==================================================
              TABS
          ================================================== */}

          <View
            style={[
              styles.desktopMain,
              {
                backgroundColor,
              },
            ]}
          >
            <Pestanas
              backgroundColor={backgroundColor}
              esEscritorio={true}
              mostrarBarraMovil={false}
            />
          </View>

          {/* ==================================================
              FAB DESKTOP
          ================================================== */}

          {estamosEnForoPrincipal && (
            <View
              pointerEvents="box-none"
              style={[
                styles.desktopFabLayer,
                {
                  paddingRight: fabPaddingRight,
                  paddingBottom: fabPaddingBottom,
                },
              ]}
            >
              <FabForo esEscritorio={true} />
            </View>
          )}
        </View>
      </View>
    );
  }

  // ========================================================
  // MOBILE / TABLET
  // ========================================================

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.mobileRoot,
        {
          backgroundColor,
        },
      ]}
    >
      <StatusBar
        style={themeMode === "dark" ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />

      {/* ==================================================
          HEADER
      ================================================== */}

      <AppHeader />

      {/* ==================================================
          CONTENIDO
      ================================================== */}

      <View
        style={[
          styles.mobileMain,
          {
            backgroundColor,
          },
        ]}
      >
        <Pestanas
          backgroundColor={backgroundColor}
          esEscritorio={false}
          mostrarBarraMovil={mostrarBarraMovil}
        />
      </View>

      {/* ==================================================
          FAB
      ================================================== */}

      {estamosEnForoPrincipal && (
        <View
          pointerEvents="box-none"
          style={[
            styles.mobileFabLayer,
            {
              paddingRight: fabPaddingRight,
              paddingBottom: fabPaddingBottom,
            },
          ]}
        >
          <FabForo esEscritorio={false} />
        </View>
      )}
    </SafeAreaView>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  // ========================================================
  // DESKTOP
  // ========================================================

  desktopRoot: {
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
    minHeight: 0,
  },

  desktopContent: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    overflow: "visible",
  },

  desktopMain: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: "visible",
  },

  desktopFabLayer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "flex-end",
    justifyContent: "flex-end",

    zIndex: 99999,
    elevation: 99999,

    overflow: "visible",
  },

  // ========================================================
  // MOBILE
  // ========================================================

  mobileRoot: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,

    position: "relative",
    overflow: "visible",
  },

  mobileMain: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,

    overflow: "visible",
  },

  // ========================================================
  // FAB MOBILE
  // ========================================================

  mobileFabLayer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "flex-end",
    justifyContent: "flex-end",

    zIndex: 99999,
    elevation: 99999,

    overflow: "visible",
  },
});
