import { crearEntrevista } from "@/services/entrevista/entrevistaService";

import {
  EntrevistaHistorial,
  obtenerHistorialEntrevistas,
} from "@/services/entrevista/historialEntrevistaService";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

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
  return fecha ? formatoFecha.format(new Date(fecha)) : "Sin fecha";
}

// ==========================================================
// COMPONENTE
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

  const verResultado = (id: string) =>
    router.push(`/(tabs)/entrevistas/${id}/resultado` as any);

  const verPlan = (id: string) =>
    router.push(`/(tabs)/entrevistas/${id}/plan` as any);

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
              HEADER
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthCabecera,

              marginBottom: esEscritorio ? 26 : 22,

              flexDirection: "row",

              alignItems: "flex-start",
            }}
          >
            <Pressable
              onPress={() => router.replace("/(tabs)/home")}
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

                opacity: pressed ? 0.8 : 1,

                ...Platform.select({
                  web: {
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                  },

                  ios: {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },

                    shadowOpacity: 0.05,

                    shadowRadius: 5,
                  },

                  android: {
                    elevation: 2,
                  },
                }),
              })}
            >
              <Ionicons name="arrow-back" size={22} color={iconColor} />
            </Pressable>

            <View
              style={{
                flex: 1,

                minWidth: 0,

                marginLeft: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 30 : esTablet ? 27 : 24,

                  lineHeight: esEscritorio ? 38 : 32,

                  color: textColor,
                }}
              >
                Entrevista de bienestar
              </Text>

              <Text
                style={{
                  marginTop: 5,

                  maxWidth: 650,

                  fontFamily: "Nunito-Medium",

                  fontSize: esEscritorio ? 15 : 14,

                  lineHeight: 21,

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

              minHeight: esEscritorio ? 126 : 112,

              marginBottom: 28,

              padding: esEscritorio ? 24 : 20,

              borderRadius: 24,

              borderWidth: 1,

              borderColor: primaryColor,

              flexDirection: "row",

              alignItems: "center",

              backgroundColor: primaryColor,

              opacity: creando ? 0.65 : pressed ? 0.88 : 1,

              ...Platform.select({
                web: {
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                },

                ios: {
                  shadowColor: "#000000",

                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },

                  shadowOpacity: 0.08,

                  shadowRadius: 10,
                },

                android: {
                  elevation: 4,
                },
              }),
            })}
          >
            <View
              style={{
                width: esEscritorio ? 58 : 52,

                height: esEscritorio ? 58 : 52,

                borderRadius: 18,

                flexShrink: 0,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: surfaceColor,
              }}
            >
              {creando ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : (
                <Ionicons name="add" size={27} color={primaryColor} />
              )}
            </View>

            <View
              style={{
                flex: 1,

                minWidth: 0,

                marginLeft: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 18 : 16,

                  color: textOnPrimaryColor,
                }}
              >
                {creando ? "Preparando evaluación..." : "Nueva evaluación"}
              </Text>

              <Text
                numberOfLines={esTelefono ? 2 : 1}
                style={{
                  marginTop: 4,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

                  lineHeight: 19,

                  color: "#EAF2FF",
                }}
              >
                {creando
                  ? "Estamos preparando una nueva entrevista."
                  : "Cuéntanos cómo te sientes actualmente y recibe una evaluación de bienestar."}
              </Text>
            </View>

            {!creando && (
              <Ionicons
                name="chevron-forward"
                size={22}
                color={textOnPrimaryColor}
              />
            )}
          </Pressable>

          {/* ==================================================
              ESTADOS
          ================================================== */}

          {cargando ? (
            <View
              style={{
                minHeight: 260,

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
          ) : !entrevistas.length ? (
            <EstadoVacio
              icono="heart-outline"
              titulo="Aún no tienes evaluaciones"
              texto="Realiza tu primera entrevista para comenzar a conocer mejor tu bienestar."
            >
              <Pressable
                disabled={creando}
                onPress={nuevaEntrevista}
                style={({ pressed }) => ({
                  minHeight: 46,

                  marginTop: 20,

                  paddingHorizontal: 20,

                  borderRadius: 14,

                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "center",

                  gap: 8,

                  backgroundColor: primaryColor,

                  opacity: creando ? 0.6 : pressed ? 0.8 : 1,
                })}
              >
                {creando && (
                  <ActivityIndicator size="small" color={textOnPrimaryColor} />
                )}

                <Text
                  style={{
                    fontFamily: "Nunito-Bold",

                    fontSize: 13,

                    color: textOnPrimaryColor,
                  }}
                >
                  {creando ? "Preparando..." : "Realizar mi primera entrevista"}
                </Text>
              </Pressable>
            </EstadoVacio>
          ) : (
            <>
              {/* ==================================================
                  ÚLTIMA EVALUACIÓN
              ================================================== */}

              <Text
                style={{
                  marginBottom: 16,

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

                  padding: esEscritorio ? 24 : 20,

                  borderRadius: 24,

                  borderWidth: 1,

                  borderColor,

                  backgroundColor: surfaceColor,

                  ...Platform.select({
                    web: {
                      boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
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
                      elevation: 3,
                    },
                  }),
                }}
              >
                {/* ==============================================
                    FECHA
                ============================================== */}

                <View
                  style={{
                    flexDirection: esTelefono ? "column" : "row",

                    alignItems: esTelefono ? "flex-start" : "center",

                    gap: esTelefono ? 12 : 0,
                  }}
                >
                  <View
                    style={{
                      flex: 1,

                      minWidth: 0,

                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 46,

                        height: 46,

                        borderRadius: 15,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={21}
                        color={primaryColor}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,

                        marginLeft: 13,
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
                          marginTop: 2,

                          fontFamily: "Nunito-Bold",

                          fontSize: 15,

                          color: textColor,
                        }}
                      >
                        {formatearFecha(ultima.fecha_fin)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 12,

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
                    ÁREA PRIORITARIA
                ============================================== */}

                {!!ultima.areas_prioritarias.length && (
                  <View
                    style={{
                      marginTop: 20,

                      padding: 18,

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
                        marginTop: 6,

                        flexDirection: "row",

                        alignItems: "center",

                        justifyContent: "space-between",

                        gap: 12,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,

                          fontFamily: "Nunito-Bold",

                          fontSize: 15,

                          lineHeight: 21,

                          color: textColor,
                        }}
                      >
                        {ultima.areas_prioritarias.join(" y ")}
                      </Text>

                      {ultima.porcentaje !== null && (
                        <Text
                          style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: 21,

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
                    ACCIONES
                ============================================== */}

                <View
                  style={{
                    marginTop: 20,

                    flexDirection: esTelefono ? "column" : "row",

                    gap: 12,
                  }}
                >
                  <BotonAccion
                    icono="analytics-outline"
                    texto="Ver resultados"
                    onPress={() => verResultado(ultima.id_entrevista)}
                  />

                  {ultima.tiene_plan && (
                    <BotonAccion
                      icono="clipboard-outline"
                      texto="Ver plan"
                      onPress={() => verPlan(ultima.id_entrevista)}
                    />
                  )}
                </View>
              </View>

              {/* ==================================================
                  HISTORIAL
              ================================================== */}

              {!!anteriores.length && (
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
                        marginTop: 3,

                        fontFamily: "Nunito-Medium",

                        fontSize: 13,

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
                        onPress={() => verResultado(entrevista.id_entrevista)}
                        style={({ pressed }) => ({
                          width: esEscritorio ? "49.3%" : "100%",

                          minHeight: 96,

                          padding: 16,

                          borderRadius: 18,

                          borderWidth: 1,

                          borderColor: pressed ? primaryColor : borderColor,

                          flexDirection: "row",

                          alignItems: "center",

                          backgroundColor: pressed
                            ? primarySoftColor
                            : surfaceColor,

                          opacity: pressed ? 0.9 : 1,
                        })}
                      >
                        <View
                          style={{
                            width: 44,

                            height: 44,

                            borderRadius: 14,

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

                        <View
                          style={{
                            flex: 1,

                            minWidth: 0,

                            marginLeft: 13,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Nunito-Bold",

                              fontSize: 14,

                              color: textColor,
                            }}
                          >
                            {formatearFecha(entrevista.fecha_fin)}
                          </Text>

                          {!!entrevista.areas_prioritarias.length && (
                            <Text
                              numberOfLines={2}
                              style={{
                                marginTop: 3,

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

                        <View
                          style={{
                            marginLeft: 10,

                            alignItems: "flex-end",

                            justifyContent: "center",

                            gap: 4,
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

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: surfaceColor,
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
        }}
      >
        <Ionicons name={icono} size={29} color={primaryColor} />
      </View>

      <Text
        style={{
          marginTop: 16,

          fontFamily: "Nunito-Bold",

          fontSize: 18,

          textAlign: "center",

          color: textColor,
        }}
      >
        {titulo}
      </Text>

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
// BOTÓN DE ACCIÓN
// ==========================================================

function BotonAccion({
  icono,
  texto,
  onPress,
}: {
  icono: keyof typeof Ionicons.glyphMap;

  texto: string;

  onPress: () => void;
}) {
  const { esTelefono } = useResponsiveLayout();

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: esTelefono ? undefined : 1,

        width: esTelefono ? "100%" : undefined,

        minHeight: 46,

        paddingHorizontal: 16,

        borderRadius: 14,

        borderWidth: 1,

        borderColor: pressed ? primaryColor : borderColor,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,

        backgroundColor: primarySoftColor,

        opacity: pressed ? 0.76 : 1,
      })}
    >
      <Ionicons name={icono} size={18} color={primaryColor} />

      <Text
        style={{
          fontFamily: "Nunito-SemiBold",

          fontSize: 13,

          color: primaryColor,
        }}
      >
        {texto}
      </Text>
    </Pressable>
  );
}
