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

// Define los datos que recibirá cada tarjeta de categoría.
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
  // Guarda el tamaño de la tarjeta para realizar la animación al presionarla.
  const escala = useSharedValue(1);

  // Aplica el cambio de escala a la tarjeta.
  const estiloAnimado = useAnimatedStyle(() => {
    return {
      transform: [{ scale: escala.value }],
    };
  });

  return (
    // Ocupa todo el ancho que le proporciona el contenedor del index.
    <Animated.View
      style={estiloAnimado}
      className="w-full"
    >
      <Pressable
        onPress={onPress}
        // Reduce ligeramente la tarjeta mientras el usuario la presiona.
        onPressIn={() => {
          escala.value = withSpring(0.96);
        }}
        // Devuelve la tarjeta a su tamaño normal al dejar de presionarla.
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
        className="h-[145px] items-center justify-center rounded-2xl bg-white px-4 shadow-md"
      >
        {/* Espacio circular donde después colocaremos la imagen de la categoría. */}
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          {imagen && (
            <Image
              source={imagen}
              className="h-16 w-16"
              resizeMode="contain"
            />
          )}
        </View>

        {/* Nombre de la categoría. */}
        <Text className="text-center text-[15px] font-medium text-slate-700">
          {titulo}
        </Text>
      </Pressable>
    </Animated.View>
  );
}