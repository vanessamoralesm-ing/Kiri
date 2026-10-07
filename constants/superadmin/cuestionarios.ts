import { Ionicons } from "@expo/vector-icons";

import type {
  EtapaCuestionario,
  FiltroEstado,
} from "@/types/superadmin/cuestionarios";

export const ETAPAS_CUESTIONARIO: {
  id: EtapaCuestionario;
  nombre: string;
  icono: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "informacion", nombre: "Información", icono: "document-text-outline" },
  { id: "subescalas", nombre: "Subescalas", icono: "layers-outline" },
  { id: "preguntas", nombre: "Preguntas y opciones", icono: "help-circle-outline" },
  { id: "baremos", nombre: "Baremos", icono: "analytics-outline" },
  { id: "revision", nombre: "Revisión", icono: "checkmark-circle-outline" },
];

export const TIPOS_CON_OPCIONES = [
  "opcion_unica",
  "opcion_multiple",
  "escala",
] as const;

export const FILTROS_ESTADO_CUESTIONARIO: {
  value: FiltroEstado;
  label: string;
}[] = [
  { value: "todos", label: "Todos" },
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" },
];

export const RESUMEN_CUESTIONARIOS = [
  {
    clave: "total",
    titulo: "Cuestionarios",
    icono: "clipboard-outline",
    descripcion: "Total registrados en el sistema",
  },
  {
    clave: "activos",
    titulo: "Activos",
    icono: "checkmark-circle-outline",
    descripcion: "Disponibles para los usuarios",
    variante: "success",
  },
  {
    clave: "inactivos",
    titulo: "Inactivos",
    icono: "pause-circle-outline",
    descripcion: "No visibles para los usuarios",
    variante: "neutral",
  },
] as const;