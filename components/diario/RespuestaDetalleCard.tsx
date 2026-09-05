import React from "react";

import {
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

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
  return (
    <Animated.View
      entering={
        FadeInDown
          .delay(delay)
          .duration(450)
      }
      style={{
        width: "100%",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#E6EBF2",
        backgroundColor: "#FFFFFF",
        padding: 18,
        marginBottom: 16,
        shadowColor: "#64748B",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Bold",
          fontSize: 17,
          lineHeight: 23,
          color: "#2D3748",
        }}
      >
        {titulo}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: "#EEF2F7",
          marginVertical: 12,
        }}
      />

      <Text
        style={{
          fontFamily: "Nunito-Medium",
          fontSize: 15,
          lineHeight: 23,
          color: "#66758D",
        }}
      >
        {respuesta || "Sin respuesta"}
      </Text>
    </Animated.View>
  );
}