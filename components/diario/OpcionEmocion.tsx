import React from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface OpcionEmocionProps {
  nombre: string;
  emoji: string;
  seleccionada: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OpcionEmocion({
  nombre,
  emoji,
  seleccionada,
  onPress,
}: OpcionEmocionProps) {
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const presionar = () => {
    escala.value = withSpring(0.95, {}, () => {
      escala.value = withSpring(1);
    });

    onPress();
  };

  return (
    <AnimatedPressable
      onPress={presionar}
      style={estiloAnimado}
      className={`w-[31%] items-center rounded-2xl border-2 px-2 py-4 ${
        seleccionada
          ? "border-blue-400 bg-blue-50"
          : "border-gray-100 bg-white"
      }`}
    >
      <Text className="text-3xl">{emoji}</Text>

      <Text
        className={`mt-2 text-center text-sm ${
          seleccionada
            ? "font-nunito-bold text-blue-600"
            : "font-nunito-medium text-gray-600"
        }`}
      >
        {nombre}
      </Text>
    </AnimatedPressable>
  );
}