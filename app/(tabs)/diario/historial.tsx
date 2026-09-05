import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  eliminarRegistroDiario,
  obtenerHistorialDiario,
} from "@/services/diario/autorregistro.service";

import {
  EntradaDiarioResumen,
} from "@/types/diario";


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

  const {
    width,
  } = useWindowDimensions();

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    registros,
    setRegistros,
  ] = useState<EntradaDiarioResumen[]>([]);

  const [
    filtroSeleccionado,
    setFiltroSeleccionado,
  ] = useState("todas");


  // Define las columnas según el tamaño de pantalla.
  const numeroColumnas =
    width >= 1100
      ? 3
      : width >= 650
        ? 2
        : 1;


  // Limita el ancho del contenido en web.
  const anchoMaximo =
    width >= 1100
      ? 1100
      : undefined;


  // Carga el historial del usuario.
  const cargarHistorial =
    useCallback(
      async () => {
        try {
          setCargando(true);

          const datos =
            await obtenerHistorialDiario(
              50
            );

          setRegistros(
            datos
          );
        } catch (error) {
          console.error(
            "Error al cargar el historial:",
            error
          );

          setRegistros(
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


  // Actualiza los datos al regresar a la pantalla.
  useFocusEffect(
    useCallback(
      () => {
        cargarHistorial();
      },
      [
        cargarHistorial,
      ]
    )
  );


  // Elimina un registro después de confirmar.
  const confirmarEliminar =
    (
      id: string
    ) => {
      Alert.alert(
        "Eliminar registro",
        "¿Deseas eliminar este registro de tu diario?",
        [
          {
            text:
              "Cancelar",

            style:
              "cancel",
          },
          {
            text:
              "Eliminar",

            style:
              "destructive",

            onPress:
              async () => {
                const exito =
                  await eliminarRegistroDiario(
                    id
                  );

                if (
                  exito
                ) {
                  await cargarHistorial();

                  return;
                }

                Alert.alert(
                  "Error",
                  "No se pudo eliminar el registro."
                );
              },
          },
        ]
      );
    };


  // Filtra los registros visibles.
  const registrosFiltrados =
    useMemo(
      () => {
        if (
          filtroSeleccionado ===
          "todas"
        ) {
          return registros;
        }

        if (
          filtroSeleccionado ===
          "emocional"
        ) {
          return registros.filter(
            item =>
              item
                .plantilla_nombre
                .toLowerCase()
                .includes(
                  "emocional"
                )
          );
        }

        return registros;
      },
      [
        registros,
        filtroSeleccionado,
      ]
    );


  const formatearFechaHora =
    (
      fechaIso: string
    ) => {
      const fecha =
        new Date(
          fechaIso
        );

      const fechaFormateada =
        fecha.toLocaleDateString(
          "es-ES",
          {
            day:
              "2-digit",

            month:
              "short",

            year:
              "numeric",
          }
        );

      const horaFormateada =
        fecha.toLocaleTimeString(
          "es-ES",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        );

      return `${fechaFormateada}, ${horaFormateada}`;
    };


  return (
    <SafeAreaView
      className="flex-1 bg-[#F8FAFC]"
    >
      {/* Encabezado */}
      <View
        className="border-b border-slate-100 bg-white"
      >
        <View
          style={{
            width:
              "100%",

            maxWidth:
              anchoMaximo,

            alignSelf:
              "center",
          }}
          className="flex-row items-center px-5 py-4"
        >
          <Pressable
            onPress={() =>
              router.back()
            }
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F5F9]"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#1E293B"
            />
          </Pressable>

          <Text
            className="flex-1 text-center font-nunito-bold text-[19px] text-[#1E293B]"
          >
            Historial de Registros
          </Text>

          <View
            className="h-11 w-11"
          />
        </View>
      </View>


      {/* Filtros */}
      <View
        style={{
          width:
            "100%",

          maxWidth:
            anchoMaximo,

          alignSelf:
            "center",
        }}
        className="py-4"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal:
              20,
          }}
        >
          {FILTROS.map(
            filtro => {
              const activo =
                filtroSeleccionado ===
                filtro.id;

              return (
                <Pressable
                  key={
                    filtro.id
                  }
                  onPress={() =>
                    setFiltroSeleccionado(
                      filtro.id
                    )
                  }
                  className={`mr-3 rounded-full border px-5 py-2.5 ${
                    activo
                      ? "border-[#4F8EF7] bg-[#4F8EF7]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <Text
                    className={`font-nunito-bold text-[13px] ${
                      activo
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {
                      filtro.label
                    }
                  </Text>
                </Pressable>
              );
            }
          )}
        </ScrollView>
      </View>


      {/* Cargando */}
      {cargando ? (
        <View
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator
            size="large"
            color="#4F8EF7"
          />

          <Text
            className="mt-3 font-nunito-medium text-sm text-slate-400"
          >
            Cargando historial...
          </Text>
        </View>
      ) : (
        <FlatList
          key={
            numeroColumnas
          }
          data={
            registrosFiltrados
          }
          keyExtractor={
            item =>
              item.id_registro
          }
          numColumns={
            numeroColumnas
          }
          showsVerticalScrollIndicator={
            false
          }
          style={{
            width:
              "100%",

            maxWidth:
              anchoMaximo,

            alignSelf:
              "center",
          }}
          contentContainerStyle={{
            paddingHorizontal:
              20,

            paddingTop:
              4,

            paddingBottom:
              40,
          }}
          columnWrapperStyle={
            numeroColumnas >
            1
              ? {
                  gap:
                    16,
                }
              : undefined
          }
          ListEmptyComponent={
            <View
              className="mt-16 items-center justify-center px-6"
            >
              <View
                className="h-16 w-16 items-center justify-center rounded-full bg-[#EEF4FF]"
              >
                <Ionicons
                  name="book-outline"
                  size={28}
                  color="#4F8EF7"
                />
              </View>

              <Text
                className="mt-4 text-center font-nunito-bold text-base text-[#334155]"
              >
                No hay registros
              </Text>

              <Text
                className="mt-1 text-center font-nunito-medium text-sm text-slate-400"
              >
                No encontramos registros disponibles en esta categoría.
              </Text>
            </View>
          }
          renderItem={({
            item,
          }) => (
            <Pressable
              onPress={() =>
                router.push(
                  `/diario/${item.id_registro}` as never
                )
              }
              style={{
                flex:
                  1,

                maxWidth:
                  numeroColumnas ===
                  1
                    ? undefined
                    : `${100 / numeroColumnas}%`,

                marginBottom:
                  16,
              }}
              className="overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-sm"
            >
              {/* Línea superior */}
              <View
                className="h-1.5 bg-[#4F8EF7]"
              />


              <View
                className="flex-1 justify-between p-4"
              >
                <View>
                  <Text
                    numberOfLines={
                      1
                    }
                    className="font-nunito-bold text-[15px] text-[#1E293B]"
                  >
                    {
                      item.plantilla_nombre
                    }
                  </Text>

                  <Text
                    numberOfLines={
                      3
                    }
                    className="mt-2 min-h-[54px] font-nunito-medium text-[13px] leading-[18px] text-slate-500"
                  >
                    {
                      item.respuesta_corta ||
                      "Sin respuesta registrada."
                    }
                  </Text>


                  {item.emociones.length >
                    0 && (
                    <View
                      className="mt-3 self-start rounded-full bg-[#EEF4FF] px-3 py-1.5"
                    >
                      <Text
                        numberOfLines={
                          1
                        }
                        className="font-nunito-bold text-[11px] text-[#4F8EF7]"
                      >
                        {
                          item.emociones.join(
                            ", "
                          )
                        }
                      </Text>
                    </View>
                  )}
                </View>


                {/* Pie */}
                <View
                  className="mt-4 flex-row items-center border-t border-slate-100 pt-3"
                >
                  <Text
                    numberOfLines={
                      1
                    }
                    className="mr-2 flex-1 font-nunito-semibold text-[11px] text-slate-400"
                  >
                    {
                      formatearFechaHora(
                        item.fecha_inicio
                      )
                    }
                  </Text>


                  <View
                    className="flex-row items-center"
                  >
                    <Pressable
                      onPress={() =>
                        router.push(
                          `/diario/${item.id_registro}/editar` as never
                        )
                      }
                      hitSlop={8}
                      className="mr-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4FF]"
                    >
                      <Ionicons
                        name="create-outline"
                        size={17}
                        color="#3478F6"
                      />
                    </Pressable>


                    <Pressable
                      onPress={() =>
                        confirmarEliminar(
                          item.id_registro
                        )
                      }
                      hitSlop={8}
                      className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F2]"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#EF4444"
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