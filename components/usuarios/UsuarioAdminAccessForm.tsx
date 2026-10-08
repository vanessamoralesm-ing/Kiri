import React from "react";
import { Text, View } from "react-native";

import {
  AdminFilterOptions,
  type AdminFilter,
} from "@/components/admin/AdminFilters";
import type { EstadoUsuario, Rol } from "@/types/auth";
import type { InstitucionResumen } from "@/types/usuarios/usuario";

interface Props {
  roles: Rol[];
  instituciones: InstitucionResumen[];
  idRol: string;
  idInstitucion: string;
  estado: EstadoUsuario;
  debeCambiarPassword: boolean;
  disabled?: boolean;
  onRolChange: (value: string) => void;
  onInstitucionChange: (value: string) => void;
  onEstadoChange: (value: EstadoUsuario) => void;
  onDebeCambiarPasswordChange: (value: boolean) => void;
}

export default function UsuarioAdminAccessForm({
  roles,
  instituciones,
  idRol,
  idInstitucion,
  estado,
  debeCambiarPassword,
  disabled,
  onRolChange,
  onInstitucionChange,
  onEstadoChange,
  onDebeCambiarPasswordChange,
}: Props) {
  const fields: AdminFilter[] = [
    {
      label: "Rol",
      value: idRol,
      onChange: onRolChange,
      options: roles.map((rol) => ({
        value: rol.id_rol,
        label: rol.nombre.replaceAll("_", " "),
      })),
    },
    {
      label: "Institución",
      value: idInstitucion,
      onChange: onInstitucionChange,
      options: [
        { value: "", label: "Sin institución" },
        ...instituciones.map((institucion) => ({
          value: institucion.id_institucion,
          label: institucion.nombre,
        })),
      ],
    },
    {
      label: "Estado",
      value: estado,
      onChange: (value) => onEstadoChange(value as EstadoUsuario),
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
      ],
    },
    {
      label: "Seguridad",
      value: String(debeCambiarPassword),
      onChange: () => onDebeCambiarPasswordChange(!debeCambiarPassword),
      options: [
        {
          value: "true",
          label: debeCambiarPassword
            ? "Cambiar contraseña al ingresar"
            : "No requiere cambio de contraseña",
        },
      ],
    },
  ];

  return (
    <View className="mt-5 gap-5 rounded-3xl border border-border bg-surface p-4 md:p-6">
      <Text className="font-nunito-bold text-lg text-text">
        Acceso y permisos
      </Text>
      {fields.map((field) => (
        <AdminFilterOptions key={field.label} {...field} disabled={disabled} />
      ))}
    </View>
  );
}
