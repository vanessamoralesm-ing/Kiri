import React from "react";

import { Pressable, ScrollView, Text, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function NuevoRegistro() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const { origen } = useLocalSearchParams<{
    origen?: string;
  }>();

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const numeroColumnas = esEscritorio ? 3 : esTablet ? 2 : 1;

  const gapTarjetas = esEscritorio ? 18 : 16;

  const paddingBottom = esEscritorio ? 56 : Math.max(insets.bottom + 70, 90);

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const regresar = () => {
    if (origen === "home") {
      router.replace("/(tabs)/home" as never);

      return;
    }

    router.replace("/(tabs)/diario" as never);
  };

  const seleccionarPlantilla = (plantilla: string) => {
    router.push({
      pathname: `/diario/nuevo/${plantilla}` as never,

      params: {
        origen,
      },
    });
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom,
        }}
      >
        {/* ==================================================
            CONTENEDOR PRINCIPAL
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,

            paddingTop: esEscritorio ? 28 : esTablet ? 24 : 18,
          }}
        >
          {/* ==================================================
              BOTÓN REGRESAR
          ================================================== */}

          <Pressable
            onPress={regresar}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 48,

              height: 48,

              marginBottom: esEscritorio ? 26 : 22,

              borderRadius: 16,

              borderWidth: 1,

              borderColor,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

              elevation: 1,

              shadowColor: "#000000",

              shadowOffset: {
                width: 0,

                height: 2,
              },

              shadowOpacity: 0.05,

              shadowRadius: 5,
            })}
          >
            <Ionicons name="arrow-back" size={22} color={textColor} />
          </Pressable>

          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{
              width: "100%",

              maxWidth: esEscritorio ? 760 : undefined,

              marginBottom: esEscritorio ? 30 : 26,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 36 : esTablet ? 32 : 30,

                lineHeight: esEscritorio ? 44 : esTablet ? 40 : 38,

                color: textColor,
              }}
            >
              ¿Qué quieres registrar hoy?
            </Text>

            <Text
              style={{
                marginTop: 8,

                fontFamily: "Nunito-Medium",

                fontSize: esEscritorio ? 16 : 15,

                lineHeight: esEscritorio ? 24 : 22,

                color: textSecondaryColor,
              }}
            >
              Elige el tipo de autorregistro que mejor se adapte a lo que
              quieres expresar.
            </Text>
          </Animated.View>

          {/* ==================================================
              TARJETAS
          ================================================== */}

          <View
            style={{
              width: "100%",

              flexDirection: numeroColumnas > 1 ? "row" : "column",

              flexWrap: numeroColumnas > 1 ? "wrap" : "nowrap",

              gap: gapTarjetas,

              alignItems: "stretch",
            }}
          >
            {/* ==============================================
                DIARIO EMOCIONAL
            ============================================== */}

            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={{
                flex: numeroColumnas > 1 ? 1 : undefined,

                minWidth: 0,

                width: numeroColumnas === 1 ? "100%" : undefined,
              }}
            >
              <TarjetaPlantillaAutorregistro
                titulo="Diario emocional"
                descripcion="Reconoce lo que sientes, qué lo provocó y cómo reaccionaste."
                icono="heart-outline"
                color={primaryColor}
                fondoIcono={primarySoftColor}
                onPress={() => seleccionarPlantilla("emocional")}
              />
            </Animated.View>

            {/* ==============================================
                PENSAMIENTOS
            ============================================== */}

            <Animated.View
              entering={FadeInDown.delay(180).duration(400)}
              style={{
                flex: numeroColumnas > 1 ? 1 : undefined,

                minWidth: 0,

                width: numeroColumnas === 1 ? "100%" : undefined,
              }}
            >
              <TarjetaPlantillaAutorregistro
                titulo="Observando mis pensamientos"
                descripcion="Observa una situación, tus pensamientos, sentimientos y reacciones."
                icono="bulb-outline"
                color={accentColor}
                fondoIcono={accentSoftColor}
                onPress={() => seleccionarPlantilla("pensamientos")}
              />
            </Animated.View>

            {/* ==============================================
                ABCDE
            ============================================== */}

            <Animated.View
              entering={FadeInDown.delay(260).duration(400)}
              style={{
                flex: numeroColumnas > 1 ? 1 : undefined,

                minWidth: 0,

                width: numeroColumnas === 1 ? "100%" : undefined,
              }}
            >
              <TarjetaPlantillaAutorregistro
                titulo="Autorregistro ABCDE"
                descripcion="Reflexiona sobre una situación, tus creencias y nuevas formas de responder."
                icono="leaf-outline"
                color={secondaryColor}
                fondoIcono={secondarySoftColor}
                onPress={() => seleccionarPlantilla("abc")}
              />
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
