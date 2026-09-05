import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";
import { OpcionEmocion } from "@/components/diario/OpcionEmocion";
import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// EMOCIONES
// ==========================================================

const EMOCIONES = [
  { nombre: "Alegría", emoji: "😊" },
  { nombre: "Tristeza", emoji: "😢" },
  { nombre: "Ansiedad", emoji: "😰" },
  { nombre: "Miedo", emoji: "😨" },
  { nombre: "Enojo", emoji: "😡" },
  { nombre: "Calma", emoji: "😌" },
  { nombre: "Frustración", emoji: "😤" },
  { nombre: "Culpa", emoji: "😔" },
  { nombre: "Vergüenza", emoji: "😳" },
  { nombre: "Esperanza", emoji: "🌱" },
];

// ==========================================================
// COMPONENTE
// ==========================================================

export default function NuevoAutorregistro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { plantilla, origen } = useLocalSearchParams<{
    plantilla?: string;
    origen?: string;
  }>();

  // ======================================================
  // ESTADO
  // ======================================================

  const [emocion, setEmocion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [reaccion, setReaccion] = useState("");
  const [ideaUtil, setIdeaUtil] = useState("");

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

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

  const regresar = () => {
    router.replace({
      pathname: "/diario/nuevo" as never,
      params: {
        origen,
      },
    });
  };

  // ======================================================
  // PLANTILLA NO DISPONIBLE
  // ======================================================

  if (plantilla !== "emocional") {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: 20,
            textAlign: "center",
            color: textColor,
          }}
        >
          Plantilla no disponible
        </Text>
      </View>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : Platform.OS === "android"
            ? "height"
            : undefined
      }
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 130, 150),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ==================================================
                    ENCABEZADO
                ================================================== */}

        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={regresar}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 16,
              borderWidth: 1,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
            })}
          >
            <Ionicons name="arrow-back" size={22} color={textColor} />
          </Pressable>

          <View
            style={{
              flex: 1,
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 30,
                color: primaryColor,
              }}
            >
              Diario Emocional
            </Text>

            <Text
              style={{
                marginTop: 2,
                fontFamily: "Nunito-Medium",
                fontSize: 16,
                color: textMutedColor,
              }}
            >
              Tu espacio seguro para expresar lo que sientes
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 16,
              borderWidth: 1,
              borderColor,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
            })}
          >
            <Ionicons name="calendar-outline" size={23} color={textColor} />
          </Pressable>
        </Animated.View>

        {/* ==================================================
                    TARJETA DE BIENVENIDA
                ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={{
            position: "relative",
            minHeight: 185,
            marginBottom: 28,
            overflow: "hidden",
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 24,
            backgroundColor: primarySoftColor,
          }}
        >
          {/* DECORACIONES */}

          <View
            style={{
              position: "absolute",
              right: -32,
              top: -40,
              width: 144,
              height: 144,
              borderRadius: 72,
              backgroundColor: primarySoftColor,
              opacity: 0.8,
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 64,
              bottom: -48,
              width: 128,
              height: 128,
              borderRadius: 64,
              backgroundColor: accentSoftColor,
              opacity: 0.8,
            }}
          />

          <View
            style={{
              position: "absolute",
              left: -32,
              bottom: -35,
              width: 112,
              height: 112,
              borderRadius: 56,
              backgroundColor: secondarySoftColor,
              opacity: 0.55,
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 96,
              top: 32,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: primaryColor,
              opacity: 0.35,
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 48,
              bottom: 32,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: accentColor,
              opacity: 0.45,
            }}
          />

          <View
            style={{
              width: "58%",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 23,
                lineHeight: 28,
                color: textColor,
              }}
            >
              ¿Cómo te{"\n"}sientes hoy?
            </Text>

            <Text
              style={{
                marginTop: 12,
                fontFamily: "Nunito-Medium",
                fontSize: 16,
                lineHeight: 20,
                color: textSecondaryColor,
              }}
            >
              Reconocer tus emociones es el primer paso para entenderte mejor.
            </Text>
          </View>

          {/* ILUSTRACIÓN TEMPORAL */}

          <View
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              width: 115,
              height: 115,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: primaryColor,
              transform: [
                {
                  rotate: "-5deg",
                },
              ],
            }}
          >
            <View
              style={{
                width: 65,
                height: 85,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: primaryColor,
                opacity: 0.88,
              }}
            >
              <Ionicons name="heart" size={34} color={textOnPrimaryColor} />
            </View>

            <View
              style={{
                position: "absolute",
                right: -8,
                bottom: 16,
                width: 16,
                height: 32,
                borderRadius: 8,
                backgroundColor: primaryColor,
                opacity: 0.7,
              }}
            />
          </View>
        </Animated.View>

        {/* ==================================================
                    SELECCIÓN DE EMOCIÓN
                ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={{
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              marginBottom: 4,
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              color: textColor,
            }}
          >
            ¿Cómo me siento hoy?
          </Text>

          <Text
            style={{
              marginBottom: 16,
              fontFamily: "Nunito-Medium",
              fontSize: 14,
              lineHeight: 20,
              color: textSecondaryColor,
            }}
          >
            Elige la emoción que mejor representa cómo te sientes.
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: 12,
            }}
          >
            {EMOCIONES.map((item) => (
              <OpcionEmocion
                key={item.nombre}
                nombre={item.nombre}
                emoji={item.emoji}
                seleccionada={emocion === item.nombre}
                onPress={() => setEmocion(item.nombre)}
              />
            ))}
          </View>
        </Animated.View>

        {/* ==================================================
                    PREGUNTAS DE REFLEXIÓN
                ================================================== */}

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <CampoPreguntaDiario
            titulo="¿Qué me hizo sentir así?"
            valor={motivo}
            onChangeText={setMotivo}
            placeholder="Cuéntanos qué ocurrió..."
          />

          <CampoPreguntaDiario
            titulo="¿Cómo reaccioné?"
            valor={reaccion}
            onChangeText={setReaccion}
            placeholder="¿Qué hiciste o cómo respondiste?"
          />

          <CampoPreguntaDiario
            titulo="Una idea útil"
            valor={ideaUtil}
            onChangeText={setIdeaUtil}
            placeholder="¿Qué te gustaría recordar de esta experiencia?"
          />
        </Animated.View>

        {/* ==================================================
                    GUARDAR
                ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={{
            marginTop: 12,
          }}
        >
          <Button
            title="Guardar registro"
            onPress={() => {
              console.log({
                emocion,
                motivo,
                reaccion,
                ideaUtil,
              });
            }}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
