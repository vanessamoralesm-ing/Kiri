import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";

interface Props {
  rol?: string | null;
}

export default function UsuarioRoleBadge({ rol }: Props) {
  const nombre = rol ?? "Sin rol";

  const clave = nombre
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const estilos =
    {
      superadministrador: {
        fondo: "bg-primary-soft",
        texto: "text-primary",
      },

      administrador_institucional: {
        fondo: "bg-accent-soft",
        texto: "text-accent",
      },

      psicologo_institucional: {
        fondo: "bg-secondary-soft",
        texto: "text-secondary",
      },

      docente: {
        fondo: "bg-primary-soft",
        texto: "text-info",
      },

      estudiante: {
        fondo: "bg-surface-secondary",
        texto: "text-warning",
      },

      independiente: {
        fondo: "bg-surface-secondary",
        texto: "text-text-secondary",
      },
    }[clave] ?? {
      fondo: "bg-surface-secondary",
      texto: "text-text-secondary",
    };

  return (
    <View
      className={cn(
        "self-start rounded-full px-3 py-1.5",
        estilos.fondo,
      )}
    >
      <Text
        className={cn(
          "font-nunito-semibold text-xs",
          estilos.texto,
        )}
      >
        {nombre.replaceAll("_", " ")}
      </Text>
    </View>
  );
}