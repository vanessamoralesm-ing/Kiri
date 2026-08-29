import React, {
  useEffect,
} from "react";

import {
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ResumenDiarioProps {
  diasRacha: number;
  totalEntradas: number;
}

export default function ResumenDiario({
  diasRacha,
  totalEntradas,
}: ResumenDiarioProps) {
  // Controla el movimiento vertical de la llama
  const movimientoLlama =
    useSharedValue(0);

  // Controla una pequeña inclinacion de la llama
  const rotacionLlama =
    useSharedValue(0);

  useEffect(() => {
    // La llama sube y baja suavemente
    movimientoLlama.value =
      withRepeat(
        withSequence(
          withTiming(-4, {
            duration: 700,
          }),

          withTiming(0, {
            duration: 700,
          })
        ),
        -1,
        true
      );

    // La llama se inclina ligeramente de un lado al otro
    rotacionLlama.value =
      withRepeat(
        withSequence(
          withTiming(-5, {
            duration: 600,
          }),

          withTiming(5, {
            duration: 600,
          }),

          withTiming(0, {
            duration: 600,
          })
        ),
        -1,
        true
      );
  }, [
    movimientoLlama,
    rotacionLlama,
  ]);

  // Estilo animado que recibe la llama
  const estiloLlama =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY:
            movimientoLlama.value,
        },

        {
          rotate: `${rotacionLlama.value}deg`,
        },
      ],
    }));

  return (
    <Animated.View
      entering={
        FadeInDown
          .delay(100)
          .duration(450)
      }
      className="
        mt-5
        flex-row
        gap-3
      "
    >
      {/* Apartado de la racha */}

      <View
        className="
          flex-1
          overflow-hidden
          rounded-[22px]
          border
          border-[#FFD59A]
          bg-[#FFF4E5]
          p-4
        "
      >
        {/* Icono y titulo */}
        <View
          className="
            flex-row
            items-center
          "
        >
          {/* modulo racha */}
          <View
            className="
              h-[48px]
              w-[48px]
              items-center
              justify-center
              rounded-full
              bg-[#FFE1B3]
            "
          >
            {/* Llama animada */}
            <Animated.View
              style={estiloLlama}
            >
              <Ionicons
                name="flame"
                size={35}
                color="#F59E0B"
              />
            </Animated.View>
          </View>

          <Text
            className="
              ml-3
              font-nunito-bold
              text-[20px]
              text-[#475569]
            "
          >
            Racha
          </Text>
        </View>

        {/* Cantidad de dias */}
        <Text
          className="
            mt-4
            font-nunito-bold
            text-[28px]
            text-[#F59E0B]
          "
        >
          {diasRacha} días
        </Text>

        {/* Mensaje */}
        <Text
          className="
            mt-1
            font-nunito-medium
            text-[13px]
            text-[#64748B]
          "
        >
          ¡Sigue así!
        </Text>

        {/* Decoracion de fondo */}
        <Ionicons
          name="flame-outline"
          size={65}
          color="#FFD89B"
          style={{
            position: "absolute",
            right: -8,
            bottom: -10,
            opacity: 0.45,
          }}
        />
      </View>

      {/*Entradas*/}

      <View
        className="
          flex-1
          overflow-hidden
          rounded-[22px]
          border
          border-[#E5DCFF]
          bg-[#F3EDFF]
          p-4
        "
      >
        {/* Icono y titulo */}
        <View
          className="
            flex-row
            items-center
          "
        >
          <View
            className="
              h-[48px]
              w-[48px]
              items-center
              justify-center
              rounded-full
              bg-[#E8DDFF]
            "
          >
            <Ionicons
              name="book-outline"
              size={30}
              color="#7C4DDE"
            />
          </View>

          <Text
            className="
              ml-3
              font-nunito-bold
              text-[20px]
              text-[#475569]
            "
          >
            Entradas
          </Text>
        </View>

        {/* Total de entradas */}
        <Text
          className="
            mt-4
            font-nunito-bold
            text-[28px]
            text-[#7C4DDE]
          "
        >
          {totalEntradas}
        </Text>

        {/* Descripcion */}
        <Text
          className="
            mt-1
            font-nunito-medium
            text-[13px]
            text-[#64748B]
          "
        >
          Registros guardados
        </Text>

        {/* Decoración */}
        <Ionicons
          name="sparkles-outline"
          size={55}
          color="#DDD0FF"
          style={{
            position: "absolute",
            right: -2,
            bottom: -5,
            opacity: 0.7,
          }}
        />
      </View>
    </Animated.View>
  );
}