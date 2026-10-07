import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import AdminCard from "./AdminCard";

const variantes = {
  primary: ["bg-primary-soft", "text-primary"],
  secondary: ["bg-secondary-soft", "text-secondary"],
  accent: ["bg-accent-soft", "text-accent"],
  success: ["bg-secondary-soft", "text-success"],
  neutral: ["bg-surface-secondary", "text-text-muted"],
} as const;

export interface AdminStatCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  sufijo?: string;
  icono?: keyof typeof Ionicons.glyphMap;
  variante?: keyof typeof variantes;
  descripcionDestacada?: boolean;
}

export default function AdminStatCard({
  titulo,
  valor,
  descripcion,
  sufijo,
  icono,
  variante = "primary",
  descripcionDestacada = false,
}: AdminStatCardProps) {
  const [fondo, color] = variantes[variante];
  return (
    <AdminCard className="h-full min-h-36">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-nunito-semibold text-sm text-text-secondary">{titulo}</Text>
        {icono && (
          <View className={`h-10 w-10 items-center justify-center rounded-xl ${fondo}`}>
            <Ionicons name={icono} size={20} className={color} />
          </View>
        )}
      </View>
      <View className="flex-row flex-wrap items-baseline gap-2">
        <Text className="font-nunito-bold text-3xl text-text">{valor}</Text>
        {!!sufijo && <Text className="font-nunito-medium text-sm text-text-muted">{sufijo}</Text>}
      </View>
      {!!descripcion && (
        <Text
          className={`font-nunito-medium text-xs ${descripcionDestacada ? color : "text-text-muted"}`}
        >
          {descripcion}
        </Text>
      )}
    </AdminCard>
  );
}
