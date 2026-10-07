import React, { useMemo, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import AdminIdentity from "@/components/admin/AdminIdentity";
import AdminList from "@/components/admin/AdminList";
import AdminRankingChart from "@/components/admin/AdminRankingChart";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { AdminColumn } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import UsuarioRoleBadge from "@/components/usuarios/UsuarioRoleBadge";
import useReportes from "@/hooks/superadmin/useReportes";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import type { InstitucionReporte, PeriodoReporte } from "@/types/superadmin/reportes";

const numero = (n: number) => n.toLocaleString("es-GT");
const Texto = ({ children }: { children: React.ReactNode }) => (
  <Text className="font-nunito-medium text-sm text-text-secondary">{children}</Text>
);
const identidad = (i: InstitucionReporte) => <AdminIdentity nombre={i.nombre} detalle={i.codigo} />;
const estado = (i: InstitucionReporte) =>
  i.estado === "activo" || i.estado === "inactivo"
    ? <AdminStatusBadge estado={i.estado} />
    : <Texto>{i.estado || "—"}</Texto>;

const columnas: AdminColumn<InstitucionReporte>[] = [
  { key: "institucion", title: "INSTITUCIÓN", className: "w-72", render: identidad },
  ...(["total", "activos", "inactivos"] as const).map((key) => ({
    key,
    title: key === "total" ? "USUARIOS" : key.toUpperCase(),
    className: "w-32",
    render: (i: InstitucionReporte) => <Texto>{numero(i[key])}</Texto>,
  })),
  { key: "estado", title: "ESTADO ACTUAL", className: "w-40", render: estado },
];

const graficos = [
  ["tests", "Tests más usados"],
  ["tecnicas", "Técnicas más usadas"],
  ["diarios", "Diarios más usados"],
] as const;

export default function ReportesScreen() {
  const r = useReportes();
  const { esEscritorio } = useResponsiveLayout();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const coincidencias = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return r.catalogo.filter((i) => `${i.nombre} ${i.codigo}`.toLowerCase().includes(q));
  }, [r.catalogo, busqueda]);

  const opciones = useMemo(() => {
    const items = coincidencias.slice(0, 20);
    const seleccionada = r.catalogo.find((i) => i.id === r.institucionId);
    if (seleccionada && !items.some((i) => i.id === seleccionada.id)) items.unshift(seleccionada);
    return items;
  }, [coincidencias, r.catalogo, r.institucionId]);

  const datos = r.reporte;
  const filas = datos?.porInstitucion ?? [];
  const paginas = Math.max(1, Math.ceil(filas.length / 20));
  const actual = Math.min(pagina, paginas);
  const paginaDatos = filas.slice((actual - 1) * 20, actual * 20);

  const indicadores = datos ? [
    {
      titulo: "Instituciones registradas",
      valor: datos.instituciones.total,
      descripcion: `${numero(datos.instituciones.activos)} activas · ${numero(datos.instituciones.inactivos)} inactivas`,
    },
    {
      titulo: "Usuarios registrados",
      valor: datos.usuarios.total,
      descripcion: `${numero(datos.usuarios.activos)} activos · ${numero(datos.usuarios.inactivos)} inactivos`,
    },
    {
      titulo: r.institucionId ? "Solicitudes vinculadas" : "Solicitudes recibidas",
      valor: datos.solicitudes.total,
      descripcion: `${numero(datos.solicitudes.pendientes)} pendientes · ${numero(datos.solicitudes.aprobadas)} aprobadas · ${numero(datos.solicitudes.rechazadas)} rechazadas`,
    },
  ] : [];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName={`grow gap-5 px-4 pt-6 md:px-8 ${esEscritorio ? "pb-8" : "pb-28"}`}
    >
      <View className="gap-3 md:flex-row md:items-center md:justify-between">
        <View className="flex-1 gap-1">
          <Text className="font-nunito-bold text-2xl text-text">Reportes globales</Text>
          <Texto>Totales por institución y rol, solicitudes y uso de recursos.</Texto>
        </View>

        {r.permitido && (
          <View className="gap-2 md:flex-row md:flex-wrap md:justify-end">
            <Button title="Actualizar" variant="secondary" disabled={r.cargando} onPress={r.recargar} className="md:w-36" />
            {(["excel", "pdf"] as const).map((f) => (
              <Button
                key={f}
                title={r.exportando === f ? "Exportando..." : `${Platform.OS === "web" ? "Descargar" : "Guardar"} ${f === "excel" ? "Excel" : "PDF"}`}
                disabled={!datos || r.cargando || !!r.exportando}
                onPress={() => r.exportar(f)}
                className="md:w-40"
              />
            ))}
          </View>
        )}
      </View>

      {r.loading ? (
        <ActivityIndicator accessibilityLabel="Cargando sesión" />
      ) : !r.permitido ? (
        <AdminEmptyState error mensaje="Se requiere una cuenta activa de superadministrador." />
      ) : (
        <>
          <AdminCard>
            <AdminFilterOptions
              label="Período"
              value={r.periodo}
              onChange={(v) => {
                r.setPeriodo(v as PeriodoReporte);
                setPagina(1);
              }}
              options={[
                { value: "todo", label: "Todos los registros" },
                { value: "30", label: "Últimos 30 días" },
                { value: "90", label: "Últimos 90 días" },
                { value: "365", label: "Últimos 365 días" },
              ]}
            />

            <Texto>
              {r.periodo === "todo"
                ? "Totales de todos los registros. Se muestran sus estados actuales."
                : "Instituciones y usuarios registrados, solicitudes recibidas y actividades completadas en el período seleccionado."}
            </Texto>

            <SearchBar value={busqueda} onChangeText={setBusqueda} placeholder="Buscar institución para filtrar..." />

            <AdminFilterOptions
              label="Institución"
              value={r.institucionId}
              horizontal
              onChange={(id) => {
                r.setInstitucionId(id);
                setPagina(1);
              }}
              options={[
                { value: "", label: "Todas" },
                ...opciones.map((i) => ({ value: i.id, label: `${i.nombre} · ${i.codigo}` })),
              ]}
            />

            {coincidencias.length > 20 && <Texto>Escribe el nombre o código para encontrar otras instituciones.</Texto>}
            {!!busqueda.trim() && !coincidencias.length && <Texto>No hay instituciones que coincidan con la búsqueda.</Texto>}
            {!!r.institucionId && <Texto>Las solicitudes incluyen únicamente las vinculadas a esta institución.</Texto>}
          </AdminCard>

          {!!r.errorExportacion && (
            <Text accessibilityRole="alert" className="font-nunito-medium text-sm text-danger">
              {r.errorExportacion}
            </Text>
          )}

          {r.cargando ? (
            <ActivityIndicator accessibilityLabel="Cargando reportes" />
          ) : r.error ? (
            <View className="gap-2">
              <AdminEmptyState error mensaje={r.error} />
              <Button title="Reintentar" variant="secondary" onPress={r.recargar} />
            </View>
          ) : datos ? (
            <>
              <Texto>
                Generado: {new Date(datos.generadoEn).toLocaleString("es-GT", {
                  timeZone: "America/Guatemala",
                })} (Guatemala)
              </Texto>

              <View className="-mx-2 flex-row flex-wrap">
                {indicadores.map((i) => (
                  <View key={i.titulo} className="w-full p-2 md:w-1/3">
                    <AdminStatCard titulo={i.titulo} valor={numero(i.valor)} descripcion={i.descripcion} />
                  </View>
                ))}
              </View>

              <AdminCard>
                <Text className="font-nunito-bold text-lg text-text">Usuarios registrados por rol</Text>
                {!datos.porRol.length ? (
                  <Texto>Sin usuarios registrados en este período.</Texto>
                ) : datos.porRol.map((rol) => (
                  <View key={rol.id} className="gap-1 border-t border-border pt-3 md:flex-row md:justify-between">
                    <UsuarioRoleBadge rol={rol.nombre} />
                    <Texto>
                      {numero(rol.total)} usuarios · {numero(rol.activos)} activos · {numero(rol.inactivos)} inactivos
                    </Texto>
                  </View>
                ))}
              </AdminCard>

              <Text className="font-nunito-bold text-lg text-text">Usuarios registrados por institución</Text>

              {!filas.length ? (
                <AdminEmptyState mensaje="Sin instituciones o usuarios para este filtro." />
              ) : (
                <>
                  <AdminList
                    items={paginaDatos}
                    columns={columnas}
                    keyExtractor={(i) => i.id}
                    renderCard={(i) => (
                      <AdminCard>
                        {identidad(i)}
                        <Texto>{numero(i.total)} usuarios · {numero(i.activos)} activos · {numero(i.inactivos)} inactivos</Texto>
                        {!!i.estado && estado(i)}
                      </AdminCard>
                    )}
                  />

                  {paginas > 1 && (
                    <View className="flex-row items-center justify-between gap-3">
                      <Button title="Anterior" variant="secondary" disabled={actual === 1} onPress={() => setPagina(actual - 1)} className="w-auto" />
                      <Texto>{actual} / {paginas}</Texto>
                      <Button title="Siguiente" variant="secondary" disabled={actual === paginas} onPress={() => setPagina(actual + 1)} className="w-auto" />
                    </View>
                  )}
                </>
              )}

              <View className="gap-1">
                <Text className="font-nunito-bold text-lg text-text">Actividad en el período</Text>
                <Texto>Tests y técnicas completados, y entradas de diario guardadas. Cada ejecución o entrada cuenta como un uso.</Texto>
              </View>

              <View className="-mx-2 flex-row flex-wrap">
                {graficos.map(([clave, titulo]) => (
                  <View key={clave} className="w-full p-2 md:w-1/3">
                    <AdminRankingChart
                      titulo={titulo}
                      ranking={datos.uso?.[clave] ?? {
                        items: [],
                        error: "Actualiza el reporte para consultar este ranking.",
                      }}
                    />
                  </View>
                ))}
              </View>

              <Texto>Las descargas incluyen todas las filas y rankings del período y la institución seleccionados.</Texto>
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}