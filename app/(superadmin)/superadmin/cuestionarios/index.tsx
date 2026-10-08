import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminList from "@/components/admin/AdminList";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { AdminColumn } from "@/components/admin/AdminTable";
import CuestionarioAdminCard from "@/components/superadmin/cuestionarios/CuestionarioAdminCard";
import Button from "@/components/ui/Button";
import {
  FILTROS_ESTADO_CUESTIONARIO,
  RESUMEN_CUESTIONARIOS,
} from "@/constants/superadmin/cuestionarios";
import { useCuestionariosAdmin } from "@/hooks/superadmin/useCuestionariosAdmin";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { TestAdmin } from "@/services/superadmin/cuestionarioAdmin.service";
import type { FiltroEstado } from "@/types/superadmin/cuestionarios";

export default function CuestionariosSuperAdminScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, "primary");
  const c = useCuestionariosAdmin();

  const crear = () => router.push("/superadmin/cuestionarios/nuevo" as never);
  const editar = (t: TestAdmin) => router.push(`/superadmin/cuestionarios/${t.id_test}` as never);

  const acciones = (t: TestAdmin) => (
    <AdminActions
      estado={t.estado ? "activo" : "inactivo"}
      entidad={t.nombre}
      disabled={c.testProcesando !== null}
      procesando={c.testProcesando === t.id_test}
      textoCambiarEstado={t.estado ? "Despublicar" : "Publicar"}
      onEditar={() => editar(t)}
      onCambiarEstado={() => c.cambiarEstado(t)}
    />
  );

  const columns: AdminColumn<TestAdmin>[] = [
    {
      key: "test",
      title: "CUESTIONARIO",
      className: "min-w-72 flex-1",
      render: (t) => (
        <View className="gap-1">
          <Text className="font-nunito-bold text-sm text-text">{t.nombre}</Text>
          <Text className="font-nunito-semibold text-xs text-primary">{t.codigo}</Text>
          {!!t.descripcion && (
            <Text numberOfLines={2} className="font-nunito-medium text-xs text-text-secondary">
              {t.descripcion}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: "configuracion",
      title: "CONFIGURACIÓN",
      className: "min-w-56 flex-1",
      render: (t) => (
        <View className="gap-1">
          <Text className="font-nunito-medium text-xs text-text-secondary">
            {t.pregunta_test?.[0]?.count ?? 0} preguntas
          </Text>
          {!!t.version && (
            <Text className="font-nunito-medium text-xs text-text-secondary">
              Versión {t.version}
            </Text>
          )}
          {t.tiene_subescalas && (
            <Text className="font-nunito-medium text-xs text-text-secondary">Subescalas</Text>
          )}
          {!!t.poblacion_objetivo && (
            <Text className="font-nunito-medium text-xs text-text-muted">
              Población: {t.poblacion_objetivo}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: "estado",
      title: "ESTADO",
      className: "w-36",
      render: (t) => <AdminStatusBadge estado={t.estado ? "activo" : "inactivo"} />,
    },
    {
      key: "acciones",
      title: "ACCIONES",
      className: "w-36",
      render: acciones,
    },
  ];

  const hayFiltros = !!c.busqueda.trim() || c.filtroEstado !== "todos";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-4 pb-28 pt-6 md:px-8"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={c.actualizando}
          onRefresh={() => void c.refrescar()}
          tintColor={primary}
          colors={[primary]}
        />
      }
    >
      <View className="w-full max-w-screen-xl self-center gap-6">
        <View className="gap-4 md:flex-row md:items-start md:justify-between">
          <View className="min-w-0 flex-1">
            <Text className="font-nunito-bold text-2xl text-text lg:text-3xl">Cuestionarios</Text>
            <Text className="mt-2 font-nunito-medium text-sm leading-5 text-text-secondary">
              Administra los instrumentos de evaluación disponibles en Kiri, sus preguntas, opciones, baremos y configuración.
            </Text>
          </View>

          <View className="md:w-52">
            <Button title="Registrar nuevo" icon="add-circle-outline" onPress={crear} className="my-0" />
          </View>
        </View>

        <View className="gap-3 md:flex-row">
          {RESUMEN_CUESTIONARIOS.map(({ clave, ...item }) => (
            <View key={clave} className="flex-1">
              <AdminStatCard {...item} valor={c.resumen[clave]} />
            </View>
          ))}
        </View>

        {!!c.errorAccion && (
          <AdminCard>
            <Text accessibilityRole="alert" className="font-nunito-medium text-sm leading-5 text-danger">
              {c.errorAccion}
            </Text>
            <Button title="Cerrar mensaje" variant="secondary" onPress={c.cerrarError} className="my-0" />
          </AdminCard>
        )}

        <View className="gap-4">
          <View className="gap-1">
            <Text className="font-nunito-bold text-lg text-text">Instrumentos registrados</Text>
            <Text className="font-nunito-medium text-xs text-text-secondary">
              {c.filtrados.length} {c.filtrados.length === 1 ? "cuestionario encontrado" : "cuestionarios encontrados"}
            </Text>
          </View>

          <AdminFilters
            busqueda={c.busqueda}
            onBusquedaChange={c.setBusqueda}
            placeholder="Buscar por nombre o código..."
            filters={[
              {
                label: "Estado",
                value: c.filtroEstado,
                onChange: (v) => c.setFiltroEstado(v as FiltroEstado),
                options: FILTROS_ESTADO_CUESTIONARIO,
              },
            ]}
          />

          {c.cargando ? (
            <View className="min-h-60 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={primary} />
              <Text className="font-nunito-medium text-sm text-text-secondary">Cargando cuestionarios...</Text>
            </View>
          ) : c.error ? (
            <View className="gap-3">
              <AdminEmptyState error mensaje={c.error} />
              <Button title="Intentar nuevamente" onPress={() => void c.cargar()} className="my-0" />
            </View>
          ) : !c.filtrados.length ? (
            <AdminCard>
              <AdminEmptyState
                mensaje={hayFiltros ? "No se encontraron cuestionarios" : "Aún no hay cuestionarios registrados"}
                icono={hayFiltros ? "search-outline" : "clipboard-outline"}
              />
              <Text className="text-center font-nunito-medium text-sm text-text-secondary">
                {hayFiltros
                  ? "Prueba con otros términos o cambia el filtro seleccionado."
                  : "Comienza registrando tu primer instrumento de evaluación."}
              </Text>
              <Button
                title={hayFiltros ? "Limpiar filtros" : "Registrar cuestionario"}
                onPress={hayFiltros ? c.limpiarFiltros : crear}
                className="my-0"
              />
            </AdminCard>
          ) : (
            <AdminList
              items={c.filtrados}
              columns={columns}
              keyExtractor={(t) => t.id_test}
              renderCard={(t) => (
                <CuestionarioAdminCard
                  test={t}
                  disabled={c.testProcesando !== null}
                  procesando={c.testProcesando === t.id_test}
                  onEditar={editar}
                  onCambiarEstado={c.cambiarEstado}
                />
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}