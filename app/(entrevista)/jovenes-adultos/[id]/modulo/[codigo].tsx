import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";
import { useAuth } from "@/services/authProvider";
import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";
import { determinarSegmentoEdad, obtenerModuloConPreguntas } from "@/services/entrevista/preguntaService";
import { obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";
import { iniciarModulo, completarModulo, obtenerSiguienteModulo } from "@/services/entrevista/moduloService";
import { evaluarRiesgoEntrevista } from "@/services/entrevista/riesgoService";
import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";
import { respuestaEstaCompleta } from "@/utils/entrevistaHelpers";
import { ModuloEntrevista, PreguntaEntrevista, MapaRespuestas } from "@/types/entrevista";

export default function ModuloAdaptativoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; codigo: string }>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;
  const codigoModulo = Array.isArray(params.codigo) ? params.codigo[0] : params.codigo;
  const { profile, loading: authLoading } = useAuth();

  const [modulo, setModulo] = useState<ModuloEntrevista | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaEntrevista[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [mapaRespuestas, setMapaRespuestas] = useState<MapaRespuestas>({});
  const [cargando, setCargando] = useState(true);
  const [errorPantalla, setErrorPantalla] = useState<string | null>(null);

  const preguntaActual = preguntas[indiceActual];
  const form = useEntrevistaFormulario({
    idEntrevista,
    preguntaActual,
    mapaRespuestas,
    setMapaRespuestas,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      setErrorPantalla("No pudimos cargar tus datos de perfil. Intenta nuevamente en unos segundos.");
      setCargando(false);
      return;
    }
    cargar();
  }, [authLoading, profile, idEntrevista, codigoModulo]);

  async function cargar() {
    if (!idEntrevista || !codigoModulo || !profile?.fecha_nacimiento) return;
    try {
      setCargando(true);
      setErrorPantalla(null);
      const entrevista = await obtenerEntrevistaPorId(idEntrevista);
      const segmento = determinarSegmentoEdad(profile.fecha_nacimiento);
      const mod = await obtenerModuloConPreguntas(entrevista.id_plantilla, codigoModulo, segmento);
      const preguntasMod = mod.preguntas ?? [];
      if (!preguntasMod.length) throw new Error("No hay preguntas disponibles.");

      await iniciarModulo(idEntrevista, codigoModulo);
      const resps = await obtenerRespuestasEntrevista(idEntrevista);
      const mapa: MapaRespuestas = {};
      resps.forEach((r) => { mapa[r.id_pregunta] = r; });

      setModulo(mod);
      setPreguntas(preguntasMod);
      setMapaRespuestas(mapa);

      let idx = preguntasMod.findIndex((p) => p.obligatoria && !respuestaEstaCompleta(p, mapa[p.id_pregunta]));
      idx = idx === -1 ? preguntasMod.length - 1 : idx;
      setIndiceActual(idx);
      form.cargarRespuestaEnFormulario(mapa[preguntasMod[idx].id_pregunta]);
    } catch (err) {
      setErrorPantalla(err instanceof Error ? err.message : "Error al cargar módulo.");
    } finally {
      setCargando(false);
    }
  }

  async function continuar() {
    const nuevoMapa = await form.ejecutarGuardado();
    if (!nuevoMapa) return;

    if (indiceActual < preguntas.length - 1) {
      const prox = indiceActual + 1;
      setIndiceActual(prox);
      form.cargarRespuestaEnFormulario(nuevoMapa[preguntas[prox].id_pregunta]);
      return;
    }

    await completarModulo(idEntrevista, codigoModulo);
    if (codigoModulo === "ESTADO_EMOCIONAL") {
      const riesgo = await evaluarRiesgoEntrevista(idEntrevista);

      if (riesgo.requiereEvaluacionRiesgo) {
        router.replace(
          `/(entrevista)/jovenes-adultos/${idEntrevista}/riesgo`
        );
        return;
      }
    }

    const proxMod = await obtenerSiguienteModulo(idEntrevista);

    if (proxMod?.modulo) {
      router.replace(
        `/(entrevista)/jovenes-adultos/${idEntrevista}/modulo/${proxMod.modulo.codigo}`
      );
      return;
    }

    router.replace(
      `/(entrevista)/jovenes-adultos/${idEntrevista}/procesando`
    );
  }

  function regresar() {
    if (form.guardando) return;
    if (indiceActual > 0) {
      const prev = indiceActual - 1;
      setIndiceActual(prev);
      form.cargarRespuestaEnFormulario(mapaRespuestas[preguntas[prev].id_pregunta]);
      return;
    }
    router.back();
  }

  return (
    <EntrevistaPantallaBase
      cargando={authLoading || cargando}
      guardando={form.guardando}
      errorPantalla={errorPantalla}
      onReintentar={cargar}
      onBack={regresar}
      onContinuar={continuar}
      tituloModulo={modulo?.nombre ?? "Entrevista"}
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
