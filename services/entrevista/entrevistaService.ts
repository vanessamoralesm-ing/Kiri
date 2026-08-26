import { supabase } from "@/lib/supabase";
import {
  EntrevistaRealizada,
  EstadoInicialEntrevista,
  PlantillaEntrevista,
} from "@/types/entrevista";

export const CODIGO_PLANTILLA_ADULTOS = "BIENESTAR_JOVENES_ADULTOS";

// OBTENER USUARIO AUTENTICADO
async function obtenerUsuarioActual() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("No se pudo obtener el usuario autenticado.");
  if (!data.user) throw new Error("No existe una sesión activa.");
  return data.user;
}

// OBTENER PLANTILLA ACTIVA
export async function obtenerPlantillaActiva(
  codigo: string = CODIGO_PLANTILLA_ADULTOS
): Promise<PlantillaEntrevista> {
  const { data, error } = await supabase
    .from("plantilla_entrevista")
    .select("id_plantilla, codigo, nombre, descripcion, edad_minima, edad_maxima, version, estado, fecha_creacion")
    .eq("codigo", codigo)
    .eq("estado", "activo")
    .single();

  if (error) {
    console.error("Error obteniendo plantilla:", error);
    throw new Error("No se pudo obtener la plantilla de entrevista.");
  }
  return data as PlantillaEntrevista;
}

// OBTENER ENTREVISTA POR ID
export async function obtenerEntrevistaPorId(idEntrevista: string): Promise<EntrevistaRealizada> {
  const user = await obtenerUsuarioActual();
  const { data, error } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .eq("id_entrevista", idEntrevista)
    .eq("id_usuario", user.id)
    .single();

  if (error) {
    console.error("Error obteniendo entrevista:", error);
    throw new Error("No se pudo obtener la entrevista.");
  }
  return data as EntrevistaRealizada;
}

// ESTADO INICIAL DESPUÉS DEL LOGIN
export async function obtenerEstadoInicialEntrevista(
  codigoPlantilla: string = CODIGO_PLANTILLA_ADULTOS
): Promise<EstadoInicialEntrevista> {
  const user = await obtenerUsuarioActual();
  const plantilla = await obtenerPlantillaActiva(codigoPlantilla);

  // 1. Verificar entrevista en progreso
  const { data: entrevistaEnProgreso, error: errorEnProgreso } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .eq("id_usuario", user.id)
    .eq("id_plantilla", plantilla.id_plantilla)
    .eq("estado", "en_progreso")
    .order("fecha_actualizacion", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorEnProgreso) {
    console.error("Error verificando entrevista en progreso:", errorEnProgreso);
    throw new Error("No se pudo verificar el estado de la entrevista.");
  }

  if (entrevistaEnProgreso) {
    return {
      situacion: "en_progreso",
      plantilla,
      entrevista: entrevistaEnProgreso as EntrevistaRealizada,
    };
  }

  // 2. Verificar entrevista completada
  const { data: entrevistaCompletada, error: errorCompletada } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .eq("id_usuario", user.id)
    .eq("id_plantilla", plantilla.id_plantilla)
    .eq("estado", "completada")
    .order("fecha_fin", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorCompletada) {
    console.error("Error verificando entrevista completada:", errorCompletada);
    throw new Error("No se pudo verificar el historial de entrevistas.");
  }

  if (entrevistaCompletada) {
    return {
      situacion: "completada",
      plantilla,
      entrevista: entrevistaCompletada as EntrevistaRealizada,
    };
  }

  return {
    situacion: "sin_entrevista",
    plantilla,
    entrevista: null,
  };
}

// CREAR ENTREVISTA
export async function crearEntrevista(
  codigoPlantilla: string = CODIGO_PLANTILLA_ADULTOS
): Promise<EntrevistaRealizada> {
  const user = await obtenerUsuarioActual();
  const plantilla = await obtenerPlantillaActiva(codigoPlantilla);

  const { data: existente, error: errorExistente } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .eq("id_usuario", user.id)
    .eq("id_plantilla", plantilla.id_plantilla)
    .eq("estado", "en_progreso")
    .order("fecha_actualizacion", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorExistente) {
    console.error("Error verificando entrevista existente:", errorExistente);
    throw new Error("No se pudo verificar la entrevista.");
  }

  if (existente) return existente as EntrevistaRealizada;

  const { data, error } = await supabase
    .from("entrevista_realizada")
    .insert({
      id_usuario: user.id,
      id_plantilla: plantilla.id_plantilla,
      estado: "en_progreso",
    })
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .single();

  if (error) {
    console.error("Error creando entrevista:", error);
    throw new Error("No se pudo iniciar la entrevista.");
  }
  return data as EntrevistaRealizada;
}

// FINALIZAR ENTREVISTA
export async function finalizarEntrevista(idEntrevista: string): Promise<EntrevistaRealizada> {
  const user = await obtenerUsuarioActual();
  const { data, error } = await supabase
    .from("entrevista_realizada")
    .update({
      estado: "completada",
      fecha_fin: new Date().toISOString(),
    })
    .eq("id_entrevista", idEntrevista)
    .eq("id_usuario", user.id)
    .select("id_entrevista, id_usuario, id_plantilla, estado, fecha_inicio, fecha_fin, fecha_actualizacion")
    .single();

  if (error) {
    console.error("Error finalizando entrevista:", error);
    throw new Error("No se pudo finalizar la entrevista.");
  }
  return data as EntrevistaRealizada;
}

// ABANDONAR ENTREVISTA
export async function abandonarEntrevista(idEntrevista: string): Promise<void> {
  const user = await obtenerUsuarioActual();
  const { error } = await supabase
    .from("entrevista_realizada")
    .update({
      estado: "abandonada",
      fecha_fin: new Date().toISOString(),
    })
    .eq("id_entrevista", idEntrevista)
    .eq("id_usuario", user.id);

  if (error) {
    console.error("Error abandonando entrevista:", error);
    throw new Error("No se pudo abandonar la entrevista.");
  }
}