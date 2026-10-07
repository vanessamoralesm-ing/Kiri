import React from "react";
import { Text, View } from "react-native";

import Input from "@/components/ui/Input";

export interface UsuarioRoleValues {
  codigoEstudiante: string;
  codigoDocente: string;
  profesion: string;
  especialidadDocente: string;
  codigoPsicologo: string;
  licenciaProfesional: string;
  especialidadPsicologo: string;
}

interface Props {
  rol: string;
  values: UsuarioRoleValues;
  disabled?: boolean;
  onChange: <K extends keyof UsuarioRoleValues>(
    campo: K,
    value: UsuarioRoleValues[K],
  ) => void;
}

type RoleField = {
  campo: keyof UsuarioRoleValues;
  label: string;
  placeholder?: string;
};
type RoleDefinition = { title: string; fields: RoleField[] };

const roleFields: Record<string, RoleDefinition> = {
  estudiante: {
    title: "Datos del estudiante",
    fields: [
      {
        campo: "codigoEstudiante",
        label: "Código de estudiante",
        placeholder: "Código institucional",
      },
    ],
  },
  docente: {
    title: "Datos del docente",
    fields: [
      {
        campo: "codigoDocente",
        label: "Código de docente",
        placeholder: "Código institucional",
      },
      { campo: "profesion", label: "Profesión" },
      { campo: "especialidadDocente", label: "Especialidad" },
    ],
  },
  psicologo: {
    title: "Datos del psicólogo",
    fields: [
      {
        campo: "codigoPsicologo",
        label: "Código de psicólogo",
        placeholder: "Código institucional",
      },
      { campo: "licenciaProfesional", label: "Licencia profesional" },
      { campo: "especialidadPsicologo", label: "Especialidad" },
    ],
  },
};

export function normalizarRol(nombre?: string) {
  return (nombre ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

export default function UsuarioRoleFields({
  rol,
  values,
  disabled,
  onChange,
}: Props) {
  const clave = normalizarRol(rol).replace(
    /^psicologo_institucional$/,
    "psicologo",
  );
  const definition = Object.hasOwn(roleFields, clave)
    ? roleFields[clave]
    : undefined;
  if (!definition) return null;

  return (
    <View className="mt-5 rounded-3xl border border-border bg-surface p-4 md:p-6">
      <Text className="mb-5 font-nunito-bold text-lg text-text">
        {definition.title}
      </Text>
      {definition.fields.map(({ campo, label, placeholder = label }) => (
        <Input
          key={campo}
          label={label}
          placeholder={placeholder}
          value={values[campo]}
          editable={!disabled}
          onChangeText={(value) => onChange(campo, value)}
        />
      ))}
    </View>
  );
}
