import type { Test } from "@/types/cuestionarios";

export type EtapaCuestionario =
  | "informacion"
  | "subescalas"
  | "preguntas"
  | "baremos"
  | "revision";
export type FiltroEstado = "todos" | "activos" | "inactivos";
export type InfoTestAdmin = Pick<
  Test,
  | "codigo"
  | "nombre"
  | "descripcion"
  | "instrucciones"
  | "poblacion_objetivo"
  | "tipo_aplicacion"
  | "tiene_subescalas"
  | "version"
>;