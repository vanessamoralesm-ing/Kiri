import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import useEditorSubescalas from "@/hooks/superadmin/useEditorSubescalas";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { SubescalaTest } from "@/types/cuestionarios";

type Props = {
  idTest: string;
  disabled?: boolean;
  onCambio?: (s: SubescalaTest[]) => void;
};

export default function EditorSubescalas({
  idTest,
  disabled = false,
  onCambio,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const s = useEditorSubescalas(idTest, disabled, onCambio);

  return (
    <View className="w-full gap-5">
      <View className="gap-3 md:flex-row md:items-center md:justify-between">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-nunito-bold text-2xl text-text">Subescalas</Text>
          <Text className="font-nunito-medium text-sm leading-5 text-text-secondary">
            Organiza las dimensiones que evalúa el cuestionario.
          </Text>
        </View>

        {!s.mostrarForm && (
          <Button
            title="Nueva subescala"
            icon="add"
            disabled={disabled}
            onPress={s.nueva}
            className="my-0 w-auto"
          />
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        <View className="rounded-xl bg-primary-soft px-3 py-2">
          <Text className="font-nunito-bold text-xs text-primary">
            {s.subescalas.length} registradas
          </Text>
        </View>
        <View className="rounded-xl border border-border bg-surface px-3 py-2">
          <Text className="font-nunito-semibold text-xs text-success">
            {s.activas} activas
          </Text>
        </View>
      </View>

      {s.mostrarForm && (
        <AdminCard className="gap-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <Ionicons name="layers-outline" size={22} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="font-nunito-bold text-lg text-text">
                {s.editandoId ? "Editar subescala" : "Registrar subescala"}
              </Text>
              <Text className="font-nunito-medium text-xs text-text-secondary">
                Completa la información de esta dimensión.
              </Text>
            </View>
          </View>

          <View className="gap-3 md:flex-row">
            <Input
              label="Código *"
              value={s.form.codigo}
              onChangeText={(v) => s.actualizar("codigo", v)}
              placeholder="Ej.: ANSIEDAD"
              autoCapitalize="characters"
              editable={!s.bloqueado}
              containerClassName="mb-0 min-w-0 flex-1"
            />
            <Input
              label="Orden *"
              value={s.form.orden}
              onChangeText={(v) => s.actualizar("orden", v.replace(/\D/g, ""))}
              placeholder="1"
              keyboardType="number-pad"
              editable={!s.bloqueado}
              containerClassName="mb-0 min-w-0 flex-1"
            />
          </View>

          <Input
            label="Nombre de la subescala *"
            value={s.form.nombre}
            onChangeText={(v) => s.actualizar("nombre", v)}
            placeholder="Ej.: Ansiedad e insomnio"
            editable={!s.bloqueado}
            containerClassName="mb-0"
          />

          <Input
            label="Descripción"
            value={s.form.descripcion}
            onChangeText={(v) => s.actualizar("descripcion", v)}
            placeholder="Describe qué evalúa esta subescala"
            editable={!s.bloqueado}
            multiline
            textAlignVertical="top"
            inputClassName="h-auto min-h-24"
            containerClassName="mb-0"
          />

          <View className="flex-row items-center gap-3 rounded-xl border border-border bg-surface-secondary p-4">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="font-nunito-bold text-sm text-text">
                Incluir en el puntaje total
              </Text>
              <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
                Indica si esta subescala contribuye al resultado total del cuestionario.
              </Text>
            </View>
            <Switch
              value={s.form.incluyeTotal}
              onValueChange={(v) => s.actualizar("incluyeTotal", v)}
              disabled={s.bloqueado}
            />
          </View>

          {!!s.error && (
            <View className="rounded-xl border border-danger p-3">
              <Text className="font-nunito-medium text-xs leading-5 text-danger">
                {s.error}
              </Text>
            </View>
          )}

          <View className="gap-2 md:flex-row md:justify-end">
            <Button
              title="Cancelar"
              variant="secondary"
              disabled={s.guardando}
              onPress={s.cancelar}
              className="my-0 w-auto"
            />
            <Button
              title={s.editandoId ? "Guardar cambios" : "Registrar subescala"}
              icon="save-outline"
              disabled={s.bloqueado}
              loading={s.guardando}
              onPress={s.guardar}
              className="my-0 w-auto"
            />
          </View>
        </AdminCard>
      )}

      {!s.mostrarForm && !!s.error && (
        <Text className="font-nunito-medium text-xs text-danger">{s.error}</Text>
      )}

      {!!s.mensaje && (
        <View className="flex-row items-center gap-2 rounded-xl bg-surface-secondary p-3">
          <Ionicons name="checkmark-circle-outline" size={19} className="text-success" />
          <Text className="flex-1 font-nunito-medium text-xs text-success">
            {s.mensaje}
          </Text>
        </View>
      )}

      {s.cargando ? (
        <View className="min-h-40 items-center justify-center gap-3">
          <ActivityIndicator color={primary} />
          <Text className="font-nunito-medium text-xs text-text-secondary">
            Cargando subescalas...
          </Text>
        </View>
      ) : !s.subescalas.length && !s.mostrarForm ? (
        <AdminCard className="p-0">
          <AdminEmptyState
            mensaje="Aún no hay subescalas. Registra las dimensiones antes de asignarlas a las preguntas."
            icono="layers-outline"
          />
        </AdminCard>
      ) : (
        <View className="gap-3">
          {s.ordenadas.map((item) => {
            const procesando = s.cambiandoId === item.id_subescala;

            return (
              <AdminCard key={item.id_subescala} className="gap-4">
                <View className="flex-row items-start gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
                    <Text className="font-nunito-bold text-sm text-primary">
                      {item.orden}
                    </Text>
                  </View>

                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="font-nunito-bold text-sm leading-5 text-text">
                      {item.nombre}
                    </Text>
                    <Text className="font-nunito-medium text-xs text-text-muted">
                      {item.codigo}
                    </Text>
                    {!!item.descripcion && (
                      <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
                        {item.descripcion}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  <AdminStatusBadge
                    estado={item.estado ? "activo" : "inactivo"}
                    label={item.estado ? "Activa" : "Inactiva"}
                  />
                  <View className="rounded-full bg-surface-secondary px-3 py-1">
                    <Text className="font-nunito-semibold text-xs text-text-secondary">
                      {item.incluye_total ? "Incluye puntaje total" : "Sin puntaje total"}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-border pt-3">
                  <AdminActions
                    estado={item.estado ? "activo" : "inactivo"}
                    entidad="subescala"
                    onEditar={() => s.editar(item)}
                    onCambiarEstado={() => s.cambiarEstado(item)}
                    disabled={disabled || s.guardando || procesando}
                    procesando={procesando}
                  />
                </View>
              </AdminCard>
            );
          })}
        </View>
      )}
    </View>
  );
}