import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { supabase } from "@/lib/supabase";
import { generarPlanBienestar, PlanBienestar } from "@/services/entrevista/planBienestarService";
import { finalizarEntrevista } from "@/services/entrevista/finalizarEntrevistaService";

function esUUID(valor:string|undefined) {
  if (!valor || valor === "[id]") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}

export default function PlanBienestarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{id:string}>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const [plan,setPlan] = useState<PlanBienestar|null>(null);
  const [cargando,setCargando] = useState(true);
  const [finalizando,setFinalizando] = useState(false);
  const [error,setError] = useState<string|null>(null);

  useEffect(() => {
    console.log("ID recibido en plan:",idEntrevista);

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

        const {data,error} = await supabase
          .from("resultado_entrevista")
          .select(`
            porcentaje,
            nivel,
            modulo_entrevista!inner(
              codigo,
              nombre
            )
          `)
          .eq("id_entrevista",idEntrevista)
          .order("porcentaje",{ascending:false});

        if (error) throw error;
        if (!activo) return;

        const resultados = (data ?? []).map((item:any) => {
          const modulo = Array.isArray(item.modulo_entrevista)
            ? item.modulo_entrevista[0]
            : item.modulo_entrevista;

          return {
            codigo:modulo?.codigo ?? "",
            nombre:modulo?.nombre ?? "",
            porcentaje:Number(item.porcentaje ?? 0),
            nivel:item.nivel ?? "BAJO",
          };
        });

        console.log("Resultados para generar plan:",resultados);

        const nuevoPlan = await generarPlanBienestar(idEntrevista,resultados);

        if (!activo) return;

        console.log("PLAN LISTO:",nuevoPlan);
        setPlan(nuevoPlan);
      } catch (e) {
        console.error("Error generando plan:",e);

        if (activo) {
          setError(
            e instanceof Error
              ? e.message
              : "No se pudo generar tu plan de bienestar."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPlan();

    return () => {
      activo = false;
    };
  },[idEntrevista]);

  async function finalizar() {
    if (!idEntrevista || !esUUID(idEntrevista) || finalizando) return;

    try {
      setFinalizando(true);
      setError(null);

      await finalizarEntrevista(idEntrevista);

      console.log("Entrevista completada correctamente:",idEntrevista);

      router.replace("/(tabs)/home");
    } catch (e) {
      console.error("Error al finalizar entrevista:",e);

      setError(
        e instanceof Error
          ? e.message
          : "No se pudo finalizar la entrevista."
      );
    } finally {
      setFinalizando(false);
    }
  }

  function volverInicio() {
    router.replace("/(tabs)/home");
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.cargandoIcono}>
            <ActivityIndicator color="#6594F4" />
          </View>

          <Text style={styles.cargandoTitulo}>
            Preparando tu plan
          </Text>

          <Text style={styles.cargandoTexto}>
            Estamos organizando algunas acciones para acompañar tu bienestar.
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
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color="#7189C7"
            />
          </View>

          <Text style={styles.cargandoTitulo}>
            No pudimos preparar tu plan
          </Text>

          <Text style={styles.cargandoTexto}>
            {error ?? "Inténtalo nuevamente más tarde."}
          </Text>

          <Pressable
            onPress={volverInicio}
            style={({pressed}) => [
              styles.boton,
              pressed && styles.botonPresionado
            ]}
          >
            <Text style={styles.botonTexto}>Volver al inicio</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        <Animated.View
          entering={FadeInUp.duration(550)}
          style={styles.header}
        >
          <View style={styles.headerIcono}>
            <Ionicons
              name="leaf"
              size={23}
              color="#6594F4"
            />
          </View>

          <Text style={styles.titulo}>
            Tu plan de bienestar
          </Text>

          <Text style={styles.subtitulo}>
            Pequeñas acciones que puedes incorporar a tu ritmo.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(120).duration(500)}
          style={styles.objetivoCard}
        >
          <View style={styles.objetivoSuperior}>
            <View style={styles.objetivoIcono}>
              <Ionicons
                name="compass-outline"
                size={21}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.objetivoInfo}>
              <Text style={styles.objetivoEtiqueta}>
                TU ENFOQUE
              </Text>

              <Text style={styles.objetivoTitulo}>
                Objetivo principal
              </Text>
            </View>
          </View>

          <Text style={styles.objetivoTexto}>
            {plan.objetivo_principal}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(200).duration(450)}
          style={styles.seccion}
        >
          <Text style={styles.seccionTitulo}>
            Para comenzar
          </Text>

          <Text style={styles.seccionTexto}>
            No tienes que hacer todo al mismo tiempo. Empieza con una actividad que se sienta posible para ti.
          </Text>
        </Animated.View>

        <View style={styles.lista}>
          {plan.actividades_recomendadas.map((actividad,index) => (
            <Animated.View
              key={actividad.codigo}
              entering={FadeInUp.delay(240 + index * 80).duration(500)}
              style={styles.actividadCard}
            >
              <View style={styles.numero}>
                <Text style={styles.numeroTexto}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.actividadContenido}>
                <View style={styles.actividadTituloFila}>
                  <View style={styles.actividadIcono}>
                    <Ionicons
                      name={actividad.icono as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color="#6594F4"
                    />
                  </View>

                  <Text style={styles.actividadTitulo}>
                    {actividad.titulo}
                  </Text>
                </View>

                <Text style={styles.actividadDescripcion}>
                  {actividad.descripcion}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeIn.delay(500).duration(500)}
          style={styles.recordatorio}
        >
          <View style={styles.recordatorioIcono}>
            <Ionicons
              name="heart-outline"
              size={20}
              color="#78B99B"
            />
          </View>

          <Text style={styles.recordatorioTexto}>
            Tu plan puede cambiar con el tiempo. Lo importante es observar cómo te sientes y avanzar de forma gradual.
          </Text>
        </Animated.View>

        <View style={styles.aviso}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#71809A"
          />

          <Text style={styles.avisoTexto}>
            Estas recomendaciones son de autocuidado y orientación. No sustituyen la valoración o atención de un profesional de salud.
          </Text>
        </View>

        {error && (
          <Animated.View
            entering={FadeIn.duration(350)}
            style={styles.errorFinal}
          >
            <Ionicons
              name="alert-circle-outline"
              size={19}
              color="#7189C7"
            />

            <Text style={styles.errorFinalTexto}>
              {error}
            </Text>
          </Animated.View>
        )}

        <Pressable
          onPress={finalizar}
          disabled={finalizando}
          style={({pressed}) => [
            styles.boton,
            (pressed || finalizando) && styles.botonPresionado
          ]}
        >
          {finalizando ? (
            <>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text style={styles.botonTexto}>
                Guardando...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.botonTexto}>
                Ir a mi inicio
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla:{
    flex:1,
    backgroundColor:"#F7F8FC",
  },

  scroll:{
    paddingHorizontal:20,
    paddingTop:15,
    paddingBottom:40,
  },

  header:{
    alignItems:"center",
    paddingHorizontal:18,
    marginBottom:24,
  },

  headerIcono:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:"#E9F2FF",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:12,
  },

  titulo:{
    fontSize:25,
    color:"#273448",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  subtitulo:{
    marginTop:7,
    fontSize:14.5,
    lineHeight:21,
    color:"#697589",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },

  objetivoCard:{
    backgroundColor:"#EAF3FF",
    borderRadius:22,
    padding:18,
    borderWidth:1,
    borderColor:"#DCE8FA",
  },

  objetivoSuperior:{
    flexDirection:"row",
    alignItems:"center",
  },

  objetivoIcono:{
    width:42,
    height:42,
    borderRadius:14,
    backgroundColor:"#6594F4",
    alignItems:"center",
    justifyContent:"center",
  },

  objetivoInfo:{
    marginLeft:12,
    flex:1,
  },

  objetivoEtiqueta:{
    fontSize:10.5,
    letterSpacing:.7,
    color:"#7189C7",
    fontFamily:"Nunito-Bold",
  },

  objetivoTitulo:{
    marginTop:2,
    fontSize:17,
    color:"#334055",
    fontFamily:"Nunito-Bold",
  },

  objetivoTexto:{
    marginTop:15,
    fontSize:14.5,
    lineHeight:21,
    color:"#536076",
    fontFamily:"Nunito-Medium",
  },

  seccion:{
    marginTop:27,
    marginBottom:14,
  },

  seccionTitulo:{
    fontSize:18,
    color:"#273448",
    fontFamily:"Nunito-Bold",
  },

  seccionTexto:{
    marginTop:4,
    fontSize:13,
    lineHeight:19,
    color:"#7A8598",
    fontFamily:"Nunito-Medium",
  },

  lista:{
    gap:12,
  },

  actividadCard:{
    backgroundColor:"#FFFFFF",
    borderRadius:20,
    padding:16,
    flexDirection:"row",
    borderWidth:1,
    borderColor:"#EDF1F7",
    shadowColor:"#334055",
    shadowOffset:{width:0,height:3},
    shadowOpacity:.035,
    shadowRadius:8,
    elevation:1,
  },

  numero:{
    width:28,
    height:28,
    borderRadius:14,
    backgroundColor:"#EDF5FF",
    alignItems:"center",
    justifyContent:"center",
    marginRight:11,
    marginTop:1,
  },

  numeroTexto:{
    fontSize:12,
    color:"#6594F4",
    fontFamily:"Nunito-Bold",
  },

  actividadContenido:{
    flex:1,
  },

  actividadTituloFila:{
    flexDirection:"row",
    alignItems:"center",
  },

  actividadIcono:{
    width:34,
    height:34,
    borderRadius:11,
    backgroundColor:"#F0F6FF",
    alignItems:"center",
    justifyContent:"center",
    marginRight:9,
  },

  actividadTitulo:{
    flex:1,
    fontSize:15,
    color:"#334055",
    fontFamily:"Nunito-Bold",
  },

  actividadDescripcion:{
    marginTop:8,
    fontSize:13,
    lineHeight:19,
    color:"#697589",
    fontFamily:"Nunito-Medium",
  },

  recordatorio:{
    marginTop:22,
    backgroundColor:"#F0F8F4",
    borderRadius:18,
    padding:15,
    flexDirection:"row",
    alignItems:"flex-start",
  },

  recordatorioIcono:{
    width:35,
    height:35,
    borderRadius:12,
    backgroundColor:"#E4F3EB",
    alignItems:"center",
    justifyContent:"center",
  },

  recordatorioTexto:{
    flex:1,
    marginLeft:10,
    fontSize:12.8,
    lineHeight:19,
    color:"#64786E",
    fontFamily:"Nunito-Medium",
  },

  aviso:{
    marginTop:13,
    backgroundColor:"#F0F3F8",
    borderRadius:15,
    padding:14,
    flexDirection:"row",
    alignItems:"flex-start",
  },

  avisoTexto:{
    flex:1,
    marginLeft:8,
    fontSize:12.2,
    lineHeight:18,
    color:"#71809A",
    fontFamily:"Nunito-Medium",
  },

  errorFinal:{
    marginTop:13,
    backgroundColor:"#EEF2FB",
    borderRadius:15,
    padding:13,
    flexDirection:"row",
    alignItems:"center",
  },

  errorFinalTexto:{
    flex:1,
    marginLeft:8,
    fontSize:12.5,
    lineHeight:18,
    color:"#647086",
    fontFamily:"Nunito-SemiBold",
  },

  boton:{
    marginTop:25,
    minHeight:55,
    borderRadius:17,
    backgroundColor:"#6594F4",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:9,
    paddingHorizontal:22,
  },

  botonPresionado:{
    opacity:.78,
  },

  botonTexto:{
    fontSize:16,
    color:"#FFFFFF",
    fontFamily:"Nunito-Bold",
  },

  cargando:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:35,
  },

  cargandoIcono:{
    width:55,
    height:55,
    borderRadius:28,
    backgroundColor:"#E9F2FF",
    alignItems:"center",
    justifyContent:"center",
  },

  errorIcono:{
    width:55,
    height:55,
    borderRadius:28,
    backgroundColor:"#EEF2FB",
    alignItems:"center",
    justifyContent:"center",
  },

  cargandoTitulo:{
    marginTop:16,
    fontSize:19,
    color:"#273448",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  cargandoTexto:{
    marginTop:7,
    fontSize:14,
    lineHeight:20,
    color:"#697589",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },
});