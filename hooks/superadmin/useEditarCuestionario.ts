import { useCallback, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { ETAPAS_CUESTIONARIO, TIPOS_CON_OPCIONES } from "@/constants/superadmin/cuestionarios";
import { useModal } from "@/contexts/ModalContext";
import {
  actualizarTestAdmin,
  normalizarCodigoTest,
  obtenerSubescalasAdmin,
  obtenerTestAdminPorId,
  type PreguntaAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type {
  EtapaCuestionario,
  InfoTestAdmin,
} from "@/types/superadmin/cuestionarios";
import type {
  OpcionTest,
  SubescalaTest,
  Test,
} from "@/types/cuestionarios";

const desdeTest = (t: Test): InfoTestAdmin => ({
  codigo: t.codigo,
  nombre: t.nombre,
  descripcion: t.descripcion,
  instrucciones: t.instrucciones,
  poblacion_objetivo: t.poblacion_objetivo,
  tipo_aplicacion: t.tipo_aplicacion,
  tiene_subescalas: t.tiene_subescalas,
  version: t.version,
});

const opcional = (v: string | null) => v?.trim() || null;

const necesitaOpciones = (tipo: string) =>
  TIPOS_CON_OPCIONES.some((t) => t === tipo);

export function useEditarCuestionario(idTest?: string) {
  const { confirmar, avisar } = useModal();
  const operacion = useRef(false);

  const [test, setTest] = useState<Test | null>(null);
  const [formulario, setFormulario] = useState<InfoTestAdmin | null>(null);
  const [subescalas, setSubescalas] = useState<SubescalaTest[]>([]);
  const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>([]);
  const [preguntaOpcionesId, setPreguntaOpcionesId] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<EtapaCuestionario>("informacion");
  const [revisionVersion, setRevisionVersion] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!idTest) {
      setError("No se recibió el identificador del cuestionario.");
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const [t, s] = await Promise.all([
        obtenerTestAdminPorId(idTest),
        obtenerSubescalasAdmin(idTest),
      ]);

      setTest(t);
      setFormulario(t ? desdeTest(t) : null);
      setSubescalas(s);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo cargar el cuestionario.",
      );
    } finally {
      setCargando(false);
    }
  }, [idTest]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const etapasVisibles = useMemo(
    () =>
      ETAPAS_CUESTIONARIO.filter(
        (e) => e.id !== "subescalas" || test?.tiene_subescalas,
      ),
    [test?.tiene_subescalas],
  );

  const subescalasActivas = useMemo(
    () => subescalas.filter((s) => s.estado),
    [subescalas],
  );

  const preguntasConOpciones = useMemo(
    () => preguntas.filter((p) => necesitaOpciones(p.tipo_pregunta)),
    [preguntas],
  );

  const preguntaSeleccionada = useMemo(
    () =>
      preguntas.find((p) => p.id_pregunta === preguntaOpcionesId) ?? null,
    [preguntas, preguntaOpcionesId],
  );

  const cambiarEtapa = (nueva: EtapaCuestionario) => {
    if (guardando) return;

    setMensaje(null);
    setError(null);

    if (nueva === "revision") setRevisionVersion((v) => v + 1);
    setEtapa(nueva);
  };

  const seleccionarPregunta = (id: string) =>
    setPreguntaOpcionesId((actual) => (actual === id ? null : id));

  const onCambioOpciones = useCallback(
    (lista: OpcionTest[]) =>
      setPreguntas((actuales) =>
        actuales.map((p) =>
          p.id_pregunta === preguntaOpcionesId
            ? { ...p, opcion_test: lista }
            : p,
        ),
      ),
    [preguntaOpcionesId],
  );

  const guardarInformacion = async () => {
    if (!formulario || !test || operacion.current) return;

    if (!formulario.codigo.trim() || !formulario.nombre.trim()) {
      setError("El código y el nombre son obligatorios.");
      return;
    }

    if (
      !["autoadministrado", "profesional"].includes(
        formulario.tipo_aplicacion,
      )
    ) {
      setError("Selecciona un tipo de aplicación válido.");
      return;
    }

    if (
      test.tiene_subescalas &&
      !formulario.tiene_subescalas &&
      subescalas.length
    ) {
      setError(
        "El cuestionario ya tiene subescalas. Revisa sus preguntas y asociaciones antes de deshabilitarlas.",
      );
      return;
    }

    operacion.current = true;

    try {
      const aceptado = await confirmar({
        titulo: "Guardar cambios",
        mensaje: `¿Deseas guardar los cambios de "${formulario.nombre.trim()}"?`,
        textoConfirmar: "Guardar cambios",
        icono: "create-outline",
      });

      if (!aceptado) return;

      setGuardando(true);
      setError(null);
      setMensaje(null);

      const actualizado = await actualizarTestAdmin(test.id_test, {
        codigo: normalizarCodigoTest(formulario.codigo),
        nombre: formulario.nombre.trim(),
        descripcion: opcional(formulario.descripcion),
        instrucciones: opcional(formulario.instrucciones),
        poblacion_objetivo: opcional(formulario.poblacion_objetivo),
        tipo_aplicacion: formulario.tipo_aplicacion,
        tiene_subescalas: formulario.tiene_subescalas,
        version: opcional(formulario.version),
      });

      setTest(actualizado);
      setFormulario(desdeTest(actualizado));
      setMensaje("Información general actualizada.");
    } catch (e) {
      const texto =
        e instanceof Error
          ? e.message
          : "No se pudieron guardar los cambios.";

      setError(texto);
      await avisar("Error al guardar", texto, true);
    } finally {
      operacion.current = false;
      setGuardando(false);
    }
  };

  return {
    test,
    formulario,
    setFormulario,
    etapa,
    etapasVisibles,
    subescalasActivas,
    preguntasConOpciones,
    preguntaSeleccionada,
    revisionVersion,
    cargando,
    guardando,
    error,
    mensaje,
    cargar,
    cambiarEtapa,
    seleccionarPregunta,
    guardarInformacion,
    necesitaOpciones,
    onCambioSubescalas: setSubescalas,
    onCambioPreguntas: setPreguntas,
    onCambioOpciones,
  };
}