import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";

import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";

import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";

import { useAuth } from "@/services/authProvider";

import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";

import {
  completarModulo,
  iniciarModulo,
} from "@/services/entrevista/moduloService";

import {
  determinarSegmentoEdad,
  obtenerPreguntasGenerales,
} from "@/services/entrevista/preguntaService";

import { obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";

import type {
  MapaRespuestas,
  ModuloEntrevista,
  PreguntaEntrevista,
} from "@/types/entrevista";

import { respuestaEstaCompleta } from "@/utils/entrevistaHelpers";

// ==========================================================
// PANTALLA
// ==========================================================

export default function PreguntasGeneralesScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const idEntrevista = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";

  const { profile, loading: authLoading } = useAuth();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [modulo, setModulo] = useState<ModuloEntrevista | null>(null);

  const [preguntas, setPreguntas] = useState<PreguntaEntrevista[]>([]);

  const [indiceActual, setIndiceActual] = useState(0);

  const [mapaRespuestas, setMapaRespuestas] = useState<MapaRespuestas>({});

  const [cargando, setCargando] = useState(true);

  const [errorPantalla, setErrorPantalla] = useState<string | null>(null);

  // ========================================================
  // PREGUNTA ACTUAL
  // ========================================================

  const preguntaActual = preguntas[indiceActual];

  // ========================================================
  // FORMULARIO
  // ========================================================

  const form = useEntrevistaFormulario({
    idEntrevista,
    preguntaActual,
    mapaRespuestas,
    setMapaRespuestas,
  });

  // ========================================================
  // CARGAR MÓDULO
  // ========================================================

  const cargar = useCallback(async () => {
    if (!idEntrevista) {
      setErrorPantalla("No se pudo identificar la entrevista.");

      setCargando(false);

      return;
    }

    if (!profile?.fecha_nacimiento) {
      setErrorPantalla("No se pudo obtener tu fecha de nacimiento.");

      setCargando(false);

      return;
    }

    try {
      setCargando(true);
      setErrorPantalla(null);

      // ----------------------------------------------
      // ENTREVISTA
      // ----------------------------------------------

      const entrevista = await obtenerEntrevistaPorId(idEntrevista);

      // ----------------------------------------------
      // SEGMENTO DE EDAD
      // ----------------------------------------------

      const segmento = determinarSegmentoEdad(profile.fecha_nacimiento);

      // ----------------------------------------------
      // PREGUNTAS DEL MÓDULO
      // ----------------------------------------------

      const mod = await obtenerPreguntasGenerales(
        entrevista.id_plantilla,
        segmento,
      );

      const preguntasModulo = mod.preguntas ?? [];

      if (!preguntasModulo.length) {
        throw new Error("No hay preguntas disponibles en este módulo.");
      }

      // ----------------------------------------------
      // INICIAR MÓDULO
      // ----------------------------------------------

      await iniciarModulo(idEntrevista, "GENERAL");

      // ----------------------------------------------
      // RESPUESTAS EXISTENTES
      // ----------------------------------------------

      const respuestas = await obtenerRespuestasEntrevista(idEntrevista);

      const mapa: MapaRespuestas = {};

      respuestas.forEach((respuesta) => {
        mapa[respuesta.id_pregunta] = respuesta;
      });

      // ----------------------------------------------
      // GUARDAR INFORMACIÓN
      // ----------------------------------------------

      setModulo(mod);

      setPreguntas(preguntasModulo);

      setMapaRespuestas(mapa);

      // ----------------------------------------------
      // DETERMINAR PREGUNTA A MOSTRAR
      // ----------------------------------------------

      let indiceInicial = preguntasModulo.findIndex(
        (pregunta) =>
          pregunta.obligatoria &&
          !respuestaEstaCompleta(pregunta, mapa[pregunta.id_pregunta]),
      );

      // Si todas las obligatorias están contestadas,
      // mostramos la última pregunta.
      if (indiceInicial === -1) {
        indiceInicial = preguntasModulo.length - 1;
      }

      setIndiceActual(indiceInicial);

      // ----------------------------------------------
      // CARGAR RESPUESTA DE LA PREGUNTA
      // ----------------------------------------------

      form.cargarRespuestaEnFormulario(
        mapa[preguntasModulo[indiceInicial].id_pregunta],
      );
    } catch (err) {
      console.error("Error cargando preguntas generales:", err);

      setErrorPantalla(
        err instanceof Error
          ? err.message
          : "No pudimos cargar este módulo de la entrevista.",
      );
    } finally {
      setCargando(false);
    }
  }, [idEntrevista, profile?.fecha_nacimiento]);

  // ========================================================
  // CARGA INICIAL
  // ========================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!profile) {
      setErrorPantalla(
        "No pudimos cargar tus datos de perfil. Intenta nuevamente en unos segundos.",
      );

      setCargando(false);

      return;
    }

    cargar();
  }, [authLoading, profile, cargar]);

  // ========================================================
  // CONTINUAR
  // ========================================================

  async function continuar() {
    if (!idEntrevista || form.guardando) {
      return;
    }

    // Guarda la respuesta actual.
    const nuevoMapa = await form.ejecutarGuardado();

    if (!nuevoMapa) {
      return;
    }

    // ------------------------------------------------------
    // SIGUIENTE PREGUNTA
    // ------------------------------------------------------

    if (indiceActual < preguntas.length - 1) {
      const siguienteIndice = indiceActual + 1;

      const siguientePregunta = preguntas[siguienteIndice];

      setIndiceActual(siguienteIndice);

      form.cargarRespuestaEnFormulario(
        nuevoMapa[siguientePregunta.id_pregunta],
      );

      return;
    }

    // ------------------------------------------------------
    // FINALIZAR MÓDULO
    // ------------------------------------------------------

    try {
      await completarModulo(idEntrevista, "GENERAL");

      router.push({
        pathname: "/(entrevista)/jovenes-adultos/[id]/seguridad-salud",

        params: {
          id: idEntrevista,
        },
      });
    } catch (err) {
      console.error("Error completando módulo GENERAL:", err);

      setErrorPantalla(
        err instanceof Error
          ? err.message
          : "No pudimos finalizar este módulo.",
      );
    }
  }

  // ========================================================
  // REGRESAR
  // ========================================================

  function regresar() {
    if (form.guardando) {
      return;
    }

    // ------------------------------------------------------
    // PREGUNTA ANTERIOR
    // ------------------------------------------------------

    if (indiceActual > 0) {
      const indiceAnterior = indiceActual - 1;

      const preguntaAnterior = preguntas[indiceAnterior];

      setIndiceActual(indiceAnterior);

      form.cargarRespuestaEnFormulario(
        mapaRespuestas[preguntaAnterior.id_pregunta],
      );

      return;
    }

    // ------------------------------------------------------
    // SALIR DEL MÓDULO
    // ------------------------------------------------------

    router.back();
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <EntrevistaPantallaBase
      cargando={authLoading || cargando}

      guardando={form.guardando}

      errorPantalla={errorPantalla}

      onReintentar={cargar}

      onBack={regresar}

      onContinuar={continuar}

      tituloModulo={modulo?.nombre ?? "Preguntas generales"}

      indiceActual={indiceActual}

      totalPreguntas={preguntas.length}

      preguntaActual={preguntaActual}

      opcionesSeleccionadas={form.opcionesSeleccionadas}

      onSeleccionarOpcion={form.seleccionarOpcion}

      textoRespuesta={form.textoRespuesta}

      onChangeTextoRespuesta={form.setTextoRespuesta}

      numeroRespuesta={form.numeroRespuesta}

      onChangeNumeroRespuesta={form.setNumeroRespuesta}

      esValida={form.respuestaActualValida()}
    />
  );
}
