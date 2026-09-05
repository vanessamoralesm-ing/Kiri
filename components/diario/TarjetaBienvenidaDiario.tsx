import React from "react";

import {
  Image,
  Pressable,
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
  withSpring,
} from "react-native-reanimated";

interface TarjetaBienvenidaDiarioProps {
  nombre: string;
  onNuevoRegistro: () => void;
}

export default function TarjetaBienvenidaDiario({
  nombre,
  onNuevoRegistro,
}: TarjetaBienvenidaDiarioProps) {
  const {
    width,
  } = useWindowDimensions();

  const esTelefonoPequeno =
    width < 390;

  const esTelefono =
    width < 768;

  const esTablet =
    width >= 768 &&
    width < 1100;

  // Tamaño responsive del avatar.
  const tamanoAvatar =
    esTelefonoPequeno
      ? 135
      : esTelefono
        ? 160
        : esTablet
          ? 185
          : 200;

  // Controla el tamaño del boton cuando se presiona.
  const escala = useSharedValue(1);

  // Aplica la escala animada.
  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(450)}
    >
      {/* Bienvenida con avatar */}
      <View className="mb-5 flex-row items-center">
        {/* Texto */}
        <View
          className="flex-1"
          style={{
            paddingRight: esTelefonoPequeno
              ? 4
              : 10,
          }}
        >
          <Text
            className="font-nunito-bold leading-[32px] text-[#1E293B]"
            style={{
              fontSize: esTelefonoPequeno
                ? 22
                : 24,
              textAlign: "left",
            }}
          >
            ¿Qué agregarás hoy a tu{"\n"}
            Diario,{" "}
            <Text className="text-[#3478F6]">
              {nombre}
            </Text>
            ?
          </Text>
        </View>

        {/* Avatar */}
        <View
          style={{
            width: tamanoAvatar,
            height: tamanoAvatar,
            flexShrink: 0,
          }}
          className="items-center justify-center"
        >
          <Image
            source={require("@/assets/images_kids/avatar_pregunta.png")}
            style={{
              width: "100%",
              height: "100%",
              transform: [
                {
                  scale: 1.28,
                },
              ],
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Boton Nuevo Registro */}
      <Animated.View
        style={estiloAnimado}
      >
        <Pressable
          onPress={onNuevoRegistro}
          onPressIn={() => {
            escala.value = withSpring(0.95);
          }}
          onPressOut={() => {
            escala.value = withSpring(1);
          }}
          className="flex-row items-center rounded-[24px] bg-[#3478F6] px-5 py-5"
          style={{
            elevation: 5,
            shadowColor: "#4F8EF7",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          {/* Icono lapiz */}
          <View className="h-[64px] w-[64px] items-center justify-center rounded-full bg-white">
            <Ionicons
              name="create-outline"
              size={31}
              color="#4F8EF7"
            />
          </View>

          {/* Texto */}
          <View className="ml-4 flex-1">
            <Text className="font-nunito-bold text-[19px] text-white">
              Nuevo Registro
            </Text>

            <Text className="mt-1 font-nunito-medium text-[14px] leading-5 text-[#EAF2FF]">
              Registra cómo te sientes y lo que pasó hoy.
            </Text>
          </View>

          {/* Flecha */}
          <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-white">
            <Ionicons
              name="arrow-forward"
              size={27}
              color="#4F8EF7"
            />
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}