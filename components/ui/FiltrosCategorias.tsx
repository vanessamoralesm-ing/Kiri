import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PROPIEDADES
// ==========================================================

// El componente recibe las opciones desde cada pantalla.
// De esta forma puede reutilizarse con diferentes datos.
type FiltrosCategoriasProps = {
  opciones: string[];
  seleccionada: string;
  onSeleccionar: (opcion: string) => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function FiltrosCategorias({
  opciones,
  seleccionada,
  onSeleccionar,
}: FiltrosCategoriasProps) {
  // ========================================================
  // RESPONSIVE
  // ========================================================

  const { esEscritorio } =
    useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceSecondaryColor =
    useThemeColor({}, "surfaceSecondary");

  const textSecondaryColor =
    useThemeColor({}, "textSecondary");

  const primaryColor =
    useThemeColor({}, "primary");

  const borderColor =
    useThemeColor({}, "border");

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: 4,
        paddingBottom: 8,
        paddingRight: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: esEscritorio
            ? 12
            : 9,
        }}
      >
        {opciones.map((item) => {
          const estaSeleccionada =
            seleccionada === item;

          return (
            <Pressable
              key={item}
              onPress={() =>
                onSeleccionar(item)
              }
              style={({ pressed }) => ({
                opacity: pressed
                  ? 0.78
                  : 1,
              })}
            >
              <View
                style={{
                  minHeight: esEscritorio
                    ? 44
                    : 40,

                  minWidth:
                    item === "Todas" ||
                    item === "Todos"
                      ? 78
                      : undefined,

                  paddingHorizontal:
                    esEscritorio
                      ? 20
                      : 17,

                  paddingVertical:
                    esEscritorio
                      ? 10
                      : 8,

                  borderRadius: 999,
                  borderWidth: 1,

                  borderColor:
                    estaSeleccionada
                      ? primaryColor
                      : borderColor,

                  backgroundColor:
                    estaSeleccionada
                      ? primaryColor
                      : surfaceSecondaryColor,

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily:
                      estaSeleccionada
                        ? "Nunito-Bold"
                        : "Nunito-SemiBold",

                    fontSize:
                      esEscritorio
                        ? 15
                        : 13,

                    color:
                      estaSeleccionada
                        ? "#FFFFFF"
                        : textSecondaryColor,
                  }}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}