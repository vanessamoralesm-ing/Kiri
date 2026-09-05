import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

import { Pressable, ScrollView, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function NuevoRegistro() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  // ======================================================
  // PARÁMETROS
  // ======================================================

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

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

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
          paddingTop: 16,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom + 120, 140),
        }}
      >
        {/* ==================================================
                    REGRESAR
                ================================================== */}

        <Pressable
          onPress={regresar}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            marginBottom: 20,
            borderRadius: 22,
            borderWidth: 1,
            borderColor,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
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
            marginBottom: 28,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 30,
              color: textColor,
            }}
          >
            ¿Qué quieres registrar hoy?
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontFamily: "Nunito-Medium",
              fontSize: 16,
              lineHeight: 24,
              color: textSecondaryColor,
            }}
          >
            Elige el tipo de autorregistro que mejor se adapte a lo que quieres
            expresar.
          </Text>
        </Animated.View>

        {/* ==================================================
                    DIARIO EMOCIONAL
                ================================================== */}

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Diario emocional"
            descripcion="Reconoce lo que sientes, qué lo provocó y cómo reaccionaste."
            icono="heart-outline"
            color={primaryColor}
            fondoIcono={primarySoftColor}
            onPress={() => seleccionarPlantilla("emocional")}
          />
        </Animated.View>

        {/* ==================================================
                    PENSAMIENTOS
                ================================================== */}

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Observando mis pensamientos"
            descripcion="Observa una situación, tus pensamientos, sentimientos y reacciones."
            icono="bulb-outline"
            color={accentColor}
            fondoIcono={accentSoftColor}
            onPress={() => seleccionarPlantilla("pensamientos")}
          />
        </Animated.View>

        {/* ==================================================
                    ABCDE
                ================================================== */}

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Autorregistro ABCDE"
            descripcion="Reflexiona sobre una situación, tus creencias y nuevas formas de responder."
            icono="leaf-outline"
            color={secondaryColor}
            fondoIcono={secondarySoftColor}
            onPress={() => seleccionarPlantilla("abc")}
          />
        </Animated.View>

        {/* ==================================================
                    MENSAJE DE APOYO
                ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={{
            marginTop: 12,
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderRadius: 24,
            borderWidth: 1,
            borderColor,
            backgroundColor: surfaceColor,
          }}
        >
          <View
            style={{
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                marginRight: 12,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons name="heart-outline" size={19} color={primaryColor} />
            </View>

            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 16,
                color: textColor,
              }}
            >
              Un espacio para ti
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Nunito-Medium",
              fontSize: 14,
              lineHeight: 20,
              color: textMutedColor,
            }}
          >
            No existe una forma correcta o incorrecta de registrar lo que
            sientes. Escribe desde tu propia experiencia.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
