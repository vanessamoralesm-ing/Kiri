import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { supabase } from "@/lib/supabase";

import {
  styles,
} from "@/styles/resultadoEntrevista.styles";

// ==========================================================
// TIPOS
// ==========================================================

type NivelResultado =
  | "BAJO"
  | "MODERADO"
  | "ALTO";

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
  modo:
  | "entrevista"
  | "historial";
};

// ==========================================================
// CONFIGURACIÓN DE ÁREAS
// ==========================================================

const CONFIG:
  Record<
    string,
    {
      icono:
      keyof typeof Ionicons.glyphMap;
    }
  > = {
  SOMATICO: {
    icono:
      "body-outline",
  },

  ANSIEDAD_INSOMNIO: {
    icono:
      "moon-outline",
  },

  SUENO: {
    icono:
      "bed-outline",
  },

  APOYO_SOCIAL: {
    icono:
      "people-outline",
  },

  VIDA_DIARIA: {
    icono:
      "calendar-outline",
  },

  ESTADO_EMOCIONAL: {
    icono:
      "heart-outline",
  },
};

// ==========================================================
// HELPERS
// ==========================================================

function obtenerRelacion(
  valor: any,
) {
  return Array.isArray(
    valor,
  )
    ? valor[0]
    : valor;
}

function textoNivel(
  nivel: NivelResultado,
) {
  if (
    nivel === "ALTO"
  ) {
    return "Mayor atención";
  }

  if (
    nivel === "MODERADO"
  ) {
    return "Atención moderada";
  }

  return "Menor atención";
}

function descripcionNivel(
  nivel: NivelResultado,
) {
  if (
    nivel === "ALTO"
  ) {
    return "Esta área puede beneficiarse de un mayor acompañamiento.";
  }

  if (
    nivel === "MODERADO"
  ) {
    return "Conviene seguir observando y fortaleciendo esta área.";
  }

  return "Tus respuestas muestran menor dificultad en esta área.";
}

function normalizarNivel(
  valor: any,
): NivelResultado {
  if (
    valor === "ALTO"
  ) {
    return "ALTO";
  }

  if (
    valor === "MODERADO"
  ) {
    return "MODERADO";
  }

  return "BAJO";
}

function esUUID(
  valor:
    | string
    | undefined,
): valor is string {
  if (
    !valor ||
    valor === "[id]"
  ) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    valor,
  );
}

function anchoBarra(
  valor: number,
): `${number}%` {
  const seguro =
    Math.min(
      Math.max(
        valor,
        0,
      ),
      100,
    );

  return `${seguro}%`;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ResultadoEntrevista({
  modo,
}: Props) {
  const router = useRouter();

  const {
    esTelefono,
    esTablet,
    esEscritorio,
  } = useResponsiveLayout();

  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const idEntrevista =
    Array.isArray(
      params.id,
    )
      ? params.id[0]
      : params.id;

  // ========================================================
  // ESTADOS
  // ========================================================

  const [
    resultados,
    setResultados,
  ] =
    useState<Resultado[]>([]);

  const [
    cargando,
    setCargando,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor(
      {},
      "background",
    );

  const surfaceColor =
    useThemeColor(
      {},
      "surface",
    );

  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary",
    );

  const borderColor =
    useThemeColor(
      {},
      "border",
    );

  const dividerColor =
    useThemeColor(
      {},
      "divider",
    );

  const textColor =
    useThemeColor(
      {},
      "text",
    );

  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary",
    );

  const textMutedColor =
    useThemeColor(
      {},
      "textMuted",
    );

  const primaryColor =
    useThemeColor(
      {},
      "primary",
    );

  const secondaryColor =
    useThemeColor(
      {},
      "secondary",
    );

  const accentColor =
    useThemeColor(
      {},
      "accent",
    );

  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft",
    );

  const secondarySoftColor =
    useThemeColor(
      {},
      "secondarySoft",
    );

  const accentSoftColor =
    useThemeColor(
      {},
      "accentSoft",
    );

  const successColor =
    useThemeColor(
      {},
      "success",
    );

  const warningColor =
    useThemeColor(
      {},
      "warning",
    );

  const dangerColor =
    useThemeColor(
      {},
      "danger",
    );

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal =
    esEscritorio
      ? PADDING_RESPONSIVE.escritorio
      : esTablet
        ? PADDING_RESPONSIVE.tablet
        : PADDING_RESPONSIVE.telefono;

  const maxWidthPantalla =
    esEscritorio
      ? MAX_WIDTHS.dashboard
      : esTablet
        ? MAX_WIDTHS.contenido
        : undefined;

  const maxWidthContenido =
    esEscritorio
      ? 1080
      : esTablet
        ? 760
        : undefined;

  const anchoBoton =
    esEscritorio
      ? 300
      : "100%";

  // ========================================================
  // CARGAR RESULTADOS
  // ========================================================

  useEffect(
    () => {
      console.log(
        "ID recibido en resultado:",
        idEntrevista,
      );

      if (
        !esUUID(
          idEntrevista,
        )
      ) {
        setError(
          "No se encontró una entrevista válida.",
        );

        setCargando(
          false,
        );

        return;
      }

      let activo =
        true;

      async function cargarResultados() {
        try {
          setCargando(
            true,
          );

          setError(
            null,
          );

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "resultado_entrevista",
              )
              .select(`
                id_resultado,
                id_modulo,
                puntaje,
                porcentaje,
                nivel,
                modulo_entrevista!inner(
                  codigo,
                  nombre
                )
              `)
              .eq(
                "id_entrevista",
                idEntrevista,
              )
              .order(
                "porcentaje",
                {
                  ascending:
                    false,
                },
              );

          if (
            error
          ) {
            throw error;
          }

          if (
            !activo
          ) {
            return;
          }

          const lista:
            Resultado[] =
            (
              data ??
              []
            ).map(
              (
                item:
                  any,
              ) => {
                const modulo =
                  obtenerRelacion(
                    item.modulo_entrevista,
                  );

                return {
                  id_resultado:
                    item.id_resultado,

                  id_modulo:
                    item.id_modulo,

                  codigo:
                    modulo?.codigo ??
                    "",

                  nombre:
                    modulo?.nombre ??
                    "Área de bienestar",

                  puntaje:
                    Number(
                      item.puntaje ??
                      0,
                    ),

                  porcentaje:
                    Number(
                      item.porcentaje ??
                      0,
                    ),

                  nivel:
                    normalizarNivel(
                      item.nivel,
                    ),
                };
              },
            );

          console.log(
            "Resultados cargados:",
            lista,
          );

          setResultados(
            lista,
          );
        } catch (
        e
        ) {
          console.error(
            "Error cargando resultados:",
            e,
          );

          if (
            activo
          ) {
            setError(
              "No pudimos cargar tus resultados.",
            );
          }
        } finally {
          if (
            activo
          ) {
            setCargando(
              false,
            );
          }
        }
      }

      cargarResultados();

      return () => {
        activo =
          false;
      };
    },
    [
      idEntrevista,
    ],
  );

  // ========================================================
  // PRIORIDADES
  // ========================================================

  const prioridades =
    useMemo(
      () => {
        if (
          !resultados.length
        ) {
          return [];
        }

        const mayor =
          resultados[0]
            .porcentaje;

        return resultados.filter(
          (
            resultado,
          ) =>
            Math.abs(
              resultado.porcentaje -
              mayor,
            ) < 0.01,
        );
      },
      [
        resultados,
      ],
    );

  // ========================================================
  // PROMEDIO
  // ========================================================

  const promedio =
    useMemo(
      () => {
        if (
          !resultados.length
        ) {
          return 0;
        }

        const total =
          resultados.reduce(
            (
              acumulado,
              resultado,
            ) =>
              acumulado +
              resultado.porcentaje,
            0,
          );

        return (
          total /
          resultados.length
        );
      },
      [
        resultados,
      ],
    );

  // ========================================================
  // NAVEGAR AL PLAN
  // ========================================================

  function continuar() {
    if (
      !esUUID(
        idEntrevista,
      )
    ) {
      console.error(
        "ID inválido al abrir plan:",
        idEntrevista,
      );

      return;
    }

    console.log(
      "ABRIENDO PLAN:",
      idEntrevista,
    );

    if (
      modo ===
      "historial"
    ) {
      router.push(
        `/(tabs)/entrevistas/${idEntrevista}/plan` as any,
      );

      return;
    }

    router.replace(
      `/(entrevista)/jovenes-adultos/${idEntrevista}/plan` as any,
    );
  }

  // ========================================================
  // SALIR
  // ========================================================

  function salir() {
    if (
      modo ===
      "historial"
    ) {
      router.replace(
        "/(tabs)/entrevistas",
      );

      return;
    }

    router.replace(
      "/(tabs)/home",
    );
  }

  // ========================================================
  // CARGANDO
  // ========================================================

  if (
    cargando
  ) {
    return (
      <SafeAreaView
        style={[
          styles.pantalla,

          {
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.cargando,

            {
              paddingHorizontal,
            },
          ]}
        >
          <View
            style={[
              styles.cargandoCirculo,

              {
                backgroundColor:
                  primarySoftColor,

                borderColor,
              },
            ]}
          >
            <ActivityIndicator
              color={
                primaryColor
              }
            />
          </View>

          <Text
            style={[
              styles.cargandoTitulo,

              {
                color:
                  textColor,
              },
            ]}
          >
            Preparando tu perfil
          </Text>

          <Text
            style={[
              styles.cargandoTexto,

              {
                color:
                  textSecondaryColor,

                maxWidth:
                  esEscritorio
                    ? 520
                    : 380,
              },
            ]}
          >
            Estamos organizando los resultados de tu entrevista.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================================
  // ERROR
  // ========================================================

  if (
    error
  ) {
    return (
      <SafeAreaView
        style={[
          styles.pantalla,

          {
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.cargando,

            {
              paddingHorizontal,
            },
          ]}
        >
          <View
            style={[
              styles.errorCirculo,

              {
                backgroundColor:
                  accentSoftColor,

                borderColor:
                  accentColor,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={
                accentColor
              }
            />
          </View>

          <Text
            style={[
              styles.cargandoTitulo,

              {
                color:
                  textColor,
              },
            ]}
          >
            No pudimos mostrar tus resultados
          </Text>

          <Text
            style={[
              styles.cargandoTexto,

              {
                color:
                  textSecondaryColor,

                maxWidth:
                  esEscritorio
                    ? 520
                    : 380,
              },
            ]}
          >
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            onPress={
              salir
            }
            style={[
              styles.botonPrincipal,

              esTelefono &&
              styles.botonPrincipalMovil,

              {
                width:
                  anchoBoton,

                alignSelf:
                  "center",

                backgroundColor:
                  primaryColor,
              },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.botonTexto
              }
            >
              {modo ===
                "historial"
                ? "Volver a mis entrevistas"
                : "Volver al inicio"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================================
  // PANTALLA PRINCIPAL
  // ========================================================

  return (
    <SafeAreaView
      style={[
        styles.pantalla,

        {
          backgroundColor,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={[
          styles.scroll,

          esTelefono &&
          styles.scrollMovil,

          esTelefono &&
          modo ===
          "historial" &&
          styles.scrollHistorialMovil,

          {
            paddingHorizontal,
          },
        ]}
      >
        {/* =================================================
            CONTENEDOR GENERAL
        ================================================= */}

        <View
          style={{
            width:
              "100%",

            maxWidth:
              maxWidthPantalla,

            alignSelf:
              "center",
          }}
        >
          <View
            style={{
              width:
                "100%",

              maxWidth:
                maxWidthContenido,

              alignSelf:
                "center",
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <Animated.View
              entering={
                FadeInUp.duration(
                  550,
                )
              }
              style={[
                styles.header,

                {
                  marginTop:
                    esEscritorio
                      ? 24
                      : esTablet
                        ? 18
                        : 10,

                  marginBottom:
                    esEscritorio
                      ? 28
                      : 22,
                },
              ]}
            >
              <View
                style={[
                  styles.headerIcono,

                  {
                    backgroundColor:
                      primarySoftColor,

                    borderColor,
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={
                    esEscritorio
                      ? 24
                      : 22
                  }
                  color={
                    primaryColor
                  }
                />
              </View>

              <Text
                style={[
                  styles.titulo,

                  {
                    color:
                      textColor,

                    fontSize:
                      esEscritorio
                        ? 32
                        : esTablet
                          ? 29
                          : 26,

                    lineHeight:
                      esEscritorio
                        ? 40
                        : 34,
                  },
                ]}
              >
                {modo ===
                  "historial"
                  ? "Perfil de bienestar"
                  : "Tu perfil de bienestar"}
              </Text>

              <Text
                style={[
                  styles.subtitulo,

                  {
                    color:
                      textSecondaryColor,

                    maxWidth:
                      640,

                    alignSelf:
                      "center",

                    fontSize:
                      esEscritorio
                        ? 16
                        : 14,

                    lineHeight:
                      esEscritorio
                        ? 24
                        : 21,
                  },
                ]}
              >
                Una mirada general a las áreas que exploramos contigo.
              </Text>
            </Animated.View>

            {/* =================================================
                CASO ESTABLE
            ================================================= */}

            {!resultados.length ? (
              <Animated.View
                entering={
                  FadeInUp
                    .delay(
                      120,
                    )
                    .duration(
                      500,
                    )
                }
                style={[
                  styles.estableCard,

                  esTelefono &&
                  styles.estableCardMovil,

                  {
                    backgroundColor:
                      surfaceColor,

                    borderColor,

                    maxWidth:
                      esEscritorio
                        ? 720
                        : undefined,

                    alignSelf:
                      "center",

                    padding:
                      esEscritorio
                        ? 30
                        : undefined,
                  },
                ]}
              >
                <View
                  style={[
                    styles.estableIcono,

                    {
                      backgroundColor:
                        secondarySoftColor,
                    },
                  ]}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={26}
                    color={
                      secondaryColor
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.estableTitulo,

                    {
                      color:
                        textColor,

                      fontSize:
                        esEscritorio
                          ? 22
                          : undefined,
                    },
                  ]}
                >
                  Todo se ve estable por ahora
                </Text>

                <Text
                  style={[
                    styles.estableTexto,

                    {
                      color:
                        textSecondaryColor,

                      maxWidth:
                        560,
                    },
                  ]}
                >
                  Tus respuestas no activaron áreas adicionales que necesitaran
                  una exploración más profunda.
                </Text>
              </Animated.View>
            ) : (
              <>
                {/* ===========================================
                    RESUMEN
                =========================================== */}

                <Animated.View
                  entering={
                    FadeInUp
                      .delay(
                        100,
                      )
                      .duration(
                        500,
                      )
                  }
                  style={[
                    styles.resumenCard,

                    esTelefono &&
                    styles.resumenCardMovil,

                    {
                      backgroundColor:
                        surfaceColor,

                      borderColor,

                      padding:
                        esEscritorio
                          ? 26
                          : undefined,

                      borderRadius:
                        esEscritorio
                          ? 22
                          : undefined,
                    },
                  ]}
                >
                  <View
                    style={
                      styles.resumenSuperior
                    }
                  >
                    <View
                      style={
                        styles.resumenInfo
                      }
                    >
                      <Text
                        style={[
                          styles.resumenEtiqueta,

                          {
                            color:
                              primaryColor,
                          },
                        ]}
                      >
                        RESUMEN DE TU ENTREVISTA
                      </Text>

                      <Text
                        style={[
                          styles.resumenTitulo,

                          {
                            color:
                              textColor,

                            fontSize:
                              esEscritorio
                                ? 22
                                : undefined,
                          },
                        ]}
                      >
                        Exploramos{" "}
                        {
                          resultados.length
                        }{" "}
                        {resultados.length ===
                          1
                          ? "área"
                          : "áreas"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.resumenIcono,

                        {
                          backgroundColor:
                            primarySoftColor,
                        },
                      ]}
                    >
                      <Ionicons
                        name="analytics-outline"
                        size={22}
                        color={
                          primaryColor
                        }
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.resumenSeparador,

                      {
                        backgroundColor:
                          dividerColor,
                      },
                    ]}
                  />

                  <View
                    style={
                      styles.resumenInferior
                    }
                  >
                    <View
                      style={
                        styles.resumenDato
                      }
                    >
                      <Text
                        style={[
                          styles.resumenNumero,

                          {
                            color:
                              textColor,

                            fontSize:
                              esEscritorio
                                ? 30
                                : undefined,
                          },
                        ]}
                      >
                        {Math.round(
                          promedio,
                        )}
                        %
                      </Text>

                      <Text
                        style={[
                          styles.resumenDatoTexto,

                          {
                            color:
                              textSecondaryColor,
                          },
                        ]}
                      >
                        promedio general
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.divisorVertical,

                        {
                          backgroundColor:
                            dividerColor,
                        },
                      ]}
                    />

                    <View
                      style={
                        styles.resumenDato
                      }
                    >
                      <Text
                        style={[
                          styles.resumenNumero,

                          {
                            color:
                              textColor,

                            fontSize:
                              esEscritorio
                                ? 30
                                : undefined,
                          },
                        ]}
                      >
                        {Math.round(
                          resultados[0]
                            .porcentaje,
                        )}
                        %
                      </Text>

                      <Text
                        style={[
                          styles.resumenDatoTexto,

                          {
                            color:
                              textSecondaryColor,
                          },
                        ]}
                      >
                        mayor indicador
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* ===========================================
                    ENCABEZADO DE ÁREAS
                =========================================== */}

                <Animated.View
                  entering={
                    FadeIn
                      .delay(
                        180,
                      )
                      .duration(
                        450,
                      )
                  }
                  style={[
                    styles.seccionHeader,

                    {
                      marginTop:
                        esEscritorio
                          ? 30
                          : undefined,
                    },
                  ]}
                >
                  <View
                    style={
                      styles.seccionInfo
                    }
                  >
                    <Text
                      style={[
                        styles.seccionTitulo,

                        {
                          color:
                            textColor,

                          fontSize:
                            esEscritorio
                              ? 21
                              : undefined,
                        },
                      ]}
                    >
                      Áreas exploradas
                    </Text>

                    <Text
                      style={[
                        styles.seccionTexto,

                        {
                          color:
                            textSecondaryColor,
                        },
                      ]}
                    >
                      De mayor a menor necesidad de atención.
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.cantidad,

                      {
                        backgroundColor:
                          primarySoftColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cantidadTexto,

                        {
                          color:
                            primaryColor,
                        },
                      ]}
                    >
                      {
                        resultados.length
                      }
                    </Text>
                  </View>
                </Animated.View>

                {/* ===========================================
                    TARJETAS
                =========================================== */}

                <View
                  style={[
                    styles.lista,

                    {
                      width:
                        "100%",

                      flexDirection:
                        esEscritorio
                          ? "row"
                          : "column",

                      flexWrap:
                        esEscritorio
                          ? "wrap"
                          : "nowrap",

                      gap:
                        esEscritorio
                          ? 16
                          : 12,
                    },
                  ]}
                >
                  {resultados.map(
                    (
                      resultado,
                      index,
                    ) => {
                      const icono:
                        keyof typeof Ionicons.glyphMap =
                        CONFIG[
                          resultado.codigo
                        ]?.icono ??
                        "sparkles-outline";

                      const esPrioridad =
                        prioridades.some(
                          (
                            prioridad,
                          ) =>
                            prioridad.id_modulo ===
                            resultado.id_modulo,
                        );

                      const colorNivel =
                        resultado.nivel ===
                          "ALTO"
                          ? dangerColor
                          : resultado.nivel ===
                            "MODERADO"
                            ? warningColor
                            : successColor;

                      return (
                        <Animated.View
                          key={
                            resultado.id_resultado
                          }
                          entering={
                            FadeInUp
                              .delay(
                                220 +
                                index *
                                80,
                              )
                              .duration(
                                500,
                              )
                          }
                          style={[
                            styles.card,

                            esTelefono &&
                            styles.cardMovil,

                            {
                              backgroundColor:
                                surfaceColor,

                              borderColor:
                                esPrioridad
                                  ? primaryColor
                                  : borderColor,

                              width:
                                esEscritorio
                                  ? "48.8%"
                                  : "100%",

                              flexBasis:
                                esEscritorio
                                  ? "48%"
                                  : "100%",

                              flexGrow:
                                esEscritorio
                                  ? 1
                                  : 0,

                              minWidth:
                                esEscritorio
                                  ? 420
                                  : undefined,

                              padding:
                                esEscritorio
                                  ? 22
                                  : undefined,
                            },

                            esPrioridad &&
                            styles.cardPrioridad,
                          ]}
                        >
                          {/* FILA SUPERIOR */}

                          <View
                            style={
                              styles.cardSuperior
                            }
                          >
                            <View
                              style={[
                                styles.areaIcono,

                                {
                                  backgroundColor:
                                    primarySoftColor,
                                },
                              ]}
                            >
                              <Ionicons
                                name={
                                  icono
                                }
                                size={22}
                                color={
                                  primaryColor
                                }
                              />
                            </View>

                            <View
                              style={
                                styles.areaInfo
                              }
                            >
                              <View
                                style={
                                  styles.nombreFila
                                }
                              >
                                <Text
                                  style={[
                                    styles.areaNombre,

                                    {
                                      color:
                                        textColor,
                                    },
                                  ]}
                                >
                                  {
                                    resultado.nombre
                                  }
                                </Text>

                                {esPrioridad && (
                                  <View
                                    style={[
                                      styles.prioridadMini,

                                      {
                                        backgroundColor:
                                          accentSoftColor,

                                        borderColor:
                                          accentColor,
                                      },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.prioridadMiniTexto,

                                        {
                                          color:
                                            accentColor,
                                        },
                                      ]}
                                    >
                                      Prioridad
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <View
                                style={
                                  styles.nivelFila
                                }
                              >
                                <View
                                  style={[
                                    styles.nivelPunto,

                                    {
                                      backgroundColor:
                                        colorNivel,
                                    },
                                  ]}
                                />

                                <Text
                                  style={[
                                    styles.nivelTexto,

                                    {
                                      color:
                                        textSecondaryColor,
                                    },
                                  ]}
                                >
                                  {
                                    textoNivel(
                                      resultado.nivel,
                                    )
                                  }
                                </Text>
                              </View>
                            </View>

                            <View
                              style={
                                styles.porcentaje
                              }
                            >
                              <Text
                                style={[
                                  styles.porcentajeNumero,

                                  {
                                    color:
                                      textColor,
                                  },
                                ]}
                              >
                                {Math.round(
                                  resultado.porcentaje,
                                )}
                              </Text>

                              <Text
                                style={[
                                  styles.porcentajeSimbolo,

                                  {
                                    color:
                                      textSecondaryColor,
                                  },
                                ]}
                              >
                                %
                              </Text>
                            </View>
                          </View>

                          {/* BARRA */}

                          <View
                            style={[
                              styles.barraContenedor,

                              {
                                backgroundColor:
                                  surfaceSecondaryColor,
                              },
                            ]}
                          >
                            <View
                              style={[
                                styles.barra,

                                {
                                  width:
                                    anchoBarra(
                                      resultado.porcentaje,
                                    ),

                                  backgroundColor:
                                    primaryColor,
                                },
                              ]}
                            />
                          </View>

                          {/* DESCRIPCIÓN */}

                          <Text
                            style={[
                              styles.cardDescripcion,

                              {
                                color:
                                  textSecondaryColor,
                              },
                            ]}
                          >
                            {
                              descripcionNivel(
                                resultado.nivel,
                              )
                            }
                          </Text>
                        </Animated.View>
                      );
                    },
                  )}
                </View>

                {/* ===========================================
                    ENFOQUE PRINCIPAL
                =========================================== */}

                {!!prioridades.length && (
                  <Animated.View
                    entering={
                      FadeInUp
                        .delay(
                          450,
                        )
                        .duration(
                          550,
                        )
                    }
                    style={[
                      styles.enfoqueCard,

                      esTelefono &&
                      styles.enfoqueCardMovil,

                      {
                        backgroundColor:
                          primaryColor,

                        marginTop:
                          esEscritorio
                            ? 24
                            : undefined,

                        padding:
                          esEscritorio
                            ? 24
                            : undefined,

                        borderRadius:
                          esEscritorio
                            ? 22
                            : undefined,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.enfoqueIcono,

                        {
                          backgroundColor:
                            "rgba(255,255,255,0.18)",
                        },
                      ]}
                    >
                      <Ionicons
                        name="compass-outline"
                        size={22}
                        color="#FFFFFF"
                      />
                    </View>

                    <View
                      style={
                        styles.enfoqueContenido
                      }
                    >
                      <Text
                        style={[
                          styles.enfoqueEtiqueta,

                          {
                            color:
                              "rgba(255,255,255,0.78)",
                          },
                        ]}
                      >
                        ENFOQUE PRINCIPAL
                      </Text>

                      <Text
                        style={[
                          styles.enfoqueTitulo,

                          {
                            color:
                              "#FFFFFF",

                            fontSize:
                              esEscritorio
                                ? 21
                                : undefined,
                          },
                        ]}
                      >
                        {prioridades
                          .map(
                            (
                              prioridad,
                            ) =>
                              prioridad.nombre,
                          )
                          .join(
                            " y ",
                          )}
                      </Text>

                      <Text
                        style={[
                          styles.enfoqueTexto,

                          {
                            color:
                              "rgba(255,255,255,0.90)",
                          },
                        ]}
                      >
                        {prioridades.length ===
                          1
                          ? "Esta área obtuvo el indicador más alto y será una referencia importante para tu plan de bienestar."
                          : "Estas áreas comparten el indicador más alto y serán una referencia importante para tu plan de bienestar."}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </>
            )}

            {/* =================================================
                AVISO
            ================================================= */}

            <Animated.View
              entering={
                FadeIn
                  .delay(
                    500,
                  )
                  .duration(
                    500,
                  )
              }
              style={[
                styles.aviso,

                esTelefono &&
                styles.avisoMovil,

                {
                  backgroundColor:
                    surfaceSecondaryColor,

                  borderColor,

                  maxWidth:
                    esEscritorio
                      ? 850
                      : undefined,

                  alignSelf:
                    "center",

                  marginTop:
                    esEscritorio
                      ? 24
                      : undefined,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={
                  textSecondaryColor
                }
              />

              <Text
                style={[
                  styles.avisoTexto,

                  {
                    color:
                      textSecondaryColor,
                  },
                ]}
              >
                Estos resultados son orientativos y están pensados para apoyar tu
                autocuidado. No representan un diagnóstico clínico.
              </Text>
            </Animated.View>

            {/* =================================================
                BOTÓN PLAN
            ================================================= */}

            <View
              style={{
                width:
                  "100%",

                marginTop:
                  esEscritorio
                    ? 28
                    : 20,

                alignItems:
                  esEscritorio
                    ? "flex-end"
                    : "stretch",
              }}
            >
              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                onPress={
                  continuar
                }
                style={[
                  styles.botonPrincipal,

                  esTelefono &&
                  styles.botonPrincipalMovil,

                  {
                    width:
                      anchoBoton,

                    backgroundColor:
                      primaryColor,
                  },
                ]}
              >
                <Text
                  style={
                    styles.botonTexto
                  }
                >
                  {modo ===
                    "historial"
                    ? "Ver plan de bienestar"
                    : "Ver mi plan de bienestar"}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}