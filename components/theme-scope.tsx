import React from "react";
import { View, type ViewProps } from "react-native";

import { NativeWindTheme } from "@/constants/nativewind-theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { cn } from "@/utils/cn";

export default function ThemeScope({
  children,
  style,
  className,
  ...props
}: ViewProps) {
  const { isDarkMode } = useThemeMode();

  return (
    <View
      {...props}
      className={cn("flex-1 bg-background", className)}
      style={[isDarkMode ? NativeWindTheme.dark : NativeWindTheme.light, style]}
    >
      {children}
    </View>
  );
}