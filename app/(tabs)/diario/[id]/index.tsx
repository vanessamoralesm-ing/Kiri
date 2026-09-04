import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DetalleRegistroDiario,
  eliminarRegistroDiario,
  obtenerDetalleRegistro,
} from "@/services/diario/autorregistro.service";

export default function VerEntradaDiarioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [cargando, setCargando] = useState(true);
  const [registro, setRegistro] = useState<DetalleRegistroDiario | null>(null);

  useEffect(() => {
    if (id) {
      cargarDetalle();
    }
  }, [id]);

  const cargarDetalle = async () => {
    setCargando(true);
    const data = await obtenerDetalleRegistro(id as string);
    setRegistro(data);
    setCargando(false);
  };

  const confirmarEliminación = () => {
    Alert.alert(
      "Eliminar registro",
      "¿Estás seguro de que deseas eliminar esta entrada? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const ok = await eliminarRegistroDiario(id as string);
            if (ok) {
              Alert.alert("Registro eliminado", "", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } else {
              Alert.alert("Error", "No se pudo eliminar el registro.");
            }
          },
        },
      ]
    );
  };

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) return "";
    const f = new Date(fechaIso);
    return f.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF]">
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  if (!registro) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF] px-6">
        <Text className="font-nunito-bold text-lg text-gray-700">
          No se encontró el registro solicitado.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-blue-500 px-4 py-2"
        >
          <Text className="font-nunito-bold text-white">Regresar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FBFF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 40, 60),
        }}
      >
        {/* Encabezado */}
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <Ionicons name="arrow-back" size={22} color="#1E3A5F" />
          </Pressable>

          <Text className="font-nunito-bold text-[22px] text-[#4F8EF7]">
            Detalle del Registro
          </Text>

          {/* Opciones: Editar y Eliminar */}
          <View className="flex-row items-center gap-x-2">
            <Pressable
              onPress={() => router.push(`/diario/${id}/editar` as never)}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <Ionicons name="create-outline" size={22} color="#3478F6" />
            </Pressable>

            <Pressable
              onPress={confirmarEliminación}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        {/* Tarjeta de Fecha e Información general */}
        <View className="mb-5 rounded-[24px] bg-white p-5 border border-slate-100 shadow-sm">
          <Text className="font-nunito-semibold text-xs text-[#9096a3] uppercase tracking-wider">
            Fecha de registro
          </Text>
          <Text className="font-nunito-bold text-base text-[#1E293B] mt-1 capitalize">
            {formatearFecha(registro.fecha_inicio)}
          </Text>

          {registro.emocionNombre ? (
            <View className="mt-4 flex-row items-center">
              <Text className="font-nunito-semibold text-sm text-slate-500 mr-2">
                Emoción sentida:
              </Text>
              <View className="rounded-full bg-blue-50 px-3 py-1 border border-blue-200">
                <Text className="font-nunito-bold text-xs text-blue-600">
                  {registro.emocionNombre}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Respuestas registradas */}
        <View className="gap-y-4">
          <View className="rounded-[20px] bg-white p-4 border border-slate-100 shadow-sm">
            <Text className="font-nunito-bold text-base text-[#2D3748] mb-1">
              ¿Qué me hizo sentir así?
            </Text>
            <Text className="font-nunito-medium text-sm text-slate-600 leading-6">
              {registro.motivo || "Sin respuesta"}
            </Text>
          </View>

          <View className="rounded-[20px] bg-white p-4 border border-slate-100 shadow-sm">
            <Text className="font-nunito-bold text-base text-[#2D3748] mb-1">
              ¿Cómo reaccioné?
            </Text>
            <Text className="font-nunito-medium text-sm text-slate-600 leading-6">
              {registro.reaccion || "Sin respuesta"}
            </Text>
          </View>

          <View className="rounded-[20px] bg-white p-4 border border-slate-100 shadow-sm">
            <Text className="font-nunito-bold text-base text-[#2D3748] mb-1">
              Una idea útil
            </Text>
            <Text className="font-nunito-medium text-sm text-slate-600 leading-6">
              {registro.ideaUtil || "Sin respuesta"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}