import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";

import {
  supabase,
} from "@/lib/supabase";

import {
  generarPlanBienestar,
  obtenerPlanBienestar,
  PlanBienestar as TipoPlanBienestar,
} from "@/services/entrevista/planBienestarService";

// ==========================================================
// TIPOS Y VALIDACIÓN
// ==========================================================

type Props = {
  modo:
    | "entrevista"
    | "historial";
};

function esUUID(valor: string | undefined): valor is string {
  return (
    !!valor &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valor,
    )
  );

}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function PlanBienestar({
  modo,
}: Props) {

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();


  const {
    width,
  } =
    useWindowDimensions();


  const movil =
    width < 600;


  const params =
    useLocalSearchParams<{
      id: string;
    }>();


  const idEntrevista =
    Array.isArray(
      params.id
    )
      ? params.id[0]
      : params.id;


  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );


  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );


  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );

  const textColor = useThemeColor({}, "text");


  const textColor =
    useThemeColor(
      {},
      "text"
    );


  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");


  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADOS
  // ========================================================

  const [plan, setPlan] = useState<TipoPlanBienestar | null>(null);

  const [cargando, setCargando] = useState(true);

  const [finalizando, setFinalizando] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // RESPONSIVE
  // ========================================================


  const secondarySoftColor =
    useThemeColor(
      {},
      "secondarySoft"
    );


  const accentSoftColor =
    useThemeColor(
      {},
      "accentSoft"
    );


  const paddingBottom = esEscritorio ? 64 : Math.max(130, insets.bottom + 110);

  // ========================================================
  // CARGAR PLAN
  // ========================================================

  useEffect(() => {
    if (!esUUID(idEntrevista)) {
      setError("No se encontró una entrevista válida.");


      if (
        !esUUID(
          idEntrevista
        )
      ) {

    const idValido = idEntrevista;


    async function cargarPlan() {
      try {
        setCargando(true);
        setError(null);

        // Buscar plan existente

        const existente = await obtenerPlanBienestar(idValido);


        if (existente) {
          setPlan(existente);
          return;
        }

        // En historial no se genera un plan nuevo

          setCargando(
            true
          );


        // Consultar resultados

        const { data, error: consultaError } = await supabase
          .from("resultado_entrevista")
          .select(
            `
            porcentaje,
            nivel,
            modulo_entrevista!inner(
              codigo,
              nombre
            )
          `,
          )
          .eq("id_entrevista", idValido)
          .order("porcentaje", {
            ascending: false,
          });

        if (consultaError) {
          throw consultaError;
        }

          // ==================================================
          // 4. GENERAR PLAN
          // ==================================================

          const nuevoPlan =
            await generarPlanBienestar(
              idEntrevista,
              resultados
            );

          return {
            codigo: modulo?.codigo ?? "",
            nombre: modulo?.nombre ?? "",


          console.log(
            "PLAN LISTO:",
            nuevoPlan
          );

        // Generar plan

        const nuevoPlan = await generarPlanBienestar(idValido, resultados);

        if (activo) {
          setPlan(nuevoPlan);
        }
      } catch (e) {
        console.error("Error cargando plan:", e);

          if (
            activo
          ) {

            setError(
              e instanceof Error
                ? e.message
                : "No se pudo cargar tu plan de bienestar."
            );

          }


        } finally {

          if (
            activo
          ) {

            setCargando(
              false
            );

          }

        }

      }

    void cargarPlan();

      cargarPlan();


      return () => {

        activo =
          false;

      };

    },
    [
      idEntrevista,
      modo,
    ]
  );


  // ========================================================
  // FINALIZAR ENTREVISTA
  // ========================================================

  async function finalizar() {

    if (
      modo !==
        "entrevista" ||
      !esUUID(
        idEntrevista
      ) ||
      finalizando
    ) {
      return;
    }


    try {
      setFinalizando(true);
      setError(null);


      router.replace("/(tabs)/home");
    } catch (e) {
      console.error("Error al finalizar entrevista:", e);

      setError(
        e instanceof Error
          ? e.message
          : "No se pudo finalizar la entrevista."
      );


    } finally {

      setFinalizando(
        false
      );

    }

  }


  // ========================================================
  // VOLVER
  // ========================================================

  function salir() {
    router.replace(
      modo === "historial" ? "/(tabs)/entrevistas" : "/(tabs)/home",
    );
  }


  // ========================================================
  // BOTÓN
  // ========================================================

  const boton = (
    texto: string,
    onPress: () => void,
    icono: keyof typeof Ionicons.glyphMap,
    deshabilitado = false,
  ) => (
    <Pressable
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => ({
        width: esEscritorio ? 310 : "100%",

        alignSelf: esEscritorio ? "flex-end" : "stretch",

        borderRadius: 15,
        overflow: "hidden",

        opacity: deshabilitado ? 0.6 : pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          minHeight: 54,

          paddingHorizontal: 16,
          paddingVertical: 12,

          borderRadius: 15,

          backgroundColor: deshabilitado ? disabledColor : primaryColor,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

          gap: 10,
        }}
      >
        {deshabilitado && (
          <ActivityIndicator size="small" color={textOnPrimaryColor} />
        )}

        <Text
          style={{
            fontFamily: "Nunito-Bold",

            fontSize: 14,
            lineHeight: 20,

            color: textOnPrimaryColor,
            textAlign: "center",
          }}
        >
          {texto}
        </Text>

        {!deshabilitado && (
          <Ionicons name={icono} size={20} color={textOnPrimaryColor} />
        )}
      </View>
    </Pressable>
  );


  // ========================================================
  // CARGANDO / SIN PLAN
  // ========================================================

  if (cargando || !plan) {
    return (
      <SafeAreaView
        edges={[]}
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <View
          style={{
            flex: 1,

            paddingHorizontal,

            justifyContent: "center",
            alignItems: "center",

            gap: 14,
          }}
        >

          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 23,

              backgroundColor: primarySoftColor,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cargando ? (
              <ActivityIndicator size="large" color={primaryColor} />
            ) : (
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={primaryColor}
              />
            )}
          </View>


          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 21,

              textAlign: "center",
              color: textColor,
            }}
          >
            {cargando
              ? modo === "historial"
                ? "Cargando tu plan"
                : "Preparando tu plan"
              : modo === "historial"
                ? "No pudimos cargar este plan"
                : "No pudimos preparar tu plan"}
          </Text>


          <Text
            style={{
              maxWidth: 380,

              fontFamily: "Nunito-Medium",

              fontSize: 14,
              lineHeight: 21,

              textAlign: "center",
              color: textSecondaryColor,
            }}
          >
            {cargando
              ? modo === "historial"
                ? "Estamos recuperando el plan asociado a esta entrevista."
                : "Estamos organizando algunas acciones para acompañar tu bienestar."
              : (error ?? "Inténtalo nuevamente más tarde.")}
          </Text>

          {!cargando && (
            <View
              style={{
                marginTop: 12,

                width: esEscritorio ? 310 : "100%",
              }}
            >
              {boton(
                modo === "historial"
                  ? "Volver a mis entrevistas"
                  : "Volver al inicio",
                salir,
                "arrow-back",
              )}
            </View>
          )}
        </View>

      </SafeAreaView>

    );

  }


  // ========================================================
  // PANTALLA PRINCIPAL
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
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: esEscritorio ? 32 : 24,
          paddingBottom,
          paddingHorizontal,
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: maxWidthPantalla,
            alignSelf: "center",
          }}
        >

          <View
            style={[
              styles.headerIcono,

              maxWidth: maxWidthContenido,
              alignSelf: "center",
            }}
          >
            {/* ENCABEZADO */}

            <Animated.View
              entering={FadeInUp.duration(450)}
              style={{
                alignItems: "center",
                gap: 9,

                marginBottom: 28,
              }}
            >
              <View
                style={{
                  width: esTelefono ? 58 : 72,
                  height: esTelefono ? 58 : 72,

                  borderRadius: 22,

                  backgroundColor: primarySoftColor,

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="leaf" size={27} color={primaryColor} />
              </View>

              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 26 : esTablet ? 30 : 34,

                  lineHeight: esTelefono ? 34 : 42,

                  textAlign: "center",
                  color: textColor,
                }}
              >
                {modo === "historial"
                  ? "Plan de bienestar"
                  : "Tu plan de bienestar"}
              </Text>

              <Text
                style={{
                  maxWidth: 600,

                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefono ? 14 : 16,

                  lineHeight: 22,
                  textAlign: "center",

                  color: textSecondaryColor,
                }}
              >
                {modo === "historial"
                  ? "Estas son las recomendaciones asociadas a esta evaluación."
                  : "Pequeñas acciones que puedes incorporar a tu ritmo."}
              </Text>
            </Animated.View>

            {/* OBJETIVO PRINCIPAL */}

            <Animated.View
              entering={FadeInUp.delay(120).duration(450)}
              style={{
                padding: esTelefono ? 20 : 27,

                borderRadius: 22,
                backgroundColor: primaryColor,

                gap: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",

                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,

                    borderRadius: 16,
                    flexShrink: 0,

                    backgroundColor: "rgba(255,255,255,0.18)",

                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="compass-outline"
                    size={23}
                    color={textOnPrimaryColor}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    minWidth: 0,
                    gap: 3,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: 11,
                      letterSpacing: 0.7,

                      color: "#EAF2FF",
                    }}
                  >
                    TU ENFOQUE
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: 19,
                      lineHeight: 25,

                      color: textOnPrimaryColor,
                    }}
                  >
                    Objetivo principal
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefono ? 15 : 17,

                  lineHeight: esTelefono ? 23 : 26,

                  color: textOnPrimaryColor,
                }}
              >
                TU ENFOQUE
              </Text>
            </Animated.View>

            {/* INTRODUCCIÓN */}

            <Animated.View
              entering={FadeIn.delay(200)}
              style={{
                marginTop: 26,
                marginBottom: 16,

                gap: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: 21,
                  color: textColor,
                }}
              >
                Objetivo principal
              </Text>

              <Text
                style={{
                  fontFamily: "Nunito-Medium",

                  fontSize: 14,
                  lineHeight: 22,

                  color: textSecondaryColor,
                }}
              >
                No tienes que hacer todo al mismo tiempo. Empieza con una
                actividad que se sienta posible para ti.
              </Text>
            </Animated.View>

            {/* ACTIVIDADES */}

            <View
              style={{
                width: "100%",

                flexDirection: esEscritorio ? "row" : "column",

                flexWrap: esEscritorio ? "wrap" : "nowrap",

                gap: 14,
              }}
            >
              {plan.actividades_recomendadas.length ? (
                plan.actividades_recomendadas.map((actividad, index) => (
                  <Animated.View
                    key={`${actividad.codigo}-${index}`}
                    entering={FadeInUp.delay(240 + index * 70).duration(450)}
                    style={{
                      width: esEscritorio ? "48%" : "100%",

                      flexGrow: esEscritorio ? 1 : 0,

                      backgroundColor: surfaceColor,

                      borderColor,
                      borderWidth: 1,
                      borderRadius: 20,

                      padding: esTelefono ? 16 : 20,

                      gap: 14,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",

                        gap: 11,
                      }}
                    >
                      {/* NÚMERO */}

                      <View
                        style={{
                          width: 30,
                          height: 30,

                          borderRadius: 15,

                          backgroundColor: primarySoftColor,

                          alignItems: "center",
                          justifyContent: "center",

                          flexShrink: 0,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: 13,

                            color: primaryColor,
                          }}
                        >
                          {index + 1}
                        </Text>

                      </View>

                      {/* ICONO */}

                      <View
                        style={{
                          width: 43,
                          height: 43,

                          borderRadius: 13,

                          backgroundColor: primarySoftColor,

                          alignItems: "center",
                          justifyContent: "center",

                          flexShrink: 0,
                        }}
                      >
                        <Ionicons
                          name={
                            actividad.icono as keyof typeof Ionicons.glyphMap
                          }
                          size={21}
                          color={primaryColor}
                        />
                      </View>

                      {/* TÍTULO */}

                      <Text
                        style={{
                          flex: 1,
                          minWidth: 0,

                          fontFamily: "Nunito-Bold",

                          fontSize: esTelefono ? 15 : 17,

                          lineHeight: 22,

                          color: textColor,
                        }}
                      >
                        {actividad.titulo}
                      </Text>
                    </View>

                    {/* DESCRIPCIÓN */}

                    <Text
                      style={{
                        fontFamily: "Nunito-Medium",

                        fontSize: 13,
                        lineHeight: 21,

                        color: textSecondaryColor,
                      }}
                    >
                      {actividad.descripcion}
                    </Text>
                  </Animated.View>
                ))
              ) : (
                <View
                  style={{
                    width: "100%",

                    padding: 24,

                    backgroundColor: surfaceColor,

                    borderColor,
                    borderWidth: 1,

                    borderRadius: 20,

                    alignItems: "center",
                    gap: 10,
                  }}
                >

                  <View
                    style={{
                      width: 50,
                      height: 50,

                      borderRadius: 16,

                      backgroundColor: secondarySoftColor,

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >

                    <Ionicons
                      name="leaf-outline"
                      size={24}
                      color={secondaryColor}
                    />

                  </View>


                  <Text
                    style={{
                      fontFamily: "Nunito-Medium",

                      fontSize: 14,
                      lineHeight: 21,

                      textAlign: "center",

                      color: textSecondaryColor,
                    }}
                  >
                    Continúa fortaleciendo los hábitos que actualmente favorecen tu bienestar.
                  </Text>

                </View>

            {/* RECORDATORIO */}

            <Animated.View
              entering={FadeIn.delay(500)}
              style={{
                width: "100%",

                marginTop: 24,

                borderRadius: 20,

                borderWidth: 1,
                borderColor: secondaryColor,

                backgroundColor: secondarySoftColor,

                padding: esTelefono ? 16 : 20,

                flexDirection: "row",
                alignItems: "flex-start",

                gap: 12,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,

                  flexShrink: 0,
                  borderRadius: 13,

                  backgroundColor: surfaceColor,

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={22}
                  color={secondaryColor}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",

                    fontSize: 16,
                    lineHeight: 22,

                    color: textColor,
                  }}
                >
                  Avanza a tu propio ritmo
                </Text>

                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: 13,
                    lineHeight: 20,

                    color: textSecondaryColor,
                  }}
                >
                  Tu plan puede cambiar con el tiempo. Lo importante es observar
                  cómo te sientes y avanzar de forma gradual.
                </Text>
              </View>
            </Animated.View>

            {/* AVISO */}

            <View
              style={{
                width: "100%",

                marginTop: 18,
                padding: 16,

                borderWidth: 1,
                borderColor,

                borderRadius: 18,

                backgroundColor: surfaceSecondaryColor,

                flexDirection: "row",
                alignItems: "flex-start",

                gap: 10,
              }}
            >

              <Ionicons
                name="information-circle-outline"
                size={21}
                color={textMutedColor}
              />


              <Text
                style={{
                  flex: 1,
                  minWidth: 0,

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,
                  lineHeight: 19,

                  color: textSecondaryColor,
                }}
              >
                {error}
              </Text>

            {/* ERROR AL FINALIZAR */}

            {error && (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={{
                  width: "100%",

                  marginTop: 16,
                  padding: 14,

                  borderRadius: 15,

                  backgroundColor: accentSoftColor,

                  borderColor: accentColor,

                  borderWidth: 1,

                  flexDirection: "row",
                  alignItems: "center",

                  gap: 10,
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color={accentColor}
                />

                <Text
                  style={{
                    flex: 1,
                    minWidth: 0,

                    color: textColor,

                    fontFamily: "Nunito-Medium",

                    fontSize: 13,
                  }}
                >

            {/* FINALIZAR / REGRESAR */}

            <View
              style={{
                marginTop: 24,
              }}
            >
              {modo === "entrevista"
                ? boton(
                  finalizando ? "Finalizando..." : "Finalizar entrevista",
                  finalizar,
                  "checkmark-circle-outline",
                  finalizando,
                )
                : boton("Volver a mis entrevistas", salir, "arrow-back")}
            </View>

            {modo === "entrevista" && (
              <Text
                style={{
                  maxWidth: esEscritorio ? 310 : undefined,

                  alignSelf: esEscritorio ? "flex-end" : "center",

                  marginTop: 10,

                  textAlign: esEscritorio ? "right" : "center",

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,
                  lineHeight: 18,

                  color: textMutedColor,
                }}
              >
                Al finalizar, esta evaluación se guardará en tu historial.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>

  );

}