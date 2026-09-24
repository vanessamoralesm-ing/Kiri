import React from "react";

import { Tabs } from "expo-router";

import { View } from "react-native";

import { useTheme } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";

import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";

import { BarraNavegacionCurva } from "@/components/ui/BarraNavegacionCurva";

import { SidebarDesktop } from "@/components/ui/SideBarDesktop";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// CONFIGURACIÓN DE PESTAÑAS
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
  const { esEscritorio } = useResponsiveLayout();

  const { dark: isDarkMode } = useTheme();

  const backgroundColor = useThemeColor({}, "background");

  // ========================================================
  // ESCRITORIO
  // ========================================================

  if (esEscritorio) {
    return (
      <View
        style={{
          flex: 1,

          flexDirection: "row",

          backgroundColor,
        }}
      >
        <SidebarDesktop />

        <View
          style={{
            flex: 1,

            minWidth: 0,

            backgroundColor,
          }}
        >
          <AppHeader />

          <View
            style={{
              flex: 1,

              minHeight: 0,
            }}
          >
            <Pestanas backgroundColor={backgroundColor} esEscritorio />
          </View>
        </View>
      </View>
    );
  }

  // ========================================================
  // TELÉFONO Y TABLET
  // ========================================================

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      {/* BARRA DE ESTADO */}

      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />

      {/* ENCABEZADO COMPARTIDO */}

      <AppHeader />

      {/* CONTENIDO Y NAVEGACIÓN INFERIOR */}

      <View
        style={{
          flex: 1,

          minHeight: 0,

          backgroundColor,
        }}
      >
        <Pestanas backgroundColor={backgroundColor} esEscritorio={false} />
      </View>
    </SafeAreaView>
  );
}
