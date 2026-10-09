import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useRouter } from "expo-router";

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

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import BotonVolver from "@/components/ui/BotonVolver";
import ActionModal, { type ModalOptions } from "@/components/ui/ActionModal";

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

export default function HistorialDiarioScreen() {
  const router = useRouter();

  const [aviso, setAviso] = useState<
    (ModalOptions & {
      onConfirm?: () => void | Promise<void>;
    }) | null
  >(null);

  const modal = aviso ? (
    <ActionModal
      {...aviso}
      visible
      onClose={() => setAviso(null)}
      onConfirm={
        aviso.onConfirm
          ? () => {
              setAviso(null);
              void aviso.onConfirm?.();
            }
          : undefined
      }
    />
  ) : null;

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const [cargando, setCargando] = useState(true);

  const [registros, setRegistros] = useState<EntradaDiarioResumen[]>([]);

  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todas");

  /*
   * ==================================================
   * COLORES
   * ==================================================
   */

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

  /*
   * ==================================================
   * RESPONSIVE
   * ==================================================
   */

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

  const separacionVertical = 18;

  const separacionHorizontal = esEscritorio ? 18 : 16;

  const paddingBottom = esEscritorio ? 56 : Math.max(insets.bottom + 130, 155);

  /*
   * ==================================================
   * CARGAR HISTORIAL
   * ==================================================
   */

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

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [cargarHistorial]),
  );

  /*
   * ==================================================
   * ELIMINAR REGISTRO
   * ==================================================
   */

  const confirmarEliminar = (id: string) => {
    setAviso({
      titulo: "Eliminar registro",
      mensaje: "¿Deseas eliminar este registro de tu diario?",
      textoConfirmar: "Eliminar",
      peligro: true,
      onConfirm: async () => {
        const exito = await eliminarRegistroDiario(id);

        if (exito) {
          await cargarHistorial();

          return;
        }

        setAviso({
          titulo: "Error",
          mensaje: "No se pudo eliminar el registro.",
        });
      },
    });
  };

  /*
   * ==================================================
   * FILTROS
   * ==================================================
   */

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

  /*
   * ==================================================
   * FORMATEAR FECHA
   * ==================================================
   */

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

  /*
   * ==================================================
   * PANTALLA
   * ==================================================
   */

  return (
    <SafeAreaView
      /*
       * IMPORTANTE:
       *
       * AppHeader ya ocupa la zona superior.
       * No agregamos edges={["top"]} aquí para
       * evitar un espacio doble sobre el contenido.
       */
      edges={[]}
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      {/* ==================================================
          HEADER
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

            /*
             * Menos espacio superior en móvil.
             * AppHeader ya está encima.
             */

            paddingTop: esEscritorio ? 18 : 4,

            paddingBottom: esEscritorio ? 18 : 10,
          }}
        >
          <View
            style={{
              width: 44,

              height: 44,

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <BotonVolver onPress={() => router.back()} />
          </View>

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
          }}
        >
          {FILTROS.map((filtro, index) => {
            const activo = filtroSeleccionado === filtro.id;

            return (
              <Pressable
                key={filtro.id}
                onPress={() => setFiltroSeleccionado(filtro.id)}
                style={({ pressed }) => ({
                  marginRight: index < FILTROS.length - 1 ? 10 : 0,

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
          CONTENIDO
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
            flex: 1,

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
                justifyContent: "space-between",
              }
              : undefined
          }
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
          renderItem={({ item, index }) => (
            <View
              style={{
                width: numeroColumnas === 1 ? "100%" : undefined,

                flex: numeroColumnas > 1 ? 1 : undefined,

                minWidth: 0,

                marginBottom: separacionVertical,

                marginRight:
                  numeroColumnas > 1 &&
                    index % numeroColumnas !== numeroColumnas - 1
                    ? separacionHorizontal
                    : 0,
              }}
            >
              {/* ==================================================
                  TARJETA
              ================================================== */}

              <Pressable
                onPress={() =>
                  router.push(`/diario/${item.id_registro}` as never)
                }
                style={({ pressed }) => ({
                  width: "100%",

                  minWidth: 0,

                  borderWidth: esTelefono ? 1.5 : 1,

                  borderColor,

                  borderRadius: esTelefono ? 20 : 24,

                  overflow: "hidden",

                  backgroundColor: pressed
                    ? surfaceSecondaryColor
                    : surfaceColor,

                  /*
                   * SOMBRA
                   */

                  elevation: esTelefono ? 6 : 3,

                  shadowColor: "#000000",

                  shadowOffset: {
                    width: 0,

                    height: esTelefono ? 5 : 3,
                  },

                  shadowOpacity: esTelefono ? 0.15 : 0.1,

                  shadowRadius: esTelefono ? 12 : 8,

                  opacity: pressed ? 0.96 : 1,
                })}
              >
                {/* ==================================================
                    FRANJA SUPERIOR
                ================================================== */}

                <View
                  style={{
                    height: esTelefono ? 4 : 5,

                    backgroundColor: primaryColor,
                  }}
                />

                {/* ==================================================
                    CONTENIDO
                ================================================== */}

                <View
                  style={{
                    backgroundColor: surfaceColor,

                    paddingHorizontal: 20,

                    paddingTop: esTelefono ? 20 : 18,

                    paddingBottom: esTelefono ? 20 : 18,
                  }}
                >
                  {/* ==================================================
                      TÍTULO
                  ================================================== */}

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 16 : 15,

                      lineHeight: esEscritorio ? 22 : 21,

                      color: textColor,
                    }}
                  >
                    {item.plantilla_nombre}
                  </Text>

                  {/* ==================================================
                      CONTENIDO
                  ================================================== */}

                  <Text
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={{
                      marginTop: 10,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,

                      lineHeight: 19,

                      color: textSecondaryColor,
                    }}
                  >
                    {item.respuesta_corta || "Sin respuesta registrada."}
                  </Text>

                  {/* ==================================================
                      EMOCIONES
                  ================================================== */}

                  {item.emociones.length > 0 && (
                    <View
                      style={{
                        marginTop: 16,

                        flexDirection: "row",

                        flexWrap: "wrap",
                      }}
                    >
                      {item.emociones.map((emocion, emocionIndex) => (
                        <View
                          key={`${emocion}-${emocionIndex}`}
                          style={{
                            marginRight: 8,

                            marginBottom: 8,

                            paddingHorizontal: 11,

                            paddingVertical: 7,

                            borderRadius: 999,

                            backgroundColor: primarySoftColor,

                            flexDirection: "row",

                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name={
                              emocionIndex === 0
                                ? "leaf-outline"
                                : "sparkles-outline"
                            }
                            size={16}
                            color={primaryColor}
                          />

                          <Text
                            numberOfLines={1}
                            style={{
                              marginLeft: 5,

                              fontFamily: "Nunito-SemiBold",

                              fontSize: 11,

                              lineHeight: 15,

                              color: primaryColor,
                            }}
                          >
                            {emocion}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* ==================================================
                      PIE DE TARJETA
                  ================================================== */}

                  <View
                    style={{
                      marginTop: 18,

                      paddingTop: 14,

                      borderTopWidth: 1,

                      borderTopColor: borderColor,

                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    {/* FECHA */}

                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 1,

                        marginRight: 12,

                        fontFamily: "Nunito-SemiBold",

                        fontSize: 11,

                        lineHeight: 16,

                        color: textMutedColor,
                      }}
                    >
                      {formatearFechaHora(item.fecha_inicio)}
                    </Text>

                    {/* ACCIONES */}

                    <View
                      style={{
                        flexDirection: "row",

                        alignItems: "center",

                        flexShrink: 0,
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
                        accessibilityRole="button"
                        accessibilityLabel="Editar registro"
                        style={({ pressed }) => ({
                          width: 38,

                          height: 38,

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
                          size={18}
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
                        accessibilityRole="button"
                        accessibilityLabel="Eliminar registro"
                        style={({ pressed }) => ({
                          width: 38,

                          height: 38,

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
                          size={18}
                          color={dangerColor}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        />
      )}
      {modal}
    </SafeAreaView>
  );
}
