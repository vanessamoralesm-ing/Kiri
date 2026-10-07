import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import { aprobarSolicitudInstitucional } from "@/services/superadmin/aprobarSolicitudService";
import { obtenerSolicitudesInstitucionales } from "@/services/superadmin/solicitudServices";
import type {
  FiltroEstado,
  FiltroTipo,
  SolicitudInstitucion,
} from "@/types/superadmin/solicitudes";

const POR_PAGINA = 5;

export default function useSolicitudesAdmin() {
  const { avisar } = useModal();
  const aprobandoRef = useRef(false);
  const [solicitudes, setSolicitudes] = useState<SolicitudInstitucion[]>([]);
  const [seleccionada, setSeleccionada] = useState<SolicitudInstitucion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aprobando, setAprobando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerSolicitudesInstitucionales();
      setSolicitudes(datos);
      setSeleccionada((actual) =>
        datos.find((s) => s.id_solicitud === actual?.id_solicitud) ??
        datos[0] ??
        null,
      );
    } catch (e) {
      console.error("Error cargando solicitudes:", e);
      setError(e instanceof Error ? e.message : "No fue posible cargar las solicitudes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const total = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadas = solicitudes.filter((s) => s.estado === "aprobada").length;

  const aprobadasMes = useMemo(() => {
    const hoy = new Date();
    return solicitudes.filter((s) => {
      if (s.estado !== "aprobada" || !s.fecha_resolucion) return false;
      const fecha = new Date(s.fecha_resolucion);
      return fecha.getFullYear() === hoy.getFullYear() &&
        fecha.getMonth() === hoy.getMonth();
    }).length;
  }, [solicitudes]);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return solicitudes.filter((s) => {
      const solicitante =
        `${s.nombre_solicitante ?? ""} ${s.apellido_solicitante ?? ""}`
          .trim()
          .toLowerCase();

      const coincide =
        !q ||
        [
          s.nombre_institucion,
          solicitante,
          s.codigo_institucional,
          s.correo,
          s.cedula_solicitante,
        ].some((v) => v?.toLowerCase().includes(q));

      return (
        (filtroEstado === "todas" || s.estado === filtroEstado) &&
        (filtroTipo === "todos" || s.tipo_institucion === filtroTipo) &&
        coincide
      );
    });
  }, [solicitudes, filtroEstado, filtroTipo, busqueda]);

  const paginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, paginas);
  const paginaDatos = filtradas.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  const reiniciar = () => setPagina(1);

  const aprobar = async () => {
    if (!seleccionada || aprobandoRef.current) return;

    aprobandoRef.current = true;
    setAprobando(true);

    try {
      const resultado = await aprobarSolicitudInstitucional(seleccionada.id_solicitud);
      const mensaje = resultado.message || "La institución fue aprobada correctamente.";

      await avisar(
        "Solicitud aprobada",
        resultado.warning ? `${mensaje}\n\n${resultado.warning}` : mensaje,
      );

      await cargar();
    } catch (e) {
      console.error("ERROR APROBANDO:", e);
      await avisar(
        "No se pudo aprobar",
        e instanceof Error
          ? e.message
          : "Ocurrió un error inesperado al aprobar la solicitud.",
        true,
      );
    } finally {
      aprobandoRef.current = false;
      setAprobando(false);
    }
  };

  return {
    solicitudes,
    seleccionada,
    setSeleccionada,
    cargando,
    aprobando,
    error,
    busqueda,
    filtroEstado,
    filtroTipo,
    pagina: paginaActual,
    paginas,
    paginaDatos,
    filtradas,
    total,
    pendientes,
    aprobadas,
    aprobadasMes,
    tasa: total ? (aprobadas / total) * 100 : 0,
    cargar,
    aprobar,
    reiniciar,
    setPagina,
    setBusqueda,
    setFiltroEstado,
    setFiltroTipo,
  };
}