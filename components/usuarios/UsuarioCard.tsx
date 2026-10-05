import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import type { UsuarioAdmin } from "@/types/usuarios/usuario";
import UsuarioStatusBadge from "./UsuarioStatusBadge";

interface Props {
  usuario: UsuarioAdmin;
  onPress?: (usuario: UsuarioAdmin) => void;
  mostrarInstitucion?: boolean;
  mostrarEstado?: boolean;
}

export default function UsuarioCard({
  usuario,
  onPress,
  mostrarInstitucion = true,
  mostrarEstado = true,
}: Props) {
  const iniciales =
    usuario.nombres.charAt(0).toUpperCase() +
    usuario.apellidos.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => onPress?.(usuario)}
      className="rounded-2xl border border-border bg-surface p-4 active:bg-surface-secondary"
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft">
          <Text className="font-nunito-bold text-base text-primary">{iniciales}</Text>
        </View>

        <View className="ml-3 flex-1">
          <Text numberOfLines={1} className="font-nunito-semibold text-sm text-text">
            {usuario.nombres} {usuario.apellidos}
          </Text>

          <Text numberOfLines={1} className="mt-0.5 font-nunito-medium text-xs text-text-muted">
            {usuario.correo}
          </Text>

          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-surface-secondary px-3 py-1">
              <Text className="font-nunito-semibold text-xs text-text-secondary">
                {usuario.rol?.nombre ?? "Sin rol"}
              </Text>
            </View>

            {mostrarEstado && <UsuarioStatusBadge estado={usuario.estado} />}
          </View>

          {mostrarInstitucion && (
            <Text numberOfLines={1} className="mt-2 font-nunito-medium text-xs text-text-secondary">
              {usuario.institucion?.nombre ?? "Sin institución"}
            </Text>
          )}
        </View>

        {onPress && <Ionicons name="chevron-forward" size={18} className="text-text-muted" />}
      </View>
    </Pressable>
  );
}