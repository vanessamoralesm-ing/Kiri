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

  // ========================================================
  // TAMAÑO
  // ========================================================

  const tamanio = esEscritorio ? 64 : esTablet ? 62 : 58;

  // ========================================================
  // ACCIÓN
  // ========================================================

  const crearPublicacion = () => {
    router.push("/(tabs)/foro/crear" as never);
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <Pressable
      onPress={crearPublicacion}
      accessibilityRole="button"
      accessibilityLabel="Crear nueva publicación"
      accessibilityHint="Abre la pantalla para crear una nueva publicación en el foro"
      hitSlop={12}
      style={({ pressed }) => [
        styles.fab,
        {
          width: tamanio,
          height: tamanio,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* ==================================================
          CÍRCULO
      ================================================== */}

      <View
        style={[
          styles.fabCircle,
          {
            width: tamanio,
            height: tamanio,
            borderRadius: tamanio / 2,
            backgroundColor: primaryColor,
          },
        ]}
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
}

function Pestanas({ backgroundColor, esEscritorio }: PestanasProps) {
  return (
    <Tabs
      tabBar={
        esEscritorio
          ? () => null
          : (props) => <BarraNavegacionCurva {...props} />
      }
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor,
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
  // DETECCIÓN DEL FORO
  // ========================================================

  /*
   * TEMPORALMENTE TRUE.
   *
   * Cuando confirmemos que el FAB está perfectamente
   * colocado, cambia esto por la condición de abajo.
   */

const estamosEnForoPrincipal =  pathname === "/foro" || pathname === "/foro/";

  // ========================================================
  // ESPACIO DEL FAB
  // ========================================================

  /*
   * Distancia desde el borde derecho.
   */

  const fabPaddingRight = esEscritorio ? 32 : esTablet ? 28 : 20;

  /*
   * Distancia desde la parte inferior.
   *
   * La barra curva mide aproximadamente 75 px.
   *
   * Dejamos además una separación para que el FAB
   * quede flotando sobre ella.
   */

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

          <View style={styles.desktopMain}>
            <Pestanas backgroundColor={backgroundColor} esEscritorio={true} />
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
          CONTENIDO + TABS
      ================================================== */}

      <View style={styles.mobileMain}>
        <Pestanas backgroundColor={backgroundColor} esEscritorio={false} />
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
  },

  desktopContent: {
    flex: 1,

    minWidth: 0,

    position: "relative",

    overflow: "visible",
  },

  desktopMain: {
    flex: 1,

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

    position: "relative",

    overflow: "visible",
  },

  mobileMain: {
    flex: 1,

    minHeight: 0,

    overflow: "visible",
  },

  // ========================================================
  // CAPA DEL FAB
  // ========================================================

  mobileFabLayer: {
    position: "absolute",

    /*
     * LA CAPA OCUPA TODA LA PANTALLA
     */

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    /*
     * ESTO ES LO QUE COLOCA EL FAB:
     *
     * derecha + abajo
     */

    alignItems: "flex-end",
    justifyContent: "flex-end",

    zIndex: 99999,
    elevation: 99999,

    overflow: "visible",
  },

  // ========================================================
  // FAB
  // ========================================================

  fab: {
    /*
     * IMPORTANTE:
     *
     * YA NO usamos position absolute.
     *
     * La capa padre se encarga de posicionarlo.
     */

    alignItems: "center",

    justifyContent: "center",

    zIndex: 999999,

    elevation: 999999,

    overflow: "visible",
  },

  // ========================================================
  // CÍRCULO
  // ========================================================

  fabCircle: {
    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    zIndex: 999999,

    elevation: 999999,

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
  },
});
