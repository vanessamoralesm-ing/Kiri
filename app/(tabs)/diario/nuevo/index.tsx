import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";

import { useThemeColor } from "@/hooks/use-theme-color";

export default function NuevoRegistro() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const { origen } = useLocalSearchParams<{
    origen?: string;
  }>();

  // ======================================================
  // TEMA
  // ======================================================

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

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefono = width < 768;

  const esTablet = width >= 768 && width < 1100;

  const esWeb = width >= 1100;

  const maxWidthContenido = esWeb ? 820 : esTablet ? 760 : undefined;

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

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

  // ======================================================
  // UI
  // ======================================================

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
          paddingBottom: Math.max(insets.bottom + 70, 90),
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal: esTelefono ? 20 : 28,

            paddingTop: esTelefono ? 18 : 26,
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

              marginBottom: 28,

              borderRadius: 18,

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

              marginBottom: 32,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esTelefono ? 30 : 34,

                lineHeight: esTelefono ? 38 : 42,

                color: textColor,
              }}
            >
              ¿Qué quieres registrar hoy?
            </Text>

            <Text
              style={{
                marginTop: 8,

                fontFamily: "Nunito-Medium",

                fontSize: esTelefono ? 15 : 16,

                lineHeight: esTelefono ? 22 : 24,

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

              alignSelf: "stretch",
            }}
          >
            {/* ==============================================
                DIARIO EMOCIONAL
            ============================================== */}

            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={{
                width: "100%",

                alignSelf: "stretch",

                marginBottom: esTelefono ? 16 : 20,
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
                width: "100%",

                alignSelf: "stretch",

                marginBottom: esTelefono ? 16 : 20,
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
                width: "100%",

                alignSelf: "stretch",
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
