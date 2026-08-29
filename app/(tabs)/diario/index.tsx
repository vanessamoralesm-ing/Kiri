import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";

export default function DiarioScreen() {
  // Por ahora son datos visuales de prueba.
  // Despues vendran desde Supabase.
  const nombreUsuario = "Maricarmen";

  const diasRacha = 5;

  const totalEntradas = 24;

  const irANuevoRegistro = () => {
    router.push(
      "/diario/nuevo"
    );
  };

  const verTodasLasEntradas = () => {
    console.log(
      "Ver todas las entradas"
    );
  };

  const abrirEntrada = () => {
    console.log(
      "Abrir entrada"
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        <View className="px-5 pb-5 pt-6">
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
              diasRacha
            }
            totalEntradas={
              totalEntradas
            }
          />

          {/* Encabezado Entradas Recientes */}
          <View className="mb-4 mt-7 flex-row items-center justify-between">
            <Text className="font-nunito-bold text-[20px] text-[#1E293B]">
              Entradas Recientes
            </Text>

            <Pressable
              onPress={
                verTodasLasEntradas
              }
              hitSlop={8}
              className="flex-row items-center"
            >
              <Text className="font-nunito-semibold text-[13px] text-[#3478F6]">
                Ver todas
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#3478F6"
              />
            </Pressable>
          </View>

          {/* Registro reciente */}
          <TarjetaEntradaDiario
            fecha="Hoy, 14 Oct · Tarde"
            titulo="Reflexiones de tarde"
            contenido="Hoy logré terminar el proyecto que tanto me estresaba. Me siento aliviada y con ganas de descansar. El paseo me ayudó a sentirme mejor."
            emociones={[
              "Paz",
              "Logro",
            ]}
            onPress={
              abrirEntrada
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}