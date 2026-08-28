import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";

type NivelResultado = "BAJO" | "MODERADO" | "ALTO";

type Resultado = {
  id_resultado:string;
  id_modulo:string;
  codigo:string;
  nombre:string;
  puntaje:number;
  porcentaje:number;
  nivel:NivelResultado;
};

const CONFIG:Record<string,{icono:keyof typeof Ionicons.glyphMap}> = {
  SOMATICO:{icono:"body-outline"},
  ANSIEDAD_INSOMNIO:{icono:"moon-outline"},
  SUENO:{icono:"bed-outline"},
  APOYO_SOCIAL:{icono:"people-outline"},
  VIDA_DIARIA:{icono:"calendar-outline"},
  ESTADO_EMOCIONAL:{icono:"heart-outline"},
};

function obtenerRelacion(valor:any) {
  return Array.isArray(valor) ? valor[0] : valor;
}

function textoNivel(nivel:NivelResultado) {
  if (nivel === "ALTO") return "Mayor atención";
  if (nivel === "MODERADO") return "Atención moderada";
  return "Menor atención";
}

function descripcionNivel(nivel:NivelResultado) {
  if (nivel === "ALTO") return "Esta área puede beneficiarse de un mayor acompañamiento.";
  if (nivel === "MODERADO") return "Conviene seguir observando y fortaleciendo esta área.";
  return "Tus respuestas muestran menor dificultad en esta área.";
}

function esUUID(valor:string|undefined) {
  if (!valor || valor === "[id]") return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}

export default function ResultadoEntrevistaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{id:string}>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const [resultados,setResultados] = useState<Resultado[]>([]);
  const [cargando,setCargando] = useState(true);
  const [error,setError] = useState<string|null>(null);

  useEffect(() => {
    console.log("ID recibido en resultado:",idEntrevista);

    if (!esUUID(idEntrevista)) {
      console.error("ID inválido recibido:",idEntrevista);
      setError("No se encontró una entrevista válida.");
      setCargando(false);
      return;
    }

    let activo = true;

    async function cargarResultados() {
      try {
        setCargando(true);
        setError(null);

        const {data,error} = await supabase
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
          .eq("id_entrevista",idEntrevista)
          .order("porcentaje",{ascending:false});

        if (error) throw error;
        if (!activo) return;

        const lista:Resultado[] = (data ?? []).map((item:any) => {
          const modulo = obtenerRelacion(item.modulo_entrevista);

          return {
            id_resultado:item.id_resultado,
            id_modulo:item.id_modulo,
            codigo:modulo?.codigo ?? "",
            nombre:modulo?.nombre ?? "Área de bienestar",
            puntaje:Number(item.puntaje ?? 0),
            porcentaje:Number(item.porcentaje ?? 0),
            nivel:(item.nivel ?? "BAJO") as NivelResultado,
          };
        });

        console.table(lista.map((r) => ({
          dimension:r.nombre,
          porcentaje:`${r.porcentaje}%`,
          nivel:r.nivel,
        })));

        setResultados(lista);
      } catch (e) {
        console.error("Error cargando resultados:",e);
        if (activo) setError("No pudimos cargar tus resultados.");
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarResultados();

    return () => {
      activo = false;
    };
  },[idEntrevista]);

  const prioridades = useMemo(() => {
    if (!resultados.length) return [];

    const mayor = resultados[0].porcentaje;

    return resultados.filter(
      (resultado) => Math.abs(resultado.porcentaje - mayor) < 0.01
    );
  },[resultados]);

  const promedio = useMemo(() => {
    if (!resultados.length) return 0;

    return resultados.reduce(
      (total,resultado) => total + resultado.porcentaje,
      0
    ) / resultados.length;
  },[resultados]);

  function continuar() {
    if (!idEntrevista || !esUUID(idEntrevista)) return;

    router.push({
      pathname:"/(entrevista)/jovenes-adultos/[id]/plan",
      params:{id:idEntrevista},
    });
  }

  function volverInicio() {
    router.replace("/(tabs)/home");
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.cargandoCirculo}>
            <ActivityIndicator color="#6594F4" />
          </View>

          <Text style={styles.cargandoTitulo}>Preparando tu perfil</Text>

          <Text style={styles.cargandoTexto}>
            Estamos organizando los resultados de tu entrevista.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.cargando}>
          <View style={styles.errorCirculo}>
            <Ionicons name="alert-circle-outline" size={28} color="#7189C7" />
          </View>

          <Text style={styles.cargandoTitulo}>
            No pudimos mostrar tus resultados
          </Text>

          <Text style={styles.cargandoTexto}>{error}</Text>

          <Pressable
            onPress={volverInicio}
            style={({pressed}) => [
              styles.botonPrincipal,
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

        <Animated.View entering={FadeInUp.duration(550)} style={styles.header}>
          <View style={styles.headerIcono}>
            <Ionicons name="sparkles" size={22} color="#6594F4" />
          </View>

          <Text style={styles.titulo}>Tu perfil de bienestar</Text>

          <Text style={styles.subtitulo}>
            Una mirada general a las áreas que exploramos contigo.
          </Text>
        </Animated.View>

        {!resultados.length ? (
          <Animated.View
            entering={FadeInUp.delay(120).duration(500)}
            style={styles.estableCard}
          >
            <View style={styles.estableIcono}>
              <Ionicons name="leaf-outline" size={26} color="#78B99B" />
            </View>

            <Text style={styles.estableTitulo}>
              Todo se ve estable por ahora
            </Text>

            <Text style={styles.estableTexto}>
              Tus respuestas no activaron áreas adicionales que necesitaran una exploración más profunda.
            </Text>
          </Animated.View>
        ) : (
          <>
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              style={styles.resumenCard}
            >
              <View style={styles.resumenSuperior}>
                <View>
                  <Text style={styles.resumenEtiqueta}>
                    RESUMEN DE TU ENTREVISTA
                  </Text>

                  <Text style={styles.resumenTitulo}>
                    Exploramos {resultados.length} {resultados.length === 1 ? "área" : "áreas"}
                  </Text>
                </View>

                <View style={styles.resumenIcono}>
                  <Ionicons name="analytics-outline" size={22} color="#6594F4" />
                </View>
              </View>

              <View style={styles.resumenSeparador} />

              <View style={styles.resumenInferior}>
                <View style={styles.resumenDato}>
                  <Text style={styles.resumenNumero}>
                    {Math.round(promedio)}%
                  </Text>
                  <Text style={styles.resumenDatoTexto}>
                    promedio general
                  </Text>
                </View>

                <View style={styles.divisorVertical} />

                <View style={styles.resumenDato}>
                  <Text style={styles.resumenNumero}>
                    {Math.round(resultados[0].porcentaje)}%
                  </Text>
                  <Text style={styles.resumenDatoTexto}>
                    mayor indicador
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeIn.delay(180).duration(450)}
              style={styles.seccionHeader}
            >
              <View>
                <Text style={styles.seccionTitulo}>Áreas exploradas</Text>
                <Text style={styles.seccionTexto}>
                  De mayor a menor necesidad de atención.
                </Text>
              </View>

              <View style={styles.cantidad}>
                <Text style={styles.cantidadTexto}>{resultados.length}</Text>
              </View>
            </Animated.View>

            <View style={styles.lista}>
              {resultados.map((resultado,index) => {
                const config = CONFIG[resultado.codigo] ?? {
                  icono:"sparkles-outline" as keyof typeof Ionicons.glyphMap
                };

                const esPrioridad = prioridades.some(
                  (p) => p.id_modulo === resultado.id_modulo
                );

                return (
                  <Animated.View
                    key={resultado.id_resultado}
                    entering={FadeInUp.delay(220 + index * 80).duration(500)}
                    style={[
                      styles.card,
                      esPrioridad && styles.cardPrioridad
                    ]}
                  >
                    <View style={styles.cardSuperior}>

                      <View style={styles.areaIcono}>
                        <Ionicons
                          name={config.icono}
                          size={22}
                          color="#6594F4"
                        />
                      </View>

                      <View style={styles.areaInfo}>
                        <View style={styles.nombreFila}>
                          <Text style={styles.areaNombre}>
                            {resultado.nombre}
                          </Text>

                          {esPrioridad && (
                            <View style={styles.prioridadMini}>
                              <Text style={styles.prioridadMiniTexto}>
                                Prioridad
                              </Text>
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

                          <Text style={styles.nivelTexto}>
                            {textoNivel(resultado.nivel)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.porcentaje}>
                        <Text style={styles.porcentajeNumero}>
                          {Math.round(resultado.porcentaje)}
                        </Text>
                        <Text style={styles.porcentajeSimbolo}>%</Text>
                      </View>

                    </View>

                    <View style={styles.barraContenedor}>
                      <View
                        style={[
                          styles.barra,
                          {
                            width:`${Math.min(
                              Math.max(resultado.porcentaje,0),
                              100
                            )}%`
                          }
                        ]}
                      />
                    </View>

                    <Text style={styles.cardDescripcion}>
                      {descripcionNivel(resultado.nivel)}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>

            {!!prioridades.length && (
              <Animated.View
                entering={FadeInUp.delay(450).duration(550)}
                style={styles.enfoqueCard}
              >
                <View style={styles.enfoqueIcono}>
                  <Ionicons name="compass-outline" size={22} color="#FFFFFF" />
                </View>

                <View style={styles.enfoqueContenido}>
                  <Text style={styles.enfoqueEtiqueta}>
                    ENFOQUE PRINCIPAL
                  </Text>

                  <Text style={styles.enfoqueTitulo}>
                    {prioridades.map((p) => p.nombre).join(" y ")}
                  </Text>

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

        <Animated.View
          entering={FadeIn.delay(500).duration(500)}
          style={styles.aviso}
        >
          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#71809A"
          />

          <Text style={styles.avisoTexto}>
            Estos resultados son orientativos y están pensados para apoyar tu autocuidado. No representan un diagnóstico clínico.
          </Text>
        </Animated.View>

        <Pressable
          onPress={resultados.length ? continuar : volverInicio}
          style={({pressed}) => [
            styles.botonPrincipal,
            pressed && styles.botonPresionado
          ]}
        >
          <Text style={styles.botonTexto}>
            {resultados.length
              ? "Ver mi plan de bienestar"
              : "Ir a mi inicio"}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla:{flex:1,backgroundColor:"#F7F8FC"},
  scroll:{paddingHorizontal:20,paddingTop:14,paddingBottom:40},

  header:{alignItems:"center",paddingHorizontal:14,marginBottom:24},
  headerIcono:{width:48,height:48,borderRadius:24,backgroundColor:"#E9F2FF",alignItems:"center",justifyContent:"center",marginBottom:12},
  titulo:{fontSize:25,color:"#273448",fontFamily:"Nunito-Bold",textAlign:"center"},
  subtitulo:{marginTop:7,fontSize:14.5,lineHeight:21,color:"#697589",fontFamily:"Nunito-Medium",textAlign:"center"},

  resumenCard:{backgroundColor:"#FFFFFF",borderRadius:22,padding:18,borderWidth:1,borderColor:"#EBF0F7",shadowColor:"#2D3A4E",shadowOffset:{width:0,height:4},shadowOpacity:.045,shadowRadius:12,elevation:2},
  resumenSuperior:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  resumenEtiqueta:{fontSize:10.5,letterSpacing:.7,color:"#7A8AA5",fontFamily:"Nunito-Bold"},
  resumenTitulo:{marginTop:4,fontSize:18,color:"#334055",fontFamily:"Nunito-Bold"},
  resumenIcono:{width:43,height:43,borderRadius:14,backgroundColor:"#EDF5FF",alignItems:"center",justifyContent:"center"},
  resumenSeparador:{height:1,backgroundColor:"#EEF2F7",marginVertical:16},
  resumenInferior:{flexDirection:"row",alignItems:"center"},
  resumenDato:{flex:1,alignItems:"center"},
  resumenNumero:{fontSize:24,color:"#527FDE",fontFamily:"Nunito-Bold"},
  resumenDatoTexto:{marginTop:2,fontSize:11.5,color:"#7A8598",fontFamily:"Nunito-Medium"},
  divisorVertical:{width:1,height:36,backgroundColor:"#EBEFF5"},

  seccionHeader:{marginTop:26,marginBottom:13,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  seccionTitulo:{fontSize:18,color:"#273448",fontFamily:"Nunito-Bold"},
  seccionTexto:{marginTop:2,fontSize:13,color:"#7A8598",fontFamily:"Nunito-Medium"},
  cantidad:{minWidth:30,height:30,borderRadius:15,backgroundColor:"#EAF2FF",alignItems:"center",justifyContent:"center",paddingHorizontal:9},
  cantidadTexto:{fontSize:13,color:"#6594F4",fontFamily:"Nunito-Bold"},

  lista:{gap:12},
  card:{backgroundColor:"#FFFFFF",borderRadius:20,padding:16,borderWidth:1,borderColor:"#EDF1F7",shadowColor:"#334055",shadowOffset:{width:0,height:3},shadowOpacity:.035,shadowRadius:8,elevation:1},
  cardPrioridad:{borderColor:"#DCE8FF",backgroundColor:"#FCFDFF"},
  cardSuperior:{flexDirection:"row",alignItems:"center"},

  areaIcono:{width:45,height:45,borderRadius:15,backgroundColor:"#EEF5FF",alignItems:"center",justifyContent:"center"},
  areaInfo:{flex:1,marginLeft:12,marginRight:8},
  nombreFila:{flexDirection:"row",alignItems:"center",flexWrap:"wrap",gap:7},
  areaNombre:{fontSize:15.5,color:"#334055",fontFamily:"Nunito-Bold"},

  prioridadMini:{backgroundColor:"#E8F1FF",borderRadius:8,paddingHorizontal:7,paddingVertical:3},
  prioridadMiniTexto:{fontSize:9.5,color:"#5F87DB",fontFamily:"Nunito-Bold"},

  nivelFila:{marginTop:4,flexDirection:"row",alignItems:"center"},
  nivelPunto:{width:7,height:7,borderRadius:4,marginRight:6},
  nivelBajo:{backgroundColor:"#78B99B"},
  nivelModerado:{backgroundColor:"#91A7D9"},
  nivelAlto:{backgroundColor:"#657FC8"},
  nivelTexto:{fontSize:12,color:"#7A8598",fontFamily:"Nunito-SemiBold"},

  porcentaje:{flexDirection:"row",alignItems:"flex-start",minWidth:56,justifyContent:"flex-end"},
  porcentajeNumero:{fontSize:25,color:"#527FDE",fontFamily:"Nunito-Bold"},
  porcentajeSimbolo:{marginTop:3,fontSize:12.5,color:"#7189C7",fontFamily:"Nunito-Bold"},

  barraContenedor:{height:7,backgroundColor:"#EDF2F9",borderRadius:8,overflow:"hidden",marginTop:15},
  barra:{height:"100%",backgroundColor:"#7DA8F8",borderRadius:8},
  cardDescripcion:{marginTop:10,fontSize:12.8,lineHeight:18,color:"#697589",fontFamily:"Nunito-Medium"},

  enfoqueCard:{marginTop:22,backgroundColor:"#EAF3FF",borderRadius:21,padding:17,flexDirection:"row",alignItems:"flex-start"},
  enfoqueIcono:{width:43,height:43,borderRadius:14,backgroundColor:"#6594F4",alignItems:"center",justifyContent:"center",marginRight:13},
  enfoqueContenido:{flex:1},
  enfoqueEtiqueta:{fontSize:10.5,letterSpacing:.65,color:"#7189C7",fontFamily:"Nunito-Bold"},
  enfoqueTitulo:{marginTop:4,fontSize:16.5,lineHeight:21,color:"#334055",fontFamily:"Nunito-Bold"},
  enfoqueTexto:{marginTop:6,fontSize:13,lineHeight:19,color:"#647086",fontFamily:"Nunito-Medium"},

  aviso:{marginTop:20,flexDirection:"row",alignItems:"flex-start",backgroundColor:"#F0F3F8",borderRadius:15,padding:14},
  avisoTexto:{flex:1,marginLeft:8,fontSize:12.3,lineHeight:18,color:"#71809A",fontFamily:"Nunito-Medium"},

  estableCard:{backgroundColor:"#FFFFFF",borderRadius:22,padding:25,alignItems:"center",borderWidth:1,borderColor:"#EDF1F7"},
  estableIcono:{width:55,height:55,borderRadius:28,backgroundColor:"#EDF8F3",alignItems:"center",justifyContent:"center"},
  estableTitulo:{marginTop:14,fontSize:18,color:"#334055",fontFamily:"Nunito-Bold",textAlign:"center"},
  estableTexto:{marginTop:8,maxWidth:310,fontSize:13.5,lineHeight:20,color:"#697589",fontFamily:"Nunito-Medium",textAlign:"center"},

  cargando:{flex:1,alignItems:"center",justifyContent:"center",paddingHorizontal:35},
  cargandoCirculo:{width:55,height:55,borderRadius:28,backgroundColor:"#E9F2FF",alignItems:"center",justifyContent:"center"},
  errorCirculo:{width:55,height:55,borderRadius:28,backgroundColor:"#EEF2FB",alignItems:"center",justifyContent:"center"},
  cargandoTitulo:{marginTop:16,fontSize:19,color:"#273448",fontFamily:"Nunito-Bold",textAlign:"center"},
  cargandoTexto:{marginTop:7,fontSize:14,lineHeight:20,color:"#697589",fontFamily:"Nunito-Medium",textAlign:"center"},

  botonPrincipal:{marginTop:25,minHeight:55,borderRadius:17,backgroundColor:"#6594F4",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:9,paddingHorizontal:22},
  botonPresionado:{opacity:.88},
  botonTexto:{fontSize:16,color:"#FFFFFF",fontFamily:"Nunito-Bold"},
});