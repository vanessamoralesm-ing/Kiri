import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Button from "@/components/ui/Button";
import UsuarioFilters from "@/components/usuarios/UsuarioFilters";
import UsuarioList from "@/components/usuarios/UsuarioList";
import useGestionUsuarios from "@/hooks/superadmin/useGestionUsuarios";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { UsuarioAdmin } from "@/types/usuarios/usuario";

export default function GestionUsuariosScreen() {
  const u = useGestionUsuarios();
  const primary = useThemeColor({}, "primary");

  const editar = (usuario: UsuarioAdmin) =>
    router.push(`/superadmin/usuarios/${usuario.id_usuario}` as never);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-4 pb-12 pt-5 md:px-6 lg:px-8 lg:pt-7"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-7xl self-center">
        <View className="gap-4 md:flex-row md:items-center md:justify-between">
          <View className="flex-1">
            <Text className="font-nunito-bold text-2xl text-text lg:text-3xl">
              Gestión de usuarios
            </Text>
            <Text className="mt-1 font-nunito-medium text-sm leading-5 text-text-secondary">
              Administra las cuentas, roles y estados de los usuarios de Kiri.
            </Text>
          </View>

          <View className="w-full md:w-44">
            <Button
              title="Registrar usuario"
              onPress={() => router.push("/superadmin/usuarios/nuevo" as never)}
              className="my-0"
            />
          </View>
        </View>

        <View className="mt-6">
          <UsuarioFilters
            busqueda={u.busqueda}
            onBusquedaChange={u.setBusqueda}
            roles={u.roles}
            idRol={u.idRol}
            onRolChange={u.setIdRol}
            estado={u.estado}
            onEstadoChange={u.setEstado}
            instituciones={u.instituciones}
            idInstitucion={u.idInstitucion}
            onInstitucionChange={u.setIdInstitucion}
            mostrarRol
            mostrarEstado
            mostrarInstitucion
          />
        </View>

        <View className="mt-5">
          {u.cargando ? (
            <View className="min-h-56 items-center justify-center gap-3">
              <ActivityIndicator color={primary} />
              <Text className="font-nunito-medium text-sm text-text-muted">
                Cargando usuarios...
              </Text>
            </View>
          ) : u.error ? (
            <AdminEmptyState error mensaje={u.error} />
          ) : !u.usuarios.length ? (
            <AdminEmptyState
              mensaje="No se encontraron usuarios"
              icono="people-outline"
            />
          ) : (
            <UsuarioList
              usuarios={u.usuarios}
              onEditar={editar}
              onCambiarEstado={u.cambiarEstado}
              onEliminar={u.eliminar}
              usuarioProcesando={u.procesando}
              mostrarInstitucion
              mostrarEstado
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}