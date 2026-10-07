import {
  useLocalSearchParams,
} from "expo-router";
import React from "react";

import UsuarioAdminFormScreen from "@/components/usuarios/UsuarioAdminFormScreen";
import { useUsuarioAdminForm } from "@/hooks/usuarios/useUsuarioAdminForm";

export default function EditarUsuarioScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const idUsuario =
    Array.isArray(id)
      ? id[0]
      : id;

  const form = useUsuarioAdminForm({
    modo: "editar",
    idUsuario,
  });

  return (
    <UsuarioAdminFormScreen
      form={form}
    />
  );
}