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
        {/* Imagen de la categoría con mayor tamaño. */}
        <View className="mb-2 h-24 w-24 items-center justify-center ">
          {imagen && (
            <Image
              source={imagen}
              style={{
                width: 110,
                height: 100,
              }}
              resizeMode="cover"
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