import React from "react";

import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PROPS
// ==========================================================

type CategoriaCardProps = {
  titulo: string;

  imagen: ImageSourcePropType;

  onPress: () => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function CategoriaCard({
  titulo,
  imagen,
  onPress,
}: CategoriaCardProps) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const alturaImagen = esEscritorio ? 126 : esTablet ? 118 : 105;

  const anchoImagen = esEscritorio ? 126 : esTablet ? 118 : 105;

  const alturaTarjeta = esEscritorio ? 215 : esTablet ? 205 : 175;

  // ========================================================
  // UI
  // ========================================================

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "100%",

        minHeight: alturaTarjeta,

        borderRadius: esEscritorio ? 22 : 20,

        borderWidth: 1,

        borderColor: pressed ? primaryColor : borderColor,

        backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

        overflow: "hidden",

        padding: esEscritorio ? 18 : 16,

        justifyContent: "space-between",

        opacity: pressed ? 0.92 : 1,

        ...Platform.select({
          web: {
            cursor: "pointer",

            boxShadow: pressed
              ? "0px 5px 14px rgba(0,0,0,0.09)"
              : "0px 2px 8px rgba(0,0,0,0.04)",
          },

          ios: {
            shadowColor: "#000000",

            shadowOffset: {
              width: 0,

              height: 3,
            },

            shadowOpacity: pressed ? 0.1 : 0.05,

            shadowRadius: 7,
          },

          android: {
            elevation: pressed ? 4 : 2,
          },
        }),
      })}
    >
      {/* ==================================================
          IMAGEN
      ================================================== */}

      <View
        style={{
          width: "100%",

          alignItems: "center",

          justifyContent: "center",

          flex: 1,
        }}
      >
        <View
          style={{
            width: anchoImagen + 16,

            height: alturaImagen + 16,

            borderRadius: 22,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor: primarySoftColor,
          }}
        >
          <Image
            source={imagen}
            resizeMode="cover"
            style={{
              width: anchoImagen,

              height: alturaImagen,

              borderRadius: 16,
            }}
          />
        </View>
      </View>

      {/* ==================================================
          PIE
      ================================================== */}

      <View
        style={{
          width: "100%",

          marginTop: 14,

          flexDirection: "row",

          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,

            minWidth: 0,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 17 : 16,

              color: textColor,
            }}
          >
            {titulo}
          </Text>

          {!esTelefono && (
            <Text
              style={{
                marginTop: 2,

                fontFamily: "Nunito-Medium",

                fontSize: 11,

                color: textSecondaryColor,
              }}
            >
              Explorar contenido
            </Text>
          )}
        </View>

        <View
          style={{
            width: 34,

            height: 34,

            marginLeft: 10,

            borderRadius: 17,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor: primarySoftColor,
          }}
        >
          <Ionicons name="arrow-forward" size={17} color={primaryColor} />
        </View>
      </View>
    </Pressable>
  );
}
