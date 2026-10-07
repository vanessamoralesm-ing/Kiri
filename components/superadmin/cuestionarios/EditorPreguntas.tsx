import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import useEditorPreguntas from "@/hooks/superadmin/useEditorPreguntas";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { PreguntaAdmin } from "@/services/superadmin/cuestionarioAdmin.service";
import type { SubescalaTest, TipoPregunta } from "@/types/cuestionarios";
import { cn } from "@/utils/cn";

type Props = {
  idTest: string;
  tieneSubescalas?: boolean;
  subescalas?: SubescalaTest[];
  disabled?: boolean;
  onCambio?: (preguntas: PreguntaAdmin[]) => void;
};

const TIPOS: {
  valor: TipoPregunta;
  label: string;
  descripcion: string;
  icono: keyof typeof Ionicons.glyphMap;
}[] = [
  { valor: "opcion_unica", label: "Opción única", descripcion: "Selecciona una sola respuesta.", icono: "radio-button-on-outline" },
  { valor: "opcion_multiple", label: "Opción múltiple", descripcion: "Permite seleccionar varias respuestas.", icono: "checkbox-outline" },
  { valor: "escala", label: "Escala", descripcion: "Respuesta mediante una escala de valores.", icono: "options-outline" },
  { valor: "numero", label: "Número", descripcion: "Introduce un valor numérico.", icono: "calculator-outline" },
  { valor: "texto", label: "Texto", descripcion: "Respuesta abierta escrita.", icono: "text-outline" },
];

type SwitchProps = {
  titulo: string;
  descripcion: string;
  valor: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
};

const OpcionSwitch = ({ titulo, descripcion, valor, disabled, onChange }: SwitchProps) => (
  <View className="w-full flex-row items-center gap-3 rounded-xl border border-border bg-surface-secondary p-3 md:flex-1">
    <View className="min-w-0 flex-1 gap-1">
      <Text className="font-nunito-bold text-sm text-text">{titulo}</Text>
      <Text className="font-nunito-medium text-xs leading-4 text-text-secondary">{descripcion}</Text>
    </View>
    <Switch value={valor} onValueChange={onChange} disabled={disabled} />
  </View>
);

export default function EditorPreguntas({
  idTest,
  tieneSubescalas = false,
  subescalas = [],
  disabled = false,
  onCambio,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const p = useEditorPreguntas(idTest, tieneSubescalas, disabled, onCambio);
  const editable = !disabled && !p.guardando;
  const tipoActual = TIPOS.find((t) => t.valor === p.form.tipoPregunta);

  return (
    <View className="w-full gap-5">
      <View className="gap-3 md:flex-row md:items-center md:justify-between">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-nunito-bold text-2xl text-text">Preguntas</Text>
          <Text className="font-nunito-medium text-sm leading-5 text-text-secondary">
            Configura las preguntas y opciones que formarán parte del cuestionario.
          </Text>
        </View>

        {!p.mostrarForm && (
          <Button
            title="Agregar pregunta"
            icon="add"
            disabled={disabled}
            onPress={p.nueva}
            className="my-0 w-auto"
          />
        )}
      </View>

      {p.mostrarForm && (
        <AdminCard className="w-full gap-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <Ionicons name="help-circle-outline" size={22} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="font-nunito-bold text-lg text-text">Nueva pregunta</Text>
              <Text className="font-nunito-medium text-xs text-text-muted">Pregunta {p.orden}</Text>
            </View>
          </View>

          <View className="gap-3 md:flex-row">
            <Input
              label="Código *"
              value={p.form.codigo}
              onChangeText={(v) => p.actualizar("codigo", v)}
              placeholder="Ej.: P-01"
              editable={editable}
              containerClassName="mb-0 min-w-0 flex-1"
            />

            {tieneSubescalas && (
              <View className="min-w-0 flex-1">
                <AdminFilterOptions
                  label="Subescala *"
                  value={p.form.idSubescala ?? ""}
                  options={subescalas.map((s) => ({
                    value: s.id_subescala,
                    label: s.nombre,
                  }))}
                  onChange={(v) => p.actualizar("idSubescala", v || null)}
                  disabled={!editable}
                  horizontal
                />
              </View>
            )}
          </View>

          <Input
            label="Enunciado *"
            value={p.form.enunciado}
            onChangeText={(v) => p.actualizar("enunciado", v)}
            placeholder="Escribe la pregunta que verá el usuario"
            editable={editable}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            inputClassName="h-auto min-h-24"
            containerClassName="mb-0"
          />

          <Input
            label="Descripción de apoyo"
            value={p.form.descripcionApoyo}
            onChangeText={(v) => p.actualizar("descripcionApoyo", v)}
            placeholder="Texto adicional o aclaración opcional"
            editable={editable}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            inputClassName="h-auto min-h-24"
            containerClassName="mb-0"
          />

          <View className="gap-3">
            <Text className="font-nunito-semibold text-sm text-text">Tipo de pregunta *</Text>

            <View className="-mx-1 flex-row flex-wrap">
              {TIPOS.map((tipo) => {
                const activa = p.form.tipoPregunta === tipo.valor;

                return (
                  <View key={tipo.valor} className="w-full p-1 md:w-1/2 lg:w-1/3">
                    <Pressable
                      disabled={!editable}
                      onPress={() => p.seleccionarTipo(tipo.valor)}
                      className={cn(
                        "min-h-20 flex-row items-center gap-3 rounded-xl border p-3 active:opacity-80",
                        activa
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-surface-secondary",
                      )}
                    >
                      <View
                        className={cn(
                          "h-9 w-9 items-center justify-center rounded-xl",
                          activa ? "bg-primary" : "bg-surface",
                        )}
                      >
                        <Ionicons
                          name={tipo.icono}
                          size={19}
                          className={activa ? "text-text-on-primary" : "text-text-secondary"}
                        />
                      </View>

                      <View className="min-w-0 flex-1">
                        <Text className={cn("font-nunito-bold text-xs", activa ? "text-primary" : "text-text")}>
                          {tipo.label}
                        </Text>
                        <Text className="font-nunito-medium text-xs leading-4 text-text-secondary">
                          {tipo.descripcion}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {!!tipoActual && (
              <View className="flex-row gap-2 rounded-xl bg-primary-soft p-3">
                <Ionicons name={tipoActual.icono} size={17} className="text-primary" />
                <Text className="flex-1 font-nunito-medium text-xs leading-4 text-text-secondary">
                  {tipoActual.descripcion}
                </Text>
              </View>
            )}
          </View>

          <View className="-mx-1 flex-row flex-wrap">
            {[
              ["Obligatoria", "Debe responderse para continuar.", "obligatoria"],
              ["Puntúa", "La respuesta aporta al resultado.", "puntua"],
              ["Observacional", "Registra información observacional.", "esObservacional"],
              ["Permite comentario", "El usuario podrá agregar un comentario.", "permiteComentario"],
            ].map(([titulo, descripcion, campo]) => (
              <View key={campo} className="w-full p-1 md:w-1/2">
                <OpcionSwitch
                  titulo={titulo}
                  descripcion={descripcion}
                  valor={p.form[campo as keyof typeof p.form] as boolean}
                  disabled={!editable}
                  onChange={(v) => p.actualizar(campo as never, v as never)}
                />
              </View>
            ))}
          </View>

          {p.necesitaOpciones && (
            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="font-nunito-bold text-base text-text">Opciones de respuesta</Text>
                  <Text className="font-nunito-medium text-xs text-text-muted">
                    Configura las respuestas y sus puntajes.
                  </Text>
                </View>
                <Button
                  title="Añadir"
                  icon="add"
                  variant="secondary"
                  onPress={p.agregarOpcion}
                  className="my-0 w-auto"
                />
              </View>

              {p.form.opciones.map((o, index) => (
                <View key={o.id} className="gap-3 rounded-xl border border-border bg-surface-secondary p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-nunito-bold text-xs text-text">Opción {index + 1}</Text>
                    {p.form.opciones.length > 2 && (
                      <Pressable onPress={() => p.eliminarOpcion(o.id)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={18} className="text-danger" />
                      </Pressable>
                    )}
                  </View>

                  <View className="gap-3 md:flex-row">
                    <Input
                      label="Código"
                      value={o.codigo}
                      placeholder="OP-1"
                      editable={editable}
                      onChangeText={(v) => p.actualizarOpcion(o.id, "codigo", v)}
                      containerClassName="mb-0 md:w-32"
                    />
                    <Input
                      label="Etiqueta"
                      value={o.etiqueta}
                      placeholder="Texto de la respuesta"
                      editable={editable}
                      onChangeText={(v) => p.actualizarOpcion(o.id, "etiqueta", v)}
                      containerClassName="mb-0 min-w-0 flex-1"
                    />
                    {p.form.puntua && (
                      <Input
                        label="Puntaje"
                        value={o.valorPuntaje}
                        placeholder="0"
                        editable={editable}
                        keyboardType="decimal-pad"
                        onChangeText={(v) =>
                          p.actualizarOpcion(
                            o.id,
                            "valorPuntaje",
                            v.replace(/[^0-9.-]/g, ""),
                          )
                        }
                        containerClassName="mb-0 md:w-32"
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {!!p.error && (
            <View className="flex-row gap-2 rounded-xl border border-danger p-3">
              <Ionicons name="alert-circle-outline" size={19} className="text-danger" />
              <Text className="flex-1 font-nunito-medium text-xs leading-5 text-danger">
                {p.error}
              </Text>
            </View>
          )}

          <View className="gap-2 md:flex-row md:justify-end">
            <Button
              title="Cancelar"
              variant="secondary"
              disabled={p.guardando}
              onPress={p.cancelar}
              className="my-0 w-auto"
            />
            <Button
              title={p.guardando ? "Guardando..." : "Guardar pregunta"}
              icon="save-outline"
              disabled={p.guardando || disabled}
              loading={p.guardando}
              onPress={p.guardar}
              className="my-0 w-auto"
            />
          </View>
        </AdminCard>
      )}

      {p.cargando ? (
        <View className="min-h-40 items-center justify-center gap-3">
          <ActivityIndicator color={primary} />
          <Text className="font-nunito-medium text-xs text-text-secondary">
            Cargando preguntas...
          </Text>
        </View>
      ) : !p.preguntas.length && !p.mostrarForm ? (
        <AdminCard className="p-0">
          <AdminEmptyState
            mensaje="Aún no hay preguntas. Agrega la primera pregunta para comenzar a construir este cuestionario."
            icono="help-circle-outline"
          />
        </AdminCard>
      ) : (
        <View className="gap-3">
          {p.preguntas.map((pregunta, index) => {
            const tipo = TIPOS.find((t) => t.valor === pregunta.tipo_pregunta);

            return (
              <AdminCard key={pregunta.id_pregunta} className="gap-3 md:flex-row md:items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                  <Text className="font-nunito-bold text-sm text-primary">{index + 1}</Text>
                </View>

                <View className="min-w-0 flex-1 gap-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="font-nunito-bold text-sm text-text">{pregunta.codigo}</Text>
                    {!!tipo && (
                      <View className="rounded-full bg-surface-secondary px-2 py-1">
                        <Text className="font-nunito-semibold text-xs text-text-secondary">
                          {tipo.label}
                        </Text>
                      </View>
                    )}
                    {!pregunta.estado && <AdminStatusBadge estado="inactivo" label="Inactiva" />}
                  </View>

                  <Text className="font-nunito-semibold text-sm leading-5 text-text">
                    {pregunta.enunciado}
                  </Text>

                  <View className="flex-row flex-wrap gap-3">
                    <Text className="font-nunito-medium text-xs text-text-muted">
                      {pregunta.opcion_test?.length ?? 0} opciones
                    </Text>
                    {pregunta.obligatoria && (
                      <Text className="font-nunito-medium text-xs text-primary">Obligatoria</Text>
                    )}
                    {pregunta.puntua && (
                      <Text className="font-nunito-medium text-xs text-success">Puntúa</Text>
                    )}
                  </View>
                </View>
              </AdminCard>
            );
          })}
        </View>
      )}
    </View>
  );
}