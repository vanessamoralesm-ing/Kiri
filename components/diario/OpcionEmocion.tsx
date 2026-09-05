import React from "react";

import { Pressable, Text } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

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

  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ======================================================
  // ANIMACIÓN
  // ======================================================

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  const presionar = () => {
    escala.value = withSpring(0.95, {}, () => {
      escala.value = withSpring(1);
    });

    onPress();
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <AnimatedPressable
      onPress={presionar}
      style={[
        estiloAnimado,
        {
          width: "31%",
          paddingHorizontal: 8,
          paddingVertical: 16,
          borderRadius: 16,
          borderWidth: 2,
          alignItems: "center",
          borderColor: seleccionada ? primaryColor : borderColor,
          backgroundColor: seleccionada ? primarySoftColor : surfaceColor,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 30,
        }}
      >
        {emoji}
      </Text>

      <Text
        style={{
          marginTop: 8,
          textAlign: "center",
          fontFamily: seleccionada ? "Nunito-Bold" : "Nunito-Medium",
          fontSize: 14,
          color: seleccionada ? primaryColor : textSecondaryColor,
        }}
      >
        {nombre}
      </Text>
    </AnimatedPressable>
  );
}
