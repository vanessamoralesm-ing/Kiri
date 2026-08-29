import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

interface TarjetaEntradaDiarioProps {
  fecha: string;
  titulo: string;
  contenido: string;
  emociones: string[];
  onPress?: () => void;
}

export default function TarjetaEntradaDiario({
  fecha,
  titulo,
  contenido,
  emociones,
  onPress,
}: TarjetaEntradaDiarioProps) {
  return (
    <Animated.View
      entering={
        FadeInDown
          .delay(200)
          .duration(450)
      }
    >
      <Pressable
        onPress={onPress}
        className="rounded-[24px] border border-[#EEF1F5] bg-white p-5 active:opacity-90"
        style={{
          elevation: 2,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        }}
      >
        {/* Fecha y opciones */}
        <View className="flex-row items-start justify-between">
          <View className="rounded-full bg-[#F3EDFF] px-3 py-1">
            <Text className="font-nunito-medium text-[12px] text-[#7C4DDE]">
              {fecha}
            </Text>
          </View>

          <Pressable
            hitSlop={8}
            className="h-8 w-8 items-center justify-center"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        </View>

        {/* titulo */}
        <Text className="mt-4 font-nunito-bold text-[19px] text-[#1E293B]">
          {titulo}
        </Text>

        {/* Contenido */}
        <Text
          className="mt-2 font-nunito-medium text-[14px] leading-[21px] text-[#64748B]"
          numberOfLines={3}
        >
          {contenido}
        </Text>

        {/* Emociones */}
        <View className="mt-4 flex-row flex-wrap gap-2">
          {emociones.map(
            (
              emocion,
              index
            ) => (
              <View
                key={`${emocion}-${index}`}
                className={
                  index === 0
                    ? "flex-row items-center rounded-full bg-[#E4F8EC] px-3 py-2"
                    : "flex-row items-center rounded-full bg-[#F1EAFF] px-3 py-2"
                }
              >
                <Ionicons
                  name={
                    index === 0
                      ? "leaf-outline"
                      : "sparkles-outline"
                  }
                  size={20}
                  color={
                    index === 0
                      ? "#16A965"
                      : "#7C4DDE"
                  }
                />

                <Text
                  className={
                    index === 0
                      ? "ml-1 font-nunito-semibold text-[12px] text-[#16A965]"
                      : "ml-1 font-nunito-semibold text-[12px] text-[#7C4DDE]"
                  }
                >
                  {emocion}
                </Text>
              </View>
            )
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}