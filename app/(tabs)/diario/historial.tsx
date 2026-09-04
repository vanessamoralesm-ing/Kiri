import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  eliminarRegistroDiario,
  EntradaDiarioResumen,
  obtenerHistorialDiario,
} from "@/services/diario/autorregistro.service";

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "emocional", label: "Diario Emocional" },
  { id: "pensamientos", label: "Observando mis Pensamientos" },
];

export default function HistorialDiarioScreen() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [registros, setRegistros] = useState<EntradaDiarioResumen[]>([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todas");

  const cargarHistorial = async () => {
    setCargando(true);
    const datos = await obtenerHistorialDiario(50);
    setRegistros(datos);
    setCargando(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [])
  );

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      "Eliminar registro",
      "¿Deseas eliminar este registro de tu diario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const exito = await eliminarRegistroDiario(id);
            if (exito) cargarHistorial();
          },
        },
      ]
    );
  };

  const registrosFiltrados = registros.filter((item) => {
    if (filtroSeleccionado === "todas") return true;
    if (filtroSeleccionado === "emocional") {
      return item.plantilla_nombre.toLowerCase().includes("emocional");
    }
    if (filtroSeleccionado === "pensamientos") {
      return item.plantilla_nombre.toLowerCase().includes("pensamiento");
    }
    return true;
  });

  const formatearFechaHora = (fechaIso: string) => {
    const f = new Date(fechaIso);
    const fecha = f.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const hora = f.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${fecha}, ${hora}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Encabezado */}
      <View className="flex-row items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </Pressable>

        <Text className="font-nunito-bold text-lg text-[#1E293B]">
          Historial de Registros
        </Text>

        <View className="w-6" />
      </View>

      {/* Filtros horizontales */}
      <View className="py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {FILTROS.map((f) => {
            const activo = filtroSeleccionado === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFiltroSeleccionado(f.id)}
                className={`mr-2.5 rounded-full px-4 py-2 border ${
                  activo
                    ? "bg-[#4F8EF7] border-[#4F8EF7]"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-nunito-bold text-xs ${
                    activo ? "text-white" : "text-slate-600"
                  }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Grid de tarjetas estilo Card (2 columnas) */}
      {cargando ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F8EF7" />
        </View>
      ) : (
        <FlatList
          data={registrosFiltrados}
          keyExtractor={(item) => item.id_registro}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{ paddingBottom: 110, paddingTop: 4 }}
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center p-5">
              <Text className="font-nunito-medium text-slate-400 text-sm">
                No hay registros disponibles en esta categoría.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/diario/${item.id_registro}` as never)}
              className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              {/* Línea identificadora azul superior */}
              <View className="h-2 bg-[#4F8EF7]" />

              <View className="p-3.5 justify-between flex-1">
                <View>
                  <Text
                    numberOfLines={1}
                    className="font-nunito-bold text-sm text-[#1E293B]"
                  >
                    {item.plantilla_nombre}
                  </Text>

                  <Text
                    numberOfLines={3}
                    className="mt-2 font-nunito-medium text-xs text-slate-500 leading-4 min-h-[48px]"
                  >
                    {item.respuesta_corta}
                  </Text>
                </View>

                {/* Pie de tarjeta: Fecha/Hora y botones de acción */}
                <View className="mt-3 pt-2 border-t border-slate-50 flex-row items-center justify-between">
                  <Text className="font-nunito-semibold text-[10px] text-slate-400 flex-1 mr-1">
                    {formatearFechaHora(item.fecha_inicio)}
                  </Text>

                  <View className="flex-row items-center gap-x-1">
                    <Pressable
                      onPress={() =>
                        router.push(`/diario/${item.id_registro}/editar` as never)
                      }
                      hitSlop={6}
                      className="p-1"
                    >
                      <Ionicons name="create-outline" size={15} color="#3478F6" />
                    </Pressable>

                    <Pressable
                      onPress={() => confirmarEliminar(item.id_registro)}
                      hitSlop={6}
                      className="p-1"
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
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