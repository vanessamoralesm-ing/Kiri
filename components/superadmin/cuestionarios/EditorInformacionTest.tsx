import React from "react";
import { Text, View } from "react-native";
import AdminCard from "@/components/admin/AdminCard";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import type { CrearTestAdmin } from "@/services/superadmin/cuestionarioAdmin.service";

type Informacion = Omit<CrearTestAdmin, "estado">;

type Props = {
  value: Informacion;
  onChange: (value: Informacion) => void;
  disabled?: boolean;
};

const APLICACIONES = [
  {
    value: "autoadministrado",
    label: "Autoadministrado",
    descripcion: "La persona contesta el cuestionario.",
  },
  {
    value: "profesional",
    label: "Profesional",
    descripcion: "Aplicado por un profesional autorizado.",
  },
] as const;

export default function EditorInformacionTest({
  value,
  onChange,
  disabled = false,
}: Props) {
  const cambiar = <K extends keyof Informacion>(
    campo: K,
    valor: Informacion[K],
  ) => onChange({ ...value, [campo]: valor });

  const campoProps = (
    campo:
      | "codigo"
      | "nombre"
      | "descripcion"
      | "instrucciones"
      | "poblacion_objetivo"
      | "version",
  ) => ({
    value: value[campo] ?? "",
    onChangeText: (v: string) => cambiar(campo, v),
    editable: !disabled,
    containerClassName: "mb-0",
  });

  return (
    <AdminCard className="w-full gap-5 md:p-6">
      <View className="gap-2">
        <Text className="font-nunito-bold text-xl text-text">
          Información general
        </Text>
        <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
          Identifica el instrumento y configura su aplicación.
        </Text>
      </View>

      <View className="gap-3 md:flex-row">
        <View className="min-w-0 md:flex-1">
          <Input
            {...campoProps("codigo")}
            label="Código *"
            placeholder="Ej.: PHQ-9"
          />
        </View>

        <View className="min-w-0 md:flex-1">
          <Input
            {...campoProps("nombre")}
            label="Nombre *"
            placeholder="Nombre del cuestionario"
          />
        </View>
      </View>

      <Input
        {...campoProps("descripcion")}
        label="Descripción"
        placeholder="Propósito del instrumento"
        multiline
        textAlignVertical="top"
        inputClassName="h-auto min-h-24"
      />

      <Input
        {...campoProps("instrucciones")}
        label="Instrucciones"
        placeholder="Indicaciones para el usuario"
        multiline
        textAlignVertical="top"
        inputClassName="h-auto min-h-24"
      />

      <Input
        {...campoProps("poblacion_objetivo")}
        label="Población objetivo"
        placeholder="Ej.: Personas adultas"
      />

      <View className="gap-2">
        <AdminFilterOptions
          label="Tipo de aplicación *"
          value={value.tipo_aplicacion}
          options={APLICACIONES}
          disabled={disabled}
          onChange={(v) =>
            cambiar("tipo_aplicacion", v as Informacion["tipo_aplicacion"])
          }
        />

        {APLICACIONES.map((item) => (
          <Text
            key={item.value}
            className="font-nunito-medium text-xs text-text-secondary"
          >
            {item.label}: {item.descripcion}
          </Text>
        ))}
      </View>

      <Input
        {...campoProps("version")}
        label="Versión"
        placeholder="Ej.: 1.0"
      />

      <View className="flex-row items-center gap-3 rounded-xl border border-border p-4">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-nunito-bold text-sm text-text">
            Utiliza subescalas
          </Text>
          <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
            Habilita las dimensiones que conforman el instrumento.
          </Text>
        </View>

        <Switch
          value={value.tiene_subescalas}
          onValueChange={(v) => cambiar("tiene_subescalas", v)}
          disabled={disabled}
        />
      </View>
    </AdminCard>
  );
}