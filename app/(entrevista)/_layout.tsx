import React from "react";
import { Stack } from "expo-router";

export default function EntrevistaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    />
  );
}   