import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpcionEmocion } from "@/components/diario/OpcionEmocion";
import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";
import Button from "@/components/ui/Button";
import {
  actualizarDiarioEmocionalService,
  obtenerDetalleRegistro,
} from "@/services/diario/autorregistro.service";

const EMOCIONES = [
  { nombre: "Alegría", emoji: "😊" },
  { nombre: "Tristeza", emoji: "😢" },
  { nombre: "Ansiedad", emoji: "😰" },
  { nombre: "Miedo", emoji: "😨" },
  { nombre: "Enojo", emoji: "😡" },
  { nombre: "Calma", emoji: "😌" },
  { nombre: "Frustración", emoji: "😤" },
  { nombre: "Culpa", emoji: "😔" },
  { nombre: "Vergüenza", emoji: "😳" },
  { nombre: "Esperanza", emoji: "🌱" },
];

export default function EditarRegistroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [emocion, setEmocion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [reaccion, setReaccion] = useState("");
  const [ideaUtil, setIdeaUtil] = useState("");

  useEffect(() => {
    if (id) cargarRegistro();
  }, [id]);

  const cargarRegistro = async () => {
    setCargando(true);
    const detalle = await obtenerDetalleRegistro(id as string);
    if (detalle) {
      setEmocion(detalle.emocionNombre);
      setMotivo(detalle.motivo);
      setReaccion(detalle.reaccion);
      setIdeaUtil(detalle.ideaUtil);
    }
    setCargando(false);
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      await actualizarDiarioEmocionalService({
        idRegistro: id as string,
        emocionNombre: emocion,
        motivo,
        reaccion,
        ideaUtil,
      });

      Alert.alert("¡Actualizado!", "El registro ha sido modificado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error al actualizar.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF]">
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8FBFF]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 100, 120),
        }}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white"
          >
            <Ionicons name="arrow-back" size={22} color="#1E3A5F" />
          </Pressable>

          <Text className="font-nunito-bold text-[22px] text-[#4F8EF7]">
            Editar Registro
          </Text>

          <View className="w-11" />
        </View>

        <View className="mb-6">
          <Text className="mb-3 font-nunito-bold text-[18px] text-[#2D3748]">
            ¿Cómo te sentías?
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {EMOCIONES.map((item) => (
              <OpcionEmocion
                key={item.nombre}
                nombre={item.nombre}
                emoji={item.emoji}
                seleccionada={emocion === item.nombre}
                onPress={() => setEmocion(item.nombre)}
              />
            ))}
          </View>
        </View>

        <CampoPreguntaDiario
          titulo="¿Qué me hizo sentir así?"
          valor={motivo}
          onChangeText={setMotivo}
          placeholder="Cuéntanos qué ocurrió..."
        />

        <CampoPreguntaDiario
          titulo="¿Cómo reaccioné?"
          valor={reaccion}
          onChangeText={setReaccion}
          placeholder="¿Qué hiciste o cómo respondiste?"
        />

        <CampoPreguntaDiario
          titulo="Una idea útil"
          valor={ideaUtil}
          onChangeText={setIdeaUtil}
          placeholder="¿Qué te gustaría recordar de esta experiencia?"
        />

        <View className="mt-3">
          <Button
            title={guardando ? "Guardando..." : "Guardar cambios"}
            onPress={guardarCambios}
            disabled={guardando}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}