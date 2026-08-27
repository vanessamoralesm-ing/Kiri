  import React, { useEffect, useMemo, useState } from "react";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";
  import { useAuth } from "@/services/authProvider";
  import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";
  import { determinarSegmentoEdad, obtenerPreguntasSeguridadSalud } from "@/services/entrevista/preguntaService";
  import { eliminarRespuesta, obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";
  import { completarModulo, iniciarModulo } from "@/services/entrevista/moduloService";
  import { ejecutarMotorAdaptativo } from "@/services/entrevista/motorAdaptativo";
  import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";
  import { respuestaEstaCompleta } from "@/utils/entrevistaHelpers";
  import { ModuloEntrevista, PreguntaEntrevista, MapaRespuestas } from "@/types/entrevista";

  export default function SeguridadSaludScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id: string }>();
    const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;
    const { profile, loading: authLoading } = useAuth();

    const [modulo, setModulo] = useState<ModuloEntrevista | null>(null);
    const [preguntas, setPreguntas] = useState<PreguntaEntrevista[]>([]);
    const [mapaRespuestas, setMapaRespuestas] = useState<MapaRespuestas>({});
    const [idPreguntaActual, setIdPreguntaActual] = useState<string | null>(null);
    const [cargando, setCargando] = useState(true);
    const [errorPantalla, setErrorPantalla] = useState<string | null>(null);

    function obtenerCodigo(preg: PreguntaEntrevista, idOp?: string) {
      return preg.opciones.find((o) => o.id_opcion === idOp)?.codigo ?? null;
    }

    const preguntasVisibles = useMemo(() => {
      return preguntas.filter((p) => {
        if (p.codigo === "SS1A") {
          const padre = preguntas.find((item) => item.codigo === "SS1");
          return padre ? obtenerCodigo(padre, mapaRespuestas[padre.id_pregunta]?.opcionesSeleccionadas?.[0]) === "SI" : false;
        }
        if (p.codigo === "SS3A") {
          const padre = preguntas.find((item) => item.codigo === "SS3");
          return padre ? obtenerCodigo(padre, mapaRespuestas[padre.id_pregunta]?.opcionesSeleccionadas?.[0]) === "TODOS_LOS_DIAS" : false;
        }
        return true;
      });
    }, [preguntas, mapaRespuestas]);

    const preguntaActual = preguntasVisibles.find((p) => p.id_pregunta === idPreguntaActual) ?? preguntasVisibles[0];
    const indiceActual = preguntaActual ? preguntasVisibles.findIndex((p) => p.id_pregunta === preguntaActual.id_pregunta) : -1;

    const form = useEntrevistaFormulario({
      idEntrevista,
      preguntaActual,
      mapaRespuestas,
      setMapaRespuestas,
      onRespuestaGuardada: async (pregGuardada, respGuardada, nuevoMapa) => {
        if (pregGuardada.codigo === "SS1" && obtenerCodigo(pregGuardada, respGuardada.opcionesSeleccionadas[0]) !== "SI") {
          const h = preguntas.find((i) => i.codigo === "SS1A");
          if (h && nuevoMapa[h.id_pregunta]) {
            await eliminarRespuesta(idEntrevista, h.id_pregunta);
            delete nuevoMapa[h.id_pregunta];
          }
        }
        if (pregGuardada.codigo === "SS3" && obtenerCodigo(pregGuardada, respGuardada.opcionesSeleccionadas[0]) !== "TODOS_LOS_DIAS") {
          const h = preguntas.find((i) => i.codigo === "SS3A");
          if (h && nuevoMapa[h.id_pregunta]) {
            await eliminarRespuesta(idEntrevista, h.id_pregunta);
            delete nuevoMapa[h.id_pregunta];
          }
        }
      },
    });

    useEffect(() => {
      if (authLoading || !profile) return;
      cargar();
    }, [authLoading, profile, idEntrevista]);

    async function cargar() {
      if (!idEntrevista || !profile?.fecha_nacimiento) return;
      try {
        setCargando(true);
        setErrorPantalla(null);
        const entrevista = await obtenerEntrevistaPorId(idEntrevista);
        const segmento = determinarSegmentoEdad(profile.fecha_nacimiento);
        const mod = await obtenerPreguntasSeguridadSalud(entrevista.id_plantilla, segmento);
        const preguntasMod = mod.preguntas ?? [];
        if (!preguntasMod.length) throw new Error("No hay preguntas disponibles.");

        await iniciarModulo(idEntrevista, "SEGURIDAD_SALUD");
        const resps = await obtenerRespuestasEntrevista(idEntrevista);
        const mapa: MapaRespuestas = {};
        resps.forEach((r) => { mapa[r.id_pregunta] = r; });

        setModulo(mod);
        setPreguntas(preguntasMod);
        setMapaRespuestas(mapa);

        const visibles = preguntasMod.filter((p) => p.codigo !== "SS1A" && p.codigo !== "SS3A");
        const primeraPendiente = visibles.find((p) => !respuestaEstaCompleta(p, mapa[p.id_pregunta])) ?? visibles[0];
        setIdPreguntaActual(primeraPendiente.id_pregunta);
        form.cargarRespuestaEnFormulario(mapa[primeraPendiente.id_pregunta]);
      } catch (err) {
        setErrorPantalla(err instanceof Error ? err.message : "Error al cargar.");
      } finally {
        setCargando(false);
      }
    }

    async function continuar() {
      const nuevoMapa = await form.ejecutarGuardado();
      if (!nuevoMapa) return;

      const nuevasVisibles = preguntas.filter((p) => {
        if (p.codigo === "SS1A") {
          const padre = preguntas.find((item) => item.codigo === "SS1");
          return padre ? obtenerCodigo(padre, nuevoMapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0]) === "SI" : false;
        }
        if (p.codigo === "SS3A") {
          const padre = preguntas.find((item) => item.codigo === "SS3");
          return padre ? obtenerCodigo(padre, nuevoMapa[padre.id_pregunta]?.opcionesSeleccionadas?.[0]) === "TODOS_LOS_DIAS" : false;
        }
        return true;
      });

      const pos = nuevasVisibles.findIndex((p) => p.id_pregunta === preguntaActual.id_pregunta);
      const prox = nuevasVisibles[pos + 1];

      if (prox) {
        setIdPreguntaActual(prox.id_pregunta);
        form.cargarRespuestaEnFormulario(nuevoMapa[prox.id_pregunta]);
        return;
      }

      await completarModulo(idEntrevista, "SEGURIDAD_SALUD");
      const segmento = determinarSegmentoEdad(profile!.fecha_nacimiento!);
      const motor = await ejecutarMotorAdaptativo(idEntrevista, segmento);

      if (motor.siguienteModulo) {
        router.replace({
          pathname: "/(entrevista)/jovenes-adultos/[id]/modulo/[codigo]",
          params: { id: idEntrevista, codigo: motor.siguienteModulo },
        });
        return;
      }

      router.replace({
        pathname: "/(entrevista)/jovenes-adultos/[id]/procesando",
        params: { id: idEntrevista },
      });
    }

    function regresar() {
      if (form.guardando || !preguntaActual) return;
      const pos = preguntasVisibles.findIndex((p) => p.id_pregunta === preguntaActual.id_pregunta);
      if (pos > 0) {
        const prev = preguntasVisibles[pos - 1];
        setIdPreguntaActual(prev.id_pregunta);
        form.cargarRespuestaEnFormulario(mapaRespuestas[prev.id_pregunta]);
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