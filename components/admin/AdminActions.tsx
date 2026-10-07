import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
interface Props {
  estado: string;
  disabled?: boolean;
  procesando?: boolean;
  entidad?: string;
  textoCambiarEstado?: string;
  onEditar?: () => void;
  onCambiarEstado?: () => void;
  onEliminar?: () => void;
}
export default function AdminActions({
  estado,
  disabled,
  procesando,
  entidad = "",
  textoCambiarEstado,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const activo = estado === "activo";
  const acciones = [
    {
      label: "Editar",
      icon: "create-outline",
      clase: "text-primary",
      onPress: onEditar,
    },
    {
      label: textoCambiarEstado ?? (activo ? "Inactivar" : "Activar"),
      icon: activo ? "pause-outline" : "play-outline",
      clase: activo ? "text-warning" : "text-success",
      onPress: onCambiarEstado,
    },
    {
      label: "Eliminar",
      icon: "trash-outline",
      clase: "text-danger",
      onPress: onEliminar,
    },
  ] as const;
  return (
    <View className="flex-row items-center gap-2">
      {procesando ? (
        <ActivityIndicator accessibilityLabel="Procesando" />
      ) : (
        acciones
          .filter((a) => a.onPress)
          .map((a) => (
            <Pressable
              key={a.label}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`${a.label} ${entidad}`.trim()}
              onPress={a.onPress}
              className="p-3 active:opacity-70"
            >
              <Ionicons name={a.icon} size={21} className={a.clase} />
            </Pressable>
          ))
      )}
    </View>
  );
}
