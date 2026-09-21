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

  ancho?: number;

  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OpcionEmocion({
  nombre,
  emoji,
  seleccionada,
  ancho,
  onPress,
}: OpcionEmocionProps) {
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

  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  const presionar = () => {
    escala.value = withSpring(0.96, {
      damping: 15,

      stiffness: 230,
    });

    setTimeout(() => {
      escala.value = withSpring(1, {
        damping: 15,

        stiffness: 230,
      });
    }, 80);

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
          width: ancho,

          minWidth: 110,

          minHeight: 118,

          paddingHorizontal: 10,

          paddingVertical: 14,

          borderRadius: 18,

          borderWidth: seleccionada ? 2 : 1.5,

          borderColor: seleccionada ? primaryColor : borderColor,

          backgroundColor: seleccionada ? primarySoftColor : surfaceColor,

          alignItems: "center",

          justifyContent: "center",

          overflow: "hidden",

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,

            height: 3,
          },

          shadowOpacity: seleccionada ? 0.12 : 0.06,

          shadowRadius: 7,

          elevation: 2,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 32,

          lineHeight: 38,

          textAlign: "center",
        }}
      >
        {emoji}
      </Text>

      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          marginTop: 8,

          width: "100%",

          textAlign: "center",

          fontFamily: seleccionada ? "Nunito-Bold" : "Nunito-Medium",

          fontSize: 13,

          lineHeight: 17,

          color: seleccionada ? primaryColor : textSecondaryColor,
        }}
      >
        {nombre}
      </Text>
    </AnimatedPressable>
  );
}
