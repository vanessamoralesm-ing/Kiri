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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface TarjetaPlantillaAutorregistroProps {
  titulo: string;
  descripcion: string;
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  fondoIcono: string;
  onPress: () => void;
}

export default function TarjetaPlantillaAutorregistro({
  titulo,
  descripcion,
  icono,
  color,
  fondoIcono,
  onPress,
}: TarjetaPlantillaAutorregistroProps) {
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  return (
    <Animated.View
      style={estiloAnimado}
      className="mb-4"
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value = withSpring(0.98);
        }}
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
        className="
          flex-row
          items-center
          rounded-[22px]
          border
          border-[#E8EDF3]
          bg-white
          p-4
        "
        style={{
          elevation: 2,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        }}
      >
        {/* Icono de la plantilla */}
        <View
          className="
            h-[58px]
            w-[58px]
            items-center
            justify-center
            rounded-2xl
          "
          style={{
            backgroundColor: fondoIcono,
          }}
        >
          <Ionicons
            name={icono}
            size={29}
            color={color}
          />
        </View>

        {/* Información */}
        <View className="ml-4 flex-1">
          <Text
            className="
              font-nunito-semibold
              text-[16px]
              text-[#1E293B]
            "
          >
            {titulo}
          </Text>

          <Text
            className="
              mt-1
              font-nunito-medium
              text-[13px]
              leading-[18px]
              text-[#64748B]
            "
          >
            {descripcion}
          </Text>
        </View>

        {/* Flecha */}
        <View
          className="
            ml-2
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#F1F5F9]
          "
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#64748B"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}