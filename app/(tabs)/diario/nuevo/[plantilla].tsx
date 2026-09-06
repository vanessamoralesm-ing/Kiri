import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

import { OpcionEmocion } from "@/components/diario/OpcionEmocion";

import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";

import Button from "@/components/ui/Button";

import { useAuth } from "@/services/authProvider";

import {
  guardarDiarioEmocionalService,
  obtenerEmocionesAutorregistro,
} from "@/services/diario/autorregistro.service";

import { EmocionAutorregistro } from "@/types/diario";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// EMOJIS
// ==========================================================

const EMOJIS_EMOCIONES: Record<string, string> = {
  Alegría: "😊",
  Tristeza: "😢",
  Ansiedad: "😰",
  Miedo: "😨",
  Enojo: "😡",
  Calma: "😌",
  Frustración: "😤",
  Culpa: "😔",
  Vergüenza: "😳",
  Esperanza: "🌱",
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function NuevoAutorregistro() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const { user } = useAuth();

  const { plantilla, origen } = useLocalSearchParams<{
    plantilla?: string;
    origen?: string;
  }>();

  // ======================================================
  // ESTADO
  // ======================================================

  const [guardando, setGuardando] = useState(false);

  const [cargandoEmociones, setCargandoEmociones] = useState(true);

  const [emociones, setEmociones] = useState<EmocionAutorregistro[]>([]);

  const [idEmocion, setIdEmocion] = useState("");

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

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefono = width < 768;

  const esTablet = width >= 768 && width < 1100;

  const esWeb = width >= 1100;

  const maxWidthContenido = esWeb ? 980 : esTablet ? 860 : undefined;

  const maxWidthSeccionPrincipal = esWeb ? 760 : undefined;

  const paddingHorizontal = esTelefono ? 16 : 24;

  const columnasEmociones = esTelefono ? 3 : esTablet ? 4 : 5;

  const gapEmociones = esTelefono ? 12 : 14;

  const anchoGridEmociones = Math.min(
    width - paddingHorizontal * 2,
    esWeb ? 760 : esTablet ? 760 : width - paddingHorizontal * 2,
  );

  const anchoTarjetaEmocion = useMemo(() => {
    const espacioTotal = gapEmociones * (columnasEmociones - 1);

    return (anchoGridEmociones - espacioTotal) / columnasEmociones;
  }, [anchoGridEmociones, columnasEmociones, gapEmociones]);

  // ======================================================
  // CARGAR EMOCIONES
  // ======================================================

  useEffect(() => {
    const cargarEmociones = async () => {
      try {
        setCargandoEmociones(true);

        const data = await obtenerEmocionesAutorregistro();

        setEmociones(data);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "No se pudieron cargar las emociones.",
        );
      } finally {
        setCargandoEmociones(false);
      }
    };

    cargarEmociones();
  }, []);

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
  // GUARDAR REGISTRO
  // ======================================================

  const guardarRegistro = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No se encontró una sesión de usuario activa.");

      return;
    }

    if (!idEmocion) {
      Alert.alert(
        "Atención",
        "Por favor selecciona una emoción antes de guardar.",
      );

      return;
    }

    try {
      setGuardando(true);

      await guardarDiarioEmocionalService({
        idUsuario: user.id,

        idEmocion,

        motivo,

        reaccion,

        ideaUtil,
      });

      Alert.alert("¡Éxito!", "Tu diario ha sido guardado correctamente.", [
        {
          text: "OK",

          onPress: regresar,
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error al guardar",
        error.message || "Ocurrió un error inesperado.",
      );
    } finally {
      setGuardando(false);
    }
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
            textAlign: "center",
            fontFamily: "Nunito-Bold",
            fontSize: 20,
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
          paddingTop: esTelefono ? 12 : 24,

          paddingBottom: Math.max(insets.bottom + 130, 150),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={regresar}
              style={({ pressed }) => ({
                width: 48,

                height: 48,

                borderRadius: 17,

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
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 28 : 30,

                  color: primaryColor,
                }}
              >
                Diario Emocional
              </Text>

              <Text
                style={{
                  marginTop: 4,

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
                width: 48,

                height: 48,

                borderRadius: 17,

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
              CARD ¿CÓMO TE SIENTES?
          ================================================== */}

          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={{
              width: "100%",

              maxWidth: maxWidthSeccionPrincipal,

              minHeight: esTelefono ? 185 : 205,

              alignSelf: "center",

              marginBottom: 32,

              paddingHorizontal: esTelefono ? 24 : 30,

              paddingVertical: esTelefono ? 24 : 28,

              borderRadius: 28,

              backgroundColor: primarySoftColor,

              borderWidth: 1,

              borderColor,

              overflow: "hidden",

              shadowColor: primaryColor,

              shadowOffset: {
                width: 0,

                height: 5,
              },

              shadowOpacity: 0.08,

              shadowRadius: 12,

              elevation: 2,
            }}
          >
            {/* ==================================================
                DECORACIONES
            ================================================== */}

            <View
              style={{
                position: "absolute",

                width: 150,

                height: 150,

                borderRadius: 75,

                backgroundColor: primarySoftColor,

                right: -25,

                top: -40,

                opacity: 0.8,
              }}
            />

            <View
              style={{
                position: "absolute",

                width: 140,

                height: 140,

                borderRadius: 70,

                backgroundColor: accentSoftColor,

                right: 90,

                bottom: -55,

                opacity: 0.8,
              }}
            />

            <View
              style={{
                position: "absolute",

                width: 120,

                height: 120,

                borderRadius: 60,

                backgroundColor: secondarySoftColor,

                left: -45,

                bottom: -50,

                opacity: 0.7,
              }}
            />

            {/* ==================================================
                TEXTO
            ================================================== */}

            <View
              style={{
                width: esTelefono ? "58%" : "62%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 23 : 25,

                  lineHeight: esTelefono ? 28 : 32,

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

                  lineHeight: esTelefono ? 20 : 24,

                  color: textSecondaryColor,
                }}
              >
                Reconocer tus emociones es el primer paso para entenderte mejor.
              </Text>
            </View>

            {/* ==================================================
                ILUSTRACIÓN
            ================================================== */}

            <View
              style={{
                position: "absolute",

                right: esTelefono ? 20 : 30,

                bottom: 24,

                width: esTelefono ? 115 : 125,

                height: esTelefono ? 115 : 125,

                borderRadius: 30,

                backgroundColor: primaryColor,

                alignItems: "center",

                justifyContent: "center",

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

                  borderRadius: 14,

                  backgroundColor: primaryColor,

                  alignItems: "center",

                  justifyContent: "center",

                  opacity: 0.88,
                }}
              >
                <Ionicons name="heart" size={34} color={textOnPrimaryColor} />
              </View>

              <View
                style={{
                  position: "absolute",

                  right: -8,

                  bottom: 18,

                  width: 16,

                  height: 32,

                  borderRadius: 10,

                  backgroundColor: primaryColor,

                  opacity: 0.65,
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
              width: "100%",

              maxWidth: esWeb ? 760 : undefined,

              alignSelf: "center",

              marginBottom: 28,
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
                marginBottom: 20,

                fontFamily: "Nunito-Medium",

                fontSize: 14,

                lineHeight: 20,

                color: textSecondaryColor,
              }}
            >
              Elige la emoción que mejor representa cómo te sientes.
            </Text>

            {cargandoEmociones ? (
              <Text
                style={{
                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  color: textMutedColor,
                }}
              >
                Cargando emociones...
              </Text>
            ) : emociones.length === 0 ? (
              <Text
                style={{
                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  color: textMutedColor,
                }}
              >
                No hay emociones disponibles.
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: "row",

                  flexWrap: "wrap",

                  gap: gapEmociones,
                }}
              >
                {emociones.map((item) => (
                  <OpcionEmocion
                    key={item.id_emocion}
                    nombre={item.nombre}
                    emoji={EMOJIS_EMOCIONES[item.nombre] ?? "💭"}
                    seleccionada={idEmocion === item.id_emocion}
                    ancho={anchoTarjetaEmocion}
                    onPress={() => setIdEmocion(item.id_emocion)}
                  />
                ))}
              </View>
            )}
          </Animated.View>

          {/* ==================================================
              PREGUNTAS
          ================================================== */}

          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={{
              width: "100%",

              maxWidth: esWeb ? 760 : undefined,

              alignSelf: "center",
            }}
          >
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
              width: "100%",

              maxWidth: esWeb ? 760 : undefined,

              alignSelf: "center",

              marginTop: 12,
            }}
          >
            <Button
              title={guardando ? "Guardando..." : "Guardar registro"}
              onPress={guardarRegistro}
              disabled={guardando || cargandoEmociones}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
