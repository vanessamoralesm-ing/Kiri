import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type LecturaRecomendadaCardProps = {
  titulo: string;
  descripcion: string;
  categoria: string;
  tiempo: string;
  autor?: string;
  imagen?: ImageSourcePropType;
  onPress?: () => void;
};

export default function LecturaRecomendadaCard({
  titulo,
  descripcion,
  categoria,
  tiempo,
  autor = "Equipo Kiri",
  imagen,
  onPress,
}: LecturaRecomendadaCardProps) {
  // Controla la pequeña animación al presionar la lectura.
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <Animated.View
      style={estiloAnimado}
      className="mb-5 overflow-hidden rounded-[22px] bg-white shadow-md"
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value = withSpring(0.98);
        }}
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
      >
        {/* Espacio reservado para la imagen principal de la lectura. */}
        <View className="h-[155px] w-full items-center justify-center bg-gray-200">
          {imagen ? (
            <Image
              source={imagen}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="image-outline"
              size={35}
              color="#A8AFBC"
            />
          )}
        </View>

        <View className="p-5">
          <View className="flex-row items-center">
            <View className="rounded-full bg-blue-50 px-3 py-1">
              <Text
                className="text-[11px] uppercase text-blue-500"
                style={{
                  fontFamily: "Nunito-Bold",
                }}
              >
                {categoria}
              </Text>
            </View>

            <View className="ml-3 flex-row items-center">
              <Ionicons
                name="time-outline"
                size={14}
                color="#8B95A5"
              />

              <Text
                className="ml-1 text-[12px] text-slate-400"
                style={{
                  fontFamily: "Nunito-Medium",
                }}
              >
                {tiempo}
              </Text>
            </View>
          </View>

          <Text
            className="mt-3 text-[19px] leading-6 text-slate-800"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            {titulo}
          </Text>

          <Text
            numberOfLines={3}
            className="mt-2 text-[14px] leading-5 text-slate-500"
            style={{
              fontFamily: "Nunito-Medium",
            }}
          >
            {descripcion}
          </Text>

          <View className="mt-5 flex-row items-center justify-between">
            <Text
              className="text-[12px] text-slate-400"
              style={{
                fontFamily: "Nunito-Medium",
              }}
            >
              Por {autor}
            </Text>

            <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#4F8CFF"
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}