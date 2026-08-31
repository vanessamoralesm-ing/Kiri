import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Tarjeta informativa para mostrar un mito junto con su realidad.
export default function MitoRealidadCard() {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      className="overflow-hidden rounded-[22px] bg-white p-5 shadow-md"
    >
      {/* Apartado del mito con colores morados. */}
      <View className="rounded-[18px] bg-[#F3EEFF] p-4">
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons
              name="bulb-outline"
              size={22}
              color="#7C6EE6"
            />
          </View>

          <Text
            className="ml-3 text-[13px] uppercase tracking-wide text-[#7466D9]"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Mito
          </Text>
        </View>

        <Text
          className="mt-4 text-[17px] leading-6 text-slate-800"
          style={{
            fontFamily: "Nunito-SemiBold",
          }}
        >
          “Hablar de salud mental significa que algo está mal conmigo.”
        </Text>
      </View>

      {/* Apartado de la realidad con colores verdes. */}
      <View className="mt-4 rounded-[18px] bg-[#EAF8F4] p-4">
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color="#5BC4AD"
            />
          </View>

          <Text
            className="ml-3 text-[13px] uppercase tracking-wide text-[#49A994]"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Realidad
          </Text>
        </View>

        <Text
          className="mt-4 text-[14px] leading-6 text-slate-600"
          style={{
            fontFamily: "Nunito-Medium",
            textAlign: "justify",
          }}
        >
          Cuidar nuestra salud mental también forma parte del bienestar. Conocer
          nuestras emociones puede ayudarnos a comprender mejor lo que sentimos.
        </Text>
      </View>
    </Animated.View>
  );
}