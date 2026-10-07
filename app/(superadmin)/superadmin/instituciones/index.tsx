import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminIdentity from "@/components/admin/AdminIdentity";
import AdminList from "@/components/admin/AdminList";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { AdminColumn } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import { useInstitucionesAdmin } from "@/hooks/instituciones/useInstitucionesAdmin";
import {
  nombreTipoInstitucion,
  TIPOS_INSTITUCION,
  type EstadoInstitucion,
  type Institucion,
} from "@/types/instituciones/institucion";

const Texto = ({ children }: { children?: React.ReactNode }) => (
  <Text selectable className="font-nunito-medium text-sm text-text-secondary">
    {children || "—"}
  </Text>
);

const Identidad = ({ item }: { item: Institucion }) => (
  <AdminIdentity nombre={item.nombre} detalle={item.codigo_institucional} imagen={item.logo} />
);

export default function InstitucionesScreen() {
  const router = useRouter();
  const c = useInstitucionesAdmin();

  const editar = (i: Institucion) =>
    router.push(`/superadmin/instituciones/${i.id_institucion}` as never);

  const acciones = (i: Institucion) => (
    <AdminActions
      estado={i.estado}
      disabled={c.procesando !== null}
      procesando={c.procesando === i.id_institucion}
      onEditar={() => editar(i)}
      onCambiarEstado={() => c.operar(i)}
      onEliminar={() => c.operar(i, true)}
    />
  );

  const ubicacion = (i: Institucion) => (
    <View className="gap-1">
      <Texto>{i.municipio}</Texto>
      <Texto>{i.departamento}</Texto>
    </View>
  );

  const contacto = (i: Institucion) => (
    <View className="gap-1">
      <Texto>{i.correo}</Texto>
      <Texto>{i.telefono}</Texto>
    </View>
  );

  const columns: AdminColumn<Institucion>[] = [
    {
      key: "institucion",
      title: "INSTITUCIÓN",
      className: "w-64",
      render: (i) => <Identidad item={i} />,
    },
    {
      key: "tipo",
      title: "TIPO",
      render: (i) => <Texto>{nombreTipoInstitucion(i.tipo_institucion)}</Texto>,
    },
    { key: "ubicacion", title: "UBICACIÓN", render: ubicacion },
    {
      key: "contacto",
      title: "CONTACTO",
      className: "w-64",
      render: contacto,
    },
    {
      key: "estado",
      title: "ESTADO",
      className: "w-32",
      render: (i) => <AdminStatusBadge estado={i.estado} />,
    },
    { key: "acciones", title: "ACCIONES", render: acciones },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow gap-5 px-4 py-6 md:px-8"
    >
      <View className="gap-3 md:flex-row md:items-center md:justify-between">
        <View>
          <Text className="font-nunito-bold text-2xl text-text">Instituciones</Text>
          <Text className="mt-1 font-nunito-medium text-sm text-text-secondary">
            Administra la información y el estado de las instituciones.
          </Text>
        </View>

        <View className="md:w-48">
          <Button
            title="Nueva institución"
            onPress={() => router.push("/superadmin/instituciones/nuevo" as never)}
          />
        </View>
      </View>

      <AdminFilters
        placeholder="Buscar instituciones..."
        busqueda={c.busqueda}
        onBusquedaChange={c.setBusqueda}
        filters={[
          {
            label: "Estado",
            value: c.estado,
            onChange: (v) => c.setEstado(v as EstadoInstitucion | ""),
            options: [
              { value: "activo", label: "Activas" },
              { value: "inactivo", label: "Inactivas" },
              { value: "", label: "Todas" },
            ],
          },
          {
            label: "Tipo de institución",
            value: c.tipo,
            onChange: c.setTipo,
            options: [{ value: "", label: "Todos" }, ...TIPOS_INSTITUCION],
          },
        ]}
      />

      {c.cargando ? (
        <ActivityIndicator accessibilityLabel="Cargando instituciones" />
      ) : c.error ? (
        <View className="gap-3">
          <AdminEmptyState error mensaje={c.error} />
          <Button title="Reintentar" variant="secondary" onPress={c.recargar} />
        </View>
      ) : !c.items.length ? (
        <AdminEmptyState
          mensaje="No hay instituciones que coincidan con los filtros."
          icono="business-outline"
        />
      ) : (
        <AdminList
          items={c.items}
          columns={columns}
          keyExtractor={(i) => i.id_institucion}
          renderCard={(i) => (
            <AdminCard actions={acciones(i)}>
              <Identidad item={i} />
              <Texto>{nombreTipoInstitucion(i.tipo_institucion)}</Texto>
              {ubicacion(i)}
              {contacto(i)}
              <AdminStatusBadge estado={i.estado} />
              <Texto>Registro: {new Date(i.fecha_registro).toLocaleDateString("es-GT")}</Texto>
            </AdminCard>
          )}
        />
      )}
    </ScrollView>
  );
}
