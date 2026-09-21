import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useFocusEffect, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  eliminarRegistroDiario,
  obtenerHistorialDiario,
} from "@/services/diario/autorregistro.service";

import { EntradaDiarioResumen } from "@/types/diario";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// FILTROS
// ==========================================================

const FILTROS = [
  {
    id: "todas",
    label: "Todas",
  },
  {
    id: "emocional",
    label: "Diario Emocional",
  },
];

// ==========================================================
// COMPONENTE
// ==========================================================

export default function HistorialDiarioScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [cargando, setCargando] = useState(true);

  const [registros, setRegistros] = useState<EntradaDiarioResumen[]>([]);

  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todas");

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

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const dangerColor = useThemeColor({}, "danger");

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

  const numeroColumnas = esEscritorio ? 3 : esTablet ? 2 : 1;

  const gapColumnas = esEscritorio ? 18 : 16;

  const paddingBottom = esEscritorio ? 56 : Math.max(insets.bottom + 130, 155);

  // ========================================================
  // CARGAR HISTORIAL
  // ========================================================

  const cargarHistorial = useCallback(async () => {
    try {
      setCargando(true);

      const datos = await obtenerHistorialDiario(50);

      setRegistros(datos);
    } catch (error) {
      console.error("Error al cargar el historial:", error);

      setRegistros([]);
    } finally {
      setCargando(false);
    }
  }, []);

  // ========================================================
  // ACTUALIZAR AL VOLVER
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [cargarHistorial]),
  );

  // ========================================================
  // ELIMINAR
  // ========================================================

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      "Eliminar registro",
      "¿Deseas eliminar este registro de tu diario?",
      [
        {
          text: "Cancelar",

          style: "cancel",
        },
        {
          text: "Eliminar",

          style: "destructive",

          onPress: async () => {
            const exito = await eliminarRegistroDiario(id);

            if (exito) {
              await cargarHistorial();

              return;
            }

            Alert.alert("Error", "No se pudo eliminar el registro.");
          },
        },
      ],
    );
  };

  // ========================================================
  // FILTRAR
  // ========================================================

  const registrosFiltrados = useMemo(() => {
    if (filtroSeleccionado === "todas") {
      return registros;
    }

    if (filtroSeleccionado === "emocional") {
      return registros.filter((item) =>
        item.plantilla_nombre.toLowerCase().includes("emocional"),
      );
    }

    return registros;
  }, [registros, filtroSeleccionado]);

  // ========================================================
  // FORMATEAR FECHA
  // ========================================================

  const formatearFechaHora = (fechaIso: string) => {
    const fecha = new Date(fechaIso);

    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    });

    const horaFormateada = fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",

      minute: "2-digit",
    });

    return `${fechaFormateada}, ${horaFormateada}`;
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <View
        style={{
          borderBottomWidth: 1,

          borderBottomColor: borderColor,

          backgroundColor: surfaceColor,
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            flexDirection: "row",

            alignItems: "center",

            paddingHorizontal,

            paddingVertical: esEscritorio ? 18 : 14,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 44,

              height: 44,

              borderRadius: 14,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: pressed
                ? primarySoftColor
                : surfaceSecondaryColor,
            })}
          >
            <Ionicons name="arrow-back" size={22} color={textColor} />
          </Pressable>

          <View
            style={{
              flex: 1,

              paddingHorizontal: 14,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                textAlign: esEscritorio ? "left" : "center",

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 22 : 19,

                color: textColor,
              }}
            >
              Historial de registros
            </Text>

            {esEscritorio && (
              <Text
                style={{
                  marginTop: 2,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

                  color: textMutedColor,
                }}
              >
                Consulta, edita o elimina tus registros anteriores.
              </Text>
            )}
          </View>

          {!esEscritorio && (
            <View
              style={{
                width: 44,

                height: 44,
              }}
            />
          )}
        </View>
      </View>

      {/* ==================================================
          FILTROS
      ================================================== */}

      <View
        style={{
          width: "100%",

          maxWidth: maxWidthContenido,

          alignSelf: "center",

          paddingTop: esEscritorio ? 22 : 16,

          paddingBottom: 14,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal,

            gap: 10,
          }}
        >
          {FILTROS.map((filtro) => {
            const activo = filtroSeleccionado === filtro.id;

            return (
              <Pressable
                key={filtro.id}
                onPress={() => setFiltroSeleccionado(filtro.id)}
                style={({ pressed }) => ({
                  paddingHorizontal: esEscritorio ? 18 : 16,

                  paddingVertical: 9,

                  borderRadius: 999,

                  borderWidth: 1,

                  borderColor: activo ? primaryColor : borderColor,

                  backgroundColor: activo
                    ? primaryColor
                    : pressed
                      ? surfaceSecondaryColor
                      : surfaceColor,
                })}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",

                    fontSize: 13,

                    color: activo ? textOnPrimaryColor : textSecondaryColor,
                  }}
                >
                  {filtro.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ==================================================
          CARGANDO
      ================================================== */}

      {cargando ? (
        <View
          style={{
            flex: 1,

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={primaryColor} />

          <Text
            style={{
              marginTop: 12,

              fontFamily: "Nunito-Medium",

              fontSize: 14,

              color: textMutedColor,
            }}
          >
            Cargando historial...
          </Text>
        </View>
      ) : (
        <FlatList
          key={numeroColumnas}
          data={registrosFiltrados}
          keyExtractor={(item) => item.id_registro}
          numColumns={numeroColumnas}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",
          }}
          contentContainerStyle={{
            paddingHorizontal,

            paddingTop: 8,

            paddingBottom,
          }}
          columnWrapperStyle={
            numeroColumnas > 1
              ? {
                  gap: gapColumnas,
                }
              : undefined
          }

          // ==================================================
          // VACÍO
          // ==================================================

          ListEmptyComponent={
            <View
              style={{
                marginTop: esEscritorio ? 80 : 60,

                paddingHorizontal: 24,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 68,

                  height: 68,

                  borderRadius: 34,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Ionicons name="book-outline" size={30} color={primaryColor} />
              </View>

              <Text
                style={{
                  marginTop: 16,

                  textAlign: "center",

                  fontFamily: "Nunito-Bold",

                  fontSize: 17,

                  color: textColor,
                }}
              >
                No hay registros
              </Text>

              <Text
                style={{
                  marginTop: 5,

                  maxWidth: 420,

                  textAlign: "center",

                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  lineHeight: 20,

                  color: textMutedColor,
                }}
              >
                No encontramos registros disponibles en esta categoría.
              </Text>
            </View>
          }

          // ==================================================
          // REGISTRO
          // ==================================================

          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push(`/diario/${item.id_registro}` as never)
              }
              style={({ pressed }) => ({
                flex: 1,

                minWidth: 0,

                marginBottom: gapColumnas,

                overflow: "hidden",

                borderRadius: 22,

                borderWidth: 1,

                borderColor,

                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

                elevation: 1,

                shadowColor: "#000000",

                shadowOffset: {
                  width: 0,

                  height: 2,
                },

                shadowOpacity: 0.05,

                shadowRadius: 5,
              })}
            >
              {/* ==========================================
                      LÍNEA SUPERIOR
                  ========================================== */}

              <View
                style={{
                  height: 6,

                  backgroundColor: primaryColor,
                }}
              />

              <View
                style={{
                  flex: 1,

                  padding: esEscritorio ? 18 : 16,

                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 16 : 15,

                      color: textColor,
                    }}
                  >
                    {item.plantilla_nombre}
                  </Text>

                  <Text
                    numberOfLines={3}
                    style={{
                      marginTop: 8,

                      minHeight: 54,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,

                      lineHeight: 18,

                      color: textSecondaryColor,
                    }}
                  >
                    {item.respuesta_corta || "Sin respuesta registrada."}
                  </Text>

                  {item.emociones.length > 0 && (
                    <View
                      style={{
                        marginTop: 12,

                        alignSelf: "flex-start",

                        maxWidth: "100%",

                        paddingHorizontal: 12,

                        paddingVertical: 6,

                        borderRadius: 999,

                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 11,

                          color: primaryColor,
                        }}
                      >
                        {item.emociones.join(", ")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* ======================================
                        PIE
                    ====================================== */}

                <View
                  style={{
                    marginTop: 16,

                    paddingTop: 12,

                    borderTopWidth: 1,

                    borderTopColor: borderColor,

                    flexDirection: "row",

                    alignItems: "center",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,

                      marginRight: 8,

                      fontFamily: "Nunito-SemiBold",

                      fontSize: 11,

                      color: textMutedColor,
                    }}
                  >
                    {formatearFechaHora(item.fecha_inicio)}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    {/* EDITAR */}

                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();

                        router.push(
                          `/diario/${item.id_registro}/editar` as never,
                        );
                      }}
                      hitSlop={8}
                      style={({ pressed }) => ({
                        width: 36,

                        height: 36,

                        marginRight: 8,

                        borderRadius: 12,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: pressed
                          ? surfaceSecondaryColor
                          : primarySoftColor,
                      })}
                    >
                      <Ionicons
                        name="create-outline"
                        size={17}
                        color={primaryColor}
                      />
                    </Pressable>

                    {/* ELIMINAR */}

                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();

                        confirmarEliminar(item.id_registro);
                      }}
                      hitSlop={8}
                      style={({ pressed }) => ({
                        width: 36,

                        height: 36,

                        borderRadius: 12,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: pressed
                          ? surfaceSecondaryColor
                          : "rgba(239, 68, 68, 0.10)",
                      })}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color={dangerColor}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
