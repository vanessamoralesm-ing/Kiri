import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";

import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";

import { useAuth } from "@/services/authProvider";

import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";

import {
  completarModulo,
  iniciarModulo,
} from "@/services/entrevista/moduloService";

import { ejecutarMotorAdaptativo } from "@/services/entrevista/motorAdaptativo";

import {
  determinarSegmentoEdad,
  obtenerPreguntasSeguridadSalud,
} from "@/services/entrevista/preguntaService";

import {
  eliminarRespuesta,
  obtenerRespuestasEntrevista,
} from "@/services/entrevista/respuestaService";

import type {
  MapaRespuestas,
  ModuloEntrevista,
  PreguntaEntrevista,
} from "@/types/entrevista";

import { respuestaEstaCompleta } from "@/utils/entrevistaHelpers";

// ==========================================================
// PANTALLA
// ==========================================================

export default function SeguridadSaludScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const { profile, loading: authLoading } = useAuth();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [modulo, setModulo] = useState<ModuloEntrevista | null>(null);

  const [preguntas, setPreguntas] = useState<PreguntaEntrevista[]>([]);

  const [mapaRespuestas, setMapaRespuestas] = useState<MapaRespuestas>({});

  const [idPreguntaActual, setIdPreguntaActual] = useState<string | null>(null);

  const [cargando, setCargando] = useState(true);

  const [errorPantalla, setErrorPantalla] = useState<string | null>(null);

  // ========================================================
  // OBTENER CÓDIGO DE OPCIÓN
  // ========================================================

  function obtenerCodigo(pregunta: PreguntaEntrevista, idOpcion?: string) {
    return (
      pregunta.opciones.find((opcion) => opcion.id_opcion === idOpcion)
        ?.codigo ?? null
    );
  }

  // ========================================================
  // PREGUNTAS VISIBLES
  // ========================================================

  const preguntasVisibles = useMemo(() => {
    return preguntas.filter((pregunta) => {
      // ----------------------------------------------
      // SS1A depende de SS1 = SI
      // ----------------------------------------------

      if (pregunta.codigo === "SS1A") {
        const padre = preguntas.find((item) => item.codigo === "SS1");

        if (!padre) {
          return false;
        }

        const idOpcion =
          mapaRespuestas[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

        return obtenerCodigo(padre, idOpcion) === "SI";
      }

      // ----------------------------------------------
      // SS3A depende de SS3 = TODOS_LOS_DIAS
      // ----------------------------------------------

      if (pregunta.codigo === "SS3A") {
        const padre = preguntas.find((item) => item.codigo === "SS3");

        if (!padre) {
          return false;
        }

        const idOpcion =
          mapaRespuestas[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

        return obtenerCodigo(padre, idOpcion) === "TODOS_LOS_DIAS";
      }

      return true;
    });
  }, [preguntas, mapaRespuestas]);

  // ========================================================
  // PREGUNTA ACTUAL
  // ========================================================

  const preguntaActual =
    preguntasVisibles.find(
      (pregunta) => pregunta.id_pregunta === idPreguntaActual,
    ) ?? preguntasVisibles[0];

  const indiceActual = preguntaActual
    ? preguntasVisibles.findIndex(
      (pregunta) => pregunta.id_pregunta === preguntaActual.id_pregunta,
    )
    : -1;

  // ========================================================
  // FORMULARIO
  // ========================================================

  const form = useEntrevistaFormulario({
    idEntrevista: idEntrevista ?? "",
    preguntaActual,
    mapaRespuestas,
    setMapaRespuestas,

    onRespuestaGuardada: async (
      preguntaGuardada,
      respuestaGuardada,
      nuevoMapa,
    ) => {
      // ----------------------------------------------
      // SI SS1 DEJA DE SER "SI", BORRAR SS1A
      // ----------------------------------------------

      if (
        preguntaGuardada.codigo === "SS1" &&
        obtenerCodigo(
          preguntaGuardada,
          respuestaGuardada.opcionesSeleccionadas[0],
        ) !== "SI"
      ) {
        const hija = preguntas.find((item) => item.codigo === "SS1A");

        if (hija?.id_pregunta && nuevoMapa[hija.id_pregunta]) {
          await eliminarRespuesta(idEntrevista!, hija.id_pregunta);

          delete nuevoMapa[hija.id_pregunta];
        }
      }

      // ----------------------------------------------
      // SI SS3 DEJA DE SER TODOS_LOS_DIAS, BORRAR SS3A
      // ----------------------------------------------

      if (
        preguntaGuardada.codigo === "SS3" &&
        obtenerCodigo(
          preguntaGuardada,
          respuestaGuardada.opcionesSeleccionadas[0],
        ) !== "TODOS_LOS_DIAS"
      ) {
        const hija = preguntas.find((item) => item.codigo === "SS3A");

        if (hija?.id_pregunta && nuevoMapa[hija.id_pregunta]) {
          await eliminarRespuesta(idEntrevista!, hija.id_pregunta);

          delete nuevoMapa[hija.id_pregunta];
        }
      }
    },
  });

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
  }, [authLoading, profile, idEntrevista]);

  // ========================================================
  // CARGAR MÓDULO
  // ========================================================

  async function cargar() {
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
      // MÓDULO Y PREGUNTAS
      // ----------------------------------------------

      const mod = await obtenerPreguntasSeguridadSalud(
        entrevista.id_plantilla,
        segmento,
      );

      const preguntasModulo = mod.preguntas ?? [];

      if (!preguntasModulo.length) {
        throw new Error("No hay preguntas disponibles.");
      }

      // ----------------------------------------------
      // INICIAR MÓDULO
      // ----------------------------------------------

      await iniciarModulo(idEntrevista, "SEGURIDAD_SALUD");

      // ----------------------------------------------
      // RESPUESTAS GUARDADAS
      // ----------------------------------------------

      const respuestas = await obtenerRespuestasEntrevista(idEntrevista);

      const mapa: MapaRespuestas = {};

      respuestas.forEach((respuesta) => {
        mapa[respuesta.id_pregunta] = respuesta;
      });

      // ----------------------------------------------
      // ESTADOS
      // ----------------------------------------------

      setModulo(mod);

      setPreguntas(preguntasModulo);

      setMapaRespuestas(mapa);

      // ----------------------------------------------
      // DETERMINAR VISIBILIDAD INICIAL
      // ----------------------------------------------

      const visiblesIniciales = preguntasModulo.filter((pregunta) => {
        if (pregunta.codigo === "SS1A") {
          const padre = preguntasModulo.find((item) => item.codigo === "SS1");

          if (!padre) {
            return false;
          }

          const idOpcion = mapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

          return obtenerCodigo(padre, idOpcion) === "SI";
        }

        if (pregunta.codigo === "SS3A") {
          const padre = preguntasModulo.find((item) => item.codigo === "SS3");

          if (!padre) {
            return false;
          }

          const idOpcion = mapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

          return obtenerCodigo(padre, idOpcion) === "TODOS_LOS_DIAS";
        }

        return true;
      });

      if (!visiblesIniciales.length) {
        throw new Error("No hay preguntas visibles en esta sección.");
      }

      // ----------------------------------------------
      // PRIMERA PENDIENTE
      // ----------------------------------------------

      const primeraPendiente =
        visiblesIniciales.find(
          (pregunta) =>
            !respuestaEstaCompleta(pregunta, mapa[pregunta.id_pregunta]),
        ) ?? visiblesIniciales[0];

      setIdPreguntaActual(primeraPendiente.id_pregunta);

      form.cargarRespuestaEnFormulario(mapa[primeraPendiente.id_pregunta]);
    } catch (err) {
      console.error("Error cargando SEGURIDAD_SALUD:", err);

      setErrorPantalla(err instanceof Error ? err.message : "Error al cargar.");
    } finally {
      setCargando(false);
    }
  }

  // ========================================================
  // CONTINUAR
  // ========================================================

  async function continuar() {
    if (!idEntrevista || !preguntaActual || form.guardando) {
      return;
    }

    // ----------------------------------------------
    // GUARDAR RESPUESTA ACTUAL
    // ----------------------------------------------

    const nuevoMapa = await form.ejecutarGuardado();

    if (!nuevoMapa) {
      return;
    }

    // ----------------------------------------------
    // RECALCULAR PREGUNTAS VISIBLES
    // ----------------------------------------------

    const nuevasVisibles = preguntas.filter((pregunta) => {
      if (pregunta.codigo === "SS1A") {
        const padre = preguntas.find((item) => item.codigo === "SS1");

        if (!padre) {
          return false;
        }

        const idOpcion =
          nuevoMapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

        return obtenerCodigo(padre, idOpcion) === "SI";
      }

      if (pregunta.codigo === "SS3A") {
        const padre = preguntas.find((item) => item.codigo === "SS3");

        if (!padre) {
          return false;
        }

        const idOpcion =
          nuevoMapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0];

        return obtenerCodigo(padre, idOpcion) === "TODOS_LOS_DIAS";
      }

      return true;
    });

    // ----------------------------------------------
    // BUSCAR SIGUIENTE PREGUNTA
    // ----------------------------------------------

    const posicionActual = nuevasVisibles.findIndex(
      (pregunta) => pregunta.id_pregunta === preguntaActual.id_pregunta,
    );

    const siguientePregunta = nuevasVisibles[posicionActual + 1];

    if (siguientePregunta) {
      setIdPreguntaActual(siguientePregunta.id_pregunta);

      form.cargarRespuestaEnFormulario(
        nuevoMapa[siguientePregunta.id_pregunta],
      );

      return;
    }

    // ----------------------------------------------
    // TERMINAR MÓDULO
    // ----------------------------------------------

    try {
      await completarModulo(idEntrevista, "SEGURIDAD_SALUD");

      if (!profile?.fecha_nacimiento) {
        throw new Error("No se pudo determinar el segmento de edad.");
      }

      const segmento = determinarSegmentoEdad(profile.fecha_nacimiento);

      // ----------------------------------------------
      // MOTOR ADAPTATIVO
      // ----------------------------------------------

      const motor = await ejecutarMotorAdaptativo(idEntrevista, segmento);

      // ----------------------------------------------
      // SIGUIENTE MÓDULO
      // ----------------------------------------------

      if (motor.siguienteModulo) {
        router.replace({
          pathname: "/(entrevista)/jovenes-adultos/[id]/modulo/[codigo]",

          params: {
            id: idEntrevista,

            codigo: motor.siguienteModulo,
          },
        });

        return;
      }

      // ----------------------------------------------
      // NO HAY MÁS MÓDULOS
      // ----------------------------------------------

      router.replace({
        pathname: "/(entrevista)/jovenes-adultos/[id]/procesando",

        params: {
          id: idEntrevista,
        },
      });
    } catch (err) {
      console.error("Error finalizando SEGURIDAD_SALUD:", err);

      setErrorPantalla(
        err instanceof Error
          ? err.message
          : "No pudimos continuar con la entrevista.",
      );
    }
  }

  // ========================================================
  // REGRESAR
  // ========================================================

  function regresar() {
    if (form.guardando || !preguntaActual) {
      return;
    }

    const posicionActual = preguntasVisibles.findIndex(
      (pregunta) => pregunta.id_pregunta === preguntaActual.id_pregunta,
    );

    if (posicionActual > 0) {
      const anterior = preguntasVisibles[posicionActual - 1];

      setIdPreguntaActual(anterior.id_pregunta);

      form.cargarRespuestaEnFormulario(mapaRespuestas[anterior.id_pregunta]);

      return;
    }

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

      tituloModulo={modulo?.nombre ?? "Seguridad y salud"}

      indiceActual={indiceActual}

      totalPreguntas={preguntasVisibles.length}

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
