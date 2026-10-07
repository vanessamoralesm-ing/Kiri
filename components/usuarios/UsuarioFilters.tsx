import React from "react";
import AdminFilters, {
  type AdminFilter,
} from "@/components/admin/AdminFilters";
import type { EstadoUsuario, Rol } from "@/types/auth";
import type { InstitucionResumen } from "@/types/usuarios/usuario";

interface Props {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  roles?: Rol[];
  idRol?: string;
  onRolChange?: (value: string) => void;
  estado?: EstadoUsuario | "";
  onEstadoChange?: (value: EstadoUsuario | "") => void;
  instituciones?: InstitucionResumen[];
  idInstitucion?: string;
  onInstitucionChange?: (value: string) => void;
  mostrarRol?: boolean;
  mostrarEstado?: boolean;
  mostrarInstitucion?: boolean;
}

export default function UsuarioFilters({
  busqueda,
  onBusquedaChange,
  roles = [],
  idRol = "",
  onRolChange,
  estado = "",
  onEstadoChange,
  instituciones = [],
  idInstitucion = "",
  onInstitucionChange,
  mostrarRol = true,
  mostrarEstado = true,
  mostrarInstitucion = false,
}: Props) {
  const filters: AdminFilter[] = [];
  if (mostrarRol && onRolChange)
    filters.push({
      label: "Rol",
      value: idRol,
      onChange: onRolChange,
      horizontal: true,
      options: [
        { value: "", label: "Todos" },
        ...roles.map((rol) => ({
          value: rol.id_rol,
          label: rol.nombre,
        })),
      ],
    });
  if (mostrarEstado && onEstadoChange)
    filters.push({
      label: "Estado",
      value: estado,
      onChange: (value) => {
        if (value === "" || value === "activo" || value === "inactivo")
          onEstadoChange(value);
      },
      options: [
        { value: "", label: "Todos" },
        { value: "activo", label: "Activos" },
        { value: "inactivo", label: "Inactivos" },
      ],
    });
  if (mostrarInstitucion && onInstitucionChange)
    filters.push({
      label: "Institución",
      value: idInstitucion,
      onChange: onInstitucionChange,
      horizontal: true,
      options: [
        { value: "", label: "Todas" },
        ...instituciones.map((institucion) => ({
          value: institucion.id_institucion,
          label: institucion.nombre,
        })),
      ],
    });
  return (
    <AdminFilters
      busqueda={busqueda}
      onBusquedaChange={onBusquedaChange}
      placeholder="Buscar por nombre, apellido o correo..."
      filters={filters}
    />
  );
}
