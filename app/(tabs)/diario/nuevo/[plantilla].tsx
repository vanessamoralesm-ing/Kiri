import React from "react";

import { Pressable, Text, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { FormularioAutorregistroABC } from "@/components/diario/FormularioAutorregistroABC";

import { FormularioDiarioEmocional } from "@/components/diario/FormularioDiarioEmocional";

import { PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function NuevoAutorregistro() {
  const router = useRouter();

  const { esTablet, esEscritorio } = useResponsiveLayout();

  const { plantilla, origen } = useLocalSearchParams<{
    plantilla?: string;
    origen?: string;
  }>();

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const regresar = () => {
    router.replace({
      pathname: "/diario/nuevo" as never,
      params: {
        origen,
      },
    });
  };

  // ========================================================
  // SELECCIONAR FORMULARIO
  // ========================================================

  if (plantilla === "emocional") {
    return <FormularioDiarioEmocional origen={origen} />;
  }

  if (plantilla === "abc") {
    return <FormularioAutorregistroABC origen={origen} />;
  }

  // ========================================================
  // PLANTILLA NO DISPONIBLE
  // ========================================================

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primarySoftColor,
          marginBottom: 18,
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={30}
          color={primaryColor}
        />
      </View>

      <Text
        style={{
          textAlign: "center",
          fontFamily: "Nunito-Bold",
          fontSize: 20,
          color: textColor,
        }}
      >
        Plantilla no disponible
      </Text>

      <Text
        style={{
          marginTop: 6,
          maxWidth: 420,
          textAlign: "center",
          fontFamily: "Nunito-Medium",
          fontSize: 14,
          lineHeight: 20,
          color: textSecondaryColor,
        }}
      >
        Esta plantilla todavía no está disponible.
      </Text>

      <Pressable
        onPress={regresar}
        style={({ pressed }) => ({
          marginTop: 22,
          minHeight: 44,
          paddingHorizontal: 18,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          backgroundColor: primaryColor,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Ionicons
          name="arrow-back"
          size={18}
          color={textOnPrimaryColor}
        />

        <Text
          style={{
            fontFamily: "Nunito-SemiBold",
            fontSize: 14,
            color: textOnPrimaryColor,
          }}
        >
          Volver a plantillas
        </Text>
      </Pressable>
    </View>
  );
}