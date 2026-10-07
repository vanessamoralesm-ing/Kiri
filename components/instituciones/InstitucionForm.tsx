import React from "react";
import { Text, View } from "react-native";
import Input from "@/components/ui/Input";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import type { useInstitucionForm } from "@/hooks/instituciones/useInstitucionForm";
import { TIPOS_INSTITUCION } from "@/types/instituciones/institucion";
const campos = [
  ["nombre", "Nombre *"],
  ["codigo_institucional", "Código institucional *"],
  ["correo", "Correo"],
  ["telefono", "Teléfono"],
  ["direccion", "Dirección"],
  ["municipio", "Municipio"],
  ["departamento", "Departamento"],
  ["logo", "URL del logo"],
] as const;
export default function InstitucionForm({
  form,
}: {
  form: ReturnType<typeof useInstitucionForm>;
}) {
  const disabled = form.guardando || form.disabled;
  return (
    <View>
      {form.institucion && (
        <Text className="mb-5 font-nunito-medium text-sm text-text-muted">
          Fecha de registro:{" "}
          {new Date(form.institucion.fecha_registro).toLocaleDateString(
            "es-GT",
          )}
        </Text>
      )}
      {campos.map(([campo, label]) => (
        <Input
          key={campo}
          label={label}
          value={form.values[campo] ?? ""}
          onChangeText={(v) => form.cambiarCampo(campo, v)}
          editable={!disabled}
          autoCapitalize={
            campo === "correo" || campo === "logo" ? "none" : "sentences"
          }
          keyboardType={
            campo === "correo"
              ? "email-address"
              : campo === "telefono"
                ? "phone-pad"
                : campo === "logo"
                  ? "url"
                  : "default"
          }
        />
      ))}
      <Text className="mb-5 font-nunito-medium text-xs text-text-muted">
        El logo acepta una URL existente; no requiere subir archivos.
      </Text>
      <View className="gap-5">
        <AdminFilterOptions
          label="Tipo de institución"
          value={form.values.tipo_institucion}
          options={TIPOS_INSTITUCION}
          disabled={disabled}
          onChange={(v) =>
            form.cambiarCampo(
              "tipo_institucion",
              v as typeof form.values.tipo_institucion,
            )
          }
        />
        <AdminFilterOptions
          label="Estado"
          value={form.values.estado}
          options={[
            { value: "activo", label: "Activa" },
            { value: "inactivo", label: "Inactiva" },
          ]}
          disabled={disabled}
          onChange={(v) =>
            form.cambiarCampo("estado", v as typeof form.values.estado)
          }
        />
      </View>
    </View>
  );
}
