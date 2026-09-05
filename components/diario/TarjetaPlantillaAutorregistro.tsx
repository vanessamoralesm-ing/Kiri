import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

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
  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const iconColor = useThemeColor({}, "icon");

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

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      style={[
        estiloAnimado,
        {
          marginBottom: 16,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value = withSpring(0.98);
        }}
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderRadius: 22,
          borderWidth: 1,
          borderColor,
          backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

          elevation: 2,

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        })}
      >
        {/* ==================================================
                    ICONO
                ================================================== */}

        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: fondoIcono,
          }}
        >
          <Ionicons name={icono} size={29} color={color} />
        </View>

        {/* ==================================================
                    INFORMACIÓN
                ================================================== */}

        <View
          style={{
            flex: 1,
            marginLeft: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-SemiBold",
              fontSize: 16,
              color: textColor,
            }}
          >
            {titulo}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontFamily: "Nunito-Medium",
              fontSize: 13,
              lineHeight: 18,
              color: textSecondaryColor,
            }}
          >
            {descripcion}
          </Text>
        </View>

        {/* ==================================================
                    FLECHA
                ================================================== */}

        <View
          style={{
            width: 36,
            height: 36,
            marginLeft: 8,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: surfaceSecondaryColor,
          }}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
