import { Ionicons } from "@expo/vector-icons";
import React from "react";

import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

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

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const {
    esTelefono,
    esTablet,
    esEscritorio,
  } = useResponsiveLayout();


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor(
    {},
    "surface"
  );

  const surfaceSecondaryColor = useThemeColor(
    {},
    "surfaceSecondary"
  );

  const borderColor = useThemeColor(
    {},
    "border"
  );

  const textColor = useThemeColor(
    {},
    "text"
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary"
  );

  const primaryColor = useThemeColor(
    {},
    "primary"
  );

  const primarySoftColor = useThemeColor(
    {},
    "primarySoft"
  );

  const accentColor = useThemeColor(
    {},
    "accent"
  );

  // ========================================================
  // DISEÑO PARA TELÉFONO
  // Mantiene las dos columnas y recupera el estilo visual
  // del card usado en tablet y escritorio.
  // ========================================================

  if (esTelefono) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: "100%",

          minHeight: 190,

          borderRadius: 20,

          borderWidth: 1,

          borderColor:
            pressed
              ? primaryColor
              : borderColor,

          backgroundColor:
            pressed
              ? surfaceSecondaryColor
              : surfaceColor,

          overflow: "hidden",

          padding: 14,

          justifyContent: "space-between",

          opacity:
            pressed
              ? 0.92
              : 1,

          ...Platform.select({
            web: {
              cursor: "pointer",

              boxShadow:
                pressed
                  ? "0px 5px 14px rgba(0,0,0,0.09)"
                  : "0px 2px 8px rgba(0,0,0,0.04)",
            } as any,

            ios: {
              shadowColor: "#000000",

              shadowOffset: {
                width: 0,
                height: 3,
              },

              shadowOpacity:
                pressed
                  ? 0.1
                  : 0.05,

              shadowRadius: 7,
            },

            android: {
              elevation:
                pressed
                  ? 4
                  : 2,
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
              width: 138,

              height: 138,

              borderRadius: 22,

              // borde morado del fondo de la imagen
              borderWidth: 1.5,

              borderColor:
                accentColor,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor:
                primarySoftColor,
            }}
          >
            <Image
              source={imagen}
              resizeMode="cover"
              style={{
                width: 122,

                height: 122,

                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* ==================================================
            TÍTULO
            ================================================== */}

        <View
          style={{
            width: "100%",

            marginTop: 12,

            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: 16,

              lineHeight: 21,

              textAlign: "center",

              color: textColor,
            }}
          >
            {titulo}
          </Text>
        </View>

      </Pressable>
    );
  }
  // ========================================================
  // TABLET Y ESCRITORIO
  // Conserva el diseño responsive.
  // ========================================================

  const alturaImagen =
    esEscritorio
      ? 126
      : esTablet
        ? 118
        : 105;

  const anchoImagen =
    esEscritorio
      ? 126
      : esTablet
        ? 118
        : 105;

  const alturaTarjeta =
    esEscritorio
      ? 215
      : esTablet
        ? 205
        : 175;


  // ========================================================
  // UI TABLET / ESCRITORIO
  // ========================================================

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "100%",

        minHeight: alturaTarjeta,

        borderRadius:
          esEscritorio
            ? 22
            : 20,

        borderWidth: 1,

        borderColor:
          pressed
            ? primaryColor
            : borderColor,

        backgroundColor:
          pressed
            ? surfaceSecondaryColor
            : surfaceColor,

        overflow: "hidden",

        padding:
          esEscritorio
            ? 18
            : 16,

        justifyContent: "space-between",

        opacity:
          pressed
            ? 0.92
            : 1,

        ...Platform.select({
          web: {
            cursor: "pointer",

            boxShadow:
              pressed
                ? "0px 5px 14px rgba(0,0,0,0.09)"
                : "0px 2px 8px rgba(0,0,0,0.04)",
          } as any,

          ios: {
            shadowColor: "#000000",

            shadowOffset: {
              width: 0,
              height: 3,
            },

            shadowOpacity:
              pressed
                ? 0.1
                : 0.05,

            shadowRadius: 7,
          },

          android: {
            elevation:
              pressed
                ? 4
                : 2,
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
            width:
              anchoImagen + 16,

            height:
              alturaImagen + 16,

            borderRadius: 22,

            // borde morado del fondo de la imagen
            borderWidth: 1.5,

            borderColor:
              accentColor,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor:
              primarySoftColor,
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

              fontSize:
                esEscritorio
                  ? 17
                  : 16,

              color: textColor,
            }}
          >
            {titulo}
          </Text>

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
        </View>


        {/* ==================================================
            FLECHA
            ================================================== */}

        <View
          style={{
            width: 34,

            height: 34,

            marginLeft: 10,

            borderRadius: 17,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor:
              primarySoftColor,
          }}
        >
          <Ionicons
            name="arrow-forward"
            size={17}
            color={primaryColor}
          />
        </View>

      </View>

    </Pressable>
  );
}