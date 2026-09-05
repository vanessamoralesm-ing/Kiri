import React, {
  useEffect,
} from "react";

import {
  Text,
  useWindowDimensions,
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
  const {
    width,
  } = useWindowDimensions();

  const esTelefonoPequeno =
    width < 390;

  const movimientoLlama =
    useSharedValue(0);

  const rotacionLlama =
    useSharedValue(0);

  useEffect(() => {
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

  const estiloLlama =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY:
            movimientoLlama.value,
        },

        {
          rotate:
            `${rotacionLlama.value}deg`,
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
      style={{
        flexDirection: "row",
        width: "100%",
        gap: 12,
        marginTop: 20,
      }}
    >
      {/* Racha */}
      <View
        style={{
          flex: 1,
          minWidth: 0,
        }}
        className="
          overflow-hidden
          rounded-[22px]
          border
          border-[#FFD59A]
          bg-[#FFF4E5]
          p-4
        "
      >
        <View className="flex-row items-center">
          <View
            style={{
              width:
                esTelefonoPequeno
                  ? 44
                  : 48,

              height:
                esTelefonoPequeno
                  ? 44
                  : 48,
            }}
            className="
              items-center
              justify-center
              rounded-full
              bg-[#FFE1B3]
            "
          >
            <Animated.View
              style={estiloLlama}
            >
              <Ionicons
                name="flame"
                size={
                  esTelefonoPequeno
                    ? 31
                    : 35
                }
                color="#F59E0B"
              />
            </Animated.View>
          </View>

          <Text
            numberOfLines={1}
            className="
              ml-3
              flex-1
              font-nunito-bold
              text-[#475569]
            "
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 17
                  : 20,
            }}
          >
            Racha
          </Text>
        </View>

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

      {/* Entradas */}
      <View
        style={{
          flex: 1,
          minWidth: 0,
        }}
        className="
          overflow-hidden
          rounded-[22px]
          border
          border-[#E5DCFF]
          bg-[#F3EDFF]
          p-4
        "
      >
        <View className="flex-row items-center">
          <View
            style={{
              width:
                esTelefonoPequeno
                  ? 44
                  : 48,

              height:
                esTelefonoPequeno
                  ? 44
                  : 48,
            }}
            className="
              items-center
              justify-center
              rounded-full
              bg-[#E8DDFF]
            "
          >
            <Ionicons
              name="book-outline"
              size={
                esTelefonoPequeno
                  ? 27
                  : 30
              }
              color="#4F8EF7"
            />
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            className="
              ml-3
              flex-1
              font-nunito-bold
              text-[#475569]
            "
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 17
                  : 20,
            }}
          >
            Entradas
          </Text>
        </View>

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

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          className="
            mt-1
            font-nunito-medium
            text-[13px]
            text-[#64748B]
          "
        >
          Registros guardados
        </Text>

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