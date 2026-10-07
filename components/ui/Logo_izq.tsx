import React from "react";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import {
  Image,
  ImageStyle,
  StyleProp,
} from "react-native";

import { useThemeMode } from "@/contexts/ThemeModeContext";

// ==========================================================
// PROPS
// ==========================================================

interface LogoProps {
  ancho?: number;
  alto?: number;
  estilo?: StyleProp<ImageStyle>;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function Logo({
  ancho = 130,
  alto = 100,
  estilo,
}: LogoProps) {
  const { themeMode } = useThemeMode();

  // ========================================================
  // LOGO SEGÚN EL TEMA GLOBAL DE KIRI
  // ========================================================

  const logo =
    themeMode === "dark"
      ? require("../../assets/images/splash-icon-ps.png")
      : require("../../assets/images/splash-icon.png");

  return (
    <Image
      source={logo}
      style={[
        {
          width: ancho,
          height: alto,
        },
        estilo,
      ]}
      resizeMode="contain"
    />
  );
}
