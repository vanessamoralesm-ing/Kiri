import { useCallback, useEffect, useRef, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import {
  crearOpcionAdmin,
  crearPreguntaAdmin,
  obtenerPreguntasAdmin,
  type PreguntaAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type { TipoPregunta } from "@/types/cuestionarios";

type Opcion = {
  id: string;
  codigo: string;
  etiqueta: string;
  valorPuntaje: string;
};

type Form = {
  codigo: string;
  enunciado: string;
  descripcionApoyo: string;
  tipoPregunta: TipoPregunta;
  idSubescala: string | null;
  obligatoria: boolean;
  puntua: boolean;
  esObservacional: boolean;
  permiteComentario: boolean;
  opciones: Opcion[];
};

const inicial: Form = {
  codigo: "",
  enunciado: "",
  descripcionApoyo: "",
  tipoPregunta: "opcion_unica",
  idSubescala: null,
  obligatoria: true,
  puntua: true,
  esObservacional: false,
  permiteComentario: false,
  opciones: [],
};

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const opcion = (n: number): Opcion => ({
  id: id(),
  codigo: `OP-${n}`,
  etiqueta: "",
  valorPuntaje: "",
});

export const requiereOpciones = (tipo: TipoPregunta) =>
  tipo === "opcion_unica" || tipo === "opcion_multiple" || tipo === "escala";

export default function useEditorPreguntas(
  idTest: string,
  tieneSubescalas = false,
  disabled = false,
  onCambio?: (preguntas: PreguntaAdmin[]) => void,
) {
  const { avisar } = useModal();
  const onCambioRef = useRef(onCambio);
  const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>([]);
  const [form, setForm] = useState<Form>({ ...inicial });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCambioRef.current = onCambio;
  }, [onCambio]);

  const cargar = useCallback(async () => {
    if (!idTest) return setCargando(false);

    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerPreguntasAdmin(idTest);
      setPreguntas(datos);
      onCambioRef.current?.(datos);
    } catch (e) {
      console.error("Error cargando preguntas:", e);
      setError("No fue posible cargar las preguntas.");
    } finally {
      setCargando(false);
    }
  }, [idTest]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const orden = preguntas.length + 1;
  const necesitaOpciones = requiereOpciones(form.tipoPregunta);

  const actualizar = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const seleccionarTipo = (tipo: TipoPregunta) =>
    setForm((f) => ({
      ...f,
      tipoPregunta: tipo,
      puntua: tipo === "texto" ? false : f.puntua,
      opciones: requiereOpciones(tipo)
        ? f.opciones.length
          ? f.opciones
          : [opcion(1), opcion(2)]
        : [],
    }));

  const agregarOpcion = () =>
    setForm((f) => ({
      ...f,
      opciones: [...f.opciones, opcion(f.opciones.length + 1)],
    }));

  const actualizarOpcion = (
    oid: string,
    campo: "codigo" | "etiqueta" | "valorPuntaje",
    valor: string,
  ) =>
    setForm((f) => ({
      ...f,
      opciones: f.opciones.map((o) => (o.id === oid ? { ...o, [campo]: valor } : o)),
    }));

  const eliminarOpcion = (oid: string) =>
    setForm((f) => ({
      ...f,
      opciones: f.opciones.filter((o) => o.id !== oid),
    }));

  const nueva = () => {
    setForm({
      ...inicial,
      codigo: `P-${String(orden).padStart(2, "0")}`,
      opciones: [opcion(1), opcion(2)],
    });
    setError(null);
    setMostrarForm(true);
  };

  const cancelar = () => {
    if (guardando) return;
    setForm({ ...inicial });
    setError(null);
    setMostrarForm(false);
  };

  const validar = () => {
    if (!form.codigo.trim()) return "Debes ingresar el código de la pregunta.";
    if (!form.enunciado.trim()) return "Debes ingresar el enunciado de la pregunta.";
    if (tieneSubescalas && !form.idSubescala) return "Debes seleccionar una subescala.";

    if (necesitaOpciones) {
      if (form.opciones.length < 2) return "La pregunta debe contener al menos dos opciones.";

      for (let i = 0; i < form.opciones.length; i++) {
        const o = form.opciones[i];
        if (!o.codigo.trim()) return `La opción ${i + 1} debe tener un código.`;
        if (!o.etiqueta.trim()) return `La opción ${i + 1} debe tener una etiqueta.`;
        if (form.puntua && !o.valorPuntaje.trim())
          return `La opción ${i + 1} debe tener un puntaje.`;
        if (form.puntua && !Number.isFinite(Number(o.valorPuntaje)))
          return `El puntaje de la opción ${i + 1} debe ser numérico.`;
      }
    }

    return null;
  };

  const guardar = async () => {
    if (guardando || disabled) return;

    const validacion = validar();
    if (validacion) return setError(validacion);

    try {
      setGuardando(true);
      setError(null);

      const creada = await crearPreguntaAdmin({
        id_test: idTest,
        id_subescala: tieneSubescalas ? form.idSubescala : null,
        codigo: form.codigo.trim(),
        enunciado: form.enunciado.trim(),
        descripcion_apoyo: form.descripcionApoyo.trim() || null,
        tipo_pregunta: form.tipoPregunta,
        orden,
        obligatoria: form.obligatoria,
        puntua: form.puntua,
        es_observacional: form.esObservacional,
        permite_comentario: form.permiteComentario,
        estado: true,
      });

      if (necesitaOpciones)
        await Promise.all(
          form.opciones.map((o, i) =>
            crearOpcionAdmin({
              id_pregunta: creada.id_pregunta,
              codigo: o.codigo.trim(),
              etiqueta: o.etiqueta.trim(),
              valor_puntaje: form.puntua ? Number(o.valorPuntaje) : null,
              orden: i + 1,
              estado: true,
            }),
          ),
        );

      await cargar();
      setForm({ ...inicial });
      setMostrarForm(false);
      void avisar("Pregunta registrada", "La pregunta fue agregada correctamente al cuestionario.");
    } catch (e) {
      console.error("Error guardando pregunta:", e);
      setError(e instanceof Error ? e.message : "No fue posible guardar la pregunta.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    preguntas,
    form,
    orden,
    necesitaOpciones,
    cargando,
    guardando,
    mostrarForm,
    error,
    actualizar,
    seleccionarTipo,
    agregarOpcion,
    actualizarOpcion,
    eliminarOpcion,
    nueva,
    cancelar,
    guardar,
  };
}