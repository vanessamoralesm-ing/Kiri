import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { generarPlanBienestar, obtenerPlanBienestar, PlanBienestar as TipoPlanBienestar } from "@/services/entrevista/planBienestarService";
import { finalizarEntrevista } from "@/services/entrevista/finalizarEntrevistaService";
import { styles } from "@/styles/planBienestar.styles";

type Props = { modo: "entrevista" | "historial" };

function esUUID(valor: string | undefined): valor is string {
  if (!valor || valor === "[id]") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}

export default function PlanBienestar({ modo }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const movil = width < 600;

  const params = useLocalSearchParams<{ id: string }>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const [plan, setPlan] = useState<TipoPlanBienestar | null>(null);
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ID recibido en plan:", idEntrevista);

    if (!esUUID(idEntrevista)) {
      setError("No se encontró una entrevista válida.");
      setCargando(false);
      return;
    }

    let activo = true;

    async function cargarPlan() {
      try {
        setCargando(true);
        setError(null);

        /*
          1. BUSCAR PLAN EXISTENTE
        */
        const existente = await obtenerPlanBienestar(idEntrevista);
        if (!activo) return;

        if (existente) {
          console.log("PLAN EXISTENTE CARGADO:", existente.id_plan);
          setPlan(existente);
          return;
        }

        /*
          2. HISTORIAL
          NUNCA GENERA PLAN NUEVO
        */
        if (modo === "historial") {
          setError("No encontramos un plan asociado a esta entrevista.");
          return;
        }

        /*
          3. ENTREVISTA ACTIVA
          OBTENER RESULTADOS
        */
        const { data, error: resultadosError } = await supabase
          .from("resultado_entrevista")
          .select(`
            porcentaje,
            nivel,
            modulo_entrevista!inner(
              codigo,
              nombre
            )
          `)
          .eq("id_entrevista", idEntrevista)
          .order("porcentaje", { ascending: false });

        if (resultadosError) throw resultadosError;
        if (!activo) return;

        const resultados = (data ?? []).map((item: any) => {
          const modulo = Array.isArray(item.modulo_entrevista) ? item.modulo_entrevista[0] : item.modulo_entrevista;
          return {
            codigo: modulo?.codigo ?? "",
            nombre: modulo?.nombre ?? "",
            porcentaje: Number(item.porcentaje ?? 0),
            nivel: item.nivel ?? "BAJO",
          };
        });

        console.log("Resultados para generar plan:", resultados);

        /*
          4. GENERAR PLAN
        */
        const nuevoPlan = await generarPlanBienestar(idEntrevista, resultados);
        if (!activo) return;

        console.log("PLAN LISTO:", nuevoPlan);
        setPlan(nuevoPlan);
      } catch (e) {
        console.error("Error cargando plan:", e);
        if (activo) {
          setError(e instanceof Error ? e.message : "No se pudo cargar tu plan de bienestar.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPlan();
    return () => { activo = false; };
  }, [idEntrevista, modo]);

  async function finalizar() {
    if (modo !== "entrevista" || !esUUID(idEntrevista) || finalizando) return;

    try {
      setFinalizando(true);
      setError(null);
      await finalizarEntrevista(idEntrevista);
      console.log("Entrevista completada correctamente:", idEntrevista);
      router.replace("/(tabs)/home");
    } catch (e) {
      console.error("Error al finalizar entrevista:", e);
      setError(e instanceof Error ? e.message : "No se pudo finalizar la entrevista.");
    } finally {
      setFinalizando(false);
    }
  }

  function salir() {
    if (modo === "historial") {
      router.replace("/(tabs)/entrevistas");
      return;
    }
    router.replace("/(tabs)/home");
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.cargandoIcono}>
            <ActivityIndicator color="#4F8EF7" />
          </View>
          <Text style={styles.cargandoTitulo}>
            {modo === "historial" ? "Cargando tu plan" : "Preparando tu plan"}
          </Text>
          <Text style={styles.cargandoTexto}>
            {modo === "historial"
              ? "Estamos recuperando el plan asociado a esta entrevista."
              : "Estamos organizando algunas acciones para acompañar tu bienestar."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.errorIcono}>
            <Ionicons name="alert-circle-outline" size={28} color="#4F8EF7" />
          </View>
          <Text style={styles.cargandoTitulo}>
            {modo === "historial" ? "No pudimos cargar este plan" : "No pudimos preparar tu plan"}
          </Text>
          <Text style={styles.cargandoTexto}>
            {error ?? "Inténtalo nuevamente más tarde."}
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={salir} style={[styles.boton, movil && styles.botonMovil]}>
            <Text style={styles.botonTexto}>
              {modo === "historial" ? "Volver a mis entrevistas" : "Volver al inicio"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          movil && styles.scrollMovil,
          movil && modo === "historial" && styles.scrollHistorialMovil,
        ]}
      >
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(550)} style={styles.header}>
          <View style={styles.headerIcono}>
            <Ionicons name="leaf" size={23} color="#4F8EF7" />
          </View>
          <Text style={styles.titulo}>
            {modo === "historial" ? "Plan de bienestar" : "Tu plan de bienestar"}
          </Text>
          <Text style={styles.subtitulo}>
            {modo === "historial"
              ? "Estas son las recomendaciones asociadas a esta evaluación."
              : "Pequeñas acciones que puedes incorporar a tu ritmo."}
          </Text>
        </Animated.View>

        {/* OBJETIVO */}
        <Animated.View entering={FadeInUp.delay(120).duration(500)} style={[styles.objetivoCard, movil && styles.objetivoCardMovil]}>
          <View style={styles.objetivoSuperior}>
            <View style={styles.objetivoIcono}>
              <Ionicons name="compass-outline" size={21} color="#FFFFFF" />
            </View>
            <View style={styles.objetivoInfo}>
              <Text style={styles.objetivoEtiqueta}>TU ENFOQUE</Text>
              <Text style={styles.objetivoTitulo}>Objetivo principal</Text>
            </View>
          </View>
          <Text style={styles.objetivoTexto}>{plan.objetivo_principal}</Text>
        </Animated.View>

        {/* SECCIÓN */}
        <Animated.View entering={FadeIn.delay(200).duration(450)} style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Para comenzar</Text>
          <Text style={styles.seccionTexto}>
            No tienes que hacer todo al mismo tiempo. Empieza con una actividad que se sienta posible para ti.
          </Text>
        </Animated.View>

        {/* ACTIVIDADES */}
        <View style={styles.lista}>
          {plan.actividades_recomendadas.length > 0 ? (
            plan.actividades_recomendadas.map((actividad, index) => (
              <Animated.View
                key={`${actividad.codigo}-${index}`}
                entering={FadeInUp.delay(240 + index * 80).duration(500)}
                style={[styles.actividadCard, movil && styles.actividadCardMovil]}
              >
                <View style={styles.numero}>
                  <Text style={styles.numeroTexto}>{index + 1}</Text>
                </View>

                <View style={styles.actividadContenido}>
                  <View style={styles.actividadTituloFila}>
                    <View style={styles.actividadIcono}>
                      <Ionicons
                        name={actividad.icono as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color="#4F8EF7"
                      />
                    </View>
                    <Text style={styles.actividadTitulo}>{actividad.titulo}</Text>
                  </View>

                  <Text style={styles.actividadDescripcion}>{actividad.descripcion}</Text>
                </View>
              </Animated.View>
            ))
          ) : (
            <View style={styles.sinActividades}>
              <View style={styles.sinActividadesIcono}>
                <Ionicons name="leaf-outline" size={21} color="#7BBF9A" />
              </View>
              <Text style={styles.sinActividadesTexto}>
                Continúa fortaleciendo los hábitos que actualmente favorecen tu bienestar.
              </Text>
            </View>
          )}
        </View>

        {/* RECORDATORIO */}
        <Animated.View entering={FadeIn.delay(500).duration(500)} style={[styles.recordatorio, movil && styles.recordatorioMovil]}>
          <View style={styles.recordatorioIcono}>
            <Ionicons name="heart-outline" size={20} color="#7BBF9A" />
          </View>
          <View style={styles.recordatorioContenido}>
            <Text style={styles.recordatorioTitulo}>Avanza a tu propio ritmo</Text>
            <Text style={styles.recordatorioTexto}>
              Tu plan puede cambiar con el tiempo. Lo importante es observar cómo te sientes y avanzar de forma gradual.
            </Text>
          </View>
        </Animated.View>

        {/* AVISO */}
        <View style={[styles.aviso, movil && styles.avisoMovil]}>
          <Ionicons name="information-circle-outline" size={19} color="#2D3748" />
          <Text style={styles.avisoTexto}>
            Estas recomendaciones son de autocuidado y orientación. No sustituyen la valoración o atención de un profesional de salud.
          </Text>
        </View>

        {/* ERROR */}
        {error && (
          <Animated.View entering={FadeIn.duration(350)} style={styles.errorFinal}>
            <Ionicons name="alert-circle-outline" size={19} color="#B8A8F8" />
            <Text style={styles.errorFinalTexto}>{error}</Text>
          </Animated.View>
        )}

        {/* BOTÓN */}
        {modo === "entrevista" ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={finalizar}
              disabled={finalizando}
              style={[styles.boton, movil && styles.botonMovil, finalizando && styles.botonDeshabilitado]}
            >
              {finalizando ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.botonTexto}>Finalizando...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.botonTexto}>Finalizar entrevista</Text>
                  <Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.textoFinal}>
              Al finalizar, esta evaluación se guardará en tu historial.
            </Text>
          </>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={salir} style={[styles.boton, movil && styles.botonMovil]}>
            <Text style={styles.botonTexto}>Volver a mis entrevistas</Text>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}