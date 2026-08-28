import { PreguntaEntrevista, RespuestaEntrevistaGuardada } from "@/types/entrevista";

export function normalizarCodigo(codigo?: string | null): string {
  return codigo?.trim().toUpperCase().replace(/\s+/g, "_") ?? "";
}

export function obtenerDescripcionPregunta(pregunta: PreguntaEntrevista): string {
  switch (pregunta.tipo_pregunta) {
    case "texto":
      return "Escribe una respuesta breve. No existen respuestas correctas o incorrectas.";
    case "numero":
      return "Ingresa una cantidad aproximada.";
    case "opcion_multiple":
      return "Puedes seleccionar más de una opción.";
    case "escala":
      return "Selecciona la opción que mejor describa cómo te has sentido.";
    default:
      return "Selecciona la opción que mejor describa tu situación.";
  }
}

export function respuestaEstaCompleta(
  pregunta: PreguntaEntrevista,
  respuesta?: RespuestaEntrevistaGuardada
): boolean {
  if (!respuesta) return false;
  switch (pregunta.tipo_pregunta) {
    case "opcion_unica":
    case "opcion_multiple":
    case "escala":
      return (respuesta.opcionesSeleccionadas ?? []).length > 0;
    case "texto":
      return Boolean(respuesta.texto_respuesta?.trim());
    case "numero":
      return respuesta.valor_numerico !== null && respuesta.valor_numerico !== undefined;
    default:
      return false;
  }
}