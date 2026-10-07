import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminIdentity from "@/components/admin/AdminIdentity";
import AdminList from "@/components/admin/AdminList";
import type { AdminColumn } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import { nombreTipoInstitucion } from "@/types/instituciones/institucion";
import type { SolicitudInstitucion } from "@/types/superadmin/solicitudes";

type Props = {
  solicitudes: SolicitudInstitucion[];
  solicitudSeleccionada: SolicitudInstitucion | null;
  pagina: number;
  totalPaginas: number;
  totalFiltradas: number;
  onSeleccionar: (s: SolicitudInstitucion) => void;
  onCambiarPagina: (pagina: number) => void;
};

const nombre = (s: SolicitudInstitucion) =>
  [s.nombre_solicitante, s.apellido_solicitante].filter(Boolean).join(" ");

const ubicacion = (s: SolicitudInstitucion) =>
  [s.municipio, s.departamento].filter(Boolean).join(", ") ||
  s.direccion ||
  "Ubicación no especificada";

const identidad = (s: SolicitudInstitucion) => {
  const p = s.nombre_institucion.trim().split(/\s+/);
  const iniciales = (p.length === 1 ? p[0].slice(0, 2) : p.slice(0, 2).map((x) => x[0]).join("")).toUpperCase();

  return (
    <AdminIdentity
      nombre={s.nombre_institucion}
      detalle={ubicacion(s)}
      iniciales={iniciales || "IN"}
    />
  );
};

const solicitante = (s: SolicitudInstitucion) => (
  <View className="gap-1">
    <Text className="font-nunito-semibold text-sm text-text">{nombre(s)}</Text>
    <Text className="font-nunito-medium text-xs text-text-muted">{s.cargo_solicitante}</Text>
  </View>
);

const tipo = (s: SolicitudInstitucion) => {
  const salud = s.tipo_institucion === "salud";
  const escolar = s.tipo_institucion === "escolar";

  return (
    <View className={`self-start rounded-full px-3 py-1 ${salud ? "bg-secondary-soft" : escolar ? "bg-accent-soft" : "bg-primary-soft"}`}>
      <Text className={`font-nunito-bold text-xs ${salud ? "text-secondary" : escolar ? "text-accent" : "text-primary"}`}>
        {nombreTipoInstitucion(s.tipo_institucion)}
      </Text>
    </View>
  );
};

const columns: AdminColumn<SolicitudInstitucion>[] = [
  { key: "institucion", title: "INSTITUCIÓN", className: "w-64", render: identidad },
  { key: "solicitante", title: "SOLICITANTE", render: solicitante },
  { key: "tipo", title: "TIPO", className: "w-40", render: tipo },
];

export default function SolicitudesTable({
  solicitudes,
  solicitudSeleccionada,
  pagina,
  totalPaginas,
  totalFiltradas,
  onSeleccionar,
  onCambiarPagina,
}: Props) {
  const seleccionada = solicitudSeleccionada?.id_solicitud;

  return (
    <View className="gap-4">
      <Text className="font-nunito-bold text-lg text-text">Registro de Peticiones</Text>

      {solicitudes.length ? (
        <AdminList
          items={solicitudes}
          columns={columns}
          keyExtractor={(s) => s.id_solicitud}
          onPressItem={onSeleccionar}
          selectedKey={seleccionada}
          renderCard={(s) => {
            const activa = seleccionada === s.id_solicitud;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Revisar solicitud de ${s.nombre_institucion}`}
                accessibilityState={{ selected: activa }}
                onPress={() => onSeleccionar(s)}
                className="rounded-2xl active:opacity-80"
              >
                <AdminCard className={activa ? "border-primary bg-primary-soft" : "bg-surface-secondary"}>
                  {identidad(s)}
                  {solicitante(s)}
                  {tipo(s)}
                </AdminCard>
              </Pressable>
            );
          }}
        />
      ) : (
        <AdminEmptyState mensaje="No encontramos solicitudes. Prueba cambiando los filtros de búsqueda." />
      )}

      <View className="gap-3 border-t border-border pt-3 md:flex-row md:items-center md:justify-between">
        <Text className="font-nunito-medium text-xs text-text-muted">
          Mostrando {solicitudes.length} de {totalFiltradas} solicitudes
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-2"
        >
          <Button
            title="Anterior"
            icon="chevron-back"
            variant="secondary"
            disabled={pagina === 1}
            onPress={() => onCambiarPagina(pagina - 1)}
            className="my-0 min-h-9 w-auto px-3 py-1"
            textClassName="text-xs"
          />

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              title={String(n)}
              variant={pagina === n ? "primary" : "secondary"}
              onPress={() => onCambiarPagina(n)}
              className="my-0 min-h-9 w-9 px-1 py-1"
              textClassName="text-xs"
            />
          ))}

          <Button
            title="Siguiente"
            icon="chevron-forward"
            variant="secondary"
            disabled={pagina === totalPaginas}
            onPress={() => onCambiarPagina(pagina + 1)}
            className="my-0 min-h-9 w-auto px-3 py-1"
            textClassName="text-xs"
          />
        </ScrollView>
      </View>
    </View>
  );
}