import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";
import { useAuth } from "@/services/authProvider";
import {
  EntradaDiarioResumen,
  obtenerHistorialDiario,
} from "@/services/diario/autorregistro.service";

export default function DiarioScreen() {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [entradas, setEntradas] = useState<EntradaDiarioResumen[]>([]);

  const cargarDatos = async () => {
    setCargando(true);
    const datos = await obtenerHistorialDiario(5);
    setEntradas(datos);
    setCargando(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const irANuevoRegistro = () => {
    router.push({
      pathname: "/diario/nuevo" as never,
      params: { origen: "diario" },
    });
  };

  const verTodasLasEntradas = () => {
    router.push("/diario/historial" as never);
  };

  const abrirEntrada = (id: string) => {
    router.push(`/diario/${id}` as never);
  };

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="px-5 pb-5 pt-6">
          <TarjetaBienvenidaDiario
            nombre={user?.user_metadata?.nombre || "Usuario"}
            onNuevoRegistro={irANuevoRegistro}
          />

          <ResumenDiario
            diasRacha={entradas.length > 0 ? 1 : 0}
            totalEntradas={entradas.length}
          />

          <View className="mb-4 mt-7 flex-row items-center justify-between">
            <Text className="font-nunito-bold text-[20px] text-[#1E293B]">
              Entradas Recientes
            </Text>

            <Pressable
              onPress={verTodasLasEntradas}
              hitSlop={8}
              className="flex-row items-center"
            >
              <Text className="font-nunito-semibold text-[13px] text-[#3478F6]">
                Ver todas
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#4F8EF7"
              />
            </Pressable>
          </View>

          {cargando ? (
            <ActivityIndicator size="small" color="#4F8EF7" className="my-5" />
          ) : entradas.length === 0 ? (
            <View className="rounded-2xl bg-white p-5 items-center border border-slate-100">
              <Text className="font-nunito-medium text-slate-500 text-sm">
                Aún no has registrado ninguna entrada.
              </Text>
            </View>
          ) : (
            entradas.map((item) => (
              <TarjetaEntradaDiario
                key={item.id_registro}
                fecha={formatearFecha(item.fecha_inicio)}
                titulo={item.plantilla_nombre}
                contenido={item.respuesta_corta}
                emociones={item.emociones}
                onPress={() => abrirEntrada(item.id_registro)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}