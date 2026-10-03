import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import React, { useState } from "react";

import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EncabezadoHome } from "@/components/ui/EncabezadoHome";

import { TarjetaModulo } from "@/components/ui/TarjetaModulo";

import { TarjetaRecomendacion } from "@/components/ui/TarjetaRecomendacion";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useProgresoHome } from "@/hooks/useProgresoHome";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useResumenBienestar } from "@/hooks/useResumenBienestar";

import { useThemeMode } from "@/contexts/ThemeModeContext";

// ==========================================================
// COLORES DE RECOMENDACIONES
// ==========================================================

const COLORES_RECOMENDACION = [
  {
    fondoClaro: "bg-purple-100",
    fondoOscuro: "bg-purple-950",
    icono: "#8B5CF6",
  },

  {
    fondoClaro: "bg-emerald-100",
    fondoOscuro: "bg-emerald-950",
    icono: "#10B981",
  },

  {
    fondoClaro: "bg-blue-100",
    fondoOscuro: "bg-blue-950",
    icono: "#4F8EF7",
  },

  {
    fondoClaro: "bg-amber-100",
    fondoOscuro: "bg-amber-950",
    icono: "#F59E0B",
  },
];

// ==========================================================
// MÓDULOS
// ==========================================================

const MODULOS = [
  {
    id: "diario",

    titulo: "Nuevo Registro en Diario",

    descripcion:
      "Registra cómo te sientes y lleva un seguimiento de tus emociones.",

    tituloMovil: "Nuevo registro",

    descripcionMovil: "Registra cómo te sientes.",

    icono: "book-outline" as const,

    color: "#4F8EF7",

    fondoIconoClaro: "#EAF2FF",

    fondoIconoOscuro: "#173A70",
  },

  {
    id: "cuestionarios",

    titulo: "Cuestionarios",

    descripcion:
      "Explora instrumentos para conocer mejor diferentes áreas de tu bienestar.",

    tituloMovil: "Cuestionarios",

    descripcionMovil: "Conoce mejor tu bienestar.",

    icono: "document-text-outline" as const,

    color: "#8B5CF6",

    fondoIconoClaro: "#F0ECFF",

    fondoIconoOscuro: "#31265F",
  },

  {
    id: "foro",

    titulo: "Foro Comunitario",

    descripcion:
      "Comparte experiencias y conecta con otras personas de la comunidad.",

    tituloMovil: "Foro",

    descripcionMovil: "Comparte y conecta.",

    icono: "megaphone-outline" as const,

    color: "#F59E0B",

    fondoIconoClaro: "#FFF7E6",

    fondoIconoOscuro: "#4A3510",
  },

  {
    id: "entrevista",

    titulo: "Entrevista de Bienestar",

    descripcion:
      "Realiza tu entrevista y recibe un plan de bienestar personalizado.",

    tituloMovil: "Entrevista",

    descripcionMovil: "Recibe tu plan personalizado.",

    icono: "heart-outline" as const,

    color: "#EC6D8C",

    fondoIconoClaro: "#FFF0F4",

    fondoIconoOscuro: "#512535",
  },

  {
    id: "tecnicas",

    titulo: "Técnicas Complementarias",

    descripcion:
      "Practica ejercicios de respiración, relajación y regulación emocional.",

    tituloMovil: "Técnicas",

    descripcionMovil: "Respira, relájate y regula.",

    icono: "leaf-outline" as const,

    color: "#7BBF9A",

    fondoIconoClaro: "#EAF8F0",

    fondoIconoOscuro: "#1F4635",
  },
];

// ==========================================================
// HOME
// ==========================================================

export default function HomeScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const { themeMode } = useThemeMode();

  // ========================================================
  // PLAN DE BIENESTAR
  // ========================================================

  const { resumen } = useResumenBienestar();

  // ========================================================
  // RACHA Y PROGRESO
  // ========================================================

  const {
    cargando: cargandoProgreso,

    rachaActual,

    actividadHoy,

    diasSemana,

    totalRegistros,

    totalCuestionarios,

    totalActividades,
  } = useProgresoHome();

  // ========================================================
  // GRID
  // ========================================================

  const [anchoGridModulos, setAnchoGridModulos] = useState(0);

  // ========================================================
  // TEMA
  // ========================================================

  const isDarkMode = themeMode === "dark";

  const backgroundColor = useThemeColor({}, "background");

  const textColor = useThemeColor({}, "text");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const secondaryColor = useThemeColor({}, "secondary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  // ========================================================
  // ACCESOS RÁPIDOS
  // ========================================================

  const numeroColumnasModulos = esEscritorio ? 5 : 2;

  const gapModulos = esEscritorio ? 14 : 16;

  const anchoTarjetaModulo =
    anchoGridModulos > 0
      ? (anchoGridModulos - gapModulos * (numeroColumnasModulos - 1)) /
      numeroColumnasModulos
      : undefined;

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 150, 175);

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function abrirModulo(idModulo: string) {
    switch (idModulo) {
      case "diario":
        router.push({
          pathname: "/diario/nuevo" as never,

          params: {
            origen: "home",
          },
        });

        break;

      case "cuestionarios":
        router.push("/(tabs)/cuestionarios");

        break;

      case "foro":
        router.push("/(tabs)/foro");

        break;

      case "entrevista":
        router.push("/(tabs)/entrevistas");

        break;

      case "tecnicas":
        router.push("/(tabs)/tecnicas");

        break;
    }
  }

  function abrirProgreso() {
    router.push("/(tabs)/progreso" as never);
  }

  // ========================================================
  // MEDIR GRID
  // ========================================================

  function medirGridModulos(event: LayoutChangeEvent) {
    const ancho = event.nativeEvent.layout.width;

    if (Math.abs(ancho - anchoGridModulos) > 1) {
      setAnchoGridModulos(ancho);
    }
  }

  // ========================================================
  // UI
  // ========================================================

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
          paddingTop: esEscritorio ? 22 : 8,
          paddingBottom,
        }}
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

          <EncabezadoHome />

          {/* ==================================================
              RACHA + PROGRESO
          ================================================== */}

          <View
            style={{
              width: "100%",

              flexDirection: esEscritorio ? "row" : "column",

              gap: esEscritorio ? 18 : 0,

              alignItems: "stretch",

              marginBottom: 24,
            }}
          >
            {/* ==================================================
                RACHA
            ================================================== */}

            <View
              style={{
                flex: esEscritorio ? 1.2 : undefined,

                width: esEscritorio ? undefined : "100%",

                minHeight: esEscritorio ? 140 : 125,

                borderRadius: 20,

                padding: esTelefono ? 16 : 18,

                marginBottom: esEscritorio ? 0 : 14,

                backgroundColor: primaryColor,

                ...Platform.select({
                  web: {
                    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
                  },

                  ios: {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },

                    shadowOpacity: 0.08,

                    shadowRadius: 8,
                  },

                  android: {
                    elevation: 4,
                  },
                }),
              }}
            >
              {/* ==================================================
                  TÍTULO
              ================================================== */}

              <Text
                style={{
                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: "#EAF2FF",
                }}
              >
                Racha emocional
              </Text>

              {/* ==================================================
                  INFORMACIÓN DE RACHA
                  
                  IMPORTANTE:
                  En móvil ahora también es ROW.
              ================================================== */}

              <View
                style={{
                  flex: esEscritorio ? 1 : undefined,

                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: esTelefono ? 6 : 10,

                  marginTop: 8,

                  width: "100%",
                }}
              >
                {/* ==============================================
                    NÚMERO DE DÍAS
                ============================================== */}

                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "baseline",

                    flexShrink: 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 39 : 32,

                      color: textOnPrimaryColor,
                    }}
                  >
                    {cargandoProgreso ? "—" : rachaActual}
                  </Text>

                  <Text
                    style={{
                      marginLeft: 5,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,

                      color: textOnPrimaryColor,
                    }}
                  >
                    {rachaActual === 1 ? "día" : "días"}
                  </Text>
                </View>

                {/* ==============================================
                    ÚLTIMOS SIETE DÍAS
                ============================================== */}

                <View
                  style={{
                    flex: 1,

                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent: "flex-end",

                    gap: esTelefono ? 3 : 5,

                    minWidth: 0,
                  }}
                >
                  {diasSemana.map((dia) => (
                    <View
                      key={dia.fecha}
                      style={{
                        width: esTelefono ? 25 : 29,

                        height: esTelefono ? 25 : 29,

                        borderRadius: esTelefono ? 13 : 15,

                        borderWidth: dia.esHoy ? 1.5 : 0,

                        borderColor: "rgba(255,255,255,0.95)",

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 1,

                        backgroundColor: dia.completado
                          ? secondaryColor
                          : "rgba(255,255,255,0.22)",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: esTelefono ? 10 : 11,

                          color: textOnPrimaryColor,
                        }}
                      >
                        {dia.etiqueta}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* ==============================================
                    LLAMA

                    AHORA FORMA PARTE DE LA MISMA FILA
                ============================================== */}

                <View
                  style={{
                    width: esTelefono ? 28 : 32,

                    height: esTelefono ? 28 : 32,

                    alignItems: "center",

                    justifyContent: "center",

                    flexShrink: 0,

                    marginLeft: esTelefono ? 2 : 4,
                  }}
                >
                  <Ionicons
                    name={actividadHoy ? "flame" : "flame-outline"}
                    size={esTelefono ? 24 : 28}
                    color={textOnPrimaryColor}
                  />
                </View>
              </View>

              {/* ==================================================
                  MENSAJE
              ================================================== */}

              <Text
                style={{
                  marginTop: 8,

                  textAlign: "right",

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  color: "#EAF2FF",
                }}
              >
                {cargandoProgreso
                  ? "Actualizando tu actividad..."
                  : actividadHoy
                    ? "¡Actividad de hoy registrada!"
                    : rachaActual > 0
                      ? "Registra una actividad hoy para continuar"
                      : "Realiza una actividad para comenzar tu racha"}
              </Text>
            </View>

            {/* ==================================================
                MI PROGRESO
            ================================================== */}

            <TouchableOpacity
              activeOpacity={0.82}
              onPress={abrirProgreso}
              style={{
                flex: esEscritorio ? 0.9 : undefined,

                width: esEscritorio ? undefined : "100%",

                minHeight: esEscritorio ? 140 : undefined,

                borderRadius: 22,

                padding: 20,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",

                backgroundColor: secondaryColor,

                ...Platform.select({
                  web: {
                    boxShadow: "0px 3px 8px rgba(0,0,0,0.06)",
                  },

                  ios: {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },

                    shadowOpacity: 0.06,

                    shadowRadius: 8,
                  },

                  android: {
                    elevation: 4,
                  },
                }),
              }}
            >
              <View
                style={{
                  flex: 1,

                  flexDirection: "row",

                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 48,

                    height: 48,

                    borderRadius: 24,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={23}
                    color={textOnPrimaryColor}
                  />
                </View>

                <View
                  style={{
                    flex: 1,

                    marginLeft: 14,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 18 : 16,

                      color: textOnPrimaryColor,
                    }}
                  >
                    Mi Progreso
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{
                      marginTop: 3,

                      fontFamily: "Nunito-Medium",

                      fontSize: 12,

                      lineHeight: 17,

                      color: "#ECFDF5",
                    }}
                  >
                    {cargandoProgreso
                      ? "Cargando tu progreso..."
                      : `${totalActividades} ${totalActividades === 1 ? "actividad" : "actividades"
                      } · ${totalRegistros} ${totalRegistros === 1
                        ? "autorregistro"
                        : "autorregistros"
                      } · ${totalCuestionarios} ${totalCuestionarios === 1
                        ? "cuestionario"
                        : "cuestionarios"
                      }`}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={23}
                color={textOnPrimaryColor}
              />
            </TouchableOpacity>
          </View>

          {/* ==================================================
              ACCESOS RÁPIDOS
          ================================================== */}

          <View
            style={{
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                marginBottom: 15,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 21 : 18,

                color: textColor,
              }}
            >
              Accesos rápidos
            </Text>

            <View
              onLayout={medirGridModulos}
              style={{
                width: "100%",

                flexDirection: "row",

                flexWrap: "wrap",

                columnGap: gapModulos,

                rowGap: esTelefono ? 12 : 16,

                alignItems: "flex-start",
              }}
            >
              {MODULOS.map((modulo) => (
                <View
                  key={modulo.id}
                  style={{
                    width: anchoTarjetaModulo,

                    minHeight: esEscritorio ? 175 : esTablet ? 180 : 165,

                    flexGrow: 0,

                    flexShrink: 0,
                  }}
                >
                  <TarjetaModulo
                    titulo={esTelefono ? modulo.tituloMovil : modulo.titulo}
                    descripcion={
                      esTelefono ? modulo.descripcionMovil : modulo.descripcion
                    }
                    nombreIcono={modulo.icono}
                    colorAcento={modulo.color}
                    fondoIconoClaro={modulo.fondoIconoClaro}
                    fondoIconoOscuro={modulo.fondoIconoOscuro}
                    onPress={() => abrirModulo(modulo.id)}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* ==================================================
              PARA TI HOY
          ================================================== */}

          <View
            style={{
              marginBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",

                alignItems: "center",

                marginBottom: 15,
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",

                    fontSize: esEscritorio ? 21 : 18,

                    color: textColor,
                  }}
                >
                  Para ti hoy
                </Text>

                {esEscritorio && (
                  <Text
                    style={{
                      marginTop: 3,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,

                      color: textMutedColor,
                    }}
                  >
                    Actividades recomendadas para apoyar tu bienestar.
                  </Text>
                )}
              </View>

              {resumen?.id_entrevista && resumen.actividades.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/entrevistas/[id]/plan",

                      params: {
                        id: resumen.id_entrevista,
                      },
                    })
                  }
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-SemiBold",

                      fontSize: 13,

                      color: primaryColor,
                    }}
                  >
                    Ver más
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ==================================================
                RECOMENDACIONES
            ================================================== */}

            {resumen?.actividades?.length ? (
              <View
                style={{
                  width: "100%",

                  flexDirection: esEscritorio ? "row" : "column",

                  flexWrap: esEscritorio ? "wrap" : "nowrap",

                  gap: esEscritorio ? 14 : 0,
                }}
              >
                {resumen.actividades.slice(0, 4).map((actividad, index) => {
                  const color =
                    COLORES_RECOMENDACION[index % COLORES_RECOMENDACION.length];

                  const fondoRecomendacion = isDarkMode
                    ? color.fondoOscuro
                    : color.fondoClaro;

                  return (
                    <View
                      key={actividad.codigo}
                      style={{
                        flex: esEscritorio ? 1 : undefined,

                        width: esEscritorio ? undefined : "100%",
                      }}
                    >
                      <TarjetaRecomendacion
                        titulo={actividad.titulo}
                        descripcion={actividad.descripcion}
                        nombreIcono={
                          actividad.icono as keyof typeof Ionicons.glyphMap
                        }
                        colorFondo={fondoRecomendacion}
                        colorIcono={color.icono}
                        colorTextoFlecha={color.icono}
                        onPress={() =>
                          router.push({
                            pathname: "/(tabs)/entrevistas/[id]/plan",

                            params: {
                              id: resumen.id_entrevista,
                            },
                          })
                        }
                      />
                    </View>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  width: esEscritorio ? "50%" : "100%",
                }}
              >
                <TarjetaRecomendacion
                  titulo="Realiza tu entrevista de bienestar"
                  descripcion="Completa tu evaluación para recibir un plan personalizado."
                  nombreIcono="heart-outline"
                  colorFondo={isDarkMode ? "bg-blue-950" : "bg-blue-100"}
                  colorIcono={primaryColor}
                  colorTextoFlecha={primaryColor}
                  onPress={() => router.push("/(tabs)/entrevistas")}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
