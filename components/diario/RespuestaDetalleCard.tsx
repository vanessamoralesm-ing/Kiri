import React from "react";

import { Text, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

type RespuestaDetalleCardProps = {
  titulo: string;
  respuesta: string;
  delay?: number;
};

export function RespuestaDetalleCard({
  titulo,
  respuesta,
  delay = 0,
}: RespuestaDetalleCardProps) {
  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(450)}
      style={{
        width: "100%",

        borderRadius: 22,

        borderWidth: 1,

        borderColor,

        backgroundColor: surfaceColor,

        padding: 18,

        marginBottom: 16,

        shadowColor: "#000000",

        shadowOffset: {
          width: 0,

          height: 3,
        },

        shadowOpacity: 0.06,

        shadowRadius: 8,

        elevation: 2,
      }}
    >
      {/* ==================================================
          TÍTULO
      ================================================== */}

      <Text
        style={{
          fontFamily: "Nunito-Bold",

          fontSize: 17,

          lineHeight: 23,

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      {/* ==================================================
          DIVISOR
      ================================================== */}

      <View
        style={{
          height: 1,

          backgroundColor: borderColor,

          marginVertical: 12,
        }}
      />

      {/* ==================================================
          RESPUESTA
      ================================================== */}

      <Text
        style={{
          fontFamily: "Nunito-Medium",

          fontSize: 15,

          lineHeight: 23,

          color: textSecondaryColor,
        }}
      >
        {respuesta || "Sin respuesta"}
      </Text>
    </Animated.View>
  );
}
