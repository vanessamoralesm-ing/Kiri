import React, { useCallback, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFocusEffect } from "@react-navigation/native";

import Animated, { FadeInUp } from "react-native-reanimated";

import {
  eliminarRegistroDiario,
  obtenerDetalleRegistro,
} from "@/services/diario/autorregistro.service";

import { DetalleRegistroDiario } from "@/types/diario";

import { DetalleHeader } from "@/components/diario/DetalleHeader";

import { ResumenRegistroCard } from "@/components/diario/ResumenRegistroCard";

import { RespuestaDetalleCard } from "@/components/diario/RespuestaDetalleCard";

import { DetalleSkeleton } from "@/components/diario/DetalleSkeleton";

import { useThemeColor } from "@/hooks/use-theme-color";

export default function VerEntradaDiarioScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [cargando, setCargando] = useState(true);

  const [registro, setRegistro] = useState<DetalleRegistroDiario | null>(null);

  // ======================================================
  // TEMA
  // ======================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefono = width < 768;

  const esTablet = width >= 768 && width < 1100;

  const esWeb = width >= 1100;

  // ======================================================
  // CARGAR DETALLE
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }

      const cargarDetalle = async () => {
        try {
          setCargando(true);

          const data = await obtenerDetalleRegistro(id);

          setRegistro(data);
        } catch (error) {
          console.error("Error al cargar el detalle:", error);

          setRegistro(null);
        } finally {
          setCargando(false);
        }
      };

      cargarDetalle();
    }, [id]),
  );

  // ======================================================
  // ELIMINAR
  // ======================================================

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
            } else {
              Alert.alert("Error", "No se pudo eliminar el registro.");
            }
          },
        },
      ],
    );
  };

  // ======================================================
  // FORMATEAR FECHA
  // ======================================================

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

  // ======================================================
  // CARGANDO
  // ======================================================

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

  // ======================================================
  // REGISTRO NO ENCONTRADO
  // ======================================================

  if (!registro) {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 24,
            borderRadius: 26,
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

  // ======================================================
  // UI
  // ======================================================

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
          paddingTop: Math.max(insets.top + 12, 20),

          paddingHorizontal: esTelefono ? 16 : 24,

          paddingBottom: Math.max(insets.bottom + 40, 60),
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: esWeb ? 860 : esTablet ? 820 : undefined,

            alignSelf: "center",
          }}
        >
          <Animated.View entering={FadeInUp.duration(400)}>
            <DetalleHeader
              onBack={() => router.back()}
              onEdit={() => router.push(`/diario/${id}/editar` as never)}
              onDelete={confirmarEliminacion}
            />

            <ResumenRegistroCard
              fecha={formatearFecha(registro.fecha_inicio)}
              emocion={registro.emocionNombre}
            />
          </Animated.View>

          {/* ==================================================
                        RESPUESTAS
                    ================================================== */}

          <View
            style={
              esTelefono
                ? undefined
                : {
                    flexDirection: "row",

                    flexWrap: "wrap",

                    justifyContent: "space-between",
                  }
            }
          >
            <View
              style={
                esTelefono
                  ? undefined
                  : {
                      width: "48.5%",
                    }
              }
            >
              <RespuestaDetalleCard
                titulo="¿Qué me hizo sentir así?"
                respuesta={registro.motivo}
                delay={100}
              />
            </View>

            <View
              style={
                esTelefono
                  ? undefined
                  : {
                      width: "48.5%",
                    }
              }
            >
              <RespuestaDetalleCard
                titulo="¿Cómo reaccioné?"
                respuesta={registro.reaccion}
                delay={160}
              />
            </View>

            <View
              style={{
                width: "100%",
              }}
            >
              <RespuestaDetalleCard
                titulo="Una idea útil"
                respuesta={registro.ideaUtil}
                delay={220}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
