import React from "react";

import UsuarioAdminFormScreen from "@/components/usuarios/UsuarioAdminFormScreen";
import { useUsuarioAdminForm } from "@/hooks/usuarios/useUsuarioAdminForm";

export default function NuevoUsuarioScreen() {
  const form =
    useUsuarioAdminForm({
      modo: "crear",
    });

  return (
    <UsuarioAdminFormScreen
      form={form}
    />
  );
}