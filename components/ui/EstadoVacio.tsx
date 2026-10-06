import { Ionicons } from "@expo/vector-icons";

import React from "react";

import {
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PROPIEDADES
// ==========================================================

// Cada pantalla puede personalizar el mensaje y el icono
// sin modificar el diseño general del estado vacío.
type EstadoVacioProps = {
  titulo: string;
  descripcion: string;
  icono?: keyof typeof Ionicons.glyphMap;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EstadoVacio({
  titulo,
  descripcion,
  icono = "search-outline",
}: EstadoVacioProps) {
  // ========================================================
  // RESPONSIVE
  // ========================================================

  const { esEscritorio } =
    useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor({}, "surface");

  const textColor =
    useThemeColor({}, "text");

  const textSecondaryColor =
    useThemeColor({}, "textSecondary");

  const primaryColor =
    useThemeColor({}, "primary");

  const primarySoftColor =
    useThemeColor({}, "primarySoft");

  const borderColor =
    useThemeColor({}, "border");

  // ========================================================
  // UI
  // ========================================================

  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={{
        width: "100%",

        maxWidth:
          esEscritorio
            ? 620
            : undefined,

        alignSelf: "center",
        alignItems: "center",

        marginTop:
          esEscritorio
            ? 12
            : 16,

        paddingHorizontal:
          esEscritorio
            ? 40
            : 24,

        paddingVertical:
          esEscritorio
            ? 38
            : 34,

        borderRadius: 22,
        borderWidth: 1,
        borderColor,

        backgroundColor:
          surfaceColor,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,

          alignItems: "center",
          justifyContent: "center",

          backgroundColor:
            primarySoftColor,
        }}
      >
        <Ionicons
          name={icono}
          size={28}
          color={primaryColor}
        />
      </View>

      <Text
        className="font-nunito-bold"
        style={{
          marginTop: 16,

          textAlign: "center",

          fontSize:
            esEscritorio
              ? 18
              : 17,

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      <Text
        className="font-nunito-medium"
        style={{
          maxWidth: 420,
          marginTop: 8,

          textAlign: "center",

          fontSize:
            esEscritorio
              ? 14
              : 13,

          lineHeight:
            esEscritorio
              ? 21
              : 20,

          color:
            textSecondaryColor,
        }}
      >
        {descripcion}
      </Text>
    </Animated.View>
  );
}