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
      {/* Saludo */}
      <View className="mb-5">
        <Text className="font-nunito-bold text-[28px] text-[#1E293B]">
          Hola,{" "}
          <Text className="text-[#3478F6]">
            {nombre}
          </Text>{" "}
        </Text>

        <Text className="mt-3 max-w-[92%] font-nunito-medium text-[15px] leading-[22px] text-[#64748B]">
          ¿Cómo te sientes hoy? Tómate un momento para reconocer
          tus emociones, pensamientos y experiencias.
        </Text>
      </View>

      {/* Boton Nuevo Registro */}
      <Animated.View
        style={estiloAnimado}
      >
        <Pressable
          onPress={onNuevoRegistro}
          onPressIn={() => {
            escala.value = withSpring(0.85);
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