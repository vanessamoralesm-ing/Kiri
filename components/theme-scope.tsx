import React from "react";
import { View, type ViewProps } from "react-native";
import { NativeWindTheme } from "@/constants/nativewind-theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";

/** Los portales de Modal también necesitan las variables CSS del tema en web. */
export function ThemeScope({ style, ...props }: ViewProps) {
  const { themeMode } = useThemeMode();
  return <View {...props} style={[NativeWindTheme[themeMode], style]} />;
}
