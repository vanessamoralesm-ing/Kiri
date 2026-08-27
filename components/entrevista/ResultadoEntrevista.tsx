import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { styles } from "@/styles/resultadoEntrevista.styles";

type NivelResultado = "BAJO" | "MODERADO" | "ALTO";

type Resultado = {
  id_resultado: string;
  id_modulo: string;
  codigo: string;
  nombre: string;
  puntaje: number;
  porcentaje: number;
  nivel: NivelResultado;
};

type Props = {
  modo: "entrevista" | "historial";
};

const CONFIG: Record<string, { icono: keyof typeof Ionicons.glyphMap }> = {
  SOMATICO: { icono: "body-outline" },
  ANSIEDAD_INSOMNIO: { icono: "moon-outline" },
  SUENO: { icono: "bed-outline" },
  APOYO_SOCIAL: { icono: "people-outline" },
  VIDA_DIARIA: { icono: "calendar-outline" },
  ESTADO_EMOCIONAL: { icono: "heart-outline" },
};

function obtenerRelacion(valor: any) {
  return Array.isArray(valor) ? valor[0] : valor;
}

function textoNivel(nivel: NivelResultado) {
  if (nivel === "ALTO") return "Mayor atención";
  if (nivel === "MODERADO") return "Atención moderada";
  return "Menor atención";
}

function descripcionNivel(nivel: NivelResultado) {
  if (nivel === "ALTO") return "Esta área puede beneficiarse de un mayor acompañamiento.";
  if (nivel === "MODERADO") return "Conviene seguir observando y fortaleciendo esta área.";
  return "Tus respuestas muestran menor dificultad en esta área.";
}

function normalizarNivel(valor: any): NivelResultado {
  if (valor === "ALTO") return "ALTO";
  if (valor === "MODERADO") return "MODERADO";
  return "BAJO";
}

function esUUID(valor: string | undefined): valor is string {
  if (!valor || valor === "[id]") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}

function anchoBarra(valor: number): `${number}%` {
  const seguro = Math.min(Math.max(valor, 0), 100);
  return `${seguro}%`;
}

export default function ResultadoEntrevista({ modo }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  /*
    WEB:
    conserva el diseño normal anterior.

    MÓVIL:
    aplica ajustes cuando el ancho es menor de 600px.
  */
  const movil = width < 600;

  const params = useLocalSearchParams<{ id: string }>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ========================================================
     CARGAR RESULTADOS
  ======================================================== */
  useEffect(() => {
    console.log("ID recibido en resultado:", idEntrevista);

    if (!esUUID(idEntrevista)) {
      setError("No se encontró una entrevista válida.");
      setCargando(false);
      return;
    }

    let activo = true;

    async function cargarResultados() {
      try {
        setCargando(true);
        setError(null);

        const { data, error } = await supabase
          .from("resultado_entrevista")
          .select(`
            id_resultado,
            id_modulo,
            puntaje,
            porcentaje,
            nivel,
            modulo_entrevista!inner(
              codigo,
              nombre
            )
          `)
          .eq("id_entrevista", idEntrevista)
          .order("porcentaje", { ascending: false });

        if (error) throw error;
        if (!activo) return;

        const lista: Resultado[] = (data ?? []).map((item: any) => {
          const modulo = obtenerRelacion(item.modulo_entrevista);
          return {
            id_resultado: item.id_resultado,
            id_modulo: item.id_modulo,
            codigo: modulo?.codigo ?? "",
            nombre: modulo?.nombre ?? "Área de bienestar",
            puntaje: Number(item.puntaje ?? 0),
            porcentaje: Number(item.porcentaje ?? 0),
            nivel: normalizarNivel(item.nivel),
          };
        });

        console.log("Resultados cargados:", lista);
        setResultados(lista);
      } catch (e) {
        console.error("Error cargando resultados:", e);
        if (activo) setError("No pudimos cargar tus resultados.");
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarResultados();
    return () => { activo = false; };
  }, [idEntrevista]);

  /* ========================================================
     PRIORIDADES
  ======================================================== */
  const prioridades = useMemo(() => {
    if (!resultados.length) return [];
    const mayor = resultados[0].porcentaje;
    return resultados.filter((resultado) => Math.abs(resultado.porcentaje - mayor) < 0.01);
  }, [resultados]);

  /* ========================================================
     PROMEDIO
  ======================================================== */
  const promedio = useMemo(() => {
    if (!resultados.length) return 0;
    const total = resultados.reduce((acumulado, resultado) => acumulado + resultado.porcentaje, 0);
    return total / resultados.length;
  }, [resultados]);

  /* ========================================================
     NAVEGAR AL PLAN
  ======================================================== */
  function continuar() {
    if (!esUUID(idEntrevista)) {
      console.error("ID inválido al abrir plan:", idEntrevista);
      return;
    }

    console.log("ABRIENDO PLAN:", idEntrevista);

    if (modo === "historial") {
      router.push(`/(tabs)/entrevistas/${idEntrevista}/plan` as any);
      return;
    }

    router.replace(`/(entrevista)/jovenes-adultos/${idEntrevista}/plan` as any);
  }

  /* ========================================================
     SALIR
  ======================================================== */
  function salir() {
    if (modo === "historial") {
      router.replace("/(tabs)/entrevistas");
      return;
    }
    router.replace("/(tabs)/home");
  }

  /* ========================================================
     CARGANDO
  ======================================================== */
  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.cargandoCirculo}>
            <ActivityIndicator color="#6594F4" />
          </View>
          <Text style={styles.cargandoTitulo}>Preparando tu perfil</Text>
          <Text style={styles.cargandoTexto}>Estamos organizando los resultados de tu entrevista.</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */
  if (error) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.errorCirculo}>
            <Ionicons name="alert-circle-outline" size={28} color="#7189C7" />
          </View>
          <Text style={styles.cargandoTitulo}>No pudimos mostrar tus resultados</Text>
          <Text style={styles.cargandoTexto}>{error}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={salir} style={[styles.botonPrincipal, movil && styles.botonPrincipalMovil]}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.botonTexto}>{modo === "historial" ? "Volver a mis entrevistas" : "Volver al inicio"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ========================================================
     PANTALLA PRINCIPAL
  ======================================================== */
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
        {/* ==================================================
            HEADER
        ================================================== */}
        <Animated.View entering={FadeInUp.duration(550)} style={styles.header}>
          <View style={styles.headerIcono}>
            <Ionicons name="sparkles" size={22} color="#6594F4" />
          </View>
          <Text style={styles.titulo}>{modo === "historial" ? "Perfil de bienestar" : "Tu perfil de bienestar"}</Text>
          <Text style={styles.subtitulo}>Una mirada general a las áreas que exploramos contigo.</Text>
        </Animated.View>

        {/* ==================================================
            CASO ESTABLE
        ================================================== */}
        {!resultados.length ? (
          <Animated.View entering={FadeInUp.delay(120).duration(500)} style={[styles.estableCard, movil && styles.estableCardMovil]}>
            <View style={styles.estableIcono}>
              <Ionicons name="leaf-outline" size={26} color="#78B99B" />
            </View>
            <Text style={styles.estableTitulo}>Todo se ve estable por ahora</Text>
            <Text style={styles.estableTexto}>Tus respuestas no activaron áreas adicionales que necesitaran una exploración más profunda.</Text>
          </Animated.View>
        ) : (
          <>
            {/* ==============================================
                RESUMEN
            ============================================== */}
            <Animated.View entering={FadeInUp.delay(100).duration(500)} style={[styles.resumenCard, movil && styles.resumenCardMovil]}>
              <View style={styles.resumenSuperior}>
                <View style={styles.resumenInfo}>
                  <Text style={styles.resumenEtiqueta}>RESUMEN DE TU ENTREVISTA</Text>
                  <Text style={styles.resumenTitulo}>Exploramos {resultados.length} {resultados.length === 1 ? "área" : "áreas"}</Text>
                </View>
                <View style={styles.resumenIcono}>
                  <Ionicons name="analytics-outline" size={22} color="#6594F4" />
                </View>
              </View>

              <View style={styles.resumenSeparador} />

              <View style={styles.resumenInferior}>
                <View style={styles.resumenDato}>
                  <Text style={styles.resumenNumero}>{Math.round(promedio)}%</Text>
                  <Text style={styles.resumenDatoTexto}>promedio general</Text>
                </View>

                <View style={styles.divisorVertical} />

                <View style={styles.resumenDato}>
                  <Text style={styles.resumenNumero}>{Math.round(resultados[0].porcentaje)}%</Text>
                  <Text style={styles.resumenDatoTexto}>mayor indicador</Text>
                </View>
              </View>
            </Animated.View>

            {/* ==============================================
                ENCABEZADO ÁREAS
            ============================================== */}
            <Animated.View entering={FadeIn.delay(180).duration(450)} style={styles.seccionHeader}>
              <View style={styles.seccionInfo}>
                <Text style={styles.seccionTitulo}>Áreas exploradas</Text>
                <Text style={styles.seccionTexto}>De mayor a menor necesidad de atención.</Text>
              </View>
              <View style={styles.cantidad}>
                <Text style={styles.cantidadTexto}>{resultados.length}</Text>
              </View>
            </Animated.View>

            {/* ==============================================
                TARJETAS
            ============================================== */}
            <View style={styles.lista}>
              {resultados.map((resultado, index) => {
                const icono: keyof typeof Ionicons.glyphMap = CONFIG[resultado.codigo]?.icono ?? "sparkles-outline";
                const esPrioridad = prioridades.some((prioridad) => prioridad.id_modulo === resultado.id_modulo);

                return (
                  <Animated.View
                    key={resultado.id_resultado}
                    entering={FadeInUp.delay(220 + index * 80).duration(500)}
                    style={[
                      styles.card,
                      movil && styles.cardMovil,
                      esPrioridad && styles.cardPrioridad,
                    ]}
                  >
                    {/* FILA SUPERIOR */}
                    <View style={styles.cardSuperior}>
                      <View style={styles.areaIcono}>
                        <Ionicons name={icono} size={22} color="#6594F4" />
                      </View>

                      <View style={styles.areaInfo}>
                        <View style={styles.nombreFila}>
                          <Text style={styles.areaNombre}>{resultado.nombre}</Text>
                          {esPrioridad && (
                            <View style={styles.prioridadMini}>
                              <Text style={styles.prioridadMiniTexto}>Prioridad</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.nivelFila}>
                          <View
                            style={[
                              styles.nivelPunto,
                              resultado.nivel === "BAJO" && styles.nivelBajo,
                              resultado.nivel === "MODERADO" && styles.nivelModerado,
                              resultado.nivel === "ALTO" && styles.nivelAlto,
                            ]}
                          />
                          <Text style={styles.nivelTexto}>{textoNivel(resultado.nivel)}</Text>
                        </View>
                      </View>

                      <View style={styles.porcentaje}>
                        <Text style={styles.porcentajeNumero}>{Math.round(resultado.porcentaje)}</Text>
                        <Text style={styles.porcentajeSimbolo}>%</Text>
                      </View>
                    </View>

                    {/* BARRA */}
                    <View style={styles.barraContenedor}>
                      <View style={[styles.barra, { width: anchoBarra(resultado.porcentaje) }]} />
                    </View>

                    {/* DESCRIPCIÓN */}
                    <Text style={styles.cardDescripcion}>{descripcionNivel(resultado.nivel)}</Text>
                  </Animated.View>
                );
              })}
            </View>

            {/* ==============================================
                ENFOQUE PRINCIPAL
            ============================================== */}
            {!!prioridades.length && (
              <Animated.View entering={FadeInUp.delay(450).duration(550)} style={[styles.enfoqueCard, movil && styles.enfoqueCardMovil]}>
                <View style={styles.enfoqueIcono}>
                  <Ionicons name="compass-outline" size={22} color="#FFFFFF" />
                </View>

                <View style={styles.enfoqueContenido}>
                  <Text style={styles.enfoqueEtiqueta}>ENFOQUE PRINCIPAL</Text>
                  <Text style={styles.enfoqueTitulo}>{prioridades.map((prioridad) => prioridad.nombre).join(" y ")}</Text>
                  <Text style={styles.enfoqueTexto}>
                    {prioridades.length === 1
                      ? "Esta área obtuvo el indicador más alto y será una referencia importante para tu plan de bienestar."
                      : "Estas áreas comparten el indicador más alto y serán una referencia importante para tu plan de bienestar."}
                  </Text>
                </View>
              </Animated.View>
            )}
          </>
        )}

        {/* ==================================================
            AVISO
        ================================================== */}
        <Animated.View entering={FadeIn.delay(500).duration(500)} style={[styles.aviso, movil && styles.avisoMovil]}>
          <Ionicons name="information-circle-outline" size={19} color="#71809A" />
          <Text style={styles.avisoTexto}>
            Estos resultados son orientativos y están pensados para apoyar tu autocuidado. No representan un diagnóstico clínico.
          </Text>
        </Animated.View>

        {/* ==================================================
            BOTÓN PLAN
        ================================================== */}
        <TouchableOpacity activeOpacity={0.8} onPress={continuar} style={[styles.botonPrincipal, movil && styles.botonPrincipalMovil]}>
          <Text style={styles.botonTexto}>{modo === "historial" ? "Ver plan de bienestar" : "Ver mi plan de bienestar"}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}