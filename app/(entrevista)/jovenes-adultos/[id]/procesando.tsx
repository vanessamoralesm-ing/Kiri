import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { procesarResultadosEntrevista } from "@/services/entrevista/procesamientoEntrevistaService";

// ==========================================================
// PANTALLA
// ==========================================================

export default function ProcesandoEntrevistaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

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

  const secondaryColor = useThemeColor({}, "secondary");
  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");
  const accentSoftColor = useThemeColor({}, "accentSoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");
  const dangerColor = useThemeColor({}, "danger");

  // ========================================================
  // ESTADOS
  // ========================================================

  const [analisisTerminado, setAnalisisTerminado] = useState(false);

  const [errorProcesamiento, setErrorProcesamiento] = useState<string | null>(
    null,
  );

  // ========================================================
  // VALORES ANIMADOS
  // ========================================================

  const ondaUno = useSharedValue(0);
  const ondaDos = useSharedValue(0);

  const pulsoCentro = useSharedValue(1);

  const indicadorUno = useSharedValue(0);
  const indicadorDos = useSharedValue(0);
  const indicadorTres = useSharedValue(0);

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthPantalla = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthContenido = esEscritorio ? 700 : esTablet ? 600 : undefined;

  const paddingTop = esEscritorio ? 36 : Math.max(insets.top + 20, 28);

  const paddingBottom = esEscritorio ? 50 : Math.max(insets.bottom + 30, 42);

  const tamañoAnimacion = esEscritorio ? 240 : esTablet ? 215 : 190;

  const tamañoOnda = esEscritorio ? 150 : esTablet ? 135 : 120;

  const tamañoCirculoExterior = esEscritorio ? 158 : esTablet ? 142 : 128;

  const tamañoCentro = esEscritorio ? 98 : esTablet ? 90 : 82;

  // ========================================================
  // ANIMACIONES
  // ========================================================

  useEffect(() => {
    ondaUno.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1900,
          easing: Easing.out(Easing.cubic),
        }),

        withTiming(0, {
          duration: 0,
        }),
      ),
      -1,
      false,
    );

    ondaDos.value = withRepeat(
      withSequence(
        withDelay(
          800,
          withTiming(1, {
            duration: 1900,

            easing: Easing.out(Easing.cubic),
          }),
        ),

        withTiming(0, {
          duration: 0,
        }),
      ),
      -1,
      false,
    );

    pulsoCentro.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 950,

          easing: Easing.inOut(Easing.ease),
        }),

        withTiming(1, {
          duration: 950,

          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    indicadorUno.value = withRepeat(
      withSequence(
        withTiming(-6, {
          duration: 350,
        }),

        withTiming(0, {
          duration: 350,
        }),

        withDelay(
          450,
          withTiming(0, {
            duration: 1,
          }),
        ),
      ),
      -1,
      false,
    );

    indicadorDos.value = withRepeat(
      withSequence(
        withDelay(
          150,
          withTiming(-6, {
            duration: 350,
          }),
        ),

        withTiming(0, {
          duration: 350,
        }),

        withDelay(
          300,
          withTiming(0, {
            duration: 1,
          }),
        ),
      ),
      -1,
      false,
    );

    indicadorTres.value = withRepeat(
      withSequence(
        withDelay(
          300,
          withTiming(-6, {
            duration: 350,
          }),
        ),

        withTiming(0, {
          duration: 350,
        }),

        withDelay(
          150,
          withTiming(0, {
            duration: 1,
          }),
        ),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(ondaUno);

      cancelAnimation(ondaDos);

      cancelAnimation(pulsoCentro);

      cancelAnimation(indicadorUno);

      cancelAnimation(indicadorDos);

      cancelAnimation(indicadorTres);
    };
  }, [
    ondaUno,
    ondaDos,
    pulsoCentro,
    indicadorUno,
    indicadorDos,
    indicadorTres,
  ]);

  // ========================================================
  // PROCESAMIENTO
  // ========================================================

  useEffect(() => {
    if (!idEntrevista || idEntrevista === "[id]") {
      setErrorProcesamiento("No se encontró una entrevista válida.");

      return;
    }

    let activo = true;

    async function procesar() {
      try {
        setErrorProcesamiento(null);

        setAnalisisTerminado(false);

        const [, resultados] = await Promise.all([
          new Promise<void>((resolve) => setTimeout(resolve, 4000)),

          procesarResultadosEntrevista(idEntrevista!),
        ]);

        if (!activo) {
          return;
        }

        console.log("====================================");

        console.log("ID ENTREVISTA:", idEntrevista);

        console.log("RESULTADOS ENTREVISTA:", resultados);

        console.log("====================================");

        setAnalisisTerminado(true);
      } catch (error) {
        if (!activo) {
          return;
        }

        console.error("ERROR PROCESANDO ENTREVISTA:", error);

        setErrorProcesamiento(
          error instanceof Error
            ? error.message
            : "No se pudieron procesar los resultados.",
        );
      }
    }

    procesar();

    return () => {
      activo = false;
    };
  }, [idEntrevista]);

  // ========================================================
  // ESTILOS ANIMADOS
  // ========================================================

  const estiloOndaUno = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + ondaUno.value * 0.45,
      },
    ],

    opacity: 0.35 - ondaUno.value * 0.35,
  }));

  const estiloOndaDos = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + ondaDos.value * 0.45,
      },
    ],

    opacity: 0.28 - ondaDos.value * 0.28,
  }));

  const estiloCentro = useAnimatedStyle(() => ({
    transform: [
      {
        scale: pulsoCentro.value,
      },
    ],
  }));

  const estiloIndicadorUno = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: indicadorUno.value,
      },
    ],

    opacity: indicadorUno.value < 0 ? 1 : 0.45,
  }));

  const estiloIndicadorDos = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: indicadorDos.value,
      },
    ],

    opacity: indicadorDos.value < 0 ? 1 : 0.45,
  }));

  const estiloIndicadorTres = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: indicadorTres.value,
      },
    ],

    opacity: indicadorTres.value < 0 ? 1 : 0.45,
  }));

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function continuar() {
    if (!idEntrevista || idEntrevista === "[id]") {
      return;
    }

    router.replace({
      pathname: "/(entrevista)/jovenes-adultos/[id]/resultado",

      params: {
        id: idEntrevista,
      },
    });
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <SafeAreaView
      edges={[]}
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,

          paddingTop,
          paddingBottom,
        }}
      >
        <View
          style={{
            flex: 1,

            width: "100%",
            maxWidth: maxWidthPantalla,

            alignSelf: "center",

            paddingHorizontal,

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          {/* ==================================================
              TARJETA PRINCIPAL
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,

              alignItems: "center",

              paddingHorizontal: esEscritorio ? 44 : esTablet ? 36 : 18,

              paddingVertical: esEscritorio ? 42 : esTablet ? 36 : 28,

              borderWidth: esTelefono ? 0 : 1,

              borderRadius: esTelefono ? 0 : 28,

              borderColor,

              backgroundColor: esTelefono ? "transparent" : surfaceColor,

              ...(Platform.OS === "web" && !esTelefono
                ? ({
                  boxShadow: "0px 6px 22px rgba(0,0,0,0.045)",
                } as any)
                : {}),

              ...(Platform.OS === "ios" && !esTelefono
                ? {
                  shadowColor: "#000000",

                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },

                  shadowOpacity: 0.05,

                  shadowRadius: 12,
                }
                : {}),

              ...(Platform.OS === "android" && !esTelefono
                ? {
                  elevation: 3,
                }
                : {}),
            }}
          >
            {/* ==================================================
                ANIMACIÓN
            ================================================== */}

            <View
              style={{
                width: tamañoAnimacion,

                height: tamañoAnimacion,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",

                    width: tamañoOnda,

                    height: tamañoOnda,

                    borderRadius: tamañoOnda / 2,

                    backgroundColor: primaryColor,
                  },

                  estiloOndaUno,
                ]}
              />

              <Animated.View
                style={[
                  {
                    position: "absolute",

                    width: tamañoOnda,

                    height: tamañoOnda,

                    borderRadius: tamañoOnda / 2,

                    backgroundColor: accentColor,
                  },

                  estiloOndaDos,
                ]}
              />

              <View
                style={{
                  width: tamañoCirculoExterior,

                  height: tamañoCirculoExterior,

                  borderRadius: tamañoCirculoExterior / 2,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Animated.View
                  style={[
                    {
                      width: tamañoCentro,

                      height: tamañoCentro,

                      borderRadius: tamañoCentro / 2,

                      alignItems: "center",

                      justifyContent: "center",

                      backgroundColor: primaryColor,
                    },

                    estiloCentro,
                  ]}
                >
                  <Ionicons
                    name="sparkles"
                    size={esEscritorio ? 36 : 29}
                    color={textOnPrimaryColor}
                  />
                </Animated.View>
              </View>
            </View>

            {/* ==================================================
                TÍTULO
            ================================================== */}

            <Animated.Text
              entering={FadeInUp.duration(600)}
              style={{
                marginTop: esEscritorio ? 18 : 14,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 30 : esTablet ? 27 : 23,

                lineHeight: esEscritorio ? 38 : 30,

                textAlign: "center",

                color: textColor,
              }}
            >
              Analizando tu perfil
            </Animated.Text>

            {/* ==================================================
                DESCRIPCIÓN
            ================================================== */}

            <Animated.Text
              entering={FadeIn.delay(200).duration(600)}
              style={{
                marginTop: 10,

                maxWidth: esEscritorio ? 500 : 390,

                fontFamily: "Nunito-Medium",

                fontSize: esEscritorio ? 16 : 15,

                lineHeight: esEscritorio ? 24 : 22,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
              Estamos procesando tus respuestas para construir un camino hacia
              tu bienestar.
            </Animated.Text>

            {/* ==================================================
                PROCESANDO
            ================================================== */}

            {!analisisTerminado && !errorProcesamiento && (
              <Animated.View
                entering={FadeIn.delay(400).duration(500)}
                style={{
                  marginTop: esEscritorio ? 28 : 24,

                  minHeight: 46,

                  paddingHorizontal: 18,

                  paddingVertical: 10,

                  borderWidth: 1,

                  borderRadius: 999,

                  borderColor,

                  flexDirection: "row",

                  alignItems: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",

                    fontSize: 14,

                    color: textSecondaryColor,
                  }}
                >
                  Procesando
                </Text>

                <View
                  style={{
                    marginLeft: 12,

                    flexDirection: "row",

                    alignItems: "center",

                    gap: 6,
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        width: 8,
                        height: 8,

                        borderRadius: 4,

                        backgroundColor: primaryColor,
                      },

                      estiloIndicadorUno,
                    ]}
                  />

                  <Animated.View
                    style={[
                      {
                        width: 8,
                        height: 8,

                        borderRadius: 4,

                        backgroundColor: primaryColor,
                      },

                      estiloIndicadorDos,
                    ]}
                  />

                  <Animated.View
                    style={[
                      {
                        width: 8,
                        height: 8,

                        borderRadius: 4,

                        backgroundColor: primaryColor,
                      },

                      estiloIndicadorTres,
                    ]}
                  />
                </View>
              </Animated.View>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {errorProcesamiento && (
              <Animated.View
                entering={FadeInUp.duration(500)}
                style={{
                  width: "100%",

                  maxWidth: 460,

                  marginTop: 26,

                  padding: 18,

                  borderWidth: 1,

                  borderRadius: 18,

                  borderColor,

                  alignItems: "center",

                  backgroundColor: surfaceSecondaryColor,
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,

                    borderRadius: 23,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: accentSoftColor,
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={25}
                    color={dangerColor}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 10,

                    fontFamily: "Nunito-SemiBold",

                    fontSize: 14,

                    lineHeight: 21,

                    textAlign: "center",

                    color: textSecondaryColor,
                  }}
                >
                  {errorProcesamiento}
                </Text>
              </Animated.View>
            )}

            {/* ==================================================
                FINALIZADO
            ================================================== */}

            {analisisTerminado && (
              <Animated.View
                entering={FadeInUp.duration(700)}
                style={{
                  width: "100%",

                  marginTop: 26,

                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 54,
                    height: 54,

                    borderRadius: 27,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: secondaryColor,
                  }}
                >
                  <Ionicons
                    name="checkmark"
                    size={29}
                    color={textOnPrimaryColor}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 12,

                    fontFamily: "Nunito-SemiBold",

                    fontSize: esEscritorio ? 16 : 15,

                    textAlign: "center",

                    color: textSecondaryColor,
                  }}
                >
                  Tu entrevista ha sido procesada.
                </Text>

                <Pressable
                  onPress={continuar}
                  style={({ pressed }) => ({
                    width: "100%",

                    maxWidth: esEscritorio ? 330 : 310,

                    minHeight: 56,

                    marginTop: 24,

                    paddingHorizontal: 20,

                    borderRadius: 16,

                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent: "center",

                    gap: 9,

                    backgroundColor: primaryColor,

                    opacity: pressed ? 0.84 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: 16,

                      color: textOnPrimaryColor,
                    }}
                  >
                    Ver mis resultados
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color={textOnPrimaryColor}
                  />
                </Pressable>
              </Animated.View>
            )}

            {/* ==================================================
                MENSAJE INFERIOR
            ================================================== */}

            {!errorProcesamiento && !analisisTerminado && (
              <Text
                style={{
                  marginTop: 22,

                  maxWidth: 420,

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  lineHeight: 18,

                  textAlign: "center",

                  color: textMutedColor,
                }}
              >
                Esto puede tomar unos segundos. Mantén esta pantalla abierta
                mientras preparamos tus resultados.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
