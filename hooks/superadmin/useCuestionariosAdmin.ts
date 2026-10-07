import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import {
  despublicarTestAdmin,
  obtenerTestsAdmin,
  publicarTestAdmin,
  type TestAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type { FiltroEstado } from "@/types/superadmin/cuestionarios";

type ErrorServicio = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

const mensajeError = (error: unknown) => {
  if (typeof error === "string" && error.trim()) return error;
  if (!error || typeof error !== "object")
    return "Ocurrió un error inesperado. Consulta la consola.";

  const e = error as ErrorServicio;
  const partes = [
    e.message,
    e.code && `Código: ${e.code}`,
    e.details,
    e.hint && `Sugerencia: ${e.hint}`,
  ].filter(Boolean);

  return partes.length
    ? partes.join("\n")
    : "Ocurrió un error inesperado. Consulta la consola.";
};

export function useCuestionariosAdmin() {
  const { confirmar, avisar } = useModal();
  const [tests, setTests] = useState<TestAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [testProcesando, setTestProcesando] = useState<string | null>(null);
  const operacion = useRef(false);
  const solicitud = useRef(0);

  const cargar = useCallback(async (mostrarCarga = true) => {
    const id = ++solicitud.current;

    try {
      if (mostrarCarga) setCargando(true);
      setError(null);

      const datos = await obtenerTestsAdmin();
      if (id === solicitud.current) setTests(datos);
    } catch (e) {
      if (id !== solicitud.current) return;
      console.error("Error cargando cuestionarios:", e);
      setError(`No fue posible cargar los cuestionarios.\n\n${mensajeError(e)}`);
    } finally {
      if (mostrarCarga && id === solicitud.current) setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
      return () => {
        solicitud.current++;
      };
    }, [cargar]),
  );

  const refrescar = async () => {
    if (actualizando || cargando || operacion.current) return;

    try {
      setActualizando(true);
      setErrorAccion(null);
      await cargar(false);
    } finally {
      setActualizando(false);
    }
  };

  const resumen = useMemo(() => {
    const activos = tests.filter((t) => t.estado).length;
    return { total: tests.length, activos, inactivos: tests.length - activos };
  }, [tests]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return tests.filter(
      (t) =>
        (!q ||
          [t.nombre, t.codigo, t.descripcion ?? ""].some((v) =>
            v.toLowerCase().includes(q),
          )) &&
        (filtroEstado === "todos" ||
          (filtroEstado === "activos" ? t.estado : !t.estado)),
    );
  }, [tests, busqueda, filtroEstado]);

  const cambiarEstado = async (test: TestAdmin) => {
    if (operacion.current || actualizando) return;

    operacion.current = true;
    const accion = test.estado ? "Despublicar" : "Publicar";

    try {
      if (
        !(await confirmar({
          titulo: `${accion} cuestionario`,
          mensaje: `¿Deseas ${accion.toLowerCase()} "${test.nombre}"?`,
          textoConfirmar: accion,
          peligro: test.estado,
          icono: test.estado
            ? "pause-circle-outline"
            : "checkmark-circle-outline",
        }))
      )
        return;

      setTestProcesando(test.id_test);
      setErrorAccion(null);

      const actualizado = test.estado
        ? await despublicarTestAdmin(test.id_test)
        : await publicarTestAdmin(test.id_test);

      if (
        actualizado.id_test !== test.id_test ||
        actualizado.estado === test.estado
      )
        throw new Error(
          "El servicio no confirmó el cambio de estado del cuestionario.",
        );

      solicitud.current++;
      setTests((items) =>
        items.map((i) =>
          i.id_test === test.id_test ? { ...i, ...actualizado } : i,
        ),
      );
    } catch (e) {
      console.error("Error cambiando el estado del cuestionario:", e);

      const mensaje = `No se pudo ${accion.toLowerCase()} "${test.nombre}".\n\n${mensajeError(e)}`;
      setErrorAccion(mensaje);
      await avisar("Error de publicación", mensaje, true);
    } finally {
      operacion.current = false;
      setTestProcesando(null);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("todos");
  };

  return {
    tests,
    filtrados,
    resumen,
    cargando,
    actualizando,
    error,
    errorAccion,
    busqueda,
    filtroEstado,
    testProcesando,
    cargar,
    refrescar,
    cambiarEstado,
    limpiarFiltros,
    cerrarError: () => setErrorAccion(null),
    setBusqueda,
    setFiltroEstado,
  };
}