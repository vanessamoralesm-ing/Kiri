import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminFilters from "@/components/admin/AdminFilters";
import AdminStatCard from "@/components/admin/AdminStatCard";
import SolicitudDetailPanel from "@/components/superadmin/solicitudes/SolicitudDetailPanel";
import SolicitudesTable from "@/components/superadmin/solicitudes/SolicitudesTable";
import Button from "@/components/ui/Button";
import useSolicitudesAdmin from "@/hooks/superadmin/useSolicitudesAdmin";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { TIPOS_INSTITUCION } from "@/types/instituciones/institucion";
import type {
  FiltroEstado,
  FiltroTipo,
  SolicitudInstitucion,
} from "@/types/superadmin/solicitudes";

export default function SolicitudesSuperAdminScreen() {
  const { esEscritorio } = useResponsiveLayout();
  const scroll = useRef<ScrollView>(null);
  const [detalle, setDetalle] = useState(false);
  const s = useSolicitudesAdmin();
  const mostrarLista = esEscritorio || !detalle;

  const arriba = () => scroll.current?.scrollTo({ y: 0, animated: true });

  useEffect(() => {
    if (esEscritorio || !detalle) return;
    const t = setTimeout(arriba, 80);
    return () => clearTimeout(t);
  }, [detalle, esEscritorio, s.seleccionada?.id_solicitud]);

  const seleccionar = (item: SolicitudInstitucion) => {
    s.setSeleccionada(item);
    if (!esEscritorio) setDetalle(true);
  };

  const volver = () => {
    setDetalle(false);
    requestAnimationFrame(arriba);
  };

  const reiniciar = () => {
    s.reiniciar();
    setDetalle(false);
  };

  const cambiarPagina = (pagina: number) => {
    s.setPagina(pagina);
    if (!esEscritorio) volver();
  };

  return (
    <ScrollView
      ref={scroll}
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={`grow ${
        esEscritorio ? "px-12 pb-12 pt-7" : "px-5 pb-28 pt-5 md:px-8"
      }`}
    >
      <View className="w-full max-w-7xl self-center gap-5">
        {mostrarLista && (
          <>
            <View className="gap-2">
              <Text className="font-nunito-bold text-2xl text-text md:text-3xl">
                Solicitudes de Instituciones
              </Text>
              <Text className="max-w-3xl font-nunito-medium text-sm leading-5 text-text-secondary">
                Gestiona, audita y valida solicitudes de incorporación de colegios,
                universidades y centros clínicos a la red Kiri para acceso a salud mental preventiva.
              </Text>
            </View>

            <View className="-mx-2 flex-row flex-wrap">
              <View className="w-full p-2 md:w-1/2 lg:w-1/3">
                <AdminStatCard
                  titulo="SOLICITUDES POR VALIDAR"
                  valor={s.pendientes}
                  sufijo="en espera"
                  descripcion={`${s.pendientes} ${
                    s.pendientes === 1 ? "solicitud pendiente" : "solicitudes pendientes"
                  } de revisión`}
                  icono="clipboard-outline"
                  variante="primary"
                />
              </View>

              <View className="w-full p-2 md:w-1/2 lg:w-1/3">
                <AdminStatCard
                  titulo="APROBADAS ESTE MES"
                  valor={s.aprobadasMes}
                  sufijo="entidades"
                  descripcion="Solicitudes aprobadas durante el mes actual"
                  icono="checkmark-circle-outline"
                  variante="secondary"
                  descripcionDestacada
                />
              </View>

              <View className="w-full p-2 md:w-1/2 lg:w-1/3">
                <AdminStatCard
                  titulo="TASA DE APROBACIÓN"
                  valor={`${s.tasa.toFixed(1)}%`}
                  descripcion="Porcentaje de solicitudes aprobadas"
                  icono="shield-checkmark-outline"
                  variante="accent"
                />
              </View>
            </View>

            <AdminFilters
              busqueda={s.busqueda}
              placeholder="Buscar por institución, solicitante, código o cédula..."
              onBusquedaChange={(v) => {
                s.setBusqueda(v);
                reiniciar();
              }}
              filters={[
                {
                  label: "Estado",
                  value: s.filtroEstado,
                  onChange: (v) => {
                    s.setFiltroEstado(v as FiltroEstado);
                    reiniciar();
                  },
                  options: [
                    { value: "todas", label: `Todas (${s.total})` },
                    { value: "pendiente", label: `Pendientes (${s.pendientes})` },
                    { value: "aprobada", label: `Aprobadas (${s.aprobadas})` },
                  ],
                },
                {
                  label: "Tipo de entidad",
                  value: s.filtroTipo,
                  onChange: (v) => {
                    s.setFiltroTipo(v as FiltroTipo);
                    reiniciar();
                  },
                  options: [{ value: "todos", label: "Todos" }, ...TIPOS_INSTITUCION],
                },
              ]}
            />
          </>
        )}

        {s.cargando ? (
          <AdminCard>
            <View className="min-h-64 items-center justify-center gap-4">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="font-nunito-semibold text-sm text-text-secondary">
                Cargando solicitudes...
              </Text>
            </View>
          </AdminCard>
        ) : s.error ? (
          <AdminCard>
            <AdminEmptyState error mensaje={`No pudimos cargar las solicitudes. ${s.error}`} />
            <Button title="Reintentar" onPress={s.cargar} />
          </AdminCard>
        ) : (
          <View className={`gap-5 ${esEscritorio ? "flex-row items-start" : ""}`}>
            {mostrarLista && (
              <View className={`min-w-0 ${esEscritorio ? "flex-1" : "w-full"}`}>
                <SolicitudesTable
                  solicitudes={s.paginaDatos}
                  solicitudSeleccionada={s.seleccionada}
                  pagina={s.pagina}
                  totalPaginas={s.paginas}
                  totalFiltradas={s.filtradas.length}
                  onSeleccionar={seleccionar}
                  onCambiarPagina={cambiarPagina}
                />
              </View>
            )}

            {(esEscritorio || detalle) && (
              <View className={esEscritorio ? "w-96 shrink-0" : "w-full gap-4"}>
                {!esEscritorio && (
                  <Button
                    title="Volver a solicitudes"
                    icon="arrow-back"
                    variant="secondary"
                    onPress={volver}
                  />
                )}

                <SolicitudDetailPanel
                  solicitud={s.seleccionada}
                  procesando={s.aprobando}
                  onAprobar={s.aprobar}
                  onSolicitarAntecedentes={() =>
                    console.log("Solicitar antecedentes:", s.seleccionada?.id_solicitud)
                  }
                  onRechazar={() =>
                    console.log("Rechazar solicitud:", s.seleccionada?.id_solicitud)
                  }
                />
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}