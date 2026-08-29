import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CategoriaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-slate-50 px-6 pt-12">
      {/* Regresa directamente a la pantalla principal de Educación. */}
      <Pressable
        onPress={() => router.replace("/(tabs)/educacion" as any)}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#475569"
        />
      </Pressable>

      <Text className="text-2xl font-semibold text-blue-500">
        {id}
      </Text>

      <Text className="mt-2 text-base text-slate-500">
        Aquí aparecerán las lecturas de esta categoría.
      </Text>
    </View>
  );
}