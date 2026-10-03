import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useAuth } from "@/services/authProvider";

import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";

import {
  completarModulo,
  iniciarModulo,
} from "@/services/entrevista/moduloService";

import {
  determinarSegmentoEdad,
  obtenerModuloConPreguntas,
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

export default function RiesgoScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const { profile, loading: authLoading } = useAuth();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // TEMA
  // ========================================================

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

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
    idEntrevista: idEntrevista ?? "",
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

      const mod = await obtenerModuloConPreguntas(
        entrevista.id_plantilla,
        "RIESGO",
        segmento,
      );

      const preguntasModulo = mod.preguntas ?? [];

      if (!preguntasModulo.length) {
        throw new Error("No hay preguntas de seguridad configuradas.");
      }

      // ----------------------------------------------
      // INICIAR MÓDULO
      // ----------------------------------------------

      await iniciarModulo(idEntrevista, "RIESGO");

      // ----------------------------------------------
      // RESPUESTAS EXISTENTES
      // ----------------------------------------------

      const respuestas = await obtenerRespuestasEntrevista(idEntrevista);

      const mapa: MapaRespuestas = {};

      respuestas.forEach((respuesta) => {
        mapa[respuesta.id_pregunta] = respuesta;
      });

      // ----------------------------------------------
      // GUARDAR DATOS
      // ----------------------------------------------

      setModulo(mod);

      setPreguntas(preguntasModulo);

      setMapaRespuestas(mapa);

      // ----------------------------------------------
      // PREGUNTA INICIAL
      // ----------------------------------------------

      let indiceInicial = preguntasModulo.findIndex(
        (pregunta) =>
          pregunta.obligatoria &&
          !respuestaEstaCompleta(pregunta, mapa[pregunta.id_pregunta]),
      );

      if (indiceInicial === -1) {
        indiceInicial = preguntasModulo.length - 1;
      }

      setIndiceActual(indiceInicial);

      form.cargarRespuestaEnFormulario(
        mapa[preguntasModulo[indiceInicial].id_pregunta],
      );
    } catch (err) {
      console.error("Error cargando módulo de riesgo:", err);

      setErrorPantalla(
        err instanceof Error
          ? err.message
          : "Error al cargar la sección de riesgo.",
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
      await completarModulo(idEntrevista, "RIESGO");

      router.replace({
        pathname: "/(entrevista)/jovenes-adultos/[id]/procesando",

        params: {
          id: idEntrevista,
        },
      });
    } catch (err) {
      console.error("Error completando módulo RIESGO:", err);

      setErrorPantalla(
        err instanceof Error
          ? err.message
          : "No pudimos finalizar esta sección.",
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

    if (indiceActual > 0) {
      const indiceAnterior = indiceActual - 1;

      const preguntaAnterior = preguntas[indiceAnterior];

      setIndiceActual(indiceAnterior);

      form.cargarRespuestaEnFormulario(
        mapaRespuestas[preguntaAnterior.id_pregunta],
      );

      return;
    }

    if (!idEntrevista) {
      router.back();

      return;
    }

    router.replace({
      pathname: "/(entrevista)/jovenes-adultos/[id]/modulo/[codigo]",

      params: {
        id: idEntrevista,
        codigo: "ESTADO_EMOCIONAL",
      },
    });
  }

  // ========================================================
  // BANNER DE SEGURIDAD
  // ========================================================

  const headerBanner = (
    <View
      style={{
        width: "100%",

        marginTop: esEscritorio ? 16 : 12,

        marginBottom: esEscritorio ? 18 : 12,

        padding: esEscritorio ? 17 : 14,

        borderWidth: 1,

        borderRadius: esEscritorio ? 18 : 16,

        borderColor,

        flexDirection: "row",

        alignItems: "flex-start",

        backgroundColor: primarySoftColor,
      }}
    >
      <View
        style={{
          width: esEscritorio ? 44 : 40,

          height: esEscritorio ? 44 : 40,

          flexShrink: 0,

          borderRadius: esEscritorio ? 14 : 13,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={esEscritorio ? 23 : 21}
          color={primaryColor}
        />
      </View>

      <View
        style={{
          flex: 1,

          minWidth: 0,

          marginLeft: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",

            fontSize: esEscritorio ? 14 : 13,

            color: textColor,
          }}
        >
          Tu seguridad es importante
        </Text>

        <Text
          style={{
            marginTop: 3,

            maxWidth: esEscritorio ? 680 : undefined,

            fontFamily: "Nunito-Medium",

            fontSize: esEscritorio ? 14 : 13,

            lineHeight: esEscritorio ? 21 : 19,

            color: textSecondaryColor,
          }}
        >
          Queremos hacer unas preguntas adicionales para orientarte de forma más
          segura. Responde según cómo te sientes actualmente.
        </Text>
      </View>
    </View>
  );

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

      tituloModulo={modulo?.nombre ?? "Seguridad y bienestar"}

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

      headerBanner={headerBanner}
    />
  );
}
