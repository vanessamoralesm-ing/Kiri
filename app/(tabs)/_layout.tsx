import React from "react";
import { Tabs } from "expo-router";

import { BarraNavegacionCurva } from "../../components/ui/BarraNavegacionCurva";
import AppHeader from "@/components/layout/AppHeader";

export default function LayoutPestanas() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacionCurva {...props} />}
      screenOptions={{
        headerShown: true,

        header: () => <AppHeader />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Inicio" }}
      />

      <Tabs.Screen
        name="diario/index"
        options={{ title: "Diario" }}
      />

      <Tabs.Screen
        name="educacion/index"
        options={{ title: "Educación" }}
      />

      <Tabs.Screen
        name="tecnicas/index"
        options={{ title: "Técnicas" }}
      />

      <Tabs.Screen
        name="perfil/index"
        options={{ title: "Perfil" }}
      />
    </Tabs>
  );
}