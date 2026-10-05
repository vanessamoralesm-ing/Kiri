import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  mensaje?: string;
  error?: boolean;
}

export default function UsuarioEmptyState({
  mensaje = "No se encontraron usuarios",
  error = false,
}: Props) {
  return (
    <View className="min-h-56 items-center justify-center p-6">
      <Ionicons
        name={error ? "alert-circle-outline" : "people-outline"}
        size={38}
        className={error ? "text-danger" : "text-text-muted"}
      />

      <Text className="mt-3 text-center font-nunito-semibold text-sm text-text">
        {mensaje}
      </Text>
    </View>
  );
}