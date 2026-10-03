import React from "react";

import { Image, ImageSourcePropType, Platform, Text, View } from "react-native";

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

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const accentColor = useThemeColor({}, "accent");

  // ========================================================
  // TELÉFONO
  // ========================================================

  if (esTelefono) {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingTop: 14,
        }}
      >
        {/* ==================================================
            CARD
            ================================================== */}

        <View
          style={{
            width: "100%",
            maxWidth: 360,

            alignItems: "center",

            borderRadius: 22,
            borderWidth: 1,
            borderColor: accentColor,

            backgroundColor: surfaceColor,

            paddingHorizontal: 16,
            paddingVertical: 16,

            ...Platform.select({
              web: {
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
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
                elevation: 5,
              },
            }),
          }}
        >
          {/* ==================================================
              IMAGEN
              ================================================== */}

          <View
            style={{
              width: "100%",
              height: 170,

              borderRadius: 20,
              overflow: "hidden",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={imagen}
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
              }}
            />
          </View>

          {/* ==================================================
              TEXTO
              ================================================== */}

          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingHorizontal: 4,
            }}
          >
            {/* TÍTULO */}

            <Text
              style={{
                marginTop: 12,

                fontFamily: "Nunito-Bold",
                fontSize: 23,
                lineHeight: 29,

                textAlign: "center",

                color: textColor,
              }}
            >
              {titulo}
            </Text>

            {/* SUBTÍTULO */}

            <Text
              style={{
                marginTop: 6,

                fontFamily: "Nunito-Medium",
                fontSize: 14,
                lineHeight: 20,

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

  // ========================================================
  // TABLET / ESCRITORIO
  // ========================================================

  /*
   * Reducimos el tamaño máximo de la tarjeta para que
   * no se vea excesivamente grande en escritorio.
   */
  const maxWidthCard = esEscritorio ? 780 : 720;

  /*
   * Contenedor de imagen más compacto.
   *
   * La imagen utiliza "contain", por lo que se muestra
   * completa y mantiene su proporción original.
   */
  const alturaImagen = esEscritorio ? 190 : 230;

  // ========================================================
  // UI TABLET / ESCRITORIO
  // ========================================================

  return (
    <View
      style={{
        width: "100%",

        alignItems: "center",

        paddingHorizontal: esEscritorio ? 16 : 24,

        paddingTop: esEscritorio ? 8 : 14,
      }}
    >
      {/* ==================================================
          CARD
          ================================================== */}

      <View
        style={{
          width: "100%",

          maxWidth: maxWidthCard,

          alignItems: "center",

          borderRadius: 22,

          borderWidth: 1,
          borderColor: accentColor,

          backgroundColor: surfaceColor,

          paddingHorizontal: esEscritorio ? 14 : 24,

          paddingTop: esEscritorio ? 14 : 20,

          paddingBottom: esEscritorio ? 20 : 22,

          ...Platform.select({
            web: {
              boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
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
            IMAGEN
            ================================================== */}

        <View
          style={{
            width: "100%",
            height: alturaImagen,

            borderRadius: 22,
            overflow: "hidden",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={imagen}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 22,
            }}
          />
        </View>

        {/* ==================================================
            TEXTO
            ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: esEscritorio ? 700 : 650,

            alignItems: "center",

            marginTop: esEscritorio ? 4 : 8,

            paddingHorizontal: 12,
          }}
        >
          {/* ==================================================
              TÍTULO
              ================================================== */}

          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 25 : 25,

              lineHeight: esEscritorio ? 31 : 31,

              textAlign: "center",

              color: textColor,
            }}
          >
            {titulo}
          </Text>

          {/* ==================================================
              SUBTÍTULO
              ================================================== */}

          <Text
            style={{
              marginTop: 6,

              fontFamily: "Nunito-Medium",

              fontSize: esEscritorio ? 15 : 15,

              lineHeight: esEscritorio ? 22 : 22,

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
