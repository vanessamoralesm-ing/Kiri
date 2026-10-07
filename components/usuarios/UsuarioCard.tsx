import React from "react";
import { Text, View } from "react-native";
import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminIdentity from "@/components/admin/AdminIdentity";
import type { UsuarioAdmin } from "@/types/usuarios/usuario";
import UsuarioRoleBadge from "./UsuarioRoleBadge";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
export interface UsuarioPresentationProps {
  onEditar?: (usuario: UsuarioAdmin) => void;
  onCambiarEstado?: (usuario: UsuarioAdmin) => void;
  onEliminar?: (usuario: UsuarioAdmin) => void;
  usuarioProcesando?: string | null;
  mostrarInstitucion?: boolean;
  mostrarEstado?: boolean;
}
export function UsuarioIdentidad({ usuario }: { usuario: UsuarioAdmin }) {
  return (
    <AdminIdentity
      nombre={`${usuario.nombres} ${usuario.apellidos}`}
      detalle={usuario.correo}
      iniciales={(
        usuario.nombres.charAt(0) + usuario.apellidos.charAt(0)
      ).toUpperCase()}
    />
  );
}
export function UsuarioAcciones({
  usuario,
  usuarioProcesando,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: UsuarioPresentationProps & { usuario: UsuarioAdmin }) {
  const procesando = usuarioProcesando === usuario.id_usuario;
  return (
    <AdminActions
      entidad="usuario"
      estado={usuario.estado}
      disabled={procesando}
      procesando={procesando}
      onEditar={onEditar && (() => onEditar(usuario))}
      onCambiarEstado={onCambiarEstado && (() => onCambiarEstado(usuario))}
      onEliminar={onEliminar && (() => onEliminar(usuario))}
    />
  );
}
export default function UsuarioCard({
  usuario,
  mostrarInstitucion = true,
  mostrarEstado = true,
  ...props
}: UsuarioPresentationProps & { usuario: UsuarioAdmin }) {
  return (
    <AdminCard actions={<UsuarioAcciones usuario={usuario} {...props} />}>
      <UsuarioIdentidad usuario={usuario} />
      <View className="flex-row flex-wrap items-center gap-2">
        <UsuarioRoleBadge rol={usuario.rol?.nombre} />
        {mostrarEstado && <AdminStatusBadge estado={usuario.estado} />}
      </View>
      {mostrarInstitucion && (
        <Text className="font-nunito-medium text-sm text-text-secondary">
          {usuario.institucion?.nombre ?? "Sin institución"}
        </Text>
      )}
    </AdminCard>
  );
}
