import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing, FadeIn, FadeInUp, cancelAnimation, useAnimatedStyle,
  useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from "react-native-reanimated";
import { procesarResultadosEntrevista } from "@/services/entrevista/procesamientoEntrevistaService";

export default function ProcesandoEntrevistaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{id:string}>();
  const idEntrevista = Array.isArray(params.id) ? params.id[0] : params.id;

  const [analisisTerminado,setAnalisisTerminado] = useState(false);
  const [errorProcesamiento,setErrorProcesamiento] = useState<string|null>(null);

  const ondaUno = useSharedValue(0);
  const ondaDos = useSharedValue(0);
  const pulsoCentro = useSharedValue(1);
  const indicadorUno = useSharedValue(0);
  const indicadorDos = useSharedValue(0);
  const indicadorTres = useSharedValue(0);

  useEffect(() => {
    ondaUno.value = withRepeat(
      withSequence(
        withTiming(1,{duration:1900,easing:Easing.out(Easing.cubic)}),
        withTiming(0,{duration:0})
      ),-1,false
    );

    ondaDos.value = withRepeat(
      withSequence(
        withDelay(800,withTiming(1,{duration:1900,easing:Easing.out(Easing.cubic)})),
        withTiming(0,{duration:0})
      ),-1,false
    );

    pulsoCentro.value = withRepeat(
      withSequence(
        withTiming(1.04,{duration:950,easing:Easing.inOut(Easing.ease)}),
        withTiming(1,{duration:950,easing:Easing.inOut(Easing.ease)})
      ),-1,false
    );

    indicadorUno.value = withRepeat(
      withSequence(
        withTiming(-6,{duration:350}),
        withTiming(0,{duration:350}),
        withDelay(450,withTiming(0,{duration:1}))
      ),-1,false
    );

    indicadorDos.value = withRepeat(
      withSequence(
        withDelay(150,withTiming(-6,{duration:350})),
        withTiming(0,{duration:350}),
        withDelay(300,withTiming(0,{duration:1}))
      ),-1,false
    );

    indicadorTres.value = withRepeat(
      withSequence(
        withDelay(300,withTiming(-6,{duration:350})),
        withTiming(0,{duration:350}),
        withDelay(150,withTiming(0,{duration:1}))
      ),-1,false
    );

    return () => {
      cancelAnimation(ondaUno);
      cancelAnimation(ondaDos);
      cancelAnimation(pulsoCentro);
      cancelAnimation(indicadorUno);
      cancelAnimation(indicadorDos);
      cancelAnimation(indicadorTres);
    };
  },[ondaUno,ondaDos,pulsoCentro,indicadorUno,indicadorDos,indicadorTres]);

  useEffect(() => {
    if (!idEntrevista || idEntrevista === "[id]") {
      setErrorProcesamiento("No se encontró una entrevista válida.");
      return;
    }

    let activo = true;

    async function procesar() {
      try {
        setErrorProcesamiento(null);
        setAnalisisTerminado(false);

        const [,resultados] = await Promise.all([
          new Promise<void>((resolve) => setTimeout(resolve,4000)),
          procesarResultadosEntrevista(idEntrevista),
        ]);

        if (!activo) return;

        console.log("====================================");
        console.log("ID ENTREVISTA:",idEntrevista);
        console.log("RESULTADOS ENTREVISTA:",resultados);
        console.log("====================================");

        setAnalisisTerminado(true);
      } catch (error) {
        if (!activo) return;

        console.error("ERROR PROCESANDO ENTREVISTA:",error);

        setErrorProcesamiento(
          error instanceof Error
            ? error.message
            : "No se pudieron procesar los resultados."
        );
      }
    }

    procesar();

    return () => {
      activo = false;
    };
  },[idEntrevista]);

  const estiloOndaUno = useAnimatedStyle(() => ({
    transform:[{scale:1 + ondaUno.value * 0.45}],
    opacity:0.35 - ondaUno.value * 0.35,
  }));

  const estiloOndaDos = useAnimatedStyle(() => ({
    transform:[{scale:1 + ondaDos.value * 0.45}],
    opacity:0.28 - ondaDos.value * 0.28,
  }));

  const estiloCentro = useAnimatedStyle(() => ({
    transform:[{scale:pulsoCentro.value}],
  }));

  const estiloIndicadorUno = useAnimatedStyle(() => ({
    transform:[{translateY:indicadorUno.value}],
    opacity:indicadorUno.value < 0 ? 1 : 0.45,
  }));

  const estiloIndicadorDos = useAnimatedStyle(() => ({
    transform:[{translateY:indicadorDos.value}],
    opacity:indicadorDos.value < 0 ? 1 : 0.45,
  }));

  const estiloIndicadorTres = useAnimatedStyle(() => ({
    transform:[{translateY:indicadorTres.value}],
    opacity:indicadorTres.value < 0 ? 1 : 0.45,
  }));

  function continuar() {
    if (!idEntrevista || idEntrevista === "[id]") return;

    console.log("Navegando a resultados con ID:",idEntrevista);

    router.replace({
      pathname:"/(entrevista)/jovenes-adultos/[id]/resultado",
      params:{id:idEntrevista},
    });
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenedor}>

        <View style={styles.animacionContenedor}>
          <Animated.View style={[styles.ondaUno,estiloOndaUno]} />
          <Animated.View style={[styles.ondaDos,estiloOndaDos]} />

          <View style={styles.circuloExterior}>
            <Animated.View style={[styles.circuloCentro,estiloCentro]}>
              <Ionicons name="sparkles" size={29} color="#FFFFFF" />
            </Animated.View>
          </View>
        </View>

        <Animated.Text entering={FadeInUp.duration(600)} style={styles.titulo}>
          Analizando tu perfil
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.descripcion}>
          Estamos procesando tus respuestas para construir un camino hacia tu bienestar.
        </Animated.Text>

        {!analisisTerminado && !errorProcesamiento && (
          <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.procesando}>
            <Text style={styles.textoProcesando}>Procesando</Text>

            <View style={styles.indicadores}>
              <Animated.View style={[styles.indicador,estiloIndicadorUno]} />
              <Animated.View style={[styles.indicador,estiloIndicadorDos]} />
              <Animated.View style={[styles.indicador,estiloIndicadorTres]} />
            </View>
          </Animated.View>
        )}

        {errorProcesamiento && (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.errorContenedor}>
            <Ionicons name="alert-circle-outline" size={27} color="#7189C7" />
            <Text style={styles.textoError}>{errorProcesamiento}</Text>
          </Animated.View>
        )}

        {analisisTerminado && (
          <Animated.View entering={FadeInUp.duration(700)} style={styles.finalizado}>
            <View style={styles.check}>
              <Ionicons name="checkmark" size={27} color="#FFFFFF" />
            </View>

            <Text style={styles.textoFinalizado}>
              Tu entrevista ha sido procesada.
            </Text>

            <Pressable
              onPress={continuar}
              style={({pressed}) => [styles.boton,pressed && styles.botonPresionado]}
            >
              <Text style={styles.textoBoton}>Ver mis resultados</Text>
              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla:{flex:1,backgroundColor:"#F7F8FC"},
  contenedor:{flex:1,alignItems:"center",justifyContent:"center",paddingHorizontal:28,paddingBottom:50},

  animacionContenedor:{width:190,height:190,alignItems:"center",justifyContent:"center"},
  ondaUno:{position:"absolute",width:120,height:120,borderRadius:60,backgroundColor:"#8BADF6"},
  ondaDos:{position:"absolute",width:120,height:120,borderRadius:60,backgroundColor:"#B7E8FF"},
  circuloExterior:{width:128,height:128,borderRadius:64,backgroundColor:"#E0F1FF",alignItems:"center",justifyContent:"center"},
  circuloCentro:{width:82,height:82,borderRadius:41,backgroundColor:"#5AB7FD",alignItems:"center",justifyContent:"center"},

  titulo:{marginTop:20,fontSize:23,color:"#273448",fontFamily:"Nunito-Bold",textAlign:"center"},
  descripcion:{marginTop:12,maxWidth:330,fontSize:15,lineHeight:22,color:"#536076",fontFamily:"Nunito-Medium",textAlign:"center"},

  procesando:{marginTop:28,flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFFF",borderRadius:25,paddingHorizontal:20,paddingVertical:11},
  textoProcesando:{fontSize:14,color:"#657083",fontFamily:"Nunito-SemiBold"},
  indicadores:{marginLeft:12,flexDirection:"row",alignItems:"center",gap:6},
  indicador:{width:8,height:8,borderRadius:4,backgroundColor:"#7DA8F8"},

  finalizado:{marginTop:25,width:"100%",alignItems:"center"},
  check:{width:48,height:48,borderRadius:24,backgroundColor:"#78B99B",alignItems:"center",justifyContent:"center"},
  textoFinalizado:{marginTop:12,fontSize:15,color:"#536076",fontFamily:"Nunito-SemiBold"},

  errorContenedor:{marginTop:25,maxWidth:330,alignItems:"center",backgroundColor:"#F0F3F8",borderRadius:16,padding:16},
  textoError:{marginTop:8,fontSize:14,lineHeight:20,color:"#647086",fontFamily:"Nunito-SemiBold",textAlign:"center"},

  boton:{marginTop:25,width:"100%",maxWidth:310,minHeight:55,borderRadius:16,backgroundColor:"#6594F4",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:9,paddingHorizontal:20},
  botonPresionado:{opacity:.88},
  textoBoton:{fontSize:16,color:"#FFFFFF",fontFamily:"Nunito-Bold"},
});