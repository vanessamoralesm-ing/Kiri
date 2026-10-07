import { useCallback, useEffect, useRef, useState } from "react";

import {
  actualizarOpcionAdmin,
  cambiarEstadoOpcionAdmin,
  crearOpcionAdmin,
  normalizarCodigoTest,
  obtenerOpcionesAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type { OpcionTest } from "@/types/cuestionarios";

type Form = {
  codigo: string;
  etiqueta: string;
  valorPuntaje: string;
  orden: string;
};

const vacio = (orden: number): Form => ({
  codigo: `OP-${orden}`,
  etiqueta: "",
  valorPuntaje: "",
  orden: String(orden),
});

const mensajeError = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error inesperado.";

export default function useEditorOpciones(
  idPregunta: string,
  puntua = true,
  disabled = false,
  onCambio?: (opciones: OpcionTest[]) => void,
) {
  const [opciones, setOpciones] = useState<OpcionTest[]>([]);
  const [form, setForm] = useState(vacio(1));
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoId, setCambiandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const onCambioRef = useRef(onCambio);

  useEffect(() => {
    onCambioRef.current = onCambio;
  }, [onCambio]);

  const cargar = useCallback(async () => {
    if (!idPregunta) {
      setOpciones([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerOpcionesAdmin(idPregunta);
      setOpciones(datos);
      onCambioRef.current?.(datos);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, [idPregunta]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const actualizar = <K extends keyof Form>(campo: K, valor: Form[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setError(null);
  };

  const nueva = () => {
    const orden = Math.max(0, ...opciones.map((o) => o.orden)) + 1;
    setEditandoId(null);
    setForm(vacio(orden));
    setError(null);
    setMensaje(null);
    setMostrarForm(true);
  };

  const editar = (o: OpcionTest) => {
    setEditandoId(o.id_opcion);
    setForm({
      codigo: o.codigo,
      etiqueta: o.etiqueta,
      valorPuntaje: o.valor_puntaje == null ? "" : String(o.valor_puntaje),
      orden: String(o.orden),
    });
    setError(null);
    setMensaje(null);
    setMostrarForm(true);
  };

  const cancelar = () => {
    if (guardando) return;
    setMostrarForm(false);
    setEditandoId(null);
    setError(null);
  };

  const validar = () => {
    const codigo = normalizarCodigoTest(form.codigo);
    const orden = Number(form.orden);

    if (!codigo) return "Ingresa el código de la opción.";
    if (!form.etiqueta.trim()) return "Ingresa la etiqueta de la opción.";
    if (!Number.isInteger(orden) || orden < 1)
      return "El orden debe ser un entero mayor que cero.";

    if (
      opciones.some(
        (o) =>
          o.id_opcion !== editandoId &&
          normalizarCodigoTest(o.codigo) === codigo,
      )
    )
      return "Ya existe una opción con ese código.";

    if (opciones.some((o) => o.id_opcion !== editandoId && o.orden === orden))
      return "Ese número de orden ya está utilizado.";

    if (puntua && !form.valorPuntaje.trim())
      return "Ingresa el puntaje de la opción.";

    if (puntua && !Number.isFinite(Number(form.valorPuntaje)))
      return "El puntaje debe ser numérico.";

    return null;
  };

  const guardar = async () => {
    if (disabled || guardando || !idPregunta) return;

    const validacion = validar();
    if (validacion) return setError(validacion);

    const editando = !!editandoId;

    try {
      setGuardando(true);
      setError(null);

      const datos = {
        codigo: normalizarCodigoTest(form.codigo),
        etiqueta: form.etiqueta.trim(),
        valor_puntaje: puntua ? Number(form.valorPuntaje) : null,
        orden: Number(form.orden),
      };

      if (editandoId) await actualizarOpcionAdmin(editandoId, datos);
      else
        await crearOpcionAdmin({
          ...datos,
          id_pregunta: idPregunta,
          estado: true,
        });

      await cargar();
      setMostrarForm(false);
      setEditandoId(null);
      setMensaje(
        editando
          ? "Opción actualizada correctamente."
          : "Opción registrada correctamente.",
      );
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (o: OpcionTest) => {
    if (disabled || cambiandoId || guardando) return;

    try {
      setCambiandoId(o.id_opcion);
      setError(null);
      await cambiarEstadoOpcionAdmin(o.id_opcion, !o.estado);
      await cargar();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCambiandoId(null);
    }
  };

  return {
    opciones: [...opciones].sort((a, b) => a.orden - b.orden),
    form,
    actualizar,
    editandoId,
    mostrarForm,
    cargando,
    guardando,
    cambiandoId,
    error,
    mensaje,
    nueva,
    editar,
    cancelar,
    guardar,
    cambiarEstado,
  };
}