import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import type { UsuarioAdmin } from "@/types/usuarios/usuario";
import UsuarioStatusBadge from "./UsuarioStatusBadge";

interface Props {
  usuarios: UsuarioAdmin[];
  onPress?: (usuario: UsuarioAdmin) => void;
  mostrarInstitucion?: boolean;
  mostrarEstado?: boolean;
}

export default function UsuarioTable({
  usuarios,
  onPress,
  mostrarInstitucion = true,
  mostrarEstado = true,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-surface">
      <View className="min-h-12 flex-row items-center border-b border-border bg-surface-secondary px-5">
        <Text className="flex-1 font-nunito-semibold text-xs text-text-secondary">USUARIO</Text>
        <Text className="w-32 font-nunito-semibold text-xs text-text-secondary">ROL</Text>
        {mostrarInstitucion && (
          <Text className="w-48 font-nunito-semibold text-xs text-text-secondary">INSTITUCIÓN</Text>
        )}
        {mostrarEstado && (
          <Text className="w-24 font-nunito-semibold text-xs text-text-secondary">ESTADO</Text>
        )}
        {onPress && <View className="w-6" />}
      </View>

      {usuarios.map((usuario, index) => {
        const iniciales =
          usuario.nombres.charAt(0).toUpperCase() +
          usuario.apellidos.charAt(0).toUpperCase();

        return (
          <Pressable
            key={usuario.id_usuario}
            onPress={() => onPress?.(usuario)}
            className={`min-h-16 flex-row items-center px-5 active:bg-surface-secondary ${
              index < usuarios.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <View className="flex-1 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <Text className="font-nunito-bold text-sm text-primary">{iniciales}</Text>
              </View>

              <View className="ml-3 flex-1">
                <Text numberOfLines={1} className="font-nunito-semibold text-sm text-text">
                  {usuario.nombres} {usuario.apellidos}
                </Text>
                <Text numberOfLines={1} className="font-nunito-medium text-xs text-text-muted">
                  {usuario.correo}
                </Text>
              </View>
            </View>

            <Text numberOfLines={1} className="w-32 font-nunito-medium text-xs text-text-secondary">
              {usuario.rol?.nombre ?? "Sin rol"}
            </Text>

            {mostrarInstitucion && (
              <Text numberOfLines={1} className="w-48 font-nunito-medium text-xs text-text-secondary">
                {usuario.institucion?.nombre ?? "Sin institución"}
              </Text>
            )}

            {mostrarEstado && (
              <View className="w-24 items-start">
                <UsuarioStatusBadge estado={usuario.estado} />
              </View>
            )}

            {onPress && <Ionicons name="chevron-forward" size={18} className="text-text-muted" />}
          </Pressable>
        );
      })}
    </View>
  );
}