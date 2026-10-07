import type { ThemePreference } from "@/contexts/ThemeModeContext";

export const CAMPOS_PERFIL = [
  { key: "nombres", label: "Nombres *" },
  { key: "apellidos", label: "Apellidos *" },
  { key: "nombre_preferido", label: "Nombre preferido" },
  { key: "telefono", label: "Teléfono (8 dígitos)" },
] as const;

export const TEMAS = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
] satisfies readonly { value: ThemePreference; label: string }[];