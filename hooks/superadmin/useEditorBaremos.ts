import { useCallback, useEffect, useState } from "react";

import {
  actualizarBaremoAdmin,
  cambiarEstadoBaremoAdmin,
  crearBaremoAdmin,
  crearRangoBaremoAdmin,
  normalizarCodigoTest,
  obtenerBaremosAdmin,
  obtenerRangosBaremoAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type {
  BaremoTest,
  RangoBaremo,
  TipoValorBaremo,
} from "@/types/cuestionarios";

type FormBaremo = {
  codigo: string;
  nombre: string;
  descripcion: string;
  poblacion: string;
  sexoAplicable: string;
  edadMinima: string;
  edadMaxima: string;
  tipoValor: TipoValorBaremo;
  version: string;
  fuente: string;
};

type FormRango = {
  idSubescala: string | null;
  nivel: string;
  valorMinimo: string;
  valorMaximo: string;
  interpretacion: string;
  orden: string;
};

const BAREMO_INICIAL: FormBaremo = {
  codigo: "",
  nombre: "",
  descripcion: "",
  poblacion: "",
  sexoAplicable: "",
  edadMinima: "",
  edadMaxima: "",
  tipoValor: "puntaje_total",
  version: "",
  fuente: "",
};

const RANGO_INICIAL: FormRango = {
  idSubescala: null,
  nivel: "",
  valorMinimo: "",
  valorMaximo: "",
  interpretacion: "",
  orden: "1",
};

const opcional = (v: string) => v.trim() || null;
const numeroOpcional = (v: string) => (v.trim() ? Number(v) : null);

const errorTexto = (e: unknown) => {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (!e || typeof e !== "object") return "Ocurrió un error.";

  const x = e as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };

  return (
    [
      x.message,
      x.code && `Código: ${x.code}`,
      x.details,
      x.hint,
    ]
      .filter(Boolean)
      .join("\n") || "Ocurrió un error."
  );
};

export default function useEditorBaremos(idTest: string, disabled = false) {
  const [baremos, setBaremos] = useState<BaremoTest[]>([]);
  const [rangos, setRangos] = useState<RangoBaremo[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormBaremo>({ ...BAREMO_INICIAL });
  const [formRango, setFormRango] = useState<FormRango>({ ...RANGO_INICIAL });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarRango, setMostrarRango] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoRangos, setCargandoRangos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const limpiarMensajes = () => {
    setError(null);
    setMensaje(null);
  };

  const cargarBaremos = useCallback(async () => {
    if (!idTest) {
      setBaremos([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setBaremos(await obtenerBaremosAdmin(idTest));
    } catch (e) {
      console.error("Error cargando baremos:", e);
      setError(errorTexto(e));
    } finally {
      setCargando(false);
    }
  }, [idTest]);

  const cargarRangos = useCallback(async (id: string) => {
    try {
      setCargandoRangos(true);
      setRangos(await obtenerRangosBaremoAdmin(id));
    } catch (e) {
      console.error("Error cargando rangos:", e);
      setError(errorTexto(e));
    } finally {
      setCargandoRangos(false);
    }
  }, []);

  useEffect(() => {
    void cargarBaremos();
  }, [cargarBaremos]);

  useEffect(() => {
    if (seleccionadoId) void cargarRangos(seleccionadoId);
    else {
      setRangos([]);
      setMostrarRango(false);
    }
  }, [seleccionadoId, cargarRangos]);

  const seleccionado =
    baremos.find((b) => b.id_baremo === seleccionadoId) ?? null;

  const actualizar = <K extends keyof FormBaremo>(
    campo: K,
    valor: FormBaremo[K],
  ) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    limpiarMensajes();
  };

  const actualizarRango = <K extends keyof FormRango>(
    campo: K,
    valor: FormRango[K],
  ) => {
    setFormRango((f) => ({ ...f, [campo]: valor }));
    limpiarMensajes();
  };

  const nuevoBaremo = () => {
    setEditandoId(null);
    setForm({ ...BAREMO_INICIAL });
    setMostrarForm(true);
    limpiarMensajes();
  };

  const editarBaremo = (b: BaremoTest) => {
    setEditandoId(b.id_baremo);
    setForm({
      codigo: b.codigo,
      nombre: b.nombre,
      descripcion: b.descripcion ?? "",
      poblacion: b.poblacion ?? "",
      sexoAplicable: b.sexo_aplicable ?? "",
      edadMinima: b.edad_minima == null ? "" : String(b.edad_minima),
      edadMaxima: b.edad_maxima == null ? "" : String(b.edad_maxima),
      tipoValor: b.tipo_valor,
      version: b.version ?? "",
      fuente: b.fuente ?? "",
    });
    setMostrarForm(true);
    limpiarMensajes();
  };

  const validarBaremo = () => {
    if (!form.codigo.trim()) return "Ingresa el código.";
    if (!form.nombre.trim()) return "Ingresa el nombre.";

    const min = numeroOpcional(form.edadMinima);
    const max = numeroOpcional(form.edadMaxima);

    if (
      (min !== null && (!Number.isInteger(min) || min < 0)) ||
      (max !== null && (!Number.isInteger(max) || max < 0))
    )
      return "Las edades deben ser números enteros no negativos.";

    if (min !== null && max !== null && min > max)
      return "La edad mínima no puede superar la edad máxima.";

    const codigo = normalizarCodigoTest(form.codigo);
    if (baremos.some((b) => b.id_baremo !== editandoId && b.codigo === codigo))
      return "Ya existe un baremo con ese código.";

    return null;
  };

  const guardarBaremo = async () => {
    if (disabled || guardando) return;

    const validacion = validarBaremo();
    if (validacion) return setError(validacion);

    try {
      setGuardando(true);
      limpiarMensajes();

      const datos = {
        codigo: normalizarCodigoTest(form.codigo),
        nombre: form.nombre.trim(),
        descripcion: opcional(form.descripcion),
        poblacion: opcional(form.poblacion),
        sexo_aplicable: opcional(form.sexoAplicable),
        edad_minima: numeroOpcional(form.edadMinima),
        edad_maxima: numeroOpcional(form.edadMaxima),
        tipo_valor: form.tipoValor,
        version: opcional(form.version),
        fuente: opcional(form.fuente),
      };

      let id = editandoId;

      if (editandoId) await actualizarBaremoAdmin(editandoId, datos);
      else {
        const nuevo = await crearBaremoAdmin({
          ...datos,
          id_test: idTest,
          estado: true,
        });
        id = nuevo.id_baremo;
      }

      await cargarBaremos();
      if (id) setSeleccionadoId(id);
      setMostrarForm(false);
      setMensaje("Baremo guardado correctamente.");
    } catch (e) {
      console.error("Error guardando baremo:", e);
      setError(errorTexto(e));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (b: BaremoTest) => {
    if (disabled || guardando) return;

    try {
      setGuardando(true);
      limpiarMensajes();
      await cambiarEstadoBaremoAdmin(b.id_baremo, !b.estado);
      await cargarBaremos();
      setMensaje(
        b.estado
          ? "Baremo desactivado correctamente."
          : "Baremo activado correctamente.",
      );
    } catch (e) {
      console.error("Error cambiando estado del baremo:", e);
      setError(errorTexto(e));
    } finally {
      setGuardando(false);
    }
  };

  const nuevoRango = () => {
    const orden = Math.max(0, ...rangos.map((r) => r.orden)) + 1;
    setFormRango({ ...RANGO_INICIAL, orden: String(orden) });
    setMostrarRango(true);
    limpiarMensajes();
  };

  const guardarRango = async () => {
    if (disabled || guardando || !seleccionadoId) return;

    const min = Number(formRango.valorMinimo);
    const max = Number(formRango.valorMaximo);
    const orden = Number(formRango.orden);

    if (!formRango.nivel.trim())
      return setError("Ingresa el nivel de interpretación.");

    if (
      !formRango.valorMinimo.trim() ||
      !formRango.valorMaximo.trim() ||
      !Number.isFinite(min) ||
      !Number.isFinite(max)
    )
      return setError("Ingresa valores mínimo y máximo válidos.");

    if (min > max)
      return setError("El valor mínimo no puede superar al máximo.");

    if (!Number.isInteger(orden) || orden < 1)
      return setError("El orden debe ser un entero mayor que cero.");

    try {
      setGuardando(true);
      limpiarMensajes();

      await crearRangoBaremoAdmin({
        id_baremo: seleccionadoId,
        id_subescala: formRango.idSubescala,
        nivel: formRango.nivel.trim(),
        valor_minimo: min,
        valor_maximo: max,
        interpretacion: opcional(formRango.interpretacion),
        orden,
        estado: true,
      });

      await cargarRangos(seleccionadoId);
      setMostrarRango(false);
      setMensaje("Rango registrado correctamente.");
    } catch (e) {
      console.error("Error guardando rango:", e);
      setError(errorTexto(e));
    } finally {
      setGuardando(false);
    }
  };

  return {
    baremos,
    rangos,
    seleccionado,
    seleccionadoId,
    setSeleccionadoId,
    form,
    formRango,
    actualizar,
    actualizarRango,
    mostrarForm,
    setMostrarForm,
    mostrarRango,
    setMostrarRango,
    editandoId,
    cargando,
    cargandoRangos,
    guardando,
    error,
    setError,
    mensaje,
    nuevoBaremo,
    editarBaremo,
    cambiarEstado,
    guardarBaremo,
    nuevoRango,
    guardarRango,
  };
}