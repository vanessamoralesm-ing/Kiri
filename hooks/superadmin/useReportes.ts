import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/services/authProvider";
import { obtenerReporteGlobal } from "@/services/superadmin/reporteService";
import { exportarReporte } from "@/services/superadmin/reporteExportService";
import type {
  CatalogoInstitucion,
  FormatoReporte,
  PeriodoReporte,
  ReporteGlobal,
} from "@/types/superadmin/reportes";

export default function useReportes() {
  const { user, profile, isSuperAdmin, loading } = useAuth();
  const permitido =
    !loading && !!user?.id && isSuperAdmin && profile?.estado === "activo";
  const [periodo, setPeriodo] = useState<PeriodoReporte>("todo");
  const [institucionId, setInstitucionId] = useState("");
  const [catalogo, setCatalogo] = useState<CatalogoInstitucion[]>([]);
  const [reporte, setReporte] = useState<ReporteGlobal | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [exportando, setExportando] = useState<FormatoReporte | null>(null);
  const [errorExportacion, setErrorExportacion] = useState("");
  const ocupado = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let vigente = true;
      setReporte(null);
      setError("");
      setErrorExportacion("");
      setCargando(permitido);
      if (!permitido || !user?.id) {
        setCatalogo([]);
        return;
      }
      obtenerReporteGlobal({ periodo, institucionId })
        .then((datos) => {
          if (vigente) {
            setReporte(datos);
            setCatalogo(datos.catalogo);
          }
        })
        .catch((e) => {
          if (vigente)
            setError(
              e instanceof Error
                ? e.message
                : "No fue posible cargar los reportes.",
            );
        })
        .finally(() => {
          if (vigente) setCargando(false);
        });
      return () => {
        vigente = false;
      };
      // La revisión vuelve a ejecutar la carga al pulsar Actualizar.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permitido, user?.id, periodo, institucionId, revision]),
  );

  async function exportar(formato: FormatoReporte) {
    if (!permitido || !reporte || cargando || ocupado.current) return;
    if (!reporte.uso) {
      setErrorExportacion("Actualiza el reporte antes de descargarlo.");
      return;
    }
    ocupado.current = true;
    setExportando(formato);
    setErrorExportacion("");
    try {
      const nombre =
        catalogo.find((i) => i.id === institucionId)?.nombre ??
        (institucionId
          ? "Institución seleccionada"
          : "Todas las instituciones");
      await exportarReporte(reporte, nombre, formato);
    } catch (e) {
      setErrorExportacion(
        e instanceof Error ? e.message : "No fue posible exportar el reporte.",
      );
    } finally {
      ocupado.current = false;
      setExportando(null);
    }
  }

  return {
    permitido,
    loading,
    periodo,
    setPeriodo,
    institucionId,
    setInstitucionId,
    catalogo,
    reporte,
    cargando,
    error,
    exportando,
    errorExportacion,
    exportar,
    recargar: () => setRevision((r) => r + 1),
  };
}
