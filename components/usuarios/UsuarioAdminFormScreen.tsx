import React from "react";
import { Text, View } from "react-native";
import AdminFormScreen from "@/components/admin/AdminFormScreen";
import UsuarioAdminAccessForm from "@/components/usuarios/UsuarioAdminAccessForm";
import UsuarioForm from "@/components/usuarios/UsuarioForm";
import UsuarioRoleFields from "@/components/usuarios/UsuarioRoleFields";
import { useUsuarioAdminForm } from "@/hooks/usuarios/useUsuarioAdminForm";

interface Props {
  form: ReturnType<typeof useUsuarioAdminForm>;
}

export default function UsuarioAdminFormScreen({ form }: Props) {
  const editando = form.modo === "editar";
  return (
    <AdminFormScreen
      title={editando ? "Editar usuario" : "Registrar usuario"}
      subtitle={
        editando
          ? "Modifica la información y los permisos del usuario."
          : "Crea una nueva cuenta y asigna sus permisos."
      }
      cargando={form.cargando}
      loadingLabel={editando ? "Cargando usuario..." : "Cargando formulario..."}
      guardando={form.guardando}
      error={form.error}
      onGuardar={form.guardar}
      onVolver={form.volver}
      submitLabel={editando ? "Guardar cambios" : "Registrar usuario"}
      contentClassName=""
    >
      <View className="rounded-3xl border border-border bg-surface p-4 md:p-6">
        <Text className="mb-5 font-nunito-bold text-lg text-text">
          Información personal
        </Text>
        {editando && (
          <View className="mb-5 rounded-2xl bg-surface-secondary px-4 py-3">
            <Text className="font-nunito-medium text-xs text-text-muted">
              Correo electrónico
            </Text>
            <Text className="mt-1 font-nunito-semibold text-sm text-text">
              {form.values.email}
            </Text>
          </View>
        )}
        <UsuarioForm
          values={form.values}
          onChange={form.cambiarCampo}
          disabled={form.guardando}
          mostrarEmail={!editando}
          mostrarPassword={!editando}
          mostrarConfirmPassword={!editando}
        />
      </View>
      <UsuarioAdminAccessForm
        roles={form.roles}
        instituciones={form.instituciones}
        idRol={form.idRol}
        idInstitucion={form.idInstitucion}
        estado={form.estado}
        debeCambiarPassword={form.debeCambiarPassword}
        disabled={form.guardando}
        onRolChange={form.setIdRol}
        onInstitucionChange={form.setIdInstitucion}
        onEstadoChange={form.setEstado}
        onDebeCambiarPasswordChange={form.setDebeCambiarPassword}
      />
      <UsuarioRoleFields
        rol={form.rolSeleccionado?.nombre ?? ""}
        values={form.roleValues}
        disabled={form.guardando}
        onChange={form.cambiarCampoRol}
      />
    </AdminFormScreen>
  );
}
