import { crearEntrevista } from "@/services/entrevista/entrevistaService";

import {
  EntrevistaHistorial,
  obtenerHistorialEntrevistas,
} from "@/services/entrevista/historialEntrevistaService";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
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

// ==========================================================
// FECHA
// ==========================================================

const formatoFecha = new Intl.DateTimeFormat("es-NI", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return "Sin fecha";
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return "Sin fecha";
  }

  return formatoFecha.format(fechaConvertida);
}

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function MisEntrevistasScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

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

  const iconColor = useThemeColor({}, "icon");

  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");
  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADOS
  // ========================================================

  const [entrevistas, setEntrevistas] = useState<EntrevistaHistorial[]>([]);

  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);

  const [error, setError] = useState<string | null>(null);

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

  const maxWidthCabecera = esEscritorio ? 860 : undefined;

  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 130, 150);

  // ========================================================
  // CARGAR HISTORIAL
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargar() {
        try {
          setCargando(true);
          setError(null);

          const data = await obtenerHistorialEntrevistas();

          if (activo) {
            setEntrevistas(data);
          }
        } catch (error) {
          console.error("Error cargando historial:", error);

          if (activo) {
            setError("No pudimos cargar tus entrevistas.");
          }
        } finally {
          if (activo) {
            setCargando(false);
          }
        }
      }

      cargar();

      return () => {
        activo = false;
      };
    }, []),
  );

  // ========================================================
  // NUEVA ENTREVISTA
  // ========================================================

  async function nuevaEntrevista() {
    if (creando) {
      return;
    }

    try {
      setCreando(true);
      setError(null);

      const entrevista = await crearEntrevista();

      router.push(
        `/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales` as any,
      );
    } catch (error) {
      console.error("Error creando entrevista:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar una nueva entrevista.",
      );
    } finally {
      setCreando(false);
    }
  }

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const verResultado = (id: string) => {
    router.push(`/(tabs)/entrevistas/${id}/resultado` as any);
  };

  const verPlan = (id: string) => {
    router.push(`/(tabs)/entrevistas/${id}/plan` as any);
  };

  // ========================================================
  // DATOS
  // ========================================================

  const ultima = entrevistas[0];

  const anteriores = entrevistas.slice(1);

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
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop,
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

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthCabecera,

              marginBottom: esEscritorio ? 28 : 24,

              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {/* VOLVER */}

            <Pressable
              onPress={() => {
                router.replace("/(tabs)/home");
              }}
              hitSlop={8}
              style={({ pressed }) => ({
                flexShrink: 0,

                borderRadius: 14,

                opacity: pressed ? 0.75 : 1,

                overflow: "hidden",
              })}
            >
              <View
                style={{
                  width: esTelefono ? 42 : 46,
                  height: esTelefono ? 42 : 46,

                  borderRadius: 14,

                  borderWidth: 1,
                  borderColor,

                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Ionicons name="arrow-back" size={22} color={iconColor} />
              </View>
            </Pressable>

            {/* TÍTULO Y DESCRIPCIÓN */}

            <View
              style={{
                flex: 1,
                minWidth: 0,

                marginLeft: esTelefono ? 12 : 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 30 : esTablet ? 27 : 23,

                  lineHeight: esEscritorio ? 38 : 31,

                  color: textColor,
                }}
              >
                Entrevista de bienestar
              </Text>

              <Text
                style={{
                  marginTop: 7,

                  maxWidth: 650,

                  fontFamily: "Nunito-Medium",

                  fontSize: esEscritorio ? 15 : 14,
                  lineHeight: esTelefono ? 21 : 23,

                  color: textSecondaryColor,
                }}
              >
                Consulta tus evaluaciones anteriores o realiza una nueva.
              </Text>
            </View>
          </View>

          {/* ==================================================
              NUEVA ENTREVISTA
          ================================================== */}

          <Pressable
            disabled={creando}
            onPress={nuevaEntrevista}
            style={({ pressed }) => ({
              width: "100%",

              marginBottom: esTelefono ? 28 : 32,

              borderRadius: 22,

              overflow: "hidden",

              opacity: creando ? 0.65 : pressed ? 0.85 : 1,

              ...(Platform.OS === "web"
                ? ({
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                } as any)
                : Platform.OS === "android"
                  ? {
                    elevation: 3,
                  }
                  : Platform.OS === "ios"
                    ? {
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 10,
                    }
                    : {}),
            })}
          >
            <View
              style={{
                width: "100%",

                minHeight: esTelefono ? 112 : 126,

                paddingHorizontal: esTelefono ? 14 : 24,
                paddingVertical: esTelefono ? 18 : 22,

                borderRadius: 22,

                backgroundColor: primaryColor,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* ICONO */}

              <View
                style={{
                  width: esTelefono ? 50 : 58,
                  height: esTelefono ? 50 : 58,

                  borderRadius: 17,

                  flexShrink: 0,

                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#FFFFFF",
                }}
              >
                {creando ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                  <Ionicons name="add" size={29} color={primaryColor} />
                )}
              </View>

              {/* TEXTO */}

              <View
                style={{
                  flex: 1,
                  minWidth: 0,

                  marginLeft: esTelefono ? 12 : 18,

                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",

                    fontSize: esTelefono ? 17 : 19,
                    lineHeight: esTelefono ? 23 : 26,

                    color: textOnPrimaryColor,
                  }}
                >
                  {creando ? "Preparando evaluación..." : "Nueva evaluación"}
                </Text>

                <Text
                  style={{
                    marginTop: 5,

                    fontFamily: "Nunito-Medium",

                    fontSize: esTelefono ? 12 : 14,
                    lineHeight: esTelefono ? 18 : 20,

                    color: "#EAF2FF",
                  }}
                >
                  {creando
                    ? "Estamos preparando una nueva entrevista."
                    : "Cuéntanos cómo te sientes actualmente y recibe una evaluación de bienestar."}
                </Text>
              </View>

              {/* FLECHA */}

              {!creando && (
                <View
                  style={{
                    width: esTelefono ? 30 : 38,
                    height: esTelefono ? 30 : 38,

                    marginLeft: esTelefono ? 6 : 12,

                    borderRadius: 999,

                    flexShrink: 0,

                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={esTelefono ? 20 : 24}
                    color={textOnPrimaryColor}
                  />
                </View>
              )}
            </View>
          </Pressable>

          {/* ==================================================
              ESTADOS
          ================================================== */}

          {cargando ? (
            <View
              style={{
                width: "100%",
                minHeight: 250,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color={primaryColor} />

              <Text
                style={{
                  marginTop: 12,

                  fontFamily: "Nunito-Medium",
                  fontSize: 14,

                  color: textSecondaryColor,
                }}
              >
                Cargando tus entrevistas...
              </Text>
            </View>
          ) : error ? (
            <EstadoVacio
              icono="alert-circle-outline"
              titulo="No pudimos cargar tus entrevistas"
              texto={error}
            />
          ) : entrevistas.length === 0 ? (
            <EstadoVacio
              icono="heart-outline"
              titulo="Aún no tienes evaluaciones"
              texto="Realiza tu primera entrevista para comenzar a conocer mejor tu bienestar."
            >
              <Pressable
                disabled={creando}
                onPress={nuevaEntrevista}
                style={({ pressed }) => ({
                  width: "100%",
                  maxWidth: 310,

                  marginTop: 22,

                  borderRadius: 14,

                  overflow: "hidden",

                  opacity: creando ? 0.6 : pressed ? 0.8 : 1,
                })}
              >
                <View
                  style={{
                    minHeight: 48,

                    paddingHorizontal: 16,
                    paddingVertical: 10,

                    borderRadius: 14,

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor: primaryColor,
                  }}
                >
                  {creando && (
                    <ActivityIndicator
                      size="small"
                      color={textOnPrimaryColor}
                      style={{
                        marginRight: 8,
                      }}
                    />
                  )}

                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 13,

                      textAlign: "center",

                      color: textOnPrimaryColor,
                    }}
                  >
                    {creando
                      ? "Preparando..."
                      : "Realizar mi primera entrevista"}
                  </Text>
                </View>
              </Pressable>
            </EstadoVacio>
          ) : (
            <>
              {/* ==================================================
                  ÚLTIMA EVALUACIÓN
              ================================================== */}

              <Text
                style={{
                  marginTop: esTelefono ? 12 : 16,
                  marginBottom: esTelefono ? 22 : 24,

                  fontFamily: "Nunito-Bold",
                  fontSize: esEscritorio ? 22 : 20,
                  color: textColor,
                }}
              >
                Última evaluación
              </Text>

              <View
                style={{
                  width: "100%",

                  padding: esEscritorio ? 24 : esTelefono ? 16 : 20,

                  borderRadius: 24,

                  borderWidth: 1,
                  borderColor,

                  backgroundColor: surfaceColor,

                  ...(Platform.OS === "web"
                    ? ({
                      boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
                    } as any)
                    : Platform.OS === "android"
                      ? {
                        elevation: 2,
                      }
                      : Platform.OS === "ios"
                        ? {
                          shadowColor: "#000000",
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowOpacity: 0.06,
                          shadowRadius: 8,
                        }
                        : {}),
                }}
              >
                {/* ==============================================
                    FECHA Y ESTADO
                ============================================== */}

                <View
                  style={{
                    width: "100%",

                    flexDirection: esTelefono ? "column" : "row",

                    alignItems: esTelefono ? "flex-start" : "center",

                    gap: 12,
                  }}
                >
                  {/* FECHA */}

                  <View
                    style={{
                      width: esTelefono ? "100%" : undefined,

                      flex: esTelefono ? undefined : 1,

                      minWidth: 0,

                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,

                        borderRadius: 15,

                        flexShrink: 0,

                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color={primaryColor}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        minWidth: 0,

                        marginLeft: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          fontSize: 12,

                          color: textMutedColor,
                        }}
                      >
                        Realizada el
                      </Text>

                      <Text
                        style={{
                          marginTop: 3,

                          fontFamily: "Nunito-Bold",

                          fontSize: esTelefono ? 14 : 15,
                          lineHeight: 21,

                          color: textColor,
                        }}
                      >
                        {formatearFecha(ultima.fecha_fin)}
                      </Text>
                    </View>
                  </View>

                  {/* ESTADO */}

                  <View
                    style={{
                      alignSelf: esTelefono ? "flex-start" : "center",

                      paddingHorizontal: 13,
                      paddingVertical: 7,

                      borderRadius: 999,

                      backgroundColor: secondarySoftColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-SemiBold",

                        fontSize: 12,

                        color: secondaryColor,
                      }}
                    >
                      Completada
                    </Text>
                  </View>
                </View>

                {/* ==============================================
                    ENFOQUE PRINCIPAL
                ============================================== */}

                {ultima.areas_prioritarias.length > 0 && (
                  <View
                    style={{
                      width: "100%",

                      marginTop: 20,

                      padding: esTelefono ? 16 : 18,

                      borderRadius: 18,

                      borderWidth: 1,
                      borderColor,

                      backgroundColor: surfaceSecondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Medium",

                        fontSize: 12,

                        color: textMutedColor,
                      }}
                    >
                      Enfoque principal
                    </Text>

                    <View
                      style={{
                        width: "100%",

                        marginTop: 8,

                        flexDirection: "row",
                        alignItems: "center",

                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          minWidth: 0,

                          fontFamily: "Nunito-Bold",

                          fontSize: esTelefono ? 14 : 15,
                          lineHeight: 21,

                          color: textColor,
                        }}
                      >
                        {ultima.areas_prioritarias.join(" y ")}
                      </Text>

                      {ultima.porcentaje !== null && (
                        <Text
                          style={{
                            flexShrink: 0,

                            fontFamily: "Nunito-Bold",

                            fontSize: esTelefono ? 20 : 22,

                            color: primaryColor,
                          }}
                        >
                          {Math.round(ultima.porcentaje)}%
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {/* ==============================================
                    ACCIONES RESPONSIVE
                ============================================== */}

                <View
                  style={{
                    width: "100%",

                    marginTop: 20,

                    flexDirection: esTelefono ? "column" : "row",
                    alignItems: "stretch",

                    gap: 12,
                  }}
                >
                  <BotonAccion
                    icono="analytics-outline"
                    texto="Ver resultados"
                    esTelefono={esTelefono}
                    onPress={() => {
                      verResultado(ultima.id_entrevista);
                    }}
                  />

                  {ultima.tiene_plan && (
                    <BotonAccion
                      icono="clipboard-outline"
                      texto="Ver plan"
                      esTelefono={esTelefono}
                      onPress={() => {
                        verPlan(ultima.id_entrevista);
                      }}
                    />
                  )}
                </View>
              </View>

              {/* ==================================================
                  HISTORIAL
              ================================================== */}

              {anteriores.length > 0 && (
                <>
                  <View
                    style={{
                      marginTop: esEscritorio ? 36 : 30,
                      marginBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",

                        fontSize: esEscritorio ? 22 : 20,

                        color: textColor,
                      }}
                    >
                      Historial
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,

                        fontFamily: "Nunito-Medium",

                        fontSize: 13,
                        lineHeight: 19,

                        color: textMutedColor,
                      }}
                    >
                      Revisa tus evaluaciones anteriores.
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",

                      flexDirection: esEscritorio ? "row" : "column",

                      flexWrap: esEscritorio ? "wrap" : "nowrap",

                      gap: 14,
                    }}
                  >
                    {anteriores.map((entrevista) => (
                      <Pressable
                        key={entrevista.id_entrevista}
                        onPress={() => {
                          verResultado(entrevista.id_entrevista);
                        }}
                        style={({ pressed }) => ({
                          width: esEscritorio ? "49%" : "100%",

                          borderRadius: 18,

                          overflow: "hidden",

                          opacity: pressed ? 0.85 : 1,
                        })}
                      >
                        <View
                          style={{
                            width: "100%",

                            minHeight: 96,

                            padding: esTelefono ? 14 : 16,

                            borderRadius: 18,

                            borderWidth: 1,
                            borderColor,

                            backgroundColor: surfaceColor,

                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {/* ICONO */}

                          <View
                            style={{
                              width: 44,
                              height: 44,

                              borderRadius: 14,

                              flexShrink: 0,

                              alignItems: "center",
                              justifyContent: "center",

                              backgroundColor: primarySoftColor,
                            }}
                          >
                            <Ionicons
                              name="heart-outline"
                              size={20}
                              color={primaryColor}
                            />
                          </View>

                          {/* INFORMACIÓN */}

                          <View
                            style={{
                              flex: 1,
                              minWidth: 0,

                              marginLeft: 12,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Nunito-Bold",

                                fontSize: 14,
                                lineHeight: 20,

                                color: textColor,
                              }}
                            >
                              {formatearFecha(entrevista.fecha_fin)}
                            </Text>

                            {entrevista.areas_prioritarias.length > 0 && (
                              <Text
                                numberOfLines={2}
                                style={{
                                  marginTop: 4,

                                  fontFamily: "Nunito-Medium",

                                  fontSize: 12,
                                  lineHeight: 17,

                                  color: textSecondaryColor,
                                }}
                              >
                                {entrevista.areas_prioritarias.join(" y ")}
                              </Text>
                            )}
                          </View>

                          {/* PORCENTAJE Y FLECHA */}

                          <View
                            style={{
                              flexShrink: 0,

                              marginLeft: 8,

                              alignItems: "flex-end",

                              justifyContent: "center",

                              gap: 5,
                            }}
                          >
                            {entrevista.porcentaje !== null && (
                              <Text
                                style={{
                                  fontFamily: "Nunito-Bold",

                                  fontSize: 16,

                                  color: primaryColor,
                                }}
                              >
                                {Math.round(entrevista.porcentaje)}%
                              </Text>
                            )}

                            <Ionicons
                              name="chevron-forward"
                              size={19}
                              color={primaryColor}
                            />
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================================
// ESTADO VACÍO
// ==========================================================

function EstadoVacio({
  icono,
  titulo,
  texto,
  children,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  texto: string;
  children?: React.ReactNode;
}) {
  const { esTelefono } = useResponsiveLayout();

  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  return (
    <View
      style={{
        width: "100%",

        minHeight: esTelefono ? 250 : 300,

        padding: esTelefono ? 22 : 30,

        borderRadius: 24,

        borderWidth: 1,
        borderColor,

        backgroundColor: surfaceColor,

        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ICONO */}

      <View
        style={{
          width: 64,
          height: 64,

          borderRadius: 32,

          alignItems: "center",
          justifyContent: "center",

          backgroundColor: primarySoftColor,
        }}
      >
        <Ionicons name={icono} size={29} color={primaryColor} />
      </View>

      {/* TÍTULO */}

      <Text
        style={{
          marginTop: 16,

          fontFamily: "Nunito-Bold",

          fontSize: 18,
          lineHeight: 24,

          textAlign: "center",

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      {/* DESCRIPCIÓN */}

      <Text
        style={{
          marginTop: 7,

          maxWidth: 460,

          fontFamily: "Nunito-Medium",

          fontSize: 14,
          lineHeight: 20,

          textAlign: "center",

          color: textSecondaryColor,
        }}
      >
        {texto}
      </Text>

      {children}
    </View>
  );
}

// ==========================================================
// BOTÓN DE ACCIÓN RESPONSIVE
// ==========================================================

function BotonAccion({
  icono,
  texto,
  onPress,
  esTelefono,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  texto: string;
  onPress: () => void;
  esTelefono: boolean;
}) {
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: esTelefono ? "100%" : undefined,
        flex: esTelefono ? undefined : 1,
        minWidth: 0,

        borderRadius: 14,
        overflow: "hidden",

        opacity: pressed ? 0.76 : 1,
      })}
    >
      <View
        style={{
          width: "100%",

          minHeight: 52,

          paddingHorizontal: 14,
          paddingVertical: 10,

          borderRadius: 14,

          borderWidth: 1,
          borderColor,

          backgroundColor: primarySoftColor,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icono} size={19} color={primaryColor} />

        <Text
          style={{
            flexShrink: 1,
            marginLeft: 9,

            fontFamily: "Nunito-Bold",
            fontSize: 13,
            lineHeight: 18,
            textAlign: "center",

            color: primaryColor,
          }}
        >
          {texto}
        </Text>
      </View>
    </Pressable>
  );
}
