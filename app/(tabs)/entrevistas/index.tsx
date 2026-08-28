import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EntrevistaHistorial, obtenerHistorialEntrevistas } from "@/services/entrevista/historialEntrevistaService";
import { crearEntrevista } from "@/services/entrevista/entrevistaService";
import { COLORES, styles } from "@/styles/entrevistas.styles";

const formatoFecha = new Intl.DateTimeFormat("es-NI", { day: "numeric", month: "long", year: "numeric" });

function formatearFecha(fecha: string | null) {
  return fecha ? formatoFecha.format(new Date(fecha)) : "Sin fecha";
}

export default function MisEntrevistasScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const movil = width < 600;

  const [entrevistas, setEntrevistas] = useState<EntrevistaHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargar() {
        try {
          setCargando(true);
          setError(null);
          const data = await obtenerHistorialEntrevistas();
          if (activo) setEntrevistas(data);
        } catch (error) {
          console.error("Error cargando historial:", error);
          if (activo) setError("No pudimos cargar tus entrevistas.");
        } finally {
          if (activo) setCargando(false);
        }
      }

      cargar();
      return () => { activo = false; };
    }, [])
  );

  async function nuevaEntrevista() {
    if (creando) return;
    try {
      setCreando(true);
      setError(null);
      const entrevista = await crearEntrevista();
      router.push(`/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales` as any);
    } catch (error) {
      console.error("Error creando entrevista:", error);
      setError(error instanceof Error ? error.message : "No pudimos iniciar una nueva entrevista.");
    } finally {
      setCreando(false);
    }
  }

  const verResultado = (id: string) => router.push(`/(tabs)/entrevistas/${id}/resultado` as any);
  const verPlan = (id: string) => router.push(`/(tabs)/entrevistas/${id}/plan` as any);

  const ultima = entrevistas[0];
  const anteriores = entrevistas.slice(1);

  return (
    <SafeAreaView style={styles.pantalla} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, movil && styles.scrollMovil]}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace("/(tabs)/home")} style={styles.volver}>
            <Ionicons name="arrow-back" size={22} color={COLORES.texto} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.titulo}>Entrevista de bienestar</Text>
            <Text style={styles.subtitulo}>Consulta tus evaluaciones anteriores o realiza una nueva.</Text>
          </View>
        </View>

        {/* NUEVA */}
        <TouchableOpacity activeOpacity={0.82} disabled={creando} onPress={nuevaEntrevista} style={[styles.nuevaCard, movil && styles.nuevaCardMovil, creando && styles.deshabilitado]}>
          <View style={styles.nuevaIcono}>
            {creando ? <ActivityIndicator size="small" color={COLORES.azul} /> : <Ionicons name="add" size={26} color={COLORES.azul} />}
          </View>
          <View style={styles.nuevaInfo}>
            <Text style={styles.nuevaTitulo}>{creando ? "Preparando evaluación..." : "Nueva evaluación"}</Text>
            <Text numberOfLines={2} style={styles.nuevaTexto}>
              {creando ? "Estamos preparando una nueva entrevista." : "Cuéntanos cómo te sientes actualmente."}
            </Text>
          </View>
          {!creando && <Ionicons name="chevron-forward" size={22} color={COLORES.fondo} />}
        </TouchableOpacity>

        {/* ESTADOS */}
        {cargando ? (
          <View style={styles.centro}>
            <ActivityIndicator color={COLORES.azul} />
            <Text style={styles.centroTexto}>Cargando tus entrevistas...</Text>
          </View>
        ) : error ? (
          <EstadoVacio movil={movil} icono="alert-circle-outline" titulo="No pudimos cargar tus entrevistas" texto={error} />
        ) : !entrevistas.length ? (
          <EstadoVacio movil={movil} icono="heart-outline" titulo="Aún no tienes evaluaciones" texto="Realiza tu primera entrevista para comenzar a conocer mejor tu bienestar.">
            <TouchableOpacity activeOpacity={0.8} disabled={creando} onPress={nuevaEntrevista} style={styles.botonPrincipal}>
              {creando && <ActivityIndicator size="small" color={COLORES.fondo} />}
              <Text style={styles.botonPrincipalTexto}>{creando ? "Preparando..." : "Realizar mi primera entrevista"}</Text>
            </TouchableOpacity>
          </EstadoVacio>
        ) : (
          <>
            {/* ÚLTIMA */}
            <Text style={styles.seccionTitulo}>Última evaluación</Text>
            <View style={[styles.ultimaCard, movil && styles.ultimaCardMovil]}>
              <View style={styles.fechaFila}>
                <View style={styles.fechaIcono}>
                  <Ionicons name="calendar-outline" size={21} color={COLORES.azul} />
                </View>
                <View style={styles.fechaInfo}>
                  <Text style={styles.fechaLabel}>Realizada el</Text>
                  <Text style={styles.fecha}>{formatearFecha(ultima.fecha_fin)}</Text>
                </View>
                <View style={styles.completada}>
                  <Text style={styles.completadaTexto}>Completada</Text>
                </View>
              </View>

              {!!ultima.areas_prioritarias.length && (
                <View style={styles.area}>
                  <Text style={styles.areaLabel}>Enfoque principal</Text>
                  <View style={styles.areaFila}>
                    <Text style={styles.areaNombre}>{ultima.areas_prioritarias.join(" y ")}</Text>
                    {ultima.porcentaje !== null && <Text style={styles.porcentaje}>{Math.round(ultima.porcentaje)}%</Text>}
                  </View>
                </View>
              )}

              <View style={[styles.acciones, movil && styles.accionesMovil]}>
                <BotonAccion icono="analytics-outline" texto="Ver resultados" onPress={() => verResultado(ultima.id_entrevista)} />
                {ultima.tiene_plan && <BotonAccion icono="clipboard-outline" texto="Ver plan" onPress={() => verPlan(ultima.id_entrevista)} />}
              </View>
            </View>

            {/* HISTORIAL */}
            {!!anteriores.length && (
              <>
                <Text style={[styles.seccionTitulo, styles.historialTitulo]}>Historial</Text>
                <View style={styles.lista}>
                  {anteriores.map((entrevista) => (
                    <TouchableOpacity key={entrevista.id_entrevista} activeOpacity={0.75} onPress={() => verResultado(entrevista.id_entrevista)} style={[styles.historialCard, movil && styles.historialCardMovil]}>
                      <View style={styles.historialIcono}>
                        <Ionicons name="heart-outline" size={20} color={COLORES.azul} />
                      </View>
                      <View style={styles.historialInfo}>
                        <Text style={styles.historialFecha}>{formatearFecha(entrevista.fecha_fin)}</Text>
                        {!!entrevista.areas_prioritarias.length && (
                          <Text numberOfLines={2} style={styles.historialArea}>{entrevista.areas_prioritarias.join(" y ")}</Text>
                        )}
                      </View>
                      <View style={styles.historialDerecha}>
                        {entrevista.porcentaje !== null && <Text style={styles.historialPorcentaje}>{Math.round(entrevista.porcentaje)}%</Text>}
                        <Ionicons name="chevron-forward" size={20} color={COLORES.azul} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* COMPONENTES PEQUEÑOS */
function EstadoVacio({ movil, icono, titulo, texto, children }: { movil: boolean; icono: keyof typeof Ionicons.glyphMap; titulo: string; texto: string; children?: React.ReactNode; }) {
  return (
    <View style={[styles.vacio, movil && styles.vacioMovil]}>
      <View style={styles.vacioIcono}>
        <Ionicons name={icono} size={29} color={COLORES.azul} />
      </View>
      <Text style={styles.vacioTitulo}>{titulo}</Text>
      <Text style={styles.vacioTexto}>{texto}</Text>
      {children}
    </View>
  );
}

function BotonAccion({ icono, texto, onPress }: { icono: keyof typeof Ionicons.glyphMap; texto: string; onPress: () => void; }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.accion}>
      <Ionicons name={icono} size={18} color={COLORES.azul} />
      <Text style={styles.accionTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}