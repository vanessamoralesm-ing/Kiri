import React from "react";
import { Text, View } from "react-native";
export default function AdminStatusBadge({ estado, label }: { estado: string; label?: string }) {
  const estados: Record<string, [string, string, string]> = {
    activo: ["Activo", "bg-secondary-soft", "text-success"],
    inactivo: ["Inactivo", "bg-surface-secondary", "text-danger"],
    pendiente: ["Pendiente", "bg-accent-soft", "text-accent"],
    aprobada: ["Aprobada", "bg-secondary-soft", "text-success"],
    rechazada: ["Rechazada", "bg-surface-secondary", "text-danger"],
  };
  const [texto, fondo, color] = estados[estado] ?? [
    estado,
    "bg-surface-secondary",
    "text-text-muted",
  ];
  return (
    <View className={`self-start rounded-full px-3 py-1.5 ${fondo}`}>
      <Text className={`font-nunito-semibold text-xs ${color}`}>{label ?? texto}</Text>
    </View>
  );
}
