import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
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

// ==========================================================
// PANTALLA
// ==========================================================

export default function AnalizandoPerfil() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // FUENTES
  // ========================================================

  const [fontsLoaded] = useFonts({
    "Nunito-Medium": require("@/assets/fonts/Nunito-Medium.ttf"),

    "Nunito-SemiBold": require("@/assets/fonts/Nunito-SemiBold.ttf"),

    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
  });

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

  const accentColor = useThemeColor({}, "accent");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADO
  // ========================================================

  const [analisisTerminado, setAnalisisTerminado] = useState(false);

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

  const paddingTop = esEscritorio ? 28 : Math.max(insets.top + 10, 18);

  const paddingBottom = esEscritorio ? 48 : Math.max(insets.bottom + 28, 40);

  const tamañoAnimacion = esEscritorio ? 240 : esTablet ? 215 : 190;

  const tamañoOnda = esEscritorio ? 150 : esTablet ? 135 : 120;

  const tamañoExterior = esEscritorio ? 158 : esTablet ? 144 : 128;

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

          easing: Easing.out(Easing.ease),
        }),

        withTiming(0, {
          duration: 350,

          easing: Easing.in(Easing.ease),
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

            easing: Easing.out(Easing.ease),
          }),
        ),

        withTiming(0, {
          duration: 350,

          easing: Easing.in(Easing.ease),
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

            easing: Easing.out(Easing.ease),
          }),
        ),

        withTiming(0, {
          duration: 350,

          easing: Easing.in(Easing.ease),
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

    // Por ahora se mantiene la simulación original.
    const temporizador = setTimeout(() => {
      setAnalisisTerminado(true);
    }, 4000);

    return () => {
      clearTimeout(temporizador);

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

  function verPlan() {
    // Conservamos el comportamiento actual.
    // Cuando tengas la ruta definitiva del plan,
    // aquí puedes reemplazar el console.log por router.push().
    console.log("Aquí irá la pantalla del plan personalizado");
  }

  // ========================================================
  // CARGA DE FUENTES
  // ========================================================

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
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
          }}
        >
          {/* ==================================================
              CABECERA
          ================================================== */}

          <View
            style={{
              minHeight: 64,

              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 46,
                height: 46,

                borderWidth: 1,
                borderRadius: 15,

                borderColor,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
              })}
            >
              <Ionicons name="arrow-back" size={23} color={textColor} />
            </Pressable>

            <Image
              source={require("@/assets/images_kids/logo_horizontal.png")}
              resizeMode="contain"
              style={{
                width: esEscritorio ? 110 : 95,

                height: 55,

                marginLeft: 12,
              }}
            />
          </View>

          {/* ==================================================
              CONTENIDO
          ================================================== */}

          <View
            style={{
              flex: 1,

              width: "100%",
              maxWidth: maxWidthContenido,

              alignSelf: "center",

              justifyContent: "center",

              alignItems: "center",

              marginTop: esEscritorio ? 20 : 10,
            }}
          >
            {/* ==================================================
                TARJETA
            ================================================== */}

            <View
              style={{
                width: "100%",

                alignItems: "center",

                paddingHorizontal: esEscritorio ? 44 : esTablet ? 34 : 18,

                paddingVertical: esEscritorio ? 40 : esTablet ? 34 : 26,

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
                    width: tamañoExterior,

                    height: tamañoExterior,

                    borderRadius: tamañoExterior / 2,

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
                  marginTop: esEscritorio ? 16 : 12,

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

                  fontSize: esEscritorio ? 16 : 14,

                  lineHeight: esEscritorio ? 24 : 21,

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

              {!analisisTerminado && (
                <>
                  <Animated.View
                    entering={FadeIn.delay(400).duration(500)}
                    style={{
                      marginTop: 28,

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

                            backgroundColor: accentColor,
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

                            backgroundColor: secondaryColor,
                          },

                          estiloIndicadorTres,
                        ]}
                      />
                    </View>
                  </Animated.View>

                  <Text
                    style={{
                      marginTop: 20,

                      maxWidth: 420,

                      fontFamily: "Nunito-Medium",

                      fontSize: 12,

                      lineHeight: 18,

                      textAlign: "center",

                      color: textMutedColor,
                    }}
                  >
                    Estamos preparando una experiencia adaptada a tus
                    respuestas.
                  </Text>
                </>
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
                    Tu perfil está listo.
                  </Text>

                  <Pressable
                    onPress={verPlan}
                    style={({ pressed }) => ({
                      width: "100%",

                      maxWidth: esEscritorio ? 330 : 300,

                      minHeight: 56,

                      marginTop: 22,

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
                        flex: 1,

                        fontFamily: "Nunito-Bold",

                        fontSize: 16,

                        textAlign: "center",

                        color: textOnPrimaryColor,
                      }}
                    >
                      Ver mi plan
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={21}
                      color={textOnPrimaryColor}
                    />
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
