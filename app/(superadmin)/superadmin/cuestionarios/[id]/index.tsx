import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import EditorBaremos from "@/components/superadmin/cuestionarios/EditorBaremos";
import EditorInformacionTest from "@/components/superadmin/cuestionarios/EditorInformacionTest";
import EditorOpciones from "@/components/superadmin/cuestionarios/EditorOpciones";
import EditorPreguntas from "@/components/superadmin/cuestionarios/EditorPreguntas";
import EditorRevisionTest from "@/components/superadmin/cuestionarios/EditorRevisionTest";
import EditorSubescalas from "@/components/superadmin/cuestionarios/EditorSubescalas";
import Button from "@/components/ui/Button";
import { useEditarCuestionario } from "@/hooks/superadmin/useEditarCuestionario";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cn } from "@/utils/cn";

export default function EditarCuestionarioScreen() {
  const { id: param } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const primary = useThemeColor({}, "primary");
  const id = Array.isArray(param) ? param[0] : param;
  const c = useEditarCuestionario(id);

  if (c.cargando)
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background">
        <ActivityIndicator size="large" color={primary} />
        <Text className="font-nunito-medium text-sm text-text-secondary">
          Cargando cuestionario...
        </Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-4 pb-28 pt-5 md:px-8 md:pt-7"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-screen-xl self-center gap-5">
        <Pressable
          disabled={c.guardando}
          onPress={() => router.replace("/superadmin/cuestionarios" as never)}
          className="min-h-11 flex-row items-center gap-2 self-start active:opacity-70"
        >
          <Ionicons name="arrow-back" size={20} className="text-primary" />
          <Text className="font-nunito-semibold text-sm text-primary">
            Volver a cuestionarios
          </Text>
        </Pressable>

        {!c.test ? (
          <AdminCard>
            <Text className="font-nunito-bold text-lg text-text">
              No se pudo abrir el cuestionario
            </Text>
            <AdminEmptyState
              error
              mensaje={c.error ?? "No existe un cuestionario con ese identificador."}
            />
            <Button title="Intentar nuevamente" onPress={c.cargar} className="my-0" />
          </AdminCard>
        ) : (
          <>
            <View className="gap-3 md:flex-row md:items-center">
              <View className="min-w-0 flex-1 gap-1">
                <Text className="font-nunito-bold text-2xl text-text lg:text-3xl">
                  {c.test.nombre}
                </Text>
                <Text className="font-nunito-medium text-sm text-text-secondary">
                  {c.test.codigo} · Versión {c.test.version ?? "sin definir"}
                </Text>
              </View>
              <AdminStatusBadge
                estado={c.test.estado ? "activo" : "inactivo"}
                label={c.test.estado ? "Publicado" : "Borrador / inactivo"}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 py-1"
            >
              {c.etapasVisibles.map((item) => {
                const activa = c.etapa === item.id;
                return (
                  <Pressable
                    key={item.id}
                    disabled={c.guardando}
                    onPress={() => c.cambiarEtapa(item.id)}
                    className={cn(
                      "min-h-12 flex-row items-center gap-2 rounded-xl border px-4 active:opacity-70",
                      activa
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-surface",
                    )}
                  >
                    <Ionicons
                      name={item.icono}
                      size={18}
                      className={activa ? "text-primary" : "text-text-secondary"}
                    />
                    <Text
                      className={cn(
                        "text-xs",
                        activa
                          ? "font-nunito-bold text-primary"
                          : "font-nunito-semibold text-text",
                      )}
                    >
                      {item.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {!!c.mensaje && (
              <Text
                accessibilityRole="alert"
                className="rounded-xl bg-secondary-soft p-3 font-nunito-semibold text-sm text-success"
              >
                {c.mensaje}
              </Text>
            )}

            {!!c.error && (
              <Text
                accessibilityRole="alert"
                className="rounded-xl border border-danger p-3 font-nunito-medium text-sm text-danger"
              >
                {c.error}
              </Text>
            )}

            {c.etapa === "informacion" && c.formulario && (
              <View className="gap-3">
                <EditorInformacionTest
                  value={c.formulario}
                  onChange={c.setFormulario}
                  disabled={c.guardando}
                />
                <Button
                  title={c.guardando ? "Guardando..." : "Guardar cambios"}
                  icon="save-outline"
                  loading={c.guardando}
                  onPress={c.guardarInformacion}
                  className="my-0"
                />
              </View>
            )}

            {c.etapa === "subescalas" && c.test.tiene_subescalas && (
              <EditorSubescalas
                idTest={c.test.id_test}
                onCambio={c.onCambioSubescalas}
              />
            )}

            {c.etapa === "preguntas" && (
              <View className="gap-5">
                {c.test.tiene_subescalas && !c.subescalasActivas.length && (
                  <AdminCard>
                    <Text className="font-nunito-medium text-sm text-danger">
                      Registra al menos una subescala activa antes de crear preguntas.
                    </Text>
                    <Button
                      title="Ir a subescalas"
                      variant="secondary"
                      onPress={() => c.cambiarEtapa("subescalas")}
                      className="my-0"
                    />
                  </AdminCard>
                )}

                <EditorPreguntas
                  idTest={c.test.id_test}
                  tieneSubescalas={c.test.tiene_subescalas}
                  subescalas={c.subescalasActivas}
                  disabled={c.test.tiene_subescalas && !c.subescalasActivas.length}
                  onCambio={c.onCambioPreguntas}
                />

                <AdminCard>
                  <Text className="font-nunito-bold text-lg text-text">
                    Editar opciones de una pregunta
                  </Text>
                  <Text className="font-nunito-medium text-xs text-text-secondary">
                    Selecciona una pregunta para administrar sus respuestas.
                  </Text>

                  {!c.preguntasConOpciones.length ? (
                    <Text className="font-nunito-medium text-xs text-text-secondary">
                      No hay preguntas con opciones registradas.
                    </Text>
                  ) : (
                    <View className="gap-2">
                      {c.preguntasConOpciones.map((p) => {
                        const activa =
                          c.preguntaSeleccionada?.id_pregunta === p.id_pregunta;

                        return (
                          <Pressable
                            key={p.id_pregunta}
                            onPress={() => c.seleccionarPregunta(p.id_pregunta)}
                            className={cn(
                              "flex-row items-center gap-2 rounded-xl border p-3 active:opacity-70",
                              activa
                                ? "border-primary bg-primary-soft"
                                : "border-border bg-surface-secondary",
                            )}
                          >
                            <View className="min-w-0 flex-1 gap-1">
                              <Text className="font-nunito-bold text-sm text-text">
                                {p.codigo} · {p.enunciado}
                              </Text>
                              <Text className="font-nunito-medium text-xs text-text-secondary">
                                {p.opcion_test?.length ?? 0} opciones registradas
                              </Text>
                            </View>
                            <Ionicons
                              name={activa ? "chevron-up" : "chevron-down"}
                              size={19}
                              className="text-primary"
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  {c.preguntaSeleccionada && (
                    <View className="border-t border-border pt-4">
                      <EditorOpciones
                        key={c.preguntaSeleccionada.id_pregunta}
                        idPregunta={c.preguntaSeleccionada.id_pregunta}
                        puntua={c.preguntaSeleccionada.puntua}
                        onCambio={c.onCambioOpciones}
                      />
                    </View>
                  )}
                </AdminCard>
              </View>
            )}

            {c.etapa === "baremos" && (
              <EditorBaremos
                idTest={c.test.id_test}
                subescalas={c.subescalasActivas}
              />
            )}

            {c.etapa === "revision" && (
              <EditorRevisionTest
                key={`${c.test.id_test}-${c.revisionVersion}`}
                idTest={c.test.id_test}
                onPublicado={c.cargar}
                onDespublicado={c.cargar}
              />
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}