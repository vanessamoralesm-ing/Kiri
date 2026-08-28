// types/entrevista.ts

// TIPOS GENERALES DE LA ENTREVISTA DE KIRI
export type SegmentoEdad = "todos" | "nino" | "adolescente" | "adulto";
export type TipoPregunta = "opcion_unica" | "opcion_multiple" | "texto" | "numero" | "escala";
export type EstadoEntrevista = "en_progreso" | "completada" | "abandonada";
export type EstadoModulo = "pendiente" | "en_progreso" | "completado" | "omitido";
export type CodigoModuloAdaptativo = "SOMATICO" | "ANSIEDAD_INSOMNIO" | "SUENO" | "APOYO_SOCIAL" | "VIDA_DIARIA" | "ESTADO_EMOCIONAL";

// PLANTILLA
export interface PlantillaEntrevista {
  id_plantilla: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  edad_minima: number;
  edad_maxima: number | null;
  version: string;
  estado: string;
  fecha_creacion?: string;
}

// MÓDULO
export interface ModuloEntrevista {
  id_modulo: string;
  id_plantilla: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  es_condicional: boolean;
  estado: string;
  preguntas?: PreguntaEntrevista[];
}

// PREGUNTA
export interface PreguntaEntrevista {
  id_pregunta: string;
  id_modulo: string;
  codigo: string;
  enunciado: string;
  tipo_pregunta: TipoPregunta;
  segmento_edad?: SegmentoEdad | string;
  orden_numero: number;
  obligatoria: boolean;
  estado: string;
  opciones: OpcionEntrevista[];
}

// OPCIONES
export interface OpcionEntrevista {
  id_opcion: string;
  id_pregunta: string;
  codigo: string;
  descripcion: string;
  valor_puntaje?: number | null;
  orden: number;
  segmento_edad?: SegmentoEdad | string;
  estado: string;
}

// ENTREVISTA REALIZADA
export interface EntrevistaRealizada {
  id_entrevista: string;
  id_usuario: string;
  id_plantilla: string;
  estado: EstadoEntrevista;
  fecha_inicio: string;
  fecha_fin: string | null;
  fecha_actualizacion: string;
}

// MÓDULO REALIZADO
export interface ModuloEntrevistaRealizado {
  id_modulo_realizado: string;
  id_entrevista: string;
  id_modulo: string;
  orden_ejecucion: number | null;
  estado: EstadoModulo;
  fecha_activacion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  modulo?: ModuloEntrevista;
}

export interface ModuloRealizadoConDatos extends ModuloEntrevistaRealizado {
  modulo: ModuloEntrevista;
}

export interface NuevoModuloRealizado {
  id_entrevista: string;
  id_modulo: string;
  orden_ejecucion: number;
  estado: EstadoModulo;
  fecha_activacion: string;
}

// GUARDAR UNA RESPUESTA
export interface GuardarRespuestaInput {
  idEntrevista: string;
  idPregunta: string;
  tipoPregunta: TipoPregunta;
  idOpciones?: string[];
  texto?: string | null;
  valorNumerico?: number | null;
}

// RESPUESTA RECUPERADA DE SUPABASE
export interface RespuestaEntrevistaGuardada {
  id_respuesta: string;
  id_entrevista: string;
  id_pregunta: string;
  texto_respuesta: string | null;
  valor_numerico: number | null;
  fecha_respuesta?: string;
  fecha_actualizacion?: string;
  opcionesSeleccionadas: string[];
}

// MAPA DE RESPUESTAS
export type MapaRespuestas = Record<string, RespuestaEntrevistaGuardada>;

// RESULTADOS
export interface ResultadoEntrevista {
  id_resultado: string;
  id_entrevista: string;
  id_modulo: string;
  puntaje: number | null;
  porcentaje: number | null;
  nivel: string | null;
  interpretacion: string | null;
  fecha_calculo: string;
}

// ESTADO INICIAL DESPUÉS DEL LOGIN
export type SituacionEntrevista = "sin_entrevista" | "en_progreso" | "completada";

export interface EstadoInicialEntrevista {
  situacion: SituacionEntrevista;
  plantilla: PlantillaEntrevista;
  entrevista: EntrevistaRealizada | null;
}

// MOTOR ADAPTATIVO
export interface ResultadoMotorAdaptativo {
  modulosActivados: CodigoModuloAdaptativo[];
  razones: Record<CodigoModuloAdaptativo, string[]>;
  siguienteModulo: string | null;
}

// EVALUACIÓN DE RIESGO
export interface SenalRiesgo {
  pregunta: "D4" | "D5";
  codigoOpcion: string;
  descripcion: string;
}

export interface ResultadoEvaluacionRiesgo {
  requiereEvaluacionRiesgo: boolean;
  senales: SenalRiesgo[];
  respuestas: {
    D4: string | null;
    D5: string | null;
  };
}

export interface PreguntaRiesgoDB {
  id_pregunta: string;
  codigo: string;
  enunciado: string;
}

export interface OpcionRiesgoDB {
  id_opcion: string;
  id_pregunta: string;
  codigo: string;
  descripcion: string;
}