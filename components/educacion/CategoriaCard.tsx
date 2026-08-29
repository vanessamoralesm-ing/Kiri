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

// Define los datos que necesita cada tarjeta de categoría.
type CategoriaCardProps = {
  titulo: string;
  imagen?: ImageSourcePropType;
  onPress: () => void;
};

export default function CategoriaCard({
  titulo,
  imagen,
  onPress,
}: CategoriaCardProps) {
  // Controla la escala de la tarjeta al presionarla.
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => {
    return {
      transform: [{ scale: escala.value }],
    };
  });

  return (
    <Animated.View
      style={estiloAnimado}
      className="w-full"
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value = withSpring(0.96);
        }}
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
        className="h-[145px] items-center justify-center rounded-2xl bg-white px-4 shadow-md"
      >
        {/* Espacio reservado para la imagen de cada categoría. */}
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          {imagen && (
            <Image
              source={imagen}
              className="h-16 w-16"
              resizeMode="contain"
            />
          )}
        </View>

        <Text
          className="text-center text-[15px] text-slate-700"
          style={{
            fontFamily: "Nunito-SemiBold",
          }}
        >
          {titulo}
        </Text>
      </Pressable>
    </Animated.View>
  );
}