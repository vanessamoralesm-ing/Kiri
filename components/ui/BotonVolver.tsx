import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPIEDADES
// ==========================================================

// La acción del botón se recibe desde cada pantalla.
// De esta forma cada vista decide a dónde debe regresar.
type BotonVolverProps = {
  onPress: () => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function BotonVolver({
  onPress,
}: BotonVolverProps) {
  // ========================================================
  // ANIMACIÓN
  // ========================================================

  // Controla la escala del botón mientras se presiona.
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  // Color principal utilizado para mantener la flecha azul.
  const primaryColor =
    useThemeColor({}, "primary");

  // ========================================================
  // UI
  // ========================================================

  return (
    <Animated.View style={estiloAnimado}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value =
            withSpring(0.9);
        }}
        onPressOut={() => {
          escala.value =
            withSpring(1);
        }}
        hitSlop={10}
        className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
        style={({ pressed }) => ({
          opacity:
            pressed
              ? 0.72
              : 1,
        })}
      >
        <Ionicons
          name="chevron-back"
          size={27}
          color={primaryColor}
        />
      </Pressable>
    </Animated.View>
  );
}