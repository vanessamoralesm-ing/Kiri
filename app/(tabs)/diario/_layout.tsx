import React from "react";

import { Stack } from "expo-router";

export default function DiarioLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen name="nuevo" />

      <Stack.Screen name="[id]" />
      <Stack.Screen name="historial" />
    </Stack>
  );
}
