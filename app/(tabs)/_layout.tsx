import React from "react";

import { View } from "react-native";

import { Tabs } from "expo-router";

import AppHeader from "@/components/layout/AppHeader";

import { SidebarDesktop } from "@/components/ui/SideBarDesktop";

import { BarraNavegacionCurva } from "@/components/ui/BarraNavegacionCurva";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// LAYOUT
// ==========================================================

export default function LayoutPestanas() {
  const { esEscritorio } = useResponsiveLayout();

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
        {/* SIDEBAR */}

        <SidebarDesktop />

        {/* CONTENIDO */}

        <View
          style={{
            flex: 1,

            minWidth: 0,

            backgroundColor,
          }}
        >
          {/* HEADER */}

          <AppHeader />

          {/* TABS */}

          <View
            style={{
              flex: 1,
            }}
          >
            <Tabs
              tabBar={() => null}
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
            </Tabs>
          </View>
        </View>
      </View>
    );
  }

  // ========================================================
  // MÓVIL / TABLET
  // ========================================================

  return (
    <View
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      <AppHeader />

      <View
        style={{
          flex: 1,
        }}
      >
        <Tabs
          tabBar={(props) => <BarraNavegacionCurva {...props} />}
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
        </Tabs>
      </View>
    </View>
  );
}
