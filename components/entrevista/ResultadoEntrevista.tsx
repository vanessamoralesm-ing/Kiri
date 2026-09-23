import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { supabase } from "@/lib/supabase";

// ==========================================================
// TIPOS
// ==========================================================

type NivelResultado = "BAJO" | "MODERADO" | "ALTO";

type Resultado = {
  id_resultado: string;
  id_modulo: string;
  codigo: string;
  nombre: string;
  puntaje: number;
  porcentaje: number;
  nivel: NivelResultado;
};

type Props = {
  modo: "entrevista" | "historial";
};

// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const ICONOS: Record<string, keyof typeof Ionicons.glyphMap> = {
  SOMATICO: "body-outline",
  ANSIEDAD_INSOMNIO: "moon-outline",
  SUENO: "bed-outline",
  APOYO_SOCIAL: "people-outline",
  VIDA_DIARIA: "calendar-outline",
  ESTADO_EMOCIONAL: "heart-outline",
};

function esUUID(valor: string | undefined): valor is string {
  return (
    !!valor &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valor,
    )
  );
}

function normalizarNivel(valor: unknown): NivelResultado {
  return valor === "ALTO" || valor === "MODERADO" ? valor : "BAJO";
}

function textoNivel(nivel: NivelResultado) {
  return nivel === "ALTO"
    ? "Mayor atención"
    : nivel === "MODERADO"
      ? "Atención moderada"
      : "Menor atención";
}

function descripcionNivel(nivel: NivelResultado) {
  return nivel === "ALTO"
    ? "Esta área puede beneficiarse de un mayor acompañamiento."
    : nivel === "MODERADO"
      ? "Conviene seguir observando y fortaleciendo esta área."
      : "Tus respuestas muestran menor dificultad en esta área.";
}

function porcentajeSeguro(valor: number): `${number}%` {
  const seguro = Math.min(100, Math.max(0, Number.isFinite(valor) ? valor : 0));

  return `${seguro}%`;
}

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function ResultadoEntrevista({ modo }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

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

  const dangerColor = useThemeColor({}, "danger");

  const warningColor = useThemeColor({}, "warning");

  const successColor = useThemeColor({}, "success");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADOS
  // ========================================================

  const [resultados, setResultados] = useState<Resultado[]>([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidth = esEscritorio ? 1080 : esTablet ? 760 : undefined;

  const maxWidthPantalla = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const paddingBottom = esEscritorio ? 64 : Math.max(130, insets.bottom + 110);

  // ========================================================
  // CARGAR RESULTADOS
  // ========================================================

  useEffect(() => {
    if (!esUUID(idEntrevista)) {
      setError("No se encontró una entrevista válida.");

      setCargando(false);
      return;
    }

    let activo = true;

    async function cargar() {
      try {
        setCargando(true);
        setError(null);

        const { data, error: consultaError } = await supabase
          .from("resultado_entrevista")
          .select(
            `
            id_resultado,
            id_modulo,
            puntaje,
            porcentaje,
            nivel,
            modulo_entrevista!inner(
              codigo,
              nombre
            )
          `,
          )
          .eq("id_entrevista", idEntrevista)
          .order("porcentaje", {
            ascending: false,
          });

        if (consultaError) {
          throw consultaError;
        }

        if (!activo) {
          return;
        }

        const lista: Resultado[] = (data ?? []).map((item: any) => {
          const modulo = Array.isArray(item.modulo_entrevista)
            ? item.modulo_entrevista[0]
            : item.modulo_entrevista;

          return {
            id_resultado: item.id_resultado,
            id_modulo: item.id_modulo,
            codigo: modulo?.codigo ?? "",
            nombre: modulo?.nombre ?? "Área de bienestar",
            puntaje: Number(item.puntaje ?? 0),
            porcentaje: Number(item.porcentaje ?? 0),
            nivel: normalizarNivel(item.nivel),
          };
        });

        setResultados(lista);
      } catch (e) {
        console.error("Error cargando resultados:", e);

        if (activo) {
          setError("No pudimos cargar tus resultados.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargar();

    return () => {
      activo = false;
    };
  }, [idEntrevista]);

  // ========================================================
  // CÁLCULOS
  // ========================================================

  const prioridades = useMemo(() => {
    if (resultados.length === 0) {
      return [];
    }

    const mayor = resultados[0].porcentaje;

    return resultados.filter(
      (item) => Math.abs(item.porcentaje - mayor) < 0.01,
    );
  }, [resultados]);

  const promedio = useMemo(
    () =>
      resultados.length
        ? resultados.reduce((suma, item) => suma + item.porcentaje, 0) /
        resultados.length
        : 0,
    [resultados],
  );

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function salir() {
    router.replace(
      modo === "historial" ? "/(tabs)/entrevistas" : "/(tabs)/home",
    );
  }

  function continuar() {
    if (!esUUID(idEntrevista)) {
      return;
    }

    if (modo === "historial") {
      router.push(`/(tabs)/entrevistas/${idEntrevista}/plan` as any);
    } else {
      router.replace(
        `/(entrevista)/jovenes-adultos/${idEntrevista}/plan` as any,
      );
    }
  }

  // ========================================================
  // BOTÓN PRINCIPAL
  // ========================================================

  const botonPrincipal = (
    texto: string,
    onPress: () => void,
    icono: keyof typeof Ionicons.glyphMap,
  ) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: esEscritorio ? 300 : "100%",
        alignSelf: esEscritorio ? "flex-end" : "stretch",

        borderRadius: 15,
        overflow: "hidden",

        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          minHeight: 52,
          paddingHorizontal: 18,
          paddingVertical: 12,

          borderRadius: 15,

          backgroundColor: primaryColor,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: 14,
            textAlign: "center",
            color: textOnPrimaryColor,
          }}
        >
          {texto}
        </Text>

        <Ionicons name={icono} size={20} color={textOnPrimaryColor} />
      </View>
    </Pressable>
  );

  // ========================================================
  // CARGANDO / ERROR
  // ========================================================

  if (cargando || error) {
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

            alignItems: "center",
            justifyContent: "center",

            gap: 14,
          }}
        >
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,

              backgroundColor: cargando ? primarySoftColor : accentSoftColor,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cargando ? (
              <ActivityIndicator color={primaryColor} size="large" />
            ) : (
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={accentColor}
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
              ? "Preparando tu perfil"
              : "No pudimos mostrar tus resultados"}
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
              ? "Estamos organizando los resultados de tu entrevista."
              : error}
          </Text>

          {error && (
            <View
              style={{
                marginTop: 12,
                width: esEscritorio ? 300 : "100%",
              }}
            >
              {botonPrincipal(
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
            style={{
              width: "100%",
              maxWidth,
              alignSelf: "center",
            }}
          >
            {/* ENCABEZADO */}

            <Animated.View
              entering={FadeInUp.duration(450)}
              style={{
                alignItems: "center",
                marginBottom: 28,
                gap: 9,
              }}
            >
              <View
                style={{
                  width: esTelefono ? 58 : 72,
                  height: esTelefono ? 58 : 72,

                  backgroundColor: primarySoftColor,

                  borderRadius: 22,

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="sparkles" size={28} color={primaryColor} />
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
                  ? "Perfil de bienestar"
                  : "Tu perfil de bienestar"}
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
                Una mirada general a las áreas que exploramos contigo.
              </Text>
            </Animated.View>

            {resultados.length === 0 ? (
              /* ESTADO SIN ÁREAS */

              <Animated.View
                entering={FadeInUp.duration(400)}
                style={{
                  backgroundColor: surfaceColor,

                  borderWidth: 1,
                  borderColor,
                  borderRadius: 22,

                  padding: 28,

                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,

                    backgroundColor: secondarySoftColor,

                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={28}
                    color={secondaryColor}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 20,

                    color: textColor,
                    textAlign: "center",
                  }}
                >
                  Todo se ve estable por ahora
                </Text>

                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: 14,
                    lineHeight: 21,

                    color: textSecondaryColor,
                    textAlign: "center",
                  }}
                >
                  Tus respuestas no activaron áreas adicionales que necesitaran
                  una exploración más profunda.
                </Text>
              </Animated.View>
            ) : (
              <>
                {/* RESUMEN */}

                <Animated.View
                  entering={FadeInUp.delay(100).duration(450)}
                  style={{
                    width: "100%",

                    borderRadius: 22,

                    borderWidth: 1,
                    borderColor,

                    backgroundColor: surfaceColor,

                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      padding: esTelefono ? 18 : 24,

                      flexDirection: "row",
                      alignItems: "center",

                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        minWidth: 0,
                        gap: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 11,
                          letterSpacing: 0.6,

                          color: primaryColor,
                        }}
                      >
                        RESUMEN DE TU ENTREVISTA
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 19,
                          color: textColor,
                        }}
                      >
                        Exploramos {resultados.length}{" "}
                        {resultados.length === 1 ? "área" : "áreas"}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 17,

                        backgroundColor: primarySoftColor,

                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="analytics-outline"
                        size={25}
                        color={primaryColor}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: borderColor,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",

                      paddingVertical: 20,
                      paddingHorizontal: 10,

                      alignItems: "stretch",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 25,
                          color: textColor,
                        }}
                      >
                        {Math.round(promedio)}%
                      </Text>

                      <Text
                        style={{
                          marginTop: 4,

                          fontFamily: "Nunito-Medium",

                          fontSize: 12,
                          textAlign: "center",

                          color: textSecondaryColor,
                        }}
                      >
                        promedio general
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 1,
                        alignSelf: "stretch",

                        backgroundColor: borderColor,
                      }}
                    />

                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 25,
                          color: textColor,
                        }}
                      >
                        {Math.round(resultados[0].porcentaje)}%
                      </Text>

                      <Text
                        style={{
                          marginTop: 4,

                          fontFamily: "Nunito-Medium",

                          fontSize: 12,
                          textAlign: "center",

                          color: textSecondaryColor,
                        }}
                      >
                        mayor indicador
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* ÁREAS EXPLORADAS */}

                <Animated.View
                  entering={FadeIn.delay(180)}
                  style={{
                    marginTop: 28,
                    marginBottom: 16,

                    flexDirection: "row",
                    alignItems: "center",

                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      minWidth: 0,
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",

                        fontSize: 21,
                        color: textColor,
                      }}
                    >
                      Áreas exploradas
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Nunito-Medium",

                        fontSize: 13,
                        lineHeight: 19,

                        color: textSecondaryColor,
                      }}
                    >
                      De mayor a menor necesidad de atención.
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,

                      backgroundColor: primarySoftColor,

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",

                        color: primaryColor,
                      }}
                    >
                      {resultados.length}
                    </Text>
                  </View>
                </Animated.View>

                {/* TARJETAS */}

                <View
                  style={{
                    width: "100%",

                    flexDirection: esEscritorio ? "row" : "column",

                    flexWrap: esEscritorio ? "wrap" : "nowrap",

                    gap: 14,
                  }}
                >
                  {resultados.map((resultado, index) => {
                    const esPrioridad = prioridades.some(
                      (item) => item.id_modulo === resultado.id_modulo,
                    );

                    const colorNivel =
                      resultado.nivel === "ALTO"
                        ? dangerColor
                        : resultado.nivel === "MODERADO"
                          ? warningColor
                          : successColor;

                    const icono =
                      ICONOS[resultado.codigo] ?? "sparkles-outline";

                    return (
                      <Animated.View
                        key={resultado.id_resultado}
                        entering={FadeInUp.delay(200 + index * 70).duration(
                          450,
                        )}
                        style={{
                          width: esEscritorio ? "48%" : "100%",

                          flexGrow: esEscritorio ? 1 : 0,

                          borderRadius: 20,

                          borderWidth: esPrioridad ? 1.5 : 1,

                          borderColor: esPrioridad ? primaryColor : borderColor,

                          backgroundColor: surfaceColor,

                          padding: esTelefono ? 16 : 20,

                          gap: 15,
                        }}
                      >
                        <View
                          style={{
                            width: "100%",

                            flexDirection: "row",

                            alignItems: "center",

                            gap: esTelefono ? 10 : 13,
                          }}
                        >
                          {/* ICONO */}

                          <View
                            style={{
                              width: esTelefono ? 48 : 56,

                              height: esTelefono ? 48 : 56,

                              borderRadius: 16,

                              backgroundColor: primarySoftColor,

                              alignItems: "center",

                              justifyContent: "center",

                              flexShrink: 0,
                            }}
                          >
                            <Ionicons
                              name={icono}
                              size={23}
                              color={primaryColor}
                            />
                          </View>

                          {/* INFORMACIÓN */}

                          <View
                            style={{
                              flex: 1,
                              minWidth: 0,
                              gap: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Nunito-Bold",

                                fontSize: esTelefono ? 15 : 17,

                                lineHeight: 22,

                                color: textColor,
                              }}
                            >
                              {resultado.nombre}
                            </Text>

                            <View
                              style={{
                                flexDirection: "row",

                                alignItems: "center",

                                gap: 6,
                                flexWrap: "wrap",
                              }}
                            >
                              <View
                                style={{
                                  width: 7,
                                  height: 7,

                                  borderRadius: 4,

                                  backgroundColor: colorNivel,
                                }}
                              />

                              <Text
                                style={{
                                  fontFamily: "Nunito-Medium",

                                  fontSize: 12,

                                  color: textSecondaryColor,
                                }}
                              >
                                {textoNivel(resultado.nivel)}
                              </Text>

                              {esPrioridad && (
                                <View
                                  style={{
                                    marginLeft: 2,

                                    paddingHorizontal: 8,

                                    paddingVertical: 3,

                                    borderRadius: 99,

                                    backgroundColor: accentSoftColor,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Nunito-Bold",

                                      fontSize: 10,

                                      color: accentColor,
                                    }}
                                  >
                                    Prioridad
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>

                          {/* PORCENTAJE */}

                          <Text
                            style={{
                              flexShrink: 0,

                              fontFamily: "Nunito-Bold",

                              fontSize: esTelefono ? 23 : 27,

                              color: textColor,
                            }}
                          >
                            {Math.round(resultado.porcentaje)}%
                          </Text>
                        </View>

                        {/* BARRA */}

                        <View
                          style={{
                            width: "100%",
                            height: 8,

                            borderRadius: 5,

                            backgroundColor: surfaceSecondaryColor,

                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              height: "100%",

                              width: porcentajeSeguro(resultado.porcentaje),

                              borderRadius: 5,

                              backgroundColor: primaryColor,
                            }}
                          />
                        </View>

                        {/* DESCRIPCIÓN */}

                        <Text
                          style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 13,
                            lineHeight: 20,

                            color: textSecondaryColor,
                          }}
                        >
                          {descripcionNivel(resultado.nivel)}
                        </Text>
                      </Animated.View>
                    );
                  })}
                </View>

                {/* ENFOQUE PRINCIPAL */}

                {prioridades.length > 0 && (
                  <Animated.View
                    entering={FadeInUp.delay(450).duration(450)}
                    style={{
                      marginTop: 22,

                      padding: esTelefono ? 18 : 24,

                      backgroundColor: primaryColor,

                      borderRadius: 21,
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",

                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,

                          borderRadius: 15,

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
                          gap: 4,
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
                          ENFOQUE PRINCIPAL
                        </Text>

                        <Text
                          style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: 19,
                            lineHeight: 25,

                            color: textOnPrimaryColor,
                          }}
                        >
                          {prioridades.map((item) => item.nombre).join(" y ")}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontFamily: "Nunito-Medium",

                        fontSize: 13,
                        lineHeight: 20,

                        color: "#F0F5FF",
                      }}
                    >
                      {prioridades.length === 1
                        ? "Esta área obtuvo el indicador más alto y será una referencia importante para tu plan de bienestar."
                        : "Estas áreas comparten el indicador más alto y serán una referencia importante para tu plan de bienestar."}
                    </Text>
                  </Animated.View>
                )}
              </>
            )}

            {/* AVISO */}

            <Animated.View
              entering={FadeIn.delay(500)}
              style={{
                width: "100%",

                marginTop: 22,
                padding: 16,

                borderRadius: 17,

                borderWidth: 1,
                borderColor,

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
                Estos resultados son orientativos y están pensados para apoyar
                tu autocuidado. No representan un diagnóstico clínico.
              </Text>
            </Animated.View>

            {/* NAVEGAR AL PLAN */}

            <View
              style={{
                marginTop: 22,
              }}
            >
              {botonPrincipal(
                modo === "historial"
                  ? "Ver plan de bienestar"
                  : "Ver mi plan de bienestar",
                continuar,
                "arrow-forward",
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
