import React from "react";

import {
  Image,
  ImageSourcePropType,
  Platform,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PROPS
// ==========================================================

type EncabezadoCardProps = {
  imagen: ImageSourcePropType;
  titulo: string;
  subtitulo: string;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EncabezadoCard({
  imagen,
  titulo,
  subtitulo,
}: EncabezadoCardProps) {
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

  const textColor = useThemeColor(
    {},
    "text"
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary"
  );

  const accentColor = useThemeColor(
    {},
    "accent"
  );

  // ========================================================
  // TELÉFONO
  // ========================================================

  if (esTelefono) {
    return (
      <View
        className="items-center px-6"
        style={{
          paddingTop: 14,
        }}
      >
        {/* CARD */}

        <View
          className="items-center rounded-[22px] border bg-white px-5 py-5"
          style={{
            width: 360,

            borderColor: accentColor,

            shadowColor: "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity: 0.08,

            shadowRadius: 6,

            elevation: 6,
          }}
        >
          {/* IMAGEN */}

          <View
            style={{
              width: "100%",
              height: 180,

              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <Image
              source={imagen}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>

          {/* TEXTO */}

          <View className="items-center px-2">
            <Text
              className="mt-3 text-center font-nunito-bold text-[23px]"
              style={{
                color: textColor,
              }}
            >
              {titulo}
            </Text>

            <Text
              className="mt-2 text-center font-nunito-medium text-[14px] leading-5"
              style={{
                color: textSecondaryColor,
              }}
            >
              {subtitulo}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ========================================================
  // TABLET Y ESCRITORIO
  // ========================================================

  const maxWidthCard = esEscritorio
    ? 1100
    : 760;

  const alturaImagen = esEscritorio
    ? 320
    : 260;

  // ========================================================
  // UI TABLET / ESCRITORIO
  // ========================================================

  return (
    <View
      style={{
        width: "100%",

        alignItems: "center",

        paddingHorizontal:
          esEscritorio
            ? 32
            : 24,

        paddingTop:
          esEscritorio
            ? 12
            : 14,
      }}
    >
      {/* ==================================================
          CARD
          ================================================== */}

      <View
        style={{
          width: "90%", //ancho del card en WEB

          maxWidth: maxWidthCard,

          alignItems: "center",

          borderRadius: 22,

          borderWidth: 1,

          borderColor: accentColor,

          backgroundColor: surfaceColor,

          paddingHorizontal:
            esEscritorio
              ? 20
              : 24,

          paddingTop:
            esEscritorio
              ? 18
              : 20,

          paddingBottom:
            esEscritorio
              ? 26
              : 22,

          ...Platform.select({
            web: {
              boxShadow:
                "0px 2px 8px rgba(0,0,0,0.06)",
            } as any,

            ios: {
              shadowColor: "#000000",

              shadowOffset: {
                width: 0,
                height: 2,
              },

              shadowOpacity: 0.08,

              shadowRadius: 6,
            },

            android: {
              elevation: 3,
            },
          }),
        }}
      >
        {/* ==================================================
            IMAGEN WEB
            ================================================== */}

        <View
          style={{
            width: esEscritorio
              ? "96%" //ancho
              : "100%",

            height: alturaImagen,

            borderRadius: 22,

            overflow: "hidden",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <Image
            source={imagen}

            resizeMode={
              esEscritorio
                ? "stretch"
                : "contain"
            }

            style={{
              width: "90%",//ancho de la imagen

              height: "100%",//altura de la imagen

              borderRadius: 22,

              transform: esEscritorio
                ? [{ scale: 0.96 }]
                : [{ scale: 1 }],
            }}
          />
        </View>

        {/* ==================================================
            TEXTO
            ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth:
              esEscritorio
                ? 850
                : 650,

            alignItems: "center",

            marginTop: 4,

            paddingHorizontal: 16,
          }}
        >
          {/* TÍTULO */}

          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize:
                esEscritorio
                  ? 27
                  : 25,

              lineHeight:
                esEscritorio
                  ? 34
                  : 31,

              textAlign: "center",

              color: textColor,
            }}
          >
            {titulo}
          </Text>

          {/* SUBTÍTULO */}

          <Text
            style={{
              marginTop: 8,

              fontFamily: "Nunito-Medium",

              fontSize:
                esEscritorio
                  ? 16
                  : 15,

              lineHeight:
                esEscritorio
                  ? 24
                  : 22,

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            {subtitulo}
          </Text>
        </View>
      </View>
    </View>
  );
}