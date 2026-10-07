import { useCallback, useEffect, useRef, useState } from "react";

import {
  actualizarSubescalaAdmin,
  cambiarEstadoSubescalaAdmin,
  crearSubescalaAdmin,
  normalizarCodigoTest,
  obtenerSubescalasAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type { SubescalaTest } from "@/types/cuestionarios";

type Form = {
  codigo: string;
  nombre: string;
  descripcion: string;
  orden: string;
  incluyeTotal: boolean;
};

const inicial = (orden: number): Form => ({
  codigo: "",
  nombre: "",
  descripcion: "",
  orden: String(orden),
  incluyeTotal: true,
});

const mensajeError = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error inesperado.";

export default function useEditorSubescalas(
  idTest: string,
  disabled = false,
  onCambio?: (s: SubescalaTest[]) => void,
) {
  const cambioRef = useRef(onCambio);
  const [subescalas, setSubescalas] = useState<SubescalaTest[]>([]);
  const [form, setForm] = useState<Form>(inicial(1));
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoId, setCambiandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    cambioRef.current = onCambio;
  }, [onCambio]);

  const cargar = useCallback(async () => {
    if (!idTest) {
      setSubescalas([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);
      const data = await obtenerSubescalasAdmin(idTest);
      setSubescalas(data);
      cambioRef.current?.(data);
    } catch (e) {
      console.error("Error cargando subescalas:", e);
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, [idTest]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const ordenadas = [...subescalas].sort((a, b) => a.orden - b.orden);
  const activas = subescalas.filter((s) => s.estado).length;
  const siguienteOrden = Math.max(0, ...subescalas.map((s) => s.orden)) + 1;
  const bloqueado = disabled || guardando;

  const actualizar = <K extends keyof Form>(campo: K, valor: Form[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (error) setError(null);
  };

  const nueva = () => {
    if (bloqueado) return;
    setEditandoId(null);
    setForm(inicial(siguienteOrden));
    setError(null);
    setMensaje(null);
    setMostrarForm(true);
  };

  const editar = (s: SubescalaTest) => {
    if (bloqueado) return;
    setEditandoId(s.id_subescala);
    setForm({
      codigo: s.codigo,
      nombre: s.nombre,
      descripcion: s.descripcion ?? "",
      orden: String(s.orden),
      incluyeTotal: s.incluye_total,
    });
    setError(null);
    setMensaje(null);
    setMostrarForm(true);
  };

  const cancelar = () => {
    if (guardando) return;
    setMostrarForm(false);
    setEditandoId(null);
    setForm(inicial(siguienteOrden));
    setError(null);
  };

  const validar = () => {
    const codigo = normalizarCodigoTest(form.codigo);
    const nombre = form.nombre.trim();
    const orden = Number(form.orden);

    if (!codigo) return "Debes ingresar el código de la subescala.";
    if (!nombre) return "Debes ingresar el nombre de la subescala.";
    if (!Number.isInteger(orden) || orden < 1)
      return "El orden debe ser un número entero mayor que cero.";

    if (
      subescalas.some(
        (s) =>
          s.id_subescala !== editandoId &&
          normalizarCodigoTest(s.codigo) === codigo,
      )
    )
      return `Ya existe una subescala con el código "${codigo}".`;

    if (
      subescalas.some(
        (s) => s.id_subescala !== editandoId && s.orden === orden,
      )
    )
      return `El orden ${orden} ya está asignado a otra subescala.`;

    return null;
  };

  const guardar = async () => {
    if (bloqueado || !idTest) return;

    const validacion = validar();
    if (validacion) return setError(validacion);

    const editando = !!editandoId;

    try {
      setGuardando(true);
      setError(null);
      setMensaje(null);

      const datos = {
        codigo: normalizarCodigoTest(form.codigo),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        orden: Number(form.orden),
        incluye_total: form.incluyeTotal,
      };

      if (editandoId) await actualizarSubescalaAdmin(editandoId, datos);
      else
        await crearSubescalaAdmin({
          id_test: idTest,
          ...datos,
          estado: true,
        });

      setMostrarForm(false);
      setEditandoId(null);
      await cargar();
      setMensaje(
        editando
          ? "La subescala se actualizó correctamente."
          : "La subescala se registró correctamente.",
      );
    } catch (e) {
      console.error("Error guardando subescala:", e);
      setError(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (s: SubescalaTest) => {
    if (disabled || cambiandoId || guardando) return;

    try {
      setCambiandoId(s.id_subescala);
      setError(null);
      setMensaje(null);
      await cambiarEstadoSubescalaAdmin(s.id_subescala, !s.estado);
      await cargar();
      setMensaje(
        `La subescala se ${s.estado ? "desactivó" : "activó"} correctamente.`,
      );
    } catch (e) {
      console.error("Error cambiando estado:", e);
      setError(mensajeError(e));
    } finally {
      setCambiandoId(null);
    }
  };

  return {
    subescalas,
    ordenadas,
    activas,
    form,
    editandoId,
    mostrarForm,
    cargando,
    guardando,
    cambiandoId,
    bloqueado,
    error,
    mensaje,
    actualizar,
    nueva,
    editar,
    cancelar,
    guardar,
    cambiarEstado,
  };
}