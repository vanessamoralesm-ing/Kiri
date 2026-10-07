import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import useRevisionTest from "@/hooks/superadmin/useRevisionTest";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cn } from "@/utils/cn";

type Props = {
  idTest: string;
  disabled?: boolean;
  onPublicado?: () => void;
  onDespublicado?: () => void;
};

export default function EditorRevisionTest({
  idTest,
  disabled = false,
  onPublicado,
  onDespublicado,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const r = useRevisionTest(idTest, disabled, onPublicado, onDespublicado);
  const { test, validacion } = r;

  if (r.cargando)
    return (
      <View className="min-h-56 items-center justify-center gap-3">
        <ActivityIndicator size="large" color={primary} />
        <Text className="font-nunito-medium text-text-secondary">
          Revisando cuestionario...
        </Text>
      </View>
    );

  if (!test)
    return (
      <AdminCard>
        <Text className="font-nunito-medium text-danger">
          {r.error ?? "No se encontró el cuestionario."}
        </Text>
        <Button title="Reintentar" variant="secondary" onPress={r.cargar} />
      </AdminCard>
    );

  const resumen = [
    ["Preguntas", test.pregunta_test?.length ?? 0, "help-circle-outline"],
    [
      "Opciones",
      test.pregunta_test?.reduce((n, p) => n + (p.opcion_test?.length ?? 0), 0) ?? 0,
      "list-outline",
    ],
    ["Subescalas", test.subescala?.length ?? 0, "layers-outline"],
    ["Baremos", test.baremo_test?.length ?? 0, "analytics-outline"],
  ] as const;

  return (
    <View className="w-full gap-5">
      <View className="gap-2">
        <Text className="font-nunito-bold text-2xl text-text">
          Revisión del cuestionario
        </Text>
        <Text className="font-nunito-medium text-sm leading-5 text-text-secondary">
          Comprueba la información del instrumento antes de ponerlo a disposición de los usuarios.
        </Text>
      </View>

      <AdminCard className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-soft">
            <Ionicons name="clipboard-outline" size={23} className="text-primary" />
          </View>

          <View className="min-w-0 flex-1 gap-1">
            <Text className="font-nunito-bold text-lg text-text">{test.nombre}</Text>
            <Text className="font-nunito-medium text-xs text-text-secondary">{test.codigo}</Text>
          </View>

          <AdminStatusBadge
            estado={test.estado ? "activo" : "inactivo"}
            label={test.estado ? "Publicado" : "Borrador"}
          />
        </View>

        {!!test.descripcion && (
          <Text className="font-nunito-medium text-sm leading-5 text-text-secondary">
            {test.descripcion}
          </Text>
        )}

        <View className="gap-1 rounded-xl bg-surface-secondary p-3">
          {[
            ["Población objetivo", test.poblacion_objetivo || "Sin definir"],
            ["Aplicación", test.tipo_aplicacion],
            ["Versión", test.version || "Sin definir"],
            ["Subescalas", test.tiene_subescalas ? "Sí" : "No"],
          ].map(([label, valor]) => (
            <Text key={label} className="font-nunito-medium text-xs text-text-secondary">
              {label}: {valor}
            </Text>
          ))}
        </View>
      </AdminCard>

      <View className="-mx-1 flex-row flex-wrap">
        {resumen.map(([titulo, valor, icono]) => (
          <View key={titulo} className="w-full p-1 md:w-1/2">
            <AdminStatCard titulo={titulo} valor={valor} icono={icono} />
          </View>
        ))}
      </View>

      <AdminCard className="gap-4">
        <View className="flex-row items-center gap-3">
          <Ionicons
            name={validacion?.valido ? "checkmark-circle-outline" : "alert-circle-outline"}
            size={25}
            className={validacion?.valido ? "text-success" : "text-danger"}
          />
          <View className="flex-1">
            <Text className="font-nunito-bold text-base text-text">
              Validación de publicación
            </Text>
            <Text className="font-nunito-medium text-xs text-text-secondary">
              {validacion?.valido
                ? "El test cumple las validaciones configuradas."
                : "Hay elementos que debes revisar."}
            </Text>
          </View>
        </View>

        {validacion?.errores.map((item, i) => (
          <View key={`${i}-${item}`} className="flex-row gap-2 rounded-xl bg-surface-secondary p-3">
            <Ionicons name="alert-circle-outline" size={18} className="text-danger" />
            <Text className="flex-1 font-nunito-medium text-xs leading-5 text-text">
              {item}
            </Text>
          </View>
        ))}

        <View className="rounded-xl bg-primary-soft p-3">
          <Text className="font-nunito-medium text-xs leading-5 text-primary">
            Revisa también las puntuaciones, los rangos de los baremos y la adecuación del
            instrumento a la población objetivo. Estas comprobaciones todavía no forman parte
            de la validación automática.
          </Text>
        </View>
      </AdminCard>

      {!!r.error && (
        <Text className="font-nunito-medium text-sm text-danger">{r.error}</Text>
      )}
      {!!r.mensaje && (
        <Text className="font-nunito-medium text-sm text-success">{r.mensaje}</Text>
      )}

      <View className="gap-3 md:flex-row">
        <Button
          title="Actualizar revisión"
          variant="secondary"
          disabled={r.procesando}
          onPress={r.cargar}
          className="my-0 md:flex-1"
        />
        <Button
          title={test.estado ? "Despublicar cuestionario" : "Publicar cuestionario"}
          variant={test.estado ? "secondary" : "primary"}
          disabled={disabled || r.procesando || (!test.estado && !validacion?.valido)}
          loading={r.procesando}
          onPress={r.cambiarPublicacion}
          className="my-0 md:flex-1"
        />
      </View>
    </View>
  );
}