import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { crearEntrevista } from "@/services/entrevista/entrevistaService";
import {
  EntrevistaHistorial,
  obtenerHistorialEntrevistas,
} from "@/services/entrevista/historialEntrevistaService";
import { cn } from "@/utils/cn";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ==========================================================
// FECHA
// ==========================================================

const formatoFecha = new Intl.DateTimeFormat("es-NI", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatearFecha(fecha: string | null) {
  if (!fecha) return "Sin fecha";

  const valor = new Date(fecha);

  return Number.isNaN(valor.getTime())
    ? "Sin fecha"
    : formatoFecha.format(valor);
}

// ==========================================================
// PANTALLA
// ==========================================================

export default function MisEntrevistasScreen() {
  const router = useRouter();

  // ActivityIndicator requiere un valor de color directo.
  const primary = useThemeColor({}, "primary");

  const [entrevistas, setEntrevistas] = useState<
    EntrevistaHistorial[]
  >([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // CARGAR HISTORIAL
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargar() {
        try {
          setCargando(true);
          setError(null);

          const data =
            await obtenerHistorialEntrevistas();

          if (activo) {
            setEntrevistas(data);
          }
        } catch (error) {
          console.error(
            "Error cargando historial:",
            error,
          );

          if (activo) {
            setError(
              "No pudimos cargar tus entrevistas.",
            );
          }
        } finally {
          if (activo) {
            setCargando(false);
          }
        }
      }

      void cargar();

      return () => {
        activo = false;
      };
    }, []),
  );

  // ========================================================
  // NUEVA ENTREVISTA
  // ========================================================

  async function nuevaEntrevista() {
    if (creando) return;

    try {
      setCreando(true);
      setError(null);

      const entrevista = await crearEntrevista();

      router.push(
        `/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales` as any,
      );
    } catch (error) {
      console.error(
        "Error creando entrevista:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar una nueva entrevista.",
      );
    } finally {
      setCreando(false);
    }
  }

  const verResultado = (id: string) =>
    router.push(
      `/(tabs)/entrevistas/${id}/resultado` as any,
    );

  const verPlan = (id: string) =>
    router.push(
      `/(tabs)/entrevistas/${id}/plan` as any,
    );

  const ultima = entrevistas[0];
  const anteriores = entrevistas.slice(1);

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Responsive:
            móvil usa px-4;
            tablet aumenta a md:px-8;
            escritorio limita el contenido con max-w-6xl. */}
        <View className="mx-auto w-full max-w-6xl px-4 pb-40 pt-5 md:px-8 md:pt-6 lg:pb-16 lg:pt-7">
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View className="mb-6 max-w-4xl flex-row items-start lg:mb-7">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver al inicio"
              hitSlop={8}
              onPress={() =>
                router.replace("/(tabs)/home")
              }
              className="h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface active:opacity-70 md:h-12 md:w-12"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                className="text-icon"
              />
            </Pressable>

            <View className="ml-3 min-w-0 flex-1 md:ml-4">
              {/* Responsive:
                  título aumenta desde md/lg. */}
              <Text className="font-nunito-bold text-2xl leading-8 text-text md:text-3xl lg:text-4xl">
                Entrevista de bienestar
              </Text>

              <Text className="mt-1 max-w-2xl font-nunito-medium text-sm leading-6 text-text-secondary md:text-base">
                Consulta tus evaluaciones anteriores o
                realiza una nueva.
              </Text>
            </View>
          </View>

          {/* ==================================================
              NUEVA ENTREVISTA
          ================================================== */}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: creando,
            }}
            disabled={creando}
            onPress={nuevaEntrevista}
            className={cn(
              "mb-8 w-full overflow-hidden rounded-3xl bg-primary shadow-sm active:opacity-80",
              creando && "opacity-60",
            )}
          >
            {/* Responsive:
                CTA más compacto en móvil y con mayor
                padding desde md. */}
            <View className="min-h-28 flex-row items-center px-4 py-5 md:min-h-32 md:px-6 md:py-6">
              <View className="h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface md:h-16 md:w-16">
                {creando ? (
                  <ActivityIndicator
                    size="small"
                    color={primary}
                  />
                ) : (
                  <Ionicons
                    name="add"
                    size={30}
                    className="text-primary"
                  />
                )}
              </View>

              <View className="ml-4 min-w-0 flex-1 md:ml-5">
                <Text className="font-nunito-bold text-lg text-text-on-primary md:text-xl">
                  {creando
                    ? "Preparando evaluación..."
                    : "Nueva evaluación"}
                </Text>

                <Text className="mt-1 font-nunito-medium text-sm leading-5 text-text-on-primary md:text-base md:leading-6">
                  {creando
                    ? "Estamos preparando una nueva entrevista."
                    : "Cuéntanos cómo te sientes actualmente y recibe una evaluación de bienestar."}
                </Text>
              </View>

              {!creando && (
                <View className="ml-3 h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft md:h-10 md:w-10">
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    className="text-primary"
                  />
                </View>
              )}
            </View>
          </Pressable>

          {/* ==================================================
              ESTADOS
          ================================================== */}

          {cargando ? (
            <View className="min-h-64 w-full items-center justify-center">
              <ActivityIndicator
                size="small"
                color={primary}
              />

              <Text className="mt-3 font-nunito-medium text-sm text-text-secondary">
                Cargando tus entrevistas...
              </Text>
            </View>
          ) : error ? (
            <EstadoVacio
              icono="alert-circle-outline"
              titulo="No pudimos cargar tus entrevistas"
              texto={error}
            />
          ) : entrevistas.length === 0 ? (
            <EstadoVacio
              icono="heart-outline"
              titulo="Aún no tienes evaluaciones"
              texto="Realiza tu primera entrevista para comenzar a conocer mejor tu bienestar."
              accion="Realizar mi primera entrevista"
              cargando={creando}
              onAccion={nuevaEntrevista}
            />
          ) : (
            <>
              {/* ==================================================
                  ÚLTIMA EVALUACIÓN
              ================================================== */}

              <Text className="mb-5 mt-3 font-nunito-bold text-xl text-text md:text-2xl">
                Última evaluación
              </Text>

              <View className="w-full rounded-3xl border border-border bg-surface p-4 shadow-sm md:p-5 lg:p-6">
                {/* Responsive:
                    fecha y estado se apilan en móvil;
                    desde md comparten la misma fila. */}
                <View className="gap-3 md:flex-row md:items-center md:justify-between">
                  <View className="min-w-0 flex-1 flex-row items-center">
                    <View className="h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        className="text-primary"
                      />
                    </View>

                    <View className="ml-3 min-w-0 flex-1">
                      <Text className="font-nunito-medium text-xs text-text-muted">
                        Realizada el
                      </Text>

                      <Text className="mt-1 font-nunito-bold text-sm leading-5 text-text md:text-base">
                        {formatearFecha(
                          ultima.fecha_fin,
                        )}
                      </Text>
                    </View>
                  </View>

                  <View className="self-start rounded-full bg-secondary-soft px-4 py-2 md:self-center">
                    <Text className="font-nunito-semibold text-xs text-secondary">
                      Completada
                    </Text>
                  </View>
                </View>

                {ultima.areas_prioritarias.length > 0 && (
                  <View className="mt-5 rounded-2xl border border-border bg-surface-secondary p-4">
                    <Text className="font-nunito-medium text-xs text-text-muted">
                      Enfoque principal
                    </Text>

                    <View className="mt-2 flex-row items-center gap-3">
                      <Text className="min-w-0 flex-1 font-nunito-bold text-sm leading-5 text-text md:text-base">
                        {ultima.areas_prioritarias.join(
                          " y ",
                        )}
                      </Text>

                      {ultima.porcentaje !== null && (
                        <Text className="shrink-0 font-nunito-bold text-xl text-primary md:text-2xl">
                          {Math.round(
                            ultima.porcentaje,
                          )}
                          %
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {/* Responsive:
                    acciones en columna en móvil;
                    desde md pasan a una fila. */}
                <View className="mt-5 gap-3 md:flex-row">
                  <View className="flex-1">
                    <Button
                      title="Ver resultados"
                      icon="analytics-outline"
                      variant="secondary"
                      onPress={() =>
                        verResultado(
                          ultima.id_entrevista,
                        )
                      }
                      className="my-0 w-full"
                    />
                  </View>

                  {ultima.tiene_plan && (
                    <View className="flex-1">
                      <Button
                        title="Ver plan"
                        icon="clipboard-outline"
                        variant="secondary"
                        onPress={() =>
                          verPlan(
                            ultima.id_entrevista,
                          )
                        }
                        className="my-0 w-full"
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* ==================================================
                  HISTORIAL
              ================================================== */}

              {anteriores.length > 0 && (
                <View className="mt-8 lg:mt-10">
                  <Text className="font-nunito-bold text-xl text-text md:text-2xl">
                    Historial
                  </Text>

                  <Text className="mt-1 font-nunito-medium text-sm text-text-muted">
                    Revisa tus evaluaciones anteriores.
                  </Text>

                  {/* Responsive:
                      una tarjeta por fila en móvil/tablet;
                      dos columnas desde lg.
                      Se usa w-1/2 y padding para evitar
                      porcentajes arbitrarios como 49%. */}
                  <View className="-mx-2 mt-3 flex-row flex-wrap">
                    {anteriores.map(
                      (entrevista) => (
                        <View
                          key={
                            entrevista.id_entrevista
                          }
                          className="w-full p-2 lg:w-1/2"
                        >
                          <Pressable
                            accessibilityRole="button"
                            onPress={() =>
                              verResultado(
                                entrevista.id_entrevista,
                              )
                            }
                            className="min-h-24 w-full flex-row items-center rounded-2xl border border-border bg-surface p-4 active:opacity-80"
                          >
                            <View className="h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
                              <Ionicons
                                name="heart-outline"
                                size={20}
                                className="text-primary"
                              />
                            </View>

                            <View className="ml-3 min-w-0 flex-1">
                              <Text className="font-nunito-bold text-sm leading-5 text-text">
                                {formatearFecha(
                                  entrevista.fecha_fin,
                                )}
                              </Text>

                              {entrevista
                                .areas_prioritarias
                                .length > 0 && (
                                <Text
                                  numberOfLines={2}
                                  className="mt-1 font-nunito-medium text-xs leading-5 text-text-secondary"
                                >
                                  {entrevista.areas_prioritarias.join(
                                    " y ",
                                  )}
                                </Text>
                              )}
                            </View>

                            <View className="ml-2 shrink-0 items-end gap-1">
                              {entrevista.porcentaje !==
                                null && (
                                <Text className="font-nunito-bold text-base text-primary">
                                  {Math.round(
                                    entrevista.porcentaje,
                                  )}
                                  %
                                </Text>
                              )}

                              <Ionicons
                                name="chevron-forward"
                                size={19}
                                className="text-primary"
                              />
                            </View>
                          </Pressable>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================================
// ESTADO VACÍO
// ==========================================================
//
// Se mantiene local porque solo se usa en esta pantalla.
// Moverlo a otro archivo agregaría imports/exports sin
// aportar reutilización real.
//

function EstadoVacio({
  icono,
  titulo,
  texto,
  accion,
  cargando = false,
  onAccion,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  texto: string;
  accion?: string;
  cargando?: boolean;
  onAccion?: () => void;
}) {
  return (
    // Responsive:
    // aumenta padding y altura mínima desde md.
    <View className="min-h-64 w-full items-center justify-center rounded-3xl border border-border bg-surface p-6 md:min-h-72 md:p-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
        <Ionicons
          name={icono}
          size={29}
          className="text-primary"
        />
      </View>

      <Text className="mt-4 text-center font-nunito-bold text-lg text-text">
        {titulo}
      </Text>

      <Text className="mt-2 max-w-md text-center font-nunito-medium text-sm leading-5 text-text-secondary">
        {texto}
      </Text>

      {accion && onAccion && (
        <Button
          title={cargando ? "Preparando..." : accion}
          loading={cargando}
          disabled={cargando}
          onPress={onAccion}
          className="my-0 mt-5 w-full max-w-sm"
        />
      )}
    </View>
  );
}