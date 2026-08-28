import { supabase } from "@/lib/supabase";
import {
  GuardarRespuestaInput,
  RespuestaEntrevistaGuardada,
} from "@/types/entrevista";

// VALIDAR RESPUESTA
function validarRespuesta(input: GuardarRespuestaInput) {
  const { tipoPregunta, idOpciones = [], texto, valorNumerico } = input;

  if (tipoPregunta === "opcion_unica" && idOpciones.length !== 1) {
    throw new Error("Debe seleccionar una opción.");
  }
  if (tipoPregunta === "opcion_multiple" && idOpciones.length === 0) {
    throw new Error("Debe seleccionar al menos una opción.");
  }
  if (tipoPregunta === "texto" && !texto?.trim()) {
    throw new Error("Debe escribir una respuesta.");
  }
  if (
    tipoPregunta === "numero" &&
    (valorNumerico === null || valorNumerico === undefined || Number.isNaN(Number(valorNumerico)))
  ) {
    throw new Error("Debe ingresar un valor válido.");
  }
  if (
    tipoPregunta === "escala" &&
    idOpciones.length === 0 &&
    (valorNumerico === null || valorNumerico === undefined)
  ) {
    throw new Error("Debe seleccionar una respuesta.");
  }
}

// GUARDAR / ACTUALIZAR RESPUESTA
export async function guardarRespuesta(
  input: GuardarRespuestaInput
): Promise<RespuestaEntrevistaGuardada> {
  validarRespuesta(input);

  const { idEntrevista, idPregunta, tipoPregunta, idOpciones = [], texto, valorNumerico } = input;

  let textoRespuesta: string | null = null;
  let numeroRespuesta: number | null = null;

  if (tipoPregunta === "texto") textoRespuesta = texto?.trim() ?? null;
  if (tipoPregunta === "numero") numeroRespuesta = valorNumerico ?? null;
  if (tipoPregunta === "escala" && valorNumerico !== undefined) numeroRespuesta = valorNumerico ?? null;

  const { data: respuesta, error: errorRespuesta } = await supabase
    .from("respuesta_entrevista")
    .upsert(
      {
        id_entrevista: idEntrevista,
        id_pregunta: idPregunta,
        texto_respuesta: textoRespuesta,
        valor_numerico: numeroRespuesta,
      },
      { onConflict: "id_entrevista,id_pregunta" }
    )
    .select("id_respuesta, id_entrevista, id_pregunta, texto_respuesta, valor_numerico, fecha_respuesta, fecha_actualizacion")
    .single();

  if (errorRespuesta) {
    console.error("Error guardando respuesta:", errorRespuesta);
    throw new Error("No se pudo guardar la respuesta.");
  }

  const { error: errorEliminarOpciones } = await supabase
    .from("respuesta_opcion_entrevista")
    .delete()
    .eq("id_respuesta", respuesta.id_respuesta);

  if (errorEliminarOpciones) {
    console.error("Error eliminando opciones anteriores:", errorEliminarOpciones);
    throw new Error("No se pudo actualizar la respuesta.");
  }

  if (idOpciones.length > 0) {
    const filas = idOpciones.map((idOpcion) => ({
      id_respuesta: respuesta.id_respuesta,
      id_opcion: idOpcion,
    }));

    const { error: errorOpciones } = await supabase
      .from("respuesta_opcion_entrevista")
      .insert(filas);

    if (errorOpciones) {
      console.error("Error guardando opciones:", errorOpciones);
      throw new Error("No se pudo guardar la opción seleccionada.");
    }
  }

  return {
    ...respuesta,
    opcionesSeleccionadas: idOpciones,
  } as RespuestaEntrevistaGuardada;
}

// OBTENER TODAS LAS RESPUESTAS DE UNA ENTREVISTA
export async function obtenerRespuestasEntrevista(
  idEntrevista: string
): Promise<RespuestaEntrevistaGuardada[]> {
  const { data: respuestas, error: errorRespuestas } = await supabase
    .from("respuesta_entrevista")
    .select("id_respuesta, id_entrevista, id_pregunta, texto_respuesta, valor_numerico, fecha_respuesta, fecha_actualizacion")
    .eq("id_entrevista", idEntrevista)
    .order("fecha_respuesta", { ascending: true });

  if (errorRespuestas) {
    console.error("Error obteniendo respuestas:", errorRespuestas);
    throw new Error("No se pudieron recuperar las respuestas.");
  }

  if (!respuestas || respuestas.length === 0) return [];

  const idsRespuestas = respuestas.map((r) => r.id_respuesta);
  const { data: opciones, error: errorOpciones } = await supabase
    .from("respuesta_opcion_entrevista")
    .select("id_respuesta, id_opcion")
    .in("id_respuesta", idsRespuestas);

  if (errorOpciones) {
    console.error("Error recuperando opciones:", errorOpciones);
    throw new Error("No se pudieron recuperar las opciones seleccionadas.");
  }

  return respuestas.map((respuesta) => {
    const opcionesSeleccionadas = (opciones ?? [])
      .filter((opcion) => opcion.id_respuesta === respuesta.id_respuesta)
      .map((opcion) => opcion.id_opcion);

    return {
      ...respuesta,
      opcionesSeleccionadas,
    } as RespuestaEntrevistaGuardada;
  });
}

// BUSCAR RESPUESTA DE UNA PREGUNTA
export async function obtenerRespuestaPregunta(
  idEntrevista: string,
  idPregunta: string
): Promise<RespuestaEntrevistaGuardada | null> {
  const respuestas = await obtenerRespuestasEntrevista(idEntrevista);
  return respuestas.find((respuesta) => respuesta.id_pregunta === idPregunta) ?? null;
}

// ELIMINAR UNA RESPUESTA
export async function eliminarRespuesta(
  idEntrevista: string,
  idPregunta: string
): Promise<void> {
  const { error } = await supabase
    .from("respuesta_entrevista")
    .delete()
    .eq("id_entrevista", idEntrevista)
    .eq("id_pregunta", idPregunta);

  if (error) {
    console.error("Error eliminando respuesta:", error);
    throw new Error("No se pudo eliminar la respuesta.");
  }
}