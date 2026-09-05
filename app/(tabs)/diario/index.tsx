import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";

import {
  useAuth,
} from "@/services/authProvider";

import {
  obtenerHistorialDiario,
} from "@/services/diario/autorregistro.service";

import {
  EntradaDiarioResumen,
} from "@/types/diario";


export default function DiarioScreen() {
  const {
    user,
  } = useAuth();

  const {
    width,
  } = useWindowDimensions();

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    entradas,
    setEntradas,
  ] = useState<EntradaDiarioResumen[]>([]);


  // Define tamaños responsive.
  const esTablet =
    width >= 768;

  const esWebGrande =
    width >= 1100;


  // Obtiene únicamente el Nombre Preferido del usuario.
  const nombreUsuario =
    useMemo(
      () => {
        const nombrePreferido =
          user?.user_metadata?.nombre_preferido;

        if (
          typeof nombrePreferido === "string" &&
          nombrePreferido.trim()
        ) {
          return nombrePreferido.trim();
        }

        return "Usuario";
      },
      [
        user,
      ]
    );


  // Carga las entradas recientes del Diario.
  const cargarDatos =
    useCallback(
      async () => {
        try {
          setCargando(true);

          const datos =
            await obtenerHistorialDiario(
              5
            );

          setEntradas(
            datos
          );
        } catch (error) {
          console.error(
            "Error al cargar las entradas del diario:",
            error
          );

          setEntradas(
            []
          );
        } finally {
          setCargando(
            false
          );
        }
      },
      []
    );


  // Recarga las entradas cuando la pantalla toma el foco.
  useFocusEffect(
    useCallback(
      () => {
        cargarDatos();
      },
      [
        cargarDatos,
      ]
    )
  );


  const irANuevoRegistro =
    () => {
      router.push({
        pathname:
          "/diario/nuevo" as never,

        params: {
          origen:
            "diario",
        },
      });
    };


  const verTodasLasEntradas =
    () => {
      router.push(
        "/diario/historial" as never
      );
    };


  const abrirEntrada =
    (
      id: string
    ) => {
      router.push(
        `/diario/${id}` as never
      );
    };


  const formatearFecha =
    (
      fechaIso: string
    ) => {
      const fecha =
        new Date(
          fechaIso
        );

      return fecha.toLocaleDateString(
        "es-ES",
        {
          day:
            "numeric",

          month:
            "short",

          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      );
    };


  return (
    <View
      className="flex-1 bg-[#F8FAFC]"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom:
            110,
        }}
      >
        {/* Contenedor principal responsive */}
        <View
          style={{
            width:
              "100%",

            maxWidth:
              esWebGrande
                ? 1080
                : 960,

            alignSelf:
              "center",

            paddingHorizontal:
              esTablet
                ? 28
                : 20,

            paddingTop:
              24,

            paddingBottom:
              20,
          }}
        >
          {/* Bienvenida */}
          <TarjetaBienvenidaDiario
            nombre={
              nombreUsuario
            }
            onNuevoRegistro={
              irANuevoRegistro
            }
          />


          {/* Resumen */}
          <ResumenDiario
            diasRacha={
              entradas.length >
              0
                ? 1
                : 0
            }
            totalEntradas={
              entradas.length
            }
          />


          {/* Encabezado de Entradas Recientes */}
          <View
            className="mb-5 mt-8 flex-row items-center justify-between"
          >
            <View
              className="flex-1 pr-3"
            >
              <Text
                className="font-nunito-bold text-[20px] text-[#1E293B]"
              >
                Entradas Recientes
              </Text>

              <Text
                className="mt-1 font-nunito-medium text-[13px] text-[#94A3B8]"
              >
                Tus últimos momentos registrados
              </Text>
            </View>


            <Pressable
              onPress={
                verTodasLasEntradas
              }
              hitSlop={
                8
              }
              className="flex-row items-center rounded-xl px-2 py-2"
            >
              <Text
                className="font-nunito-semibold text-[13px] text-[#3478F6]"
              >
                Ver todas
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#4F8EF7"
              />
            </Pressable>
          </View>


          {/* Cargando */}
          {cargando ? (
            <View
              className="items-center py-8"
            >
              <ActivityIndicator
                size="small"
                color="#4F8EF7"
              />

              <Text
                className="mt-3 font-nunito-medium text-sm text-slate-400"
              >
                Cargando tus entradas...
              </Text>
            </View>
          ) : entradas.length ===
            0 ? (
            <View
              className="items-center rounded-[22px] border border-slate-100 bg-white p-6"
            >
              <Ionicons
                name="book-outline"
                size={28}
                color="#94A3B8"
              />

              <Text
                className="mt-3 text-center font-nunito-medium text-sm text-slate-500"
              >
                Aún no has registrado ninguna entrada.
              </Text>

              <Text
                className="mt-1 text-center font-nunito-medium text-xs text-slate-400"
              >
                Tu próximo registro aparecerá aquí.
              </Text>
            </View>
          ) : (
            <View
              style={
                esTablet
                  ? {
                      flexDirection:
                        "row",

                      flexWrap:
                        "wrap",

                      gap:
                        16,
                    }
                  : undefined
              }
            >
              {entradas.map(
                (
                  item
                ) => (
                  <View
                    key={
                      item.id_registro
                    }
                    style={
                      esTablet
                        ? {
                            width:
                              esWebGrande
                                ? "calc(50% - 8px)" as never
                                : "48.5%",
                          }
                        : {
                            width:
                              "100%",

                            marginBottom:
                              18,
                          }
                    }
                  >
                    <TarjetaEntradaDiario
                      fecha={
                        formatearFecha(
                          item.fecha_inicio
                        )
                      }
                      titulo={
                        item.plantilla_nombre
                      }
                      contenido={
                        item.respuesta_corta
                      }
                      emociones={
                        item.emociones
                      }
                      onPress={() =>
                        abrirEntrada(
                          item.id_registro
                        )
                      }
                    />
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}