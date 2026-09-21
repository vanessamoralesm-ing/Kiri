import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
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

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { seccionesEntrevista } from "@/constants/preguntas_kids";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const PREGUNTAS_POR_PANTALLA = 1;

const tiposOpciones = ["verde", "azul", "amarillo", "morado"] as const;

const emojiOpcion = "🤔";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EntrevistaNinos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollEntrevistaRef = useRef<ScrollView>(null);

  const { esTelefono, esTablet, esEscritorio, width } = useResponsiveLayout();

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

  const accentColor = useThemeColor({}, "accent");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // FUENTES
  // ========================================================

  const [fontsLoaded] = useFonts({
    "Nunito-Medium": require("@/assets/fonts/Nunito-Medium.ttf"),

    "Nunito-SemiBold": require("@/assets/fonts/Nunito-SemiBold.ttf"),

    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
  });

  // ========================================================
  // ESTADOS
  // ========================================================

  const [numeroSeccion, setNumeroSeccion] = useState(0);

  const [paginaActual, setPaginaActual] = useState(0);

  const [respuestas, setRespuestas] = useState<{
    [clave: string]: string;
  }>({});

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const esTelefonoPequeno = width < 380;

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : 18;

  const maxWidthPantalla = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthContenido = esEscritorio ? 1040 : esTablet ? 760 : undefined;

  const paddingTop = esEscritorio ? 20 : Math.max(insets.top + 2, 8);

  const paddingBottom = esEscritorio ? 40 : Math.max(insets.bottom + 18, 26);

  // ========================================================
  // SCROLL
  // ========================================================

  function volverAlInicioPregunta() {
    scrollEntrevistaRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }

  // ========================================================
  // CARGA
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
  // DATOS ACTUALES
  // ========================================================

  const seccionActual = seccionesEntrevista[numeroSeccion];

  const indiceInicial = paginaActual * PREGUNTAS_POR_PANTALLA;

  const indiceFinal = indiceInicial + PREGUNTAS_POR_PANTALLA;

  const preguntasVisibles = seccionActual.preguntas.slice(
    indiceInicial,
    indiceFinal,
  );

  const totalPaginas = Math.ceil(
    seccionActual.preguntas.length / PREGUNTAS_POR_PANTALLA,
  );

  const esUltimaPagina = paginaActual === totalPaginas - 1;

  const esUltimaSeccion = numeroSeccion === seccionesEntrevista.length - 1;

  // ========================================================
  // RESPUESTAS
  // ========================================================

  function seleccionarRespuesta(indicePregunta: number, respuesta: string) {
    const clave = `${numeroSeccion}-${indicePregunta}`;

    setRespuestas((prev) => ({
      ...prev,
      [clave]: respuesta,
    }));
  }

  const paginaCompleta = preguntasVisibles.every((pregunta, indiceLocal) => {
    const indiceReal = indiceInicial + indiceLocal;

    const clave = `${numeroSeccion}-${indiceReal}`;

    const respuesta = respuestas[clave];

    return respuesta !== undefined && respuesta.trim() !== "";
  });

  // ========================================================
  // PROGRESO
  // ========================================================

  const totalPreguntas = seccionesEntrevista.reduce(
    (total, seccion) => total + seccion.preguntas.length,
    0,
  );

  const totalRespondidas = Object.values(respuestas).filter(
    (respuesta) => respuesta.trim() !== "",
  ).length;

  const porcentaje =
    totalPreguntas > 0
      ? Math.round((totalRespondidas / totalPreguntas) * 100)
      : 0;

  // ========================================================
  // CONTINUAR
  // ========================================================

  function continuar() {
    if (!paginaCompleta) {
      Alert.alert(
        "Falta una respuesta",
        "Debe responder la pregunta antes de continuar.",
      );

      return;
    }

    if (!esUltimaPagina) {
      volverAlInicioPregunta();

      setPaginaActual((prev) => prev + 1);

      return;
    }

    if (!esUltimaSeccion) {
      volverAlInicioPregunta();

      setNumeroSeccion((prev) => prev + 1);

      setPaginaActual(0);

      return;
    }

    console.log("Respuestas:", respuestas);

    router.replace("/ninos/analizando");
  }

  // ========================================================
  // REGRESAR
  // ========================================================

  function regresar() {
    if (paginaActual > 0) {
      volverAlInicioPregunta();

      setPaginaActual((prev) => prev - 1);

      return;
    }

    if (numeroSeccion > 0) {
      const seccionAnterior = seccionesEntrevista[numeroSeccion - 1];

      const paginasAnteriores = Math.ceil(
        seccionAnterior.preguntas.length / PREGUNTAS_POR_PANTALLA,
      );

      volverAlInicioPregunta();

      setNumeroSeccion((prev) => prev - 1);

      setPaginaActual(paginasAnteriores - 1);

      return;
    }

    router.back();
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
      <ImageBackground
        source={require("@/assets/images_kids/fondo_niños.png")}
        resizeMode="cover"
        imageStyle={{
          transform: [
            {
              translateY: -3,
            },
            {
              scale: esEscritorio ? 1 : 1.06,
            },
          ],
        }}
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        {/* ==================================================
            CONTENEDOR GENERAL
        ================================================== */}

        <View
          style={{
            flex: 1,

            width: "100%",
            maxWidth: maxWidthPantalla,

            alignSelf: "center",

            paddingTop,
          }}
        >
          {/* ==================================================
              ZONA SUPERIOR
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,

              alignSelf: "center",

              paddingHorizontal,
            }}
          >
            {/* ENCABEZADO */}

            <View
              style={{
                minHeight: esEscritorio ? 72 : 64,

                flexDirection: "row",

                alignItems: "center",
              }}
            >
              <Pressable
                onPress={regresar}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,

                  borderRadius: 14,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: pressed ? primarySoftColor : "transparent",
                })}
              >
                <Ionicons
                  name="arrow-back"
                  size={esEscritorio ? 28 : 26}
                  color={primaryColor}
                />
              </Pressable>

              <Image
                source={require("@/assets/images_kids/logo_horizontal.png")}
                resizeMode="contain"
                style={{
                  width: esEscritorio ? 120 : 105,

                  height: esEscritorio ? 64 : 58,

                  marginLeft: 8,
                }}
              />
            </View>

            {/* ==================================================
                INFORMACIÓN DE PROGRESO
            ================================================== */}

            <View
              style={{
                marginTop: esEscritorio ? 4 : 0,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <Text
                maxFontSizeMultiplier={1}
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 14 : 13,

                  color: primaryColor,
                }}
              >
                Sección {numeroSeccion + 1} de {seccionesEntrevista.length}
              </Text>

              <Text
                maxFontSizeMultiplier={1}
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 14 : 13,

                  color: primaryColor,
                }}
              >
                {porcentaje}% completado
              </Text>
            </View>

            {/* ==================================================
                BARRA DE SECCIONES
            ================================================== */}

            <View
              style={{
                width: "100%",

                marginTop: 12,
                marginBottom: 10,

                flexDirection: "row",

                alignItems: "center",
              }}
            >
              {seccionesEntrevista.map((seccion, indice) => {
                const estaActivo = indice === numeroSeccion;

                const completado = indice < numeroSeccion;

                return (
                  <View
                    key={seccion.titulo}
                    style={{
                      flex: 1,

                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: esEscritorio ? 28 : 24,

                        height: esEscritorio ? 28 : 24,

                        borderRadius: esEscritorio ? 14 : 12,

                        borderWidth: 3,

                        borderColor:
                          completado || estaActivo ? accentColor : borderColor,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: completado
                          ? accentColor
                          : surfaceColor,
                      }}
                    >
                      {estaActivo && !completado && (
                        <View
                          style={{
                            width: 10,
                            height: 10,

                            borderRadius: 5,

                            backgroundColor: accentColor,
                          }}
                        />
                      )}

                      {completado && (
                        <Ionicons
                          name="checkmark"
                          size={15}
                          color={textOnPrimaryColor}
                        />
                      )}
                    </View>

                    {indice < seccionesEntrevista.length - 1 && (
                      <View
                        style={{
                          flex: 1,

                          height: 2,

                          marginHorizontal: esEscritorio ? 10 : 7,

                          backgroundColor: completado
                            ? accentColor
                            : borderColor,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* ==================================================
              SCROLL DE PREGUNTA
          ================================================== */}

          <ScrollView
            ref={scrollEntrevistaRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              width: "100%",
            }}
            contentContainerStyle={{
              flexGrow: 1,

              paddingHorizontal,

              paddingBottom,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthContenido,

                alignSelf: "center",

                paddingTop: esEscritorio ? 14 : 8,
              }}
            >
              {preguntasVisibles.map((pregunta, indiceLocal) => {
                const indiceReal = indiceInicial + indiceLocal;

                const clave = `${numeroSeccion}-${indiceReal}`;

                const respuestaActual = respuestas[clave] || "";

                return (
                  <View
                    key={clave}
                    style={{
                      width: "100%",

                      minHeight: esEscritorio
                        ? 480
                        : esTablet
                          ? 520
                          : esTelefonoPequeno
                            ? 560
                            : 590,

                      borderWidth: 1,

                      borderRadius: esEscritorio ? 30 : 26,

                      borderColor,

                      paddingHorizontal: esEscritorio ? 32 : esTablet ? 26 : 20,

                      paddingTop: esEscritorio ? 28 : 22,

                      paddingBottom: esEscritorio ? 32 : 120,

                      backgroundColor: surfaceColor,

                      ...(Platform.OS === "web"
                        ? ({
                          boxShadow: "0px 5px 18px rgba(0,0,0,0.05)",
                        } as any)
                        : {}),

                      ...(Platform.OS === "ios"
                        ? {
                          shadowColor: "#000000",

                          shadowOffset: {
                            width: 0,
                            height: 4,
                          },

                          shadowOpacity: 0.05,

                          shadowRadius: 10,
                        }
                        : {}),

                      ...(Platform.OS === "android"
                        ? {
                          elevation: 3,
                        }
                        : {}),
                    }}
                  >
                    {/* ==================================================
                          PREGUNTA + MASCOTA EN ESCRITORIO
                      ================================================== */}

                    <View
                      style={{
                        flexDirection: esEscritorio ? "row" : "column",

                        alignItems: esEscritorio ? "flex-start" : "stretch",

                        gap: esEscritorio ? 28 : 0,
                      }}
                    >
                      {/* TEXTO Y OPCIONES */}

                      <View
                        style={{
                          flex: esEscritorio ? 1 : undefined,

                          minWidth: 0,
                        }}
                      >
                        {/* ENCABEZADO DE PREGUNTA */}

                        <View
                          style={{
                            flexDirection: "row",

                            alignItems: "flex-start",
                          }}
                        >
                          <View
                            style={{
                              width: esEscritorio ? 42 : 38,

                              height: esEscritorio ? 42 : 38,

                              flexShrink: 0,

                              borderRadius: esEscritorio ? 21 : 19,

                              alignItems: "center",

                              justifyContent: "center",

                              backgroundColor: primarySoftColor,
                            }}
                          >
                            <Text
                              maxFontSizeMultiplier={1}
                              style={{
                                fontFamily: "Nunito-Bold",

                                fontSize: 16,

                                color: textColor,
                              }}
                            >
                              {indiceReal + 1}.
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 1,
                              minWidth: 0,
                              marginLeft: 12,
                            }}
                          >
                            <Text
                              maxFontSizeMultiplier={1}
                              style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: esEscritorio
                                  ? 22
                                  : esTablet
                                    ? 21
                                    : 20,

                                lineHeight: esEscritorio ? 29 : 25,

                                color: textColor,
                              }}
                            >
                              {pregunta.texto}
                            </Text>

                            <Text
                              maxFontSizeMultiplier={1}
                              style={{
                                marginTop: 8,

                                fontFamily: "Nunito-Medium",

                                fontSize: 14,

                                lineHeight: 19,

                                color: textMutedColor,
                              }}
                            >
                              Elige la opción que mejor se ajuste al proceder de
                              su hijo/a.
                            </Text>
                          </View>
                        </View>

                        {/* ==================================================
                              OPCIONES
                          ================================================== */}

                        <View
                          style={{
                            width: "100%",

                            marginTop: esEscritorio ? 24 : 18,

                            gap: 10,
                          }}
                        >
                          {pregunta.opciones?.map((opcion, indiceOpcion) => {
                            const seleccionada = respuestaActual === opcion;

                            const tipo = tiposOpciones[indiceOpcion] ?? "azul";

                            let fondoOpcion = surfaceSecondaryColor;

                            let bordeOpcion = borderColor;

                            let fondoEmoji = primarySoftColor;

                            if (tipo === "verde") {
                              fondoOpcion = "#FAFFFB";

                              bordeOpcion = "#D6ECD9";

                              fondoEmoji = "#BEE3C2";
                            }

                            if (tipo === "azul") {
                              fondoOpcion = "#FAFCFF";

                              bordeOpcion = "#D6E6FA";

                              fondoEmoji = "#C9E0FC";
                            }

                            if (tipo === "amarillo") {
                              fondoOpcion = "#FFFDF8";

                              bordeOpcion = "#F7E6B8";

                              fondoEmoji = "#FFE39B";
                            }

                            if (tipo === "morado") {
                              fondoOpcion = "#FCFAFF";

                              bordeOpcion = "#E6DDF9";

                              fondoEmoji = "#D8CCFA";
                            }

                            return (
                              <Pressable
                                key={opcion}
                                hitSlop={4}
                                onPress={() =>
                                  seleccionarRespuesta(indiceReal, opcion)
                                }
                                style={({ pressed }) => ({
                                  width: "100%",

                                  minHeight: esEscritorio ? 58 : 52,

                                  paddingHorizontal: 13,

                                  paddingVertical: 8,

                                  borderWidth: seleccionada ? 2 : 1,

                                  borderRadius: 15,

                                  borderColor: seleccionada
                                    ? primaryColor
                                    : bordeOpcion,

                                  flexDirection: "row",

                                  alignItems: "center",

                                  backgroundColor: seleccionada
                                    ? primarySoftColor
                                    : fondoOpcion,

                                  opacity: pressed ? 0.84 : 1,
                                })}
                              >
                                <View
                                  style={{
                                    width: 38,

                                    height: 38,

                                    flexShrink: 0,

                                    marginRight: 12,

                                    borderRadius: 19,

                                    alignItems: "center",

                                    justifyContent: "center",

                                    backgroundColor: fondoEmoji,
                                  }}
                                >
                                  <Text
                                    maxFontSizeMultiplier={1}
                                    style={{
                                      fontSize: 21,
                                    }}
                                  >
                                    {emojiOpcion}
                                  </Text>
                                </View>

                                <Text
                                  maxFontSizeMultiplier={1}
                                  style={{
                                    flex: 1,

                                    fontFamily: "Nunito-SemiBold",

                                    fontSize: esEscritorio ? 15 : 14,

                                    lineHeight: 19,

                                    color: seleccionada
                                      ? primaryColor
                                      : textSecondaryColor,
                                  }}
                                >
                                  {opcion}
                                </Text>

                                {seleccionada && (
                                  <View
                                    style={{
                                      width: 28,

                                      height: 28,

                                      marginLeft: 8,

                                      borderRadius: 14,

                                      alignItems: "center",

                                      justifyContent: "center",

                                      backgroundColor: primaryColor,
                                    }}
                                  >
                                    <Ionicons
                                      name="checkmark"
                                      size={17}
                                      color={textOnPrimaryColor}
                                    />
                                  </View>
                                )}
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>

                      {/* ==================================================
                            MASCOTA — ESCRITORIO
                        ================================================== */}

                      {esEscritorio && (
                        <View
                          style={{
                            width: 260,

                            minHeight: 360,

                            flexShrink: 0,

                            alignItems: "center",

                            justifyContent: "flex-end",

                            borderRadius: 28,

                            backgroundColor: primarySoftColor,

                            overflow: "hidden",
                          }}
                        >
                          <Image
                            source={require("@/assets/gifs/kiri_pensando.gif")}
                            resizeMode="contain"
                            style={{
                              width: 285,

                              height: 300,

                              marginBottom: -15,
                            }}
                          />
                        </View>
                      )}
                    </View>

                    {/* ==================================================
                          MASCOTA — MÓVIL / TABLET
                      ================================================== */}

                    {!esEscritorio && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",

                          right: esTelefonoPequeno ? -18 : -24,

                          bottom: esTelefonoPequeno ? -6 : -14,

                          width: esTelefonoPequeno ? 180 : esTablet ? 230 : 220,

                          height: esTelefonoPequeno
                            ? 150
                            : esTablet
                              ? 190
                              : 180,

                          alignItems: "center",

                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={require("@/assets/gifs/kiri_pensando.gif")}
                          resizeMode="contain"
                          style={{
                            width: esTelefonoPequeno
                              ? 210
                              : esTablet
                                ? 260
                                : 250,

                            height: esTelefonoPequeno
                              ? 175
                              : esTablet
                                ? 220
                                : 205,
                          }}
                        />
                      </View>
                    )}
                  </View>
                );
              })}

              {/* ==================================================
                  BOTÓN
              ================================================== */}

              <View
                style={{
                  width: "100%",

                  marginTop: esEscritorio ? 22 : 14,

                  paddingBottom: 6,

                  alignItems: esEscritorio ? "flex-end" : "stretch",
                }}
              >
                <Pressable
                  onPress={continuar}
                  style={({ pressed }) => ({
                    width: esEscritorio ? 300 : "100%",

                    minHeight: 54,

                    borderRadius: 16,

                    alignItems: "center",

                    justifyContent: "center",

                    paddingHorizontal: 20,

                    backgroundColor: paginaCompleta ? primaryColor : "#BCC5D1",

                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text
                    maxFontSizeMultiplier={1}
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: 16,

                      color: textOnPrimaryColor,
                    }}
                  >
                    {esUltimaPagina && esUltimaSeccion
                      ? "Finalizar entrevista"
                      : "Continuar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
