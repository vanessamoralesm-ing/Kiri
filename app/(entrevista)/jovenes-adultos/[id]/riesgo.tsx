import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import EntrevistaPantallaBase from "@/components/entrevista/EntrevistaPantallaBase";
import { useAuth } from "@/services/authProvider";
import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";
import { determinarSegmentoEdad, obtenerModuloConPreguntas } from "@/services/entrevista/preguntaService";
import { obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";
import { iniciarModulo, completarModulo } from "@/services/entrevista/moduloService";
import { useEntrevistaFormulario } from "@/hooks/useEntrevistaFormulario";
import { respuestaEstaCompleta } from "@/utils/entrevistaHelpers";
import { ModuloEntrevista, PreguntaEntrevista, MapaRespuestas } from "@/types/entrevista";

export default function RiesgoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;
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
      const mod = await obtenerModuloConPreguntas(entrevista.id_plantilla, "RIESGO", segmento);
      const preguntasMod = mod.preguntas ?? [];
      if (!preguntasMod.length) throw new Error("No hay preguntas de seguridad configuradas.");

      await iniciarModulo(idEntrevista, "RIESGO");
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
      setErrorPantalla(err instanceof Error ? err.message : "Error al cargar sección de riesgo.");
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

    await completarModulo(idEntrevista, "RIESGO");
    router.replace({
      pathname: "/(entrevista)/jovenes-adultos/[id]/procesando",
      params: { id: idEntrevista },
    });
  }

  function regresar() {
    if (form.guardando) return;
    if (indiceActual > 0) {
      const prev = indiceActual - 1;
      setIndiceActual(prev);
      form.cargarRespuestaEnFormulario(mapaRespuestas[preguntas[prev].id_pregunta]);
      return;
    }
    router.replace({
      pathname: "/(entrevista)/jovenes-adultos/[id]/modulo/[codigo]",
      params: { id: idEntrevista, codigo: "ESTADO_EMOCIONAL" },
    });
  }

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
      headerBanner={
        <View style={styles.aviso}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#557FD8" />
          <Text style={styles.textoAviso}>
            Queremos hacer unas preguntas adicionales para orientarte de forma más segura. Responde según cómo te sientes actualmente.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  aviso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#EDF3FF",
  },
  textoAviso: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#53627C",
    fontFamily: "Nunito-SemiBold",
  },
});