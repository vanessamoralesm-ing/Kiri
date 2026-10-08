import React, { useCallback, useState } from "react";

import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInUp } from "react-native-reanimated";

import {
  eliminarRegistroDiario,
  obtenerDetalleRegistro,
  obtenerDetalleRegistroABC,
} from "@/services/diario/autorregistro.service";

import { DetalleRegistroDiario, DetalleRegistroABC } from "@/types/diario";

import { DetalleHeader } from "@/components/diario/DetalleHeader";

import { ResumenRegistroCard } from "@/components/diario/ResumenRegistroCard";

import { RespuestaDetalleCard } from "@/components/diario/RespuestaDetalleCard";

import { DetalleSkeleton } from "@/components/diario/DetalleSkeleton";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function VerEntradaDiarioScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [cargando, setCargando] = useState(true);

  const [tipoRegistro, setTipoRegistro] = useState<
    "emocional" | "abc" | null
  >(null);

  const [registroEmocional, setRegistroEmocional] =
    useState<DetalleRegistroDiario | null>(null);

  const [registroABC, setRegistroABC] =
    useState<DetalleRegistroABC | null>(null);
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
    ? 980
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthRespuestas = esEscritorio ? 900 : undefined;

  const gapRespuestas = esEscritorio ? 18 : esTablet ? 16 : 0;

  const paddingTop = esEscritorio ? 28 : Math.max(insets.top + 12, 20);

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 50, 70);

  // ========================================================
  // CARGAR DETALLE
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }

      const cargarDetalle = async () => {
        try {
          setCargando(true);

          setTipoRegistro(null);
          setRegistroABC(null);
          setRegistroEmocional(null);

          // Primero comprobamos si es Autorregistro ABC.
          const detalleABC = await obtenerDetalleRegistroABC(id);

          if (detalleABC) {
            setRegistroABC(detalleABC);
            setTipoRegistro("abc");

            return;
          }

          // Si no es ABC, conservamos el flujo existente
          // del Diario Emocional.
          const detalleEmocional =
            await obtenerDetalleRegistro(id);

          if (detalleEmocional) {
            setRegistroEmocional(detalleEmocional);
            setTipoRegistro("emocional");

            return;
          }

          setTipoRegistro(null);
        } catch (error) {
          console.error(
            "Error al cargar el detalle:",
            error,
          );

          setTipoRegistro(null);
          setRegistroABC(null);
          setRegistroEmocional(null);
        } finally {
          setCargando(false);
        }
      };

      cargarDetalle();
    }, [id]),
  );

  // ========================================================
  // ELIMINAR
  // ========================================================

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar registro",
      "¿Estás seguro de que deseas eliminar esta entrada? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",

          style: "cancel",
        },
        {
          text: "Eliminar",

          style: "destructive",

          onPress: async () => {
            if (!id) {
              return;
            }

            const ok = await eliminarRegistroDiario(id);

            if (ok) {
              Alert.alert(
                "Registro eliminado",
                "La entrada fue eliminada correctamente.",
                [
                  {
                    text: "OK",

                    onPress: () => router.back(),
                  },
                ],
              );

              return;
            }

            Alert.alert("Error", "No se pudo eliminar el registro.");
          },
        },
      ],
    );
  };

  // ========================================================
  // FORMATEAR FECHA
  // ========================================================

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) {
      return "";
    }

    return new Date(fechaIso).toLocaleDateString("es-ES", {
      weekday: "long",

      day: "numeric",

      month: "long",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    });
  };

  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor,
        }}
      >
        <DetalleSkeleton />
      </View>
    );
  }

  // ========================================================
  // REGISTRO NO ENCONTRADO
  // ========================================================

  if (
    !tipoRegistro ||
    (tipoRegistro === "abc" && !registroABC) ||
    (tipoRegistro === "emocional" && !registroEmocional)
  ) {

    return (
      <View
        style={{
          flex: 1,

          paddingHorizontal,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor,
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: 440,

            padding: esTelefono ? 22 : 28,

            borderRadius: 24,

            borderWidth: 1,

            borderColor,

            backgroundColor: surfaceColor,

            elevation: 2,

            shadowColor: "#000000",

            shadowOffset: {
              width: 0,

              height: 2,
            },

            shadowOpacity: 0.05,

            shadowRadius: 8,
          }}
        >
          <View
            style={{
              width: 64,

              height: 64,

              borderRadius: 32,

              alignSelf: "center",

              alignItems: "center",

              justifyContent: "center",

              marginBottom: 16,

              backgroundColor: surfaceSecondaryColor,
            }}
          >
            <Text
              style={{
                fontSize: 30,
              }}
            >
              📖
            </Text>
          </View>

          <Text
            style={{
              textAlign: "center",

              fontFamily: "Nunito-Bold",

              fontSize: 20,

              color: textColor,
            }}
          >
            No encontramos este registro
          </Text>

          <Text
            style={{
              marginTop: 8,

              textAlign: "center",

              fontFamily: "Nunito-Medium",

              fontSize: 14,

              lineHeight: 20,

              color: textMutedColor,
            }}
          >
            Es posible que haya sido eliminado o que ya no esté disponible.
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              minHeight: 48,

              marginTop: 20,

              paddingHorizontal: 20,

              borderRadius: 16,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: pressed ? surfaceSecondaryColor : primaryColor,
            })}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                color: textOnPrimaryColor,
              }}
            >
              Regresar
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ========================================================
  // AUTORREGISTRO ABC - SOLO LECTURA
  // ========================================================

  if (tipoRegistro === "abc" && registroABC) {
    return (
      <View
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
              maxWidth: esEscritorio
                ? 820
                : esTablet
                  ? MAX_WIDTHS.formulario
                  : undefined,
              alignSelf: "center",
              paddingHorizontal,
            }}
          >
            {/* ==============================================
                HEADER
            ============================================== */}

            <DetalleHeader
              onBack={() => router.back()}
              onEdit={() =>
                router.push(
                  `/diario/${id}/editar` as never,
                )
              }
              onDelete={confirmarEliminacion}
            />

            {/* ==============================================
                FECHA
            ============================================== */}

            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 20,
                marginBottom: 16,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 14,
                backgroundColor: surfaceSecondaryColor,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-SemiBold",
                  fontSize: 14,
                  color: textSecondaryColor,
                }}
              >
                {formatearFecha(registroABC.fecha_inicio)}
              </Text>
            </View>

            {/* ==============================================
                TARJETA ABC
            ============================================== */}

            <View
              style={{
                width: "100%",
                overflow: "hidden",
                borderRadius: esTelefono ? 22 : 26,
                borderWidth: 1,
                borderColor,
                backgroundColor: surfaceColor,

                elevation: 2,

                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.06,
                shadowRadius: 12,
              }}
            >
              {/* ==========================================
                  ENCABEZADO DE LA TARJETA
              ========================================== */}

              <View
                style={{
                  paddingHorizontal: esTelefono ? 18 : 24,
                  paddingTop: esTelefono ? 18 : 20,
                  paddingBottom: esTelefono ? 14 : 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: surfaceSecondaryColor,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                    }}
                  >
                    📖
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
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: esTelefono ? 18 : 20,
                      color: primaryColor,
                    }}
                  >
                    Autorregistro ABC
                  </Text>

                  {!esTelefono && (
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: "Nunito-Medium",
                        fontSize: 13,
                        lineHeight: 18,
                        color: textMutedColor,
                      }}
                    >
                      Tu reflexión personal
                    </Text>
                  )}
                </View>
              </View>

              {/* ==========================================
                  DIVISOR
              ========================================== */}

              <View
                style={{
                  height: 1,
                  marginHorizontal: esTelefono ? 18 : 24,
                  backgroundColor: borderColor,
                }}
              />

              {/* ==========================================
                  CONTENIDO GUARDADO
              ========================================== */}

              <View
                style={{
                  paddingHorizontal: esTelefono ? 18 : 24,
                  paddingTop: esTelefono ? 18 : 22,
                  paddingBottom: esTelefono ? 22 : 26,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Medium",
                    fontSize: esTelefono ? 17 : 18,
                    lineHeight: esTelefono ? 27 : 29,
                    color: textColor,
                  }}
                >
                  {registroABC.contenido ||
                    "Sin contenido registrado."}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ========================================================
  // DIARIO EMOCIONAL
  // ========================================================

  if (!registroEmocional) {
    return null;
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop,

          paddingBottom,
        }}
      >
        {/* ==================================================
            CONTENEDOR PRINCIPAL
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* ==================================================
              HEADER + RESUMEN
          ================================================== */}

          <Animated.View
            entering={FadeInUp.duration(400)}
            style={{
              width: "100%",

              marginBottom: esEscritorio ? 28 : 22,
            }}
          >
            <DetalleHeader
              onBack={() => router.back()}
              onEdit={() => router.push(`/diario/${id}/editar` as never)}
              onDelete={confirmarEliminacion}
            />

            <ResumenRegistroCard
              fecha={formatearFecha(registroEmocional.fecha_inicio)}
              emocion={registroEmocional.emocionNombre}
            />
          </Animated.View>

          {/* ==================================================
              RESPUESTAS
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthRespuestas,

              alignSelf: "center",

              flexDirection: esTelefono ? "column" : "row",

              flexWrap: esTelefono ? "nowrap" : "wrap",

              gap: gapRespuestas,

              alignItems: "stretch",
            }}
          >
            {/* ==============================================
                MOTIVO
            ============================================== */}

            <View
              style={{
                flex: esTelefono ? undefined : 1,

                width: esTelefono ? "100%" : undefined,

                minWidth: 0,
              }}
            >
              <RespuestaDetalleCard
                titulo="¿Qué me hizo sentir así?"
                respuesta={registroEmocional.motivo}
                delay={100}
              />
            </View>

            {/* ==============================================
                REACCIÓN
            ============================================== */}

            <View
              style={{
                flex: esTelefono ? undefined : 1,

                width: esTelefono ? "100%" : undefined,

                minWidth: 0,
              }}
            >
              <RespuestaDetalleCard
                titulo="¿Cómo reaccioné?"
                respuesta={registroEmocional.reaccion}
                delay={160}
              />
            </View>

            {/* ==============================================
                IDEA ÚTIL
            ============================================== */}

            <View
              style={{
                width: "100%",
              }}
            >
              <RespuestaDetalleCard
                titulo="Una idea útil"
                respuesta={registroEmocional.ideaUtil}
                delay={220}
              />
            </View>
          </View>

          {/* ==================================================
              NOTA INFERIOR
          ================================================== */}

          {esEscritorio && (
            <View
              style={{
                width: "100%",

                maxWidth: maxWidthRespuestas,

                alignSelf: "center",

                marginTop: 6,
              }}
            >
              <Text
                style={{
                  textAlign: "center",

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  color: textSecondaryColor,
                }}
              >
                Este registro forma parte de tu historial personal de
                autorregistros.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
