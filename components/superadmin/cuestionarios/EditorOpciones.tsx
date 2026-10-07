import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import useEditorOpciones from "@/hooks/superadmin/useEditorOpciones";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { OpcionTest } from "@/types/cuestionarios";

type Props = {
  idPregunta: string;
  puntua?: boolean;
  disabled?: boolean;
  onCambio?: (opciones: OpcionTest[]) => void;
};

export default function EditorOpciones({
  idPregunta,
  puntua = true,
  disabled = false,
  onCambio,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const o = useEditorOpciones(idPregunta, puntua, disabled, onCambio);
  const editable = !disabled && !o.guardando;

  return (
    <View className="w-full gap-4">
      <View className="gap-3 md:flex-row md:items-center md:justify-between">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-nunito-bold text-xl text-text">
            Opciones de respuesta
          </Text>
          <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
            Configura las respuestas disponibles para esta pregunta.
          </Text>
        </View>

        {!o.mostrarForm && (
          <Button
            title="Nueva opción"
            icon="add"
            disabled={disabled}
            onPress={o.nueva}
            className="my-0 w-auto"
          />
        )}
      </View>

      {o.mostrarForm && (
        <AdminCard className="gap-4">
          <Text className="font-nunito-bold text-lg text-text">
            {o.editandoId ? "Editar opción" : "Registrar opción"}
          </Text>

          <View className="gap-3 md:flex-row">
            <Input
              label="Código *"
              value={o.form.codigo}
              onChangeText={(v) => o.actualizar("codigo", v)}
              placeholder="Ej.: OP-1"
              editable={editable}
              autoCapitalize="characters"
              containerClassName="mb-0 min-w-0 flex-1"
            />
            <Input
              label="Orden *"
              value={o.form.orden}
              onChangeText={(v) => o.actualizar("orden", v.replace(/\D/g, ""))}
              keyboardType="number-pad"
              editable={editable}
              containerClassName="mb-0 min-w-0 flex-1"
            />
          </View>

          <Input
            label="Etiqueta *"
            value={o.form.etiqueta}
            onChangeText={(v) => o.actualizar("etiqueta", v)}
            placeholder="Texto que verá el usuario"
            editable={editable}
            containerClassName="mb-0"
          />

          {puntua && (
            <Input
              label="Valor del puntaje *"
              value={o.form.valorPuntaje}
              onChangeText={(v) =>
                o.actualizar(
                  "valorPuntaje",
                  v.replace(/[^0-9.,-]/g, "").replace(",", "."),
                )
              }
              keyboardType="decimal-pad"
              placeholder="Ej.: 0"
              editable={editable}
              containerClassName="mb-0"
            />
          )}

          {!!o.error && (
            <Text className="font-nunito-medium text-xs text-danger">
              {o.error}
            </Text>
          )}

          <View className="gap-2 md:flex-row md:justify-end">
            <Button
              title="Cancelar"
              variant="secondary"
              disabled={o.guardando}
              onPress={o.cancelar}
              className="my-0 w-auto"
            />
            <Button
              title="Guardar opción"
              disabled={disabled || o.guardando}
              loading={o.guardando}
              onPress={o.guardar}
              className="my-0 w-auto"
            />
          </View>
        </AdminCard>
      )}

      {!!o.mensaje && (
        <Text className="font-nunito-medium text-xs text-success">
          {o.mensaje}
        </Text>
      )}

      {!o.mostrarForm && !!o.error && (
        <Text className="font-nunito-medium text-xs text-danger">
          {o.error}
        </Text>
      )}

      {o.cargando ? (
        <ActivityIndicator color={primary} />
      ) : !o.opciones.length ? (
        <AdminCard className="p-0">
          <AdminEmptyState
            mensaje="Aún no hay opciones. Agrega las respuestas que estarán disponibles."
            icono="list-circle-outline"
          />
        </AdminCard>
      ) : (
        <View className="gap-3">
          {o.opciones.map((item) => (
            <AdminCard key={item.id_opcion} className="gap-3 border border-border p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                  <Text className="font-nunito-bold text-primary">
                    {item.orden}
                  </Text>
                </View>

                <View className="min-w-0 flex-1 gap-1">
                  <Text className="font-nunito-bold text-sm text-text">
                    {item.etiqueta}
                  </Text>
                  <Text className="font-nunito-medium text-xs text-text-muted">
                    {item.codigo}
                    {puntua && item.valor_puntaje != null
                      ? ` · ${item.valor_puntaje} puntos`
                      : ""}
                  </Text>
                </View>

                <Switch
                  value={item.estado}
                  disabled={disabled || o.cambiandoId !== null}
                  onValueChange={() => o.cambiarEstado(item)}
                />
              </View>

              <Button
                title="Editar"
                icon="create-outline"
                variant="secondary"
                disabled={disabled || o.guardando}
                onPress={() => o.editar(item)}
                className="my-0 w-auto self-start"
              />
            </AdminCard>
          ))}
        </View>
      )}
    </View>
  );
}