import { supabase } from "@/lib/supabase";
import {
  ModuloEntrevista,
  OpcionEntrevista,
  PreguntaEntrevista,
  SegmentoEdad,
} from "@/types/entrevista";

// CALCULAR EDAD
export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// DETERMINAR SEGMENTO DE EDAD
export function determinarSegmentoEdad(fechaNacimiento: string): SegmentoEdad {
  const edad = calcularEdad(fechaNacimiento);
  if (edad >= 6 && edad <= 11) return "nino";
  if (edad >= 12 && edad <= 17) return "adolescente";
  if (edad >= 18) return "adulto";

  throw new Error("La edad del usuario no corresponde a los segmentos disponibles.");
}

// OBTENER UN MÓDULO CON SUS PREGUNTAS Y OPCIONES
export async function obtenerModuloConPreguntas(
  idPlantilla: string,
  codigoModulo: string,
  segmentoEdad: SegmentoEdad
): Promise<ModuloEntrevista> {
  // 1. OBTENER MÓDULO
  const { data: modulo, error: errorModulo } = await supabase
    .from("modulo_entrevista")
    .select("id_modulo, id_plantilla, codigo, nombre, descripcion, orden, es_condicional, estado")
    .eq("id_plantilla", idPlantilla)
    .eq("codigo", codigoModulo)
    .eq("estado", "activo")
    .single();

  if (errorModulo) {
    console.error(`Error obteniendo módulo ${codigoModulo}:`, errorModulo);
    throw new Error(`No se pudo cargar el módulo ${codigoModulo}.`);
  }

  // 2. OBTENER PREGUNTAS
  const { data: preguntas, error: errorPreguntas } = await supabase
    .from("pregunta_entrevista")
    .select("id_pregunta, id_modulo, codigo, enunciado, tipo_pregunta, segmento_edad, orden_numero, obligatoria, estado")
    .eq("id_modulo", modulo.id_modulo)
    .eq("estado", "activo")
    .in("segmento_edad", ["todos", segmentoEdad])
    .order("orden_numero", { ascending: true });

  if (errorPreguntas) {
    console.error(`Error obteniendo preguntas de ${codigoModulo}:`, errorPreguntas);
    throw new Error("No se pudieron cargar las preguntas.");
  }

  if (!preguntas || preguntas.length === 0) {
    return { ...(modulo as ModuloEntrevista), preguntas: [] };
  }

  // 3. OBTENER OPCIONES
  const idsPreguntas = preguntas.map((pregunta) => pregunta.id_pregunta);
  const { data: opciones, error: errorOpciones } = await supabase
    .from("opcion_entrevista")
    .select("id_opcion, id_pregunta, codigo, descripcion, valor_puntaje, orden, segmento_edad, estado")
    .in("id_pregunta", idsPreguntas)
    .eq("estado", "activo")
    .in("segmento_edad", ["todos", segmentoEdad])
    .order("orden", { ascending: true });

  if (errorOpciones) {
    console.error(`Error obteniendo opciones de ${codigoModulo}:`, errorOpciones);
    throw new Error("No se pudieron cargar las opciones de respuesta.");
  }

  // 4. COMBINAR PREGUNTAS CON SUS OPCIONES
  const preguntasCompletas: PreguntaEntrevista[] = preguntas.map((pregunta) => {
    const opcionesPregunta = (opciones ?? []).filter(
      (opcion) => opcion.id_pregunta === pregunta.id_pregunta
    );
    return {
      ...pregunta,
      opciones: opcionesPregunta as OpcionEntrevista[],
    } as PreguntaEntrevista;
  });

  return {
    ...(modulo as ModuloEntrevista),
    preguntas: preguntasCompletas,
  };
}

// ATAJOS
export async function obtenerPreguntasGenerales(
  idPlantilla: string,
  segmentoEdad: SegmentoEdad
) {
  return obtenerModuloConPreguntas(idPlantilla, "GENERAL", segmentoEdad);
}

export async function obtenerPreguntasSeguridadSalud(
  idPlantilla: string,
  segmentoEdad: SegmentoEdad
) {
  return obtenerModuloConPreguntas(idPlantilla, "SEGURIDAD_SALUD", segmentoEdad);
}