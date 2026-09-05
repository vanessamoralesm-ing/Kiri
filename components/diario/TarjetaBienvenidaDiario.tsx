import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

interface TarjetaBienvenidaDiarioProps {
  nombre: string;
  onNuevoRegistro: () => void;
}

export default function TarjetaBienvenidaDiario({
  nombre,
  onNuevoRegistro,
}: TarjetaBienvenidaDiarioProps) {
  // ======================================================
  // TEMA
  // ======================================================

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

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
    <Animated.View entering={FadeInDown.duration(450)}>
      {/* ==================================================
                SALUDO
            ================================================== */}

      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: 28,
            color: textColor,
          }}
        >
          Hola,{" "}
          <Text
            style={{
              color: primaryColor,
            }}
          >
            {nombre}
          </Text>
        </Text>

        <Text
          style={{
            marginTop: 12,
            maxWidth: "92%",
            fontFamily: "Nunito-Medium",
            fontSize: 15,
            lineHeight: 22,
            color: textSecondaryColor,
          }}
        >
          ¿Cómo te sientes hoy? Tómate un momento para reconocer tus emociones,
          pensamientos y experiencias.
        </Text>
      </View>

      {/* ==================================================
                NUEVO REGISTRO
            ================================================== */}

      <Animated.View style={estiloAnimado}>
        <Pressable
          onPress={onNuevoRegistro}
          onPressIn={() => {
            escala.value = withSpring(0.85);
          }}
          onPressOut={() => {
            escala.value = withSpring(1);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderRadius: 24,
            backgroundColor: primaryColor,

            elevation: 5,

            shadowColor: primaryColor,
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          {/* ==========================================
                        ICONO
                    ========================================== */}

          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: textOnPrimaryColor,
            }}
          >
            <Ionicons name="create-outline" size={31} color={primaryColor} />
          </View>

          {/* ==========================================
                        TEXTO
                    ========================================== */}

          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 19,
                color: textOnPrimaryColor,
              }}
            >
              Nuevo Registro
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontFamily: "Nunito-Medium",
                fontSize: 14,
                lineHeight: 20,
                color: primarySoftColor,
              }}
            >
              Registra cómo te sientes y lo que pasó hoy.
            </Text>
          </View>

          {/* ==========================================
                        FLECHA
                    ========================================== */}

          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: textOnPrimaryColor,
            }}
          >
            <Ionicons name="arrow-forward" size={27} color={primaryColor} />
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
