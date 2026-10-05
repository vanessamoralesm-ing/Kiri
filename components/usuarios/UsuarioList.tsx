import React from "react";
import { View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import type { UsuarioAdmin } from "@/types/usuarios/usuario";

import UsuarioCard from "./UsuarioCard";
import UsuarioTable from "./UsuarioTable";

interface Props {
  usuarios: UsuarioAdmin[];
  onPress?: (usuario: UsuarioAdmin) => void;
  mostrarInstitucion?: boolean;
  mostrarEstado?: boolean;
}

export default function UsuarioList(props: Props) {
  const { esTelefono } = useResponsiveLayout();

  if (!esTelefono) return <UsuarioTable {...props} />;

  return (
    <View className="gap-3">
      {props.usuarios.map((usuario) => (
        <UsuarioCard
          key={usuario.id_usuario}
          usuario={usuario}
          onPress={props.onPress}
          mostrarInstitucion={props.mostrarInstitucion}
          mostrarEstado={props.mostrarEstado}
        />
      ))}
    </View>
  );
}