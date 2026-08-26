import { obtenerEntrevistaPorId } from "@/services/entrevista/entrevistaService";
import { obtenerPreguntasGenerales } from "@/services/entrevista/preguntaService";
import { obtenerRespuestasEntrevista } from "@/services/entrevista/respuestaService";
import { activarModulos, obtenerSiguienteModulo } from "@/services/entrevista/moduloService";
import {
  CodigoModuloAdaptativo,
  MapaRespuestas,
  PreguntaEntrevista,
  ResultadoMotorAdaptativo,
  RespuestaEntrevistaGuardada,
  SegmentoEdad,
} from "@/types/entrevista";

const ORDEN_MODULOS: CodigoModuloAdaptativo[] = [
  "SOMATICO",
  "ANSIEDAD_INSOMNIO",
  "SUENO",
  "APOYO_SOCIAL",
  "VIDA_DIARIA",
  "ESTADO_EMOCIONAL",
];

function normalizarCodigo(codigo?: string | null): string {
  return codigo?.trim().toUpperCase().replace(/\s+/g, "_") ?? "";
}

function codigoEs(codigo: string | null, valores: string[]): boolean {
  const codigoNormalizado = normalizarCodigo(codigo);
  if (!codigoNormalizado) return false;
  return valores.some((valor) => normalizarCodigo(valor) === codigoNormalizado);
}

function codigoContiene(codigo: string | null, fragmentos: string[]): boolean {
  const codigoNormalizado = normalizarCodigo(codigo);
  if (!codigoNormalizado) return false;
  return fragmentos.some((fragmento) => codigoNormalizado.includes(normalizarCodigo(fragmento)));
}

function crearMapaRespuestas(respuestas: RespuestaEntrevistaGuardada[]): MapaRespuestas {
  const mapa: MapaRespuestas = {};
  respuestas.forEach((respuesta) => {
    mapa[respuesta.id_pregunta] = respuesta;
  });
  return mapa;
}

function obtenerCodigoRespuesta(
  codigoPregunta: string,
  preguntas: PreguntaEntrevista[],
  mapa: MapaRespuestas
): string | null {
  const pregunta = preguntas.find(
    (item) => normalizarCodigo(item.codigo) === normalizarCodigo(codigoPregunta)
  );
  if (!pregunta) return null;

  const respuesta = mapa[pregunta.id_pregunta];
  if (!respuesta) return null;

  const idOpcion = respuesta.opcionesSeleccionadas?.[0];
  if (!idOpcion) return null;

  const opcion = pregunta.opciones.find((item) => item.id_opcion === idOpcion);
  return opcion?.codigo ?? null;
}

export async function determinarModulosAdaptativos(
  idEntrevista: string,
  segmento: SegmentoEdad
): Promise<{
  modulos: CodigoModuloAdaptativo[];
  razones: Record<CodigoModuloAdaptativo, string[]>;
}> {
  if (!idEntrevista) {
    throw new Error("No se recibió el identificador de la entrevista.");
  }

  if (segmento === "nino") {
    throw new Error("Este motor corresponde únicamente a jóvenes y adultos.");
  }

  const entrevista = await obtenerEntrevistaPorId(idEntrevista);
  const moduloGeneral = await obtenerPreguntasGenerales(entrevista.id_plantilla, segmento);
  const preguntas = moduloGeneral.preguntas ?? [];

  if (preguntas.length === 0) {
    throw new Error("No se encontraron las preguntas generales.");
  }

  const respuestas = await obtenerRespuestasEntrevista(idEntrevista);
  const mapa = crearMapaRespuestas(respuestas);

  const g1 = obtenerCodigoRespuesta("G1", preguntas, mapa);
  const g2 = obtenerCodigoRespuesta("G2", preguntas, mapa);
  const g3 = obtenerCodigoRespuesta("G3", preguntas, mapa);
  const g4 = obtenerCodigoRespuesta("G4", preguntas, mapa);
  const g5 = obtenerCodigoRespuesta("G5", preguntas, mapa);
  const g6 = obtenerCodigoRespuesta("G6", preguntas, mapa);

  console.log("Motor adaptativo - respuestas generales:", { G1: g1, G2: g2, G3: g3, G4: g4, G5: g5, G6: g6 });

  const bienestarBajo = codigoEs(g1, ["MAL", "MUY_MAL"]);
  const suenoBajo = codigoEs(g3, ["MAL", "MUY_MAL"]);
  const estresFrecuente = codigoEs(g4, ["FRECUENTEMENTE", "MUCHAS_VECES", "CASI_SIEMPRE", "SIEMPRE", "TODOS_LOS_DIAS"]);
  const energiaBaja = codigoEs(g5, ["BAJA", "MUY_BAJA"]);
  const energiaMuyBaja = codigoEs(g5, ["MUY_BAJA"]);
  const apoyoBajo = codigoEs(g6, ["NUNCA", "CASI_NUNCA", "POCAS_VECES", "MUY_POCAS_VECES"]);

  const areaSalud = codigoContiene(g2, ["SALUD"]);
  const areaTrabajoEstudio = codigoContiene(g2, ["TRABAJO", "ESTUDIO", "ESCUELA"]);

  const modulos = new Set<CodigoModuloAdaptativo>();
  const razones: Record<CodigoModuloAdaptativo, string[]> = {
    SOMATICO: [],
    ANSIEDAD_INSOMNIO: [],
    SUENO: [],
    APOYO_SOCIAL: [],
    VIDA_DIARIA: [],
    ESTADO_EMOCIONAL: [],
  };

  if (areaSalud) {
    modulos.add("SOMATICO");
    razones.SOMATICO.push("La salud fue identificada como un área relevante.");
  }
  if (energiaBaja) {
    modulos.add("SOMATICO");
    razones.SOMATICO.push("Se identificó energía baja.");
  }

  if (estresFrecuente) {
    modulos.add("ANSIEDAD_INSOMNIO");
    razones.ANSIEDAD_INSOMNIO.push("Se identificó estrés o preocupación frecuente.");
  }
  if (suenoBajo) {
    modulos.add("ANSIEDAD_INSOMNIO");
    razones.ANSIEDAD_INSOMNIO.push("Se identificaron dificultades relacionadas con el sueño.");
  }
  if (energiaBaja) {
    modulos.add("ANSIEDAD_INSOMNIO");
    razones.ANSIEDAD_INSOMNIO.push("Se identificó cansancio o energía baja.");
  }

  if (suenoBajo) {
    modulos.add("SUENO");
    razones.SUENO.push("El usuario indicó dificultades con el sueño.");
  }

  if (apoyoBajo) {
    modulos.add("APOYO_SOCIAL");
    razones.APOYO_SOCIAL.push("Se identificó poca disponibilidad de apoyo.");
  }

  if (bienestarBajo && areaTrabajoEstudio) {
    modulos.add("VIDA_DIARIA");
    razones.VIDA_DIARIA.push("Se identificó bienestar bajo junto con afectación en trabajo o estudios.");
  }

  if (bienestarBajo) {
    modulos.add("ESTADO_EMOCIONAL");
    razones.ESTADO_EMOCIONAL.push("Se identificó bienestar emocional bajo.");
  }
  if (energiaMuyBaja) {
    modulos.add("ESTADO_EMOCIONAL");
    razones.ESTADO_EMOCIONAL.push("Se identificó un nivel muy bajo de energía.");
  }

  const modulosOrdenados = ORDEN_MODULOS.filter((codigo) => modulos.has(codigo));

  console.log("Motor adaptativo - módulos determinados:", modulosOrdenados);
  console.log("Motor adaptativo - razones:", razones);

  return {
    modulos: modulosOrdenados,
    razones,
  };
}

export async function ejecutarMotorAdaptativo(
  idEntrevista: string,
  segmento: SegmentoEdad
): Promise<ResultadoMotorAdaptativo> {
  const resultado = await determinarModulosAdaptativos(idEntrevista, segmento);

  if (resultado.modulos.length > 0) {
    await activarModulos(idEntrevista, resultado.modulos);
  }

  const siguiente = await obtenerSiguienteModulo(idEntrevista);

  return {
    modulosActivados: resultado.modulos,
    razones: resultado.razones,
    siguienteModulo: siguiente?.modulo?.codigo ?? null,
  };
}