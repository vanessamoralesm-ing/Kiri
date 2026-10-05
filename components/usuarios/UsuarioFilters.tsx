import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import SearchBar from "@/components/ui/SearchBar";
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

const Chip = ({
  label,
  activo,
  onPress,
}: {
  label: string;
  activo: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`rounded-full border px-4 py-2 ${
      activo
        ? "border-primary bg-primary-soft"
        : "border-border bg-surface-secondary"
    }`}
  >
    <Text
      className={`font-nunito-semibold text-xs ${
        activo ? "text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

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
  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <SearchBar
        value={busqueda}
        onChangeText={onBusquedaChange}
        placeholder="Buscar por nombre, apellido o correo..."
      />

      {mostrarRol && onRolChange && (
        <View className="gap-2">
          <Text className="font-nunito-semibold text-sm text-text-secondary">Rol</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <Chip label="Todos" activo={!idRol} onPress={() => onRolChange("")} />
              {roles.map((rol) => (
                <Chip
                  key={rol.id_rol}
                  label={rol.nombre}
                  activo={idRol === rol.id_rol}
                  onPress={() => onRolChange(rol.id_rol)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {mostrarEstado && onEstadoChange && (
        <View className="gap-2">
          <Text className="font-nunito-semibold text-sm text-text-secondary">Estado</Text>

          <View className="flex-row flex-wrap gap-2">
            <Chip label="Todos" activo={!estado} onPress={() => onEstadoChange("")} />
            <Chip label="Activos" activo={estado === "activo"} onPress={() => onEstadoChange("activo")} />
            <Chip label="Inactivos" activo={estado === "inactivo"} onPress={() => onEstadoChange("inactivo")} />
          </View>
        </View>
      )}

      {mostrarInstitucion && onInstitucionChange && (
        <View className="gap-2">
          <Text className="font-nunito-semibold text-sm text-text-secondary">Institución</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <Chip label="Todas" activo={!idInstitucion} onPress={() => onInstitucionChange("")} />
              {instituciones.map((institucion) => (
                <Chip
                  key={institucion.id_institucion}
                  label={institucion.nombre}
                  activo={idInstitucion === institucion.id_institucion}
                  onPress={() => onInstitucionChange(institucion.id_institucion)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}