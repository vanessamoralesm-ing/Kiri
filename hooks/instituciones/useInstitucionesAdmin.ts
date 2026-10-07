import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import {
  cambiarEstadoInstitucion,
  eliminarInstitucion,
  obtenerInstitucionesAdmin,
} from "@/services/instituciones/institucionService";
import type {
  EstadoInstitucion,
  Institucion,
} from "@/types/instituciones/institucion";

export function useInstitucionesAdmin() {
  const { confirmar, avisar } = useModal();
  const [items, setItems] = useState<Institucion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoInstitucion | "">("activo");
  const [tipo, setTipo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const ocupado = useRef(false);

  useFocusEffect(useCallback(() => setRevision((v) => v + 1), []));

  useEffect(() => {
    let vigente = true;
    const timer = setTimeout(async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerInstitucionesAdmin({ busqueda, estado, tipo });
        if (vigente) setItems(data);
      } catch (e) {
        if (vigente)
          setError(
            e instanceof Error
              ? e.message
              : "No fue posible cargar las instituciones.",
          );
      } finally {
        if (vigente) setCargando(false);
      }
    }, 300);

    return () => {
      vigente = false;
      clearTimeout(timer);
    };
  }, [busqueda, estado, tipo, revision]);

  const operar = async (item: Institucion, eliminar = false) => {
    if (ocupado.current) return;

    ocupado.current = true;
    const siguiente = item.estado === "activo" ? "inactivo" : "activo";
    const accion = eliminar
      ? "Eliminar"
      : siguiente === "activo"
        ? "Activar"
        : "Inactivar";

    try {
      if (
        !(await confirmar({
          titulo: `${accion} institución`,
          mensaje: eliminar
            ? `¿Eliminar ${item.nombre}? Esta acción es definitiva. Si tiene usuarios asociados, no se eliminará.`
            : `¿${accion} ${item.nombre}?`,
          textoConfirmar: accion,
          peligro: eliminar,
        }))
      )
        return;

      setProcesando(item.id_institucion);

      if (eliminar) await eliminarInstitucion(item.id_institucion);
      else await cambiarEstadoInstitucion(item.id_institucion, siguiente);

      setRevision((v) => v + 1);

      await avisar(
        "Instituciones",
        `${item.nombre} se ${
          eliminar ? "eliminó" : siguiente === "activo" ? "activó" : "inactivó"
        } correctamente.`,
      );
    } catch (e) {
      await avisar(
        "No se pudo completar la acción",
        e instanceof Error ? e.message : "No fue posible completar la acción.",
        true,
      );
    } finally {
      ocupado.current = false;
      setProcesando(null);
    }
  };

  return {
    items,
    busqueda,
    estado,
    tipo,
    cargando,
    error,
    procesando,
    setBusqueda,
    setEstado,
    setTipo,
    operar,
    recargar: () => setRevision((v) => v + 1),
  };
}