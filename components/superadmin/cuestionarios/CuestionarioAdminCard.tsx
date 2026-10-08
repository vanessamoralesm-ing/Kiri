import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { TestAdmin } from "@/services/superadmin/cuestionarioAdmin.service";

interface Props {
  test: TestAdmin;
  procesando?: boolean;
  disabled?: boolean;
  onEditar: (test: TestAdmin) => void;
  onCambiarEstado: (test: TestAdmin) => void;
}

export default function CuestionarioAdminCard({
  test, procesando, disabled, onEditar, onCambiarEstado,
}: Props) {
  const cantidad = test.pregunta_test?.[0]?.count ?? 0;
  return (
    <AdminCard actions={
      <AdminActions
        estado={test.estado ? "activo" : "inactivo"}
        entidad={test.nombre}
        procesando={procesando}
        disabled={disabled}
        textoCambiarEstado={test.estado ? "Despublicar" : "Publicar"}
        onEditar={() => onEditar(test)}
        onCambiarEstado={() => onCambiarEstado(test)}
      />
    }>
      <View className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-soft">
          <Ionicons name="clipboard-outline" size={23} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-nunito-bold text-lg text-text">{test.nombre}</Text>
          <Text className="font-nunito-semibold text-xs text-primary">{test.codigo}</Text>
        </View>
        <AdminStatusBadge estado={test.estado ? "activo" : "inactivo"} />
      </View>
      {!!test.descripcion && (
        <Text numberOfLines={3} className="font-nunito-medium text-sm leading-5 text-text-secondary">
          {test.descripcion}
        </Text>
      )}
      <View className="flex-row flex-wrap gap-3">
        <Text className="font-nunito-medium text-xs text-text-secondary">
          {cantidad} {cantidad === 1 ? "pregunta" : "preguntas"}
        </Text>
        {!!test.version && <Text className="font-nunito-medium text-xs text-text-secondary">Versión {test.version}</Text>}
        {test.tiene_subescalas && <Text className="font-nunito-medium text-xs text-text-secondary">Subescalas</Text>}
      </View>
      {!!test.poblacion_objetivo && (
        <Text className="font-nunito-medium text-xs text-text-muted">Población: {test.poblacion_objetivo}</Text>
      )}
    </AdminCard>
  );
}
