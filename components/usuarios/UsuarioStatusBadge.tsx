import React from "react";
import { Text, View } from "react-native";

import type { EstadoUsuario } from "@/types/auth";

export default function UsuarioStatusBadge({ estado }: { estado: EstadoUsuario }) {
  const activo = estado === "activo";

  return (
    <View className={`rounded-full px-3 py-1 ${activo ? "bg-secondary-soft" : "bg-surface-secondary"}`}>
      <Text className={`font-nunito-semibold text-xs ${activo ? "text-success" : "text-danger"}`}>
        {activo ? "Activo" : "Inactivo"}
      </Text>
    </View>
  );
}