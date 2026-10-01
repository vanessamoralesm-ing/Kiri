import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

import { OpcionEmocion } from "@/components/diario/OpcionEmocion";

import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";

import Button from "@/components/ui/Button";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import {
  guardarDiarioEmocionalService,
  obtenerEmocionesAutorregistro,
} from "@/services/diario/autorregistro.service";

import { EmocionAutorregistro } from "@/types/diario";

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

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const { user } = useAuth();

  const { plantilla, origen } = useLocalSearchParams<{
    plantilla?: string;
    origen?: string;
  }>();

  // ========================================================
  // ESTADO
  // ========================================================

  const [guardando, setGuardando] = useState(false);

  const [cargandoEmociones, setCargandoEmociones] = useState(true);

  const [emociones, setEmociones] = useState<EmocionAutorregistro[]>([]);

  const [idEmocion, setIdEmocion] = useState("");

  const [motivo, setMotivo] = useState("");

  const [reaccion, setReaccion] = useState("");

  const [ideaUtil, setIdeaUtil] = useState("");

  /*
   * Ancho real disponible para la cuadrícula.
   *
   * Se mide directamente del contenedor para que responda
   * correctamente cuando la sidebar se expande o retrae.
   */
  const [anchoGridEmociones, setAnchoGridEmociones] = useState(0);

  // ========================================================
  // TEMA
  // ========================================================

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

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  /*
   * La pantalla puede ocupar el dashboard,
   * pero el formulario interior se mantiene
   * más estrecho para facilitar la lectura.
   */
  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthFormulario = esEscritorio
    ? 820
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  /*
   * Emociones:
   *
   * móvil      -> 3 columnas
   * tablet     -> 4 columnas
   * escritorio -> 5 columnas
   */
  const columnasEmociones = esEscritorio ? 5 : esTablet ? 4 : 3;

  const gapEmociones = esEscritorio ? 14 : 12;

  const anchoTarjetaEmocion = useMemo(() => {
    if (anchoGridEmociones <= 0) {
      return 0;
    }

    const espacioTotal = gapEmociones * (columnasEmociones - 1);

    return (anchoGridEmociones - espacioTotal) / columnasEmociones;
  }, [anchoGridEmociones, columnasEmociones, gapEmociones]);

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 130, 150);

  // ========================================================
  // CARGAR EMOCIONES
  // ========================================================

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

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const regresar = () => {
    router.replace({
      pathname: "/diario/nuevo" as never,

      params: {
        origen,
      },
    });
  };

  // ========================================================
  // GUARDAR REGISTRO
  // ========================================================

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

  // ========================================================
  // MEDIR GRID DE EMOCIONES
  // ========================================================

  const medirGridEmociones = (event: LayoutChangeEvent) => {
    const nuevoAncho = event.nativeEvent.layout.width;

    if (Math.abs(nuevoAncho - anchoGridEmociones) > 1) {
      setAnchoGridEmociones(nuevoAncho);
    }
  };

  // ========================================================
  // PLANTILLA NO DISPONIBLE
  // ========================================================

  if (plantilla !== "emocional") {
    return (
      <View
        style={{
          flex: 1,

          paddingHorizontal: paddingHorizontal,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor,
        }}
      >
        <View
          style={{
            width: 64,

            height: 64,

            borderRadius: 32,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor: primarySoftColor,

            marginBottom: 18,
          }}
        >
          <Ionicons
            name="document-text-outline"
            size={30}
            color={primaryColor}
          />
        </View>

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

        <Text
          style={{
            marginTop: 6,

            maxWidth: 420,

            textAlign: "center",

            fontFamily: "Nunito-Medium",

            fontSize: 14,

            lineHeight: 20,

            color: textSecondaryColor,
          }}
        >
          Esta plantilla todavía no está disponible.
        </Text>

        <Pressable
          onPress={regresar}
          style={({ pressed }) => ({
            marginTop: 22,

            minHeight: 44,

            paddingHorizontal: 18,

            borderRadius: 12,

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "center",

            gap: 7,

            backgroundColor: primaryColor,

            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons name="arrow-back" size={18} color={textOnPrimaryColor} />

          <Text
            style={{
              fontFamily: "Nunito-SemiBold",

              fontSize: 14,

              color: textOnPrimaryColor,
            }}
          >
            Volver a plantillas
          </Text>
        </Pressable>
      </View>
    );
  }

  // ========================================================
  // UI
  // ========================================================

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
          paddingTop: esEscritorio ? 28 : esTablet ? 22 : 14,

          paddingBottom,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
          }}
        >
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              marginBottom: 26,

              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Pressable
              onPress={regresar}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 46,

                height: 46,

                flexShrink: 0,

                borderRadius: 15,

                borderWidth: 1,

                borderColor,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
              })}
            >
              <Ionicons name="arrow-back" size={21} color={textColor} />
            </Pressable>

            <View
              style={{
                flex: 1,

                minWidth: 0,

                paddingHorizontal: 16,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 30 : esTablet ? 29 : 26,

                  color: primaryColor,
                }}
              >
                Diario emocional
              </Text>

              <Text
                numberOfLines={esTelefono ? 2 : 1}
                style={{
                  marginTop: 3,

                  fontFamily: "Nunito-Medium",

                  fontSize: esEscritorio ? 15 : 14,

                  lineHeight: 20,

                  color: textMutedColor,
                }}
              >
                Tu espacio seguro para expresar lo que sientes
              </Text>
            </View>

            {/* CALENDARIO */}

            {!esTelefono && (
              <View
                style={{
                  width: 46,

                  height: 46,

                  flexShrink: 0,

                  borderRadius: 15,

                  borderWidth: 1,

                  borderColor,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Ionicons name="calendar-outline" size={22} color={textColor} />
              </View>
            )}
          </Animated.View>

          {/* ==================================================
              CARD ¿CÓMO TE SIENTES?
          ================================================== */}

          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              minHeight: esTelefono ? 185 : 205,

              alignSelf: "center",

              marginBottom: esEscritorio ? 34 : 28,

              paddingHorizontal: esTelefono ? 22 : 30,

              paddingVertical: esTelefono ? 22 : 28,

              borderRadius: 26,

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
                width: esTelefono ? "60%" : "64%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 26 : esTelefono ? 22 : 24,

                  lineHeight: esEscritorio ? 33 : esTelefono ? 28 : 31,

                  color: textColor,
                }}
              >
                ¿Cómo te{"\n"}sientes hoy?
              </Text>

              <Text
                style={{
                  marginTop: 10,

                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefono ? 14 : 15,

                  lineHeight: esTelefono ? 20 : 22,

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

                right: esTelefono ? 18 : 30,

                bottom: esTelefono ? 22 : 25,

                width: esTelefono ? 100 : 120,

                height: esTelefono ? 100 : 120,

                borderRadius: 28,

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
              <Ionicons
                name="heart"
                size={esTelefono ? 32 : 38}
                color={textOnPrimaryColor}
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

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              marginBottom: 30,
            }}
          >
            <Text
              style={{
                marginBottom: 4,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 21 : 20,

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
              <View
                style={{
                  minHeight: 100,

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: 14,

                    color: textMutedColor,
                  }}
                >
                  Cargando emociones...
                </Text>
              </View>
            ) : emociones.length === 0 ? (
              <View
                style={{
                  minHeight: 100,

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: 14,

                    color: textMutedColor,
                  }}
                >
                  No hay emociones disponibles.
                </Text>
              </View>
            ) : (
              <View
                onLayout={medirGridEmociones}
                style={{
                  width: "100%",

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

              maxWidth: maxWidthFormulario,

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

              maxWidth: maxWidthFormulario,

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
