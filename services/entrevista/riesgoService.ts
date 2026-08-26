import { supabase } from "@/lib/supabase";
import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";
import { obtenerModuloPorCodigo } from "@/services/entrevista/moduloService";
import { obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";
import {
  OpcionRiesgoDB,
  PreguntaRiesgoDB,
  ResultadoEvaluacionRiesgo,
  RespuestaEntrevistaGuardada,
  SenalRiesgo,
} from "@/types/entrevista";

export { SenalRiesgo, ResultadoEvaluacionRiesgo };

function normalizarCodigo(codigo?: string | null): string {
  return codigo?.trim().toUpperCase().replace(/\s+/g, "_") ?? "";
}

const OPCIONES_D4_SEGUIMIENTO = new Set<string>([
  "NO_MAS_HABITUAL",
  "BASTANTE_MAS_HABITUAL",
  "MUCHO_MAS_HABITUAL",
]);

const OPCIONES_D5_SEGUIMIENTO = new Set<string>([
  "CRUZADO_POR_MENTE",
  "CLARAMENTE_PENSADO",
]);

function crearMapaRespuestas(respuestas: RespuestaEntrevistaGuardada[]) {
  const mapa = new Map<string, RespuestaEntrevistaGuardada>();
  respuestas.forEach((respuesta) => {
    mapa.set(respuesta.id_pregunta, respuesta);
  });
  return mapa;
}

function obtenerCodigoOpcion(
  opciones: OpcionRiesgoDB[],
  respuesta?: RespuestaEntrevistaGuardada
): { codigo: string | null; descripcion: string | null } {
  const idOpcion = respuesta?.opcionesSeleccionadas?.[0];
  if (!idOpcion) return { codigo: null, descripcion: null };

  const opcion = opciones.find((item) => item.id_opcion === idOpcion);
  if (!opcion) return { codigo: null, descripcion: null };

  return {
    codigo: normalizarCodigo(opcion.codigo),
    descripcion: opcion.descripcion,
  };
}

export async function evaluarRiesgoEntrevista(
  idEntrevista: string
): Promise<ResultadoEvaluacionRiesgo> {
  if (!idEntrevista) {
    throw new Error("No se recibió el identificador de la entrevista.");
  }

  // 1. OBTENER ENTREVISTA
  const entrevista = await obtenerEntrevistaPorId(idEntrevista);

  // 2. OBTENER MÓDULO ESTADO EMOCIONAL
  const moduloEstadoEmocional = await obtenerModuloPorCodigo(
    entrevista.id_plantilla,
    "ESTADO_EMOCIONAL"
  );

  // 3. OBTENER PREGUNTAS D4 Y D5
  const { data: preguntasData, error: errorPreguntas } = await supabase
    .from("pregunta_entrevista")
    .select("id_pregunta, codigo, enunciado")
    .eq("id_modulo", moduloEstadoEmocional.id_modulo)
    .in("codigo", ["D4", "D5"]);

  if (errorPreguntas) {
    console.error("Error obteniendo preguntas de seguridad:", errorPreguntas);
    throw new Error("No se pudieron revisar las respuestas de seguridad.");
  }

  const preguntas = (preguntasData ?? []) as PreguntaRiesgoDB[];
  const preguntaD4 = preguntas.find((p) => p.codigo === "D4");
  const preguntaD5 = preguntas.find((p) => p.codigo === "D5");

  if (!preguntaD4 || !preguntaD5) {
    throw new Error("No se encontraron las preguntas D4 y D5 del módulo Estado Emocional.");
  }

  // 4. OBTENER OPCIONES DE D4 Y D5
  const { data: opcionesData, error: errorOpciones } = await supabase
    .from("opcion_entrevista")
    .select("id_opcion, id_pregunta, codigo, descripcion")
    .in("id_pregunta", [preguntaD4.id_pregunta, preguntaD5.id_pregunta]);

  if (errorOpciones) {
    console.error("Error obteniendo opciones de seguridad:", errorOpciones);
    throw new Error("No se pudieron revisar las opciones de seguridad.");
  }

  const opciones = (opcionesData ?? []) as OpcionRiesgoDB[];

  // 5. OBTENER RESPUESTAS
  const respuestas = await obtenerRespuestasEntrevista(idEntrevista);
  const mapaRespuestas = crearMapaRespuestas(respuestas);

  // 6. EVALUAR D4 Y D5
  const respuestaD4 = mapaRespuestas.get(preguntaD4.id_pregunta);
  const opcionD4 = obtenerCodigoOpcion(opciones, respuestaD4);

  const respuestaD5 = mapaRespuestas.get(preguntaD5.id_pregunta);
  const opcionD5 = obtenerCodigoOpcion(opciones, respuestaD5);

  console.log("Evaluación de seguridad:", {
    D4: opcionD4.codigo,
    D5: opcionD5.codigo,
  });

  // 7. DETECTAR SEÑALES
  const senales: SenalRiesgo[] = [];

  if (opcionD4.codigo && OPCIONES_D4_SEGUIMIENTO.has(opcionD4.codigo)) {
    senales.push({
      pregunta: "D4",
      codigoOpcion: opcionD4.codigo,
      descripcion: opcionD4.descripcion ?? "",
    });
  }

  if (opcionD5.codigo && OPCIONES_D5_SEGUIMIENTO.has(opcionD5.codigo)) {
    senales.push({
      pregunta: "D5",
      codigoOpcion: opcionD5.codigo,
      descripcion: opcionD5.descripcion ?? "",
    });
  }

  const resultado: ResultadoEvaluacionRiesgo = {
    requiereEvaluacionRiesgo: senales.length > 0,
    senales,
    respuestas: {
      D4: opcionD4.codigo,
      D5: opcionD5.codigo,
    },
  };

  console.log("Resultado evaluación de seguridad:", resultado);
  return resultado;
}