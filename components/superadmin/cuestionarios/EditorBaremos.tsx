import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import AdminActions from "@/components/admin/AdminActions";
import AdminCard from "@/components/admin/AdminCard";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useEditorBaremos from "@/hooks/superadmin/useEditorBaremos";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import type { SubescalaTest, TipoValorBaremo } from "@/types/cuestionarios";
import { cn } from "@/utils/cn";

type Props = {
  idTest: string;
  subescalas?: SubescalaTest[];
  disabled?: boolean;
};

const TIPOS_VALOR: { value: TipoValorBaremo; label: string }[] = [
  { value: "puntaje_directo", label: "Puntaje directo" },
  { value: "puntaje_total", label: "Puntaje total" },
  { value: "percentil", label: "Percentil" },
  { value: "puntaje_t", label: "Puntaje T" },
  { value: "eneatipo", label: "Eneatipo" },
];

export default function EditorBaremos({
  idTest,
  subescalas = [],
  disabled = false,
}: Props) {
  const { esTelefono } = useResponsiveLayout();
  const primary = useThemeColor({}, "primary");
  const b = useEditorBaremos(idTest, disabled);

  const inputProps = {
    editable: !disabled && !b.guardando,
    containerClassName: "mb-0 min-w-0 flex-1",
  };

  return (
    <View className="w-full gap-5">
      <View
        className={cn(
          "gap-3",
          esTelefono
            ? "items-stretch"
            : "flex-row items-center justify-between",
        )}
      >
        <View className="min-w-0 flex-1">
          <Text className="font-nunito-bold text-xl text-text">Baremos</Text>
          <Text className="mt-1 font-nunito-medium text-sm text-text-secondary">
            Configura los criterios de interpretación del test.
          </Text>
        </View>

        {!b.mostrarForm && (
          <Button
            title="Nuevo baremo"
            icon="add"
            disabled={disabled || b.guardando}
            onPress={b.nuevoBaremo}
            className="my-0 w-auto"
          />
        )}
      </View>

      {b.mostrarForm && (
        <AdminCard className="gap-4">
          <Text className="font-nunito-bold text-lg text-text">
            {b.editandoId ? "Editar baremo" : "Registrar baremo"}
          </Text>

          <View className={cn("gap-3", !esTelefono && "flex-row")}>
            <Input
              {...inputProps}
              label="Código *"
              value={b.form.codigo}
              onChangeText={(v) => b.actualizar("codigo", v)}
              placeholder="Ej.: BAREMO-GENERAL"
            />
            <Input
              {...inputProps}
              label="Nombre *"
              value={b.form.nombre}
              onChangeText={(v) => b.actualizar("nombre", v)}
              placeholder="Baremo general"
            />
          </View>

          <Input
            {...inputProps}
            label="Descripción"
            value={b.form.descripcion}
            onChangeText={(v) => b.actualizar("descripcion", v)}
            multiline
            inputClassName="h-auto min-h-24"
            textAlignVertical="top"
            scrollEnabled={false}
          />

          <View className={cn("gap-3", !esTelefono && "flex-row")}>
            <Input
              {...inputProps}
              label="Población"
              value={b.form.poblacion}
              onChangeText={(v) => b.actualizar("poblacion", v)}
              placeholder="Ej.: Adultos"
            />
            <Input
              {...inputProps}
              label="Sexo aplicable"
              value={b.form.sexoAplicable}
              onChangeText={(v) => b.actualizar("sexoAplicable", v)}
              placeholder="Ej.: Todos"
            />
          </View>

          <View className={cn("gap-3", !esTelefono && "flex-row")}>
            <Input
              {...inputProps}
              label="Edad mínima"
              value={b.form.edadMinima}
              onChangeText={(v) =>
                b.actualizar("edadMinima", v.replace(/\D/g, ""))
              }
              keyboardType="decimal-pad"
            />
            <Input
              {...inputProps}
              label="Edad máxima"
              value={b.form.edadMaxima}
              onChangeText={(v) =>
                b.actualizar("edadMaxima", v.replace(/\D/g, ""))
              }
              keyboardType="decimal-pad"
            />
          </View>

          <AdminFilterOptions
            label="Tipo de valor"
            value={b.form.tipoValor}
            options={TIPOS_VALOR}
            onChange={(v) => b.actualizar("tipoValor", v as TipoValorBaremo)}
            disabled={disabled || b.guardando}
          />

          <View className={cn("gap-3", !esTelefono && "flex-row")}>
            <Input
              {...inputProps}
              label="Versión"
              value={b.form.version}
              onChangeText={(v) => b.actualizar("version", v)}
            />
            <Input
              {...inputProps}
              label="Fuente"
              value={b.form.fuente}
              onChangeText={(v) => b.actualizar("fuente", v)}
            />
          </View>

          {!!b.error && (
            <Text className="font-nunito-medium text-xs text-danger">
              {b.error}
            </Text>
          )}

          <View
            className={cn(
              "justify-end gap-2",
              esTelefono ? "flex-col-reverse" : "flex-row",
            )}
          >
            <Button
              title="Cancelar"
              variant="secondary"
              disabled={b.guardando}
              onPress={() => {
                b.setMostrarForm(false);
                b.setError(null);
              }}
              className="my-0 w-auto"
            />
            <Button
              title="Guardar baremo"
              disabled={disabled || b.guardando}
              loading={b.guardando}
              onPress={b.guardarBaremo}
              className="my-0 w-auto"
            />
          </View>
        </AdminCard>
      )}

      {!!b.mensaje && (
        <Text className="font-nunito-medium text-xs text-success">
          {b.mensaje}
        </Text>
      )}

      {!b.mostrarForm && !!b.error && (
        <Text className="font-nunito-medium text-xs text-danger">
          {b.error}
        </Text>
      )}

      {b.cargando ? (
        <ActivityIndicator color={primary} />
      ) : !b.baremos.length ? (
        <View className="items-center gap-3 rounded-2xl border border-border p-7">
          <Ionicons name="analytics-outline" size={38} className="text-primary" />
          <Text className="text-center font-nunito-medium text-text-secondary">
            Aún no se han configurado baremos.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {b.baremos.map((item) => {
            const activo = b.seleccionadoId === item.id_baremo;

            return (
              <AdminCard
                key={item.id_baremo}
                className={cn(
                  "gap-3 border p-4",
                  activo ? "border-primary" : "border-border",
                )}
              >
                <Pressable
                  onPress={() =>
                    b.setSeleccionadoId(activo ? null : item.id_baremo)
                  }
                  className="active:opacity-70"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="min-w-0 flex-1 gap-1">
                      <Text className="font-nunito-bold text-sm text-text">
                        {item.nombre}
                      </Text>
                      <Text className="font-nunito-medium text-xs text-text-secondary">
                        {item.codigo}
                      </Text>
                      <Text className="font-nunito-medium text-xs text-text-secondary">
                        {item.tipo_valor.replace(/_/g, " ")}
                      </Text>
                    </View>

                    <Ionicons
                      name={activo ? "chevron-up" : "chevron-down"}
                      size={22}
                      className="text-primary"
                    />
                  </View>
                </Pressable>

                <AdminActions
                  estado={item.estado ? "activo" : "inactivo"}
                  entidad="baremo"
                  onEditar={() => b.editarBaremo(item)}
                  onCambiarEstado={() => b.cambiarEstado(item)}
                  disabled={disabled || b.guardando}
                />
              </AdminCard>
            );
          })}
        </View>
      )}

      {b.seleccionado && (
        <AdminCard className="gap-4">
          <View
            className={cn(
              "gap-3",
              !esTelefono && "flex-row items-center justify-between",
            )}
          >
            <Text className="min-w-0 flex-1 font-nunito-bold text-lg text-text">
              Rangos: {b.seleccionado.nombre}
            </Text>

            {!b.mostrarRango && (
              <Button
                title="Agregar rango"
                icon="add"
                variant="secondary"
                disabled={disabled || b.guardando}
                onPress={b.nuevoRango}
                className="my-0 w-auto"
              />
            )}
          </View>

          {b.mostrarRango && (
            <View className="gap-3">
              <Input
                {...inputProps}
                label="Nivel *"
                value={b.formRango.nivel}
                onChangeText={(v) => b.actualizarRango("nivel", v)}
                placeholder="Ej.: Bajo, moderado, alto"
              />

              <View className={cn("gap-3", !esTelefono && "flex-row")}>
                <Input
                  {...inputProps}
                  label="Valor mínimo *"
                  value={b.formRango.valorMinimo}
                  onChangeText={(v) => b.actualizarRango("valorMinimo", v)}
                  keyboardType="decimal-pad"
                />
                <Input
                  {...inputProps}
                  label="Valor máximo *"
                  value={b.formRango.valorMaximo}
                  onChangeText={(v) => b.actualizarRango("valorMaximo", v)}
                  keyboardType="decimal-pad"
                />
              </View>

              <Input
                {...inputProps}
                label="Interpretación"
                value={b.formRango.interpretacion}
                onChangeText={(v) => b.actualizarRango("interpretacion", v)}
                multiline
                inputClassName="h-auto min-h-24"
                textAlignVertical="top"
                scrollEnabled={false}
              />

              <Input
                {...inputProps}
                label="Orden *"
                value={b.formRango.orden}
                onChangeText={(v) =>
                  b.actualizarRango("orden", v.replace(/\D/g, ""))
                }
                keyboardType="decimal-pad"
              />

              {!!subescalas.length && (
                <AdminFilterOptions
                  label="Subescala"
                  value={b.formRango.idSubescala ?? ""}
                  options={[
                    { value: "", label: "Puntaje general" },
                    ...subescalas
                      .filter((s) => s.estado)
                      .map((s) => ({
                        value: s.id_subescala,
                        label: s.nombre,
                      })),
                  ]}
                  onChange={(id) =>
                    b.actualizarRango("idSubescala", id || null)
                  }
                  disabled={disabled || b.guardando}
                  horizontal
                />
              )}

              {!!b.error && (
                <Text className="font-nunito-medium text-xs text-danger">
                  {b.error}
                </Text>
              )}

              <View
                className={cn(
                  "justify-end gap-2",
                  esTelefono ? "flex-col-reverse" : "flex-row",
                )}
              >
                <Button
                  title="Cancelar"
                  variant="secondary"
                  disabled={b.guardando}
                  onPress={() => {
                    b.setMostrarRango(false);
                    b.setError(null);
                  }}
                  className="my-0 w-auto"
                />
                <Button
                  title="Guardar rango"
                  disabled={disabled || b.guardando}
                  loading={b.guardando}
                  onPress={b.guardarRango}
                  className="my-0 w-auto"
                />
              </View>
            </View>
          )}

          {b.cargandoRangos ? (
            <ActivityIndicator color={primary} />
          ) : !b.rangos.length ? (
            <Text className="font-nunito-medium text-sm text-text-secondary">
              Aún no hay rangos registrados para este baremo.
            </Text>
          ) : (
            <View className="gap-2">
              {b.rangos.map((r) => (
                <View
                  key={r.id_rango}
                  className="gap-1 rounded-xl bg-surface-secondary p-3"
                >
                  <Text className="font-nunito-bold text-text">{r.nivel}</Text>
                  <Text className="font-nunito-medium text-xs text-primary">
                    {r.valor_minimo} – {r.valor_maximo}
                  </Text>
                  {!!r.interpretacion && (
                    <Text className="font-nunito-medium text-xs leading-5 text-text-secondary">
                      {r.interpretacion}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </AdminCard>
      )}
    </View>
  );
}