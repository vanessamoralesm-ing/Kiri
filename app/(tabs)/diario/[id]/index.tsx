import React, {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  useFocusEffect,
} from "@react-navigation/native";

import Animated, {
  FadeInUp,
} from "react-native-reanimated";

import {
  eliminarRegistroDiario,
  obtenerDetalleRegistro,
} from "@/services/diario/autorregistro.service";

import {
  DetalleRegistroDiario,
} from "@/types/diario";

import {
  DetalleHeader,
} from "@/components/diario/DetalleHeader";

import {
  ResumenRegistroCard,
} from "@/components/diario/ResumenRegistroCard";

import {
  RespuestaDetalleCard,
} from "@/components/diario/RespuestaDetalleCard";

import {
  DetalleSkeleton,
} from "@/components/diario/DetalleSkeleton";

export default function VerEntradaDiarioScreen() {
  const router =
    useRouter();

  const insets =
    useSafeAreaInsets();

  const {
    width,
  } =
    useWindowDimensions();

  const {
    id,
  } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [
    cargando,
    setCargando,
  ] =
    useState(true);

  const [
    registro,
    setRegistro,
  ] =
    useState<DetalleRegistroDiario | null>(
      null
    );

  const esTelefono =
    width < 768;

  const esTablet =
    width >= 768 &&
    width < 1100;

  const esWeb =
    width >= 1100;

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }

      const cargarDetalle =
        async () => {
          try {
            setCargando(true);

            const data =
              await obtenerDetalleRegistro(
                id
              );

            setRegistro(data);
          } catch (error) {
            console.error(
              "Error al cargar el detalle:",
              error
            );

            setRegistro(null);
          } finally {
            setCargando(false);
          }
        };

      cargarDetalle();
    }, [id])
  );

  const confirmarEliminacion =
    () => {
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
            onPress:
              async () => {
                if (!id) {
                  return;
                }

                const ok =
                  await eliminarRegistroDiario(
                    id
                  );

                if (ok) {
                  Alert.alert(
                    "Registro eliminado",
                    "La entrada fue eliminada correctamente.",
                    [
                      {
                        text: "OK",
                        onPress: () =>
                          router.back(),
                      },
                    ]
                  );
                } else {
                  Alert.alert(
                    "Error",
                    "No se pudo eliminar el registro."
                  );
                }
              },
          },
        ]
      );
    };

  const formatearFecha =
    (
      fechaIso?: string
    ) => {
      if (!fechaIso) {
        return "";
      }

      return new Date(
        fechaIso
      ).toLocaleDateString(
        "es-ES",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    };

  if (cargando) {
    return (
      <DetalleSkeleton />
    );
  }

  if (!registro) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF] px-6">
        <View
          style={{
            width: "100%",
            maxWidth: 420,
          }}
          className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm"
        >
          <Text className="text-center font-nunito-bold text-xl text-[#2D3748]">
            No encontramos este registro
          </Text>

          <Text className="mt-2 text-center font-nunito-medium text-[14px] leading-5 text-[#8B98AC]">
            Es posible que haya sido eliminado o que ya no esté disponible.
          </Text>

          <Pressable
            onPress={() =>
              router.back()
            }
            className="mt-5 min-h-[48px] items-center justify-center rounded-2xl bg-[#4F8EF7] px-5"
          >
            <Text className="font-nunito-bold text-white">
              Regresar
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FBFF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop:
            Math.max(
              insets.top + 12,
              20
            ),

          paddingHorizontal:
            esTelefono
              ? 16
              : 24,

          paddingBottom:
            Math.max(
              insets.bottom + 40,
              60
            ),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth:
              esWeb
                ? 860
                : esTablet
                  ? 820
                  : undefined,
            alignSelf: "center",
          }}
        >
          <Animated.View
            entering={
              FadeInUp.duration(
                400
              )
            }
          >
            <DetalleHeader
              onBack={() =>
                router.back()
              }
              onEdit={() =>
                router.push(
                  `/diario/${id}/editar` as never
                )
              }
              onDelete={
                confirmarEliminacion
              }
            />

            <ResumenRegistroCard
              fecha={
                formatearFecha(
                  registro.fecha_inicio
                )
              }
              emocion={
                registro.emocionNombre
              }
            />
          </Animated.View>

          <View
            style={
              esTelefono
                ? undefined
                : {
                    flexDirection:
                      "row",
                    flexWrap:
                      "wrap",
                    justifyContent:
                      "space-between",
                  }
            }
          >
            <View
              style={
                esTelefono
                  ? undefined
                  : {
                      width:
                        "48.5%",
                    }
              }
            >
              <RespuestaDetalleCard
                titulo="¿Qué me hizo sentir así?"
                respuesta={
                  registro.motivo
                }
                delay={100}
              />
            </View>

            <View
              style={
                esTelefono
                  ? undefined
                  : {
                      width:
                        "48.5%",
                    }
              }
            >
              <RespuestaDetalleCard
                titulo="¿Cómo reaccioné?"
                respuesta={
                  registro.reaccion
                }
                delay={160}
              />
            </View>

            <View
              style={{
                width:
                  esTelefono
                    ? "100%"
                    : "100%",
              }}
            >
              <RespuestaDetalleCard
                titulo="Una idea útil"
                respuesta={
                  registro.ideaUtil
                }
                delay={220}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}