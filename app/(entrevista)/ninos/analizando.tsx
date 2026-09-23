import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";

import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function AnalizandoPerfil() {
  // Cargamos las fuentes Nunito que ya tenemos
  // guardadas dentro de assets/fonts.
  const [fontsLoaded] = useFonts({
    "Nunito-Medium": require(
      "@/assets/fonts/Nunito-Medium.ttf"
    ),

    "Nunito-SemiBold": require(
      "@/assets/fonts/Nunito-SemiBold.ttf"
    ),

    "Nunito-Bold": require(
      "@/assets/fonts/Nunito-Bold.ttf"
    ),
  });

  // Controla cuándo termina el proceso visual.
  const [analisisTerminado, setAnalisisTerminado] =
    useState(false);

  // =========================================
  // ANIMACIÓN DEL PROCESAMIENTO
  // =========================================

  // Controla la primera onda.
  const ondaUno = useSharedValue(0);

  // Controla la segunda onda.
  const ondaDos = useSharedValue(0);

  // Controla el pequeño pulso del círculo central.
  const pulsoCentro = useSharedValue(1);

  // Controlan los tres indicadores animados
  // que aparecen junto al texto "Procesando".
  const indicadorUno = useSharedValue(0);
  const indicadorDos = useSharedValue(0);
  const indicadorTres = useSharedValue(0);

  // Inicia la animación y simula el procesamiento.
  useEffect(() => {
    // Primera onda:
    // comienza pequeña y se expande suavemente.
    ondaUno.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1900,
          easing: Easing.out(Easing.cubic),
        }),

        // Regresa inmediatamente a cero
        // para volver a comenzar la onda.
        withTiming(0, {
          duration: 0,
        })
      ),
      -1,
      false
    );

    // Segunda onda:
    // hace el mismo movimiento pero comienza
    // un poco después para crear profundidad.
    ondaDos.value = withRepeat(
      withSequence(
        withDelay(
          800,
          withTiming(1, {
            duration: 1900,
            easing: Easing.out(Easing.cubic),
          })
        ),

        withTiming(0, {
          duration: 0,
        })
      ),
      -1,
      false
    );

    // El centro hace un pulso muy pequeño
    // para que la animación se sienta más natural.
    pulsoCentro.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 950,
          easing: Easing.inOut(Easing.ease),
        }),

        withTiming(1, {
          duration: 950,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    // =========================================
    // ANIMACIÓN DEL INDICADOR "PROCESANDO"
    // =========================================

    // Primer indicador.
    indicadorUno.value = withRepeat(
      withSequence(
        withTiming(-6, {
          duration: 350,
          easing: Easing.out(Easing.ease),
        }),

        withTiming(0, {
          duration: 350,
          easing: Easing.in(Easing.ease),
        }),

        withDelay(
          450,
          withTiming(0, {
            duration: 1,
          })
        )
      ),
      -1,
      false
    );

    // Segundo indicador.
    // Comienza ligeramente después del primero.
    indicadorDos.value = withRepeat(
      withSequence(
        withDelay(
          150,
          withTiming(-6, {
            duration: 350,
            easing: Easing.out(Easing.ease),
          })
        ),

        withTiming(0, {
          duration: 350,
          easing: Easing.in(Easing.ease),
        }),

        withDelay(
          300,
          withTiming(0, {
            duration: 1,
          })
        )
      ),
      -1,
      false
    );

    // Tercer indicador.
    // Comienza después del segundo.
    indicadorTres.value = withRepeat(
      withSequence(
        withDelay(
          300,
          withTiming(-6, {
            duration: 350,
            easing: Easing.out(Easing.ease),
          })
        ),

        withTiming(0, {
          duration: 350,
          easing: Easing.in(Easing.ease),
        }),

        withDelay(
          150,
          withTiming(0, {
            duration: 1,
          })
        )
      ),
      -1,
      false
    );

    // Por ahora simulamos el análisis durante 4 segundos.
    // Más adelante esto se reemplazará por el proceso
    // real que analice las respuestas de la entrevista.
    const temporizador = setTimeout(() => {
      setAnalisisTerminado(true);
    }, 4000);

    // Limpia el temporizador y las animaciones
    // cuando el usuario sale de esta pantalla.
    return () => {
      clearTimeout(temporizador);

      cancelAnimation(ondaUno);
      cancelAnimation(ondaDos);
      cancelAnimation(pulsoCentro);

      cancelAnimation(indicadorUno);
      cancelAnimation(indicadorDos);
      cancelAnimation(indicadorTres);
    };
  }, [
    ondaUno,
    ondaDos,
    pulsoCentro,
    indicadorUno,
    indicadorDos,
    indicadorTres,
  ]);

  // Primera onda que crece y desaparece.
  const estiloOndaUno = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: 1 + ondaUno.value * 0.45,
        },
      ],

      opacity: 0.35 - ondaUno.value * 0.35,
    };
  });

  // Segunda onda que aparece un poco después.
  const estiloOndaDos = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: 1 + ondaDos.value * 0.45,
        },
      ],

      opacity: 0.28 - ondaDos.value * 0.28,
    };
  });

  // Pequeño pulso del círculo central.
  const estiloCentro = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: pulsoCentro.value,
        },
      ],
    };
  });

  // Estilo animado del primer indicador.
  const estiloIndicadorUno = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: indicadorUno.value,
        },
      ],

      opacity:
        indicadorUno.value < 0
          ? 1
          : 0.45,
    };
  });

  // Estilo animado del segundo indicador.
  const estiloIndicadorDos = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: indicadorDos.value,
        },
      ],

      opacity:
        indicadorDos.value < 0
          ? 1
          : 0.45,
    };
  });

  // Estilo animado del tercer indicador.
  const estiloIndicadorTres = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: indicadorTres.value,
        },
      ],

      opacity:
        indicadorTres.value < 0
          ? 1
          : 0.45,
    };
  });

  // No mostramos la pantalla hasta que
  // las fuentes estén completamente cargadas.
  if (!fontsLoaded) {
    return null;
  }

  function verPlan() {
    // Por ahora este botón no navega a ninguna pantalla.
    // Más adelante aquí agregaremos la ruta
    // de la pantalla que está desarrollando mi compañera.
    console.log(
      "Aquí irá la pantalla del plan personalizado"
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <View className="flex-1 px-6">

        {/* ENCABEZADO */}
        <View className="h-20 flex-row items-center">

          {/* Botón para regresar */}
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-10 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={27}
              color="#135CE4"
            />
          </Pressable>

          {/* Logo de Kiri */}
          <Image
            source={require(
              "@/assets/images_kids/logo_horizontal.png"
            )}
            style={{
              width: 95,
              height: 55,
              marginLeft: 4,
            }}
            resizeMode="contain"
          />
        </View>

        {/* CONTENIDO CENTRAL */}
        <View className="flex-1 items-center pt-20">

          {/* ANIMACIÓN DE PROCESAMIENTO */}
          <View className="h-48 w-48 items-center justify-center">

            {/* Primera onda */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#8badf6",
                },
                estiloOndaUno,
              ]}
            />

            {/* Segunda onda */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#b7e8ff",
                },
                estiloOndaDos,
              ]}
            />

            {/* Círculo exterior fijo */}
            <View
              className="
                h-32
                w-32
                items-center
                justify-center
                rounded-full
                bg-[#E0F1FF]
              "
            >
              {/* Círculo central animado */}
              <Animated.View
                style={[
                  {
                    width: 82,
                    height: 82,
                    borderRadius: 41,
                    backgroundColor: "#5ab7fd",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  estiloCentro,
                ]}
              >
                {/* Icono que representa el procesamiento */}
                <Ionicons
                  name="sparkles"
                  size={27}
                  color="#FFFFFF"
                />
              </Animated.View>
            </View>
          </View>

          {/* TÍTULO */}
          <Animated.Text
            entering={FadeInUp.duration(600)}
            className="
              mt-5
              text-center
              text-[21px]
              text-[#273448]
            "
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Analizando tu perfil
          </Animated.Text>

          {/* DESCRIPCIÓN */}
          <Animated.Text
            entering={FadeIn.delay(200).duration(600)}
            className="
              mt-4
              max-w-[310px]
              text-center
              text-[14px]
              leading-5
              text-[#536076]
            "
            style={{
              fontFamily: "Nunito-Medium",
            }}
          >
            Estamos procesando tus respuestas para construir
            un camino hacia tu bienestar
          </Animated.Text>

          {/* TEXTO QUE APARECE MIENTRAS PROCESA */}
          {!analisisTerminado && (
            <Animated.View
              entering={FadeIn.delay(400).duration(500)}
              className="
                mt-8
                flex-row
                items-center
                justify-center
                rounded-full
                bg-white/70
                px-5
                py-3
              "
            >
              {/* Texto de procesamiento */}
              <Text
                className="text-[13px] text-[#657083]"
                style={{
                  fontFamily: "Nunito-SemiBold",
                }}
              >
                Procesando
              </Text>

              {/* Indicadores animados */}
              <View className="ml-3 h-6 flex-row items-center gap-1.5">

                {/* Primer indicador */}
                <Animated.View
                  style={estiloIndicadorUno}
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#7DA8F8]
                  "
                />

                {/* Segundo indicador */}
                <Animated.View
                  style={estiloIndicadorDos}
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#A78BFA]
                  "
                />

                {/* Tercer indicador */}
                <Animated.View
                  style={estiloIndicadorTres}
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#8ED1B2]
                  "
                />
              </View>
            </Animated.View>
          )}

          {/* BOTÓN QUE APARECE CUANDO TERMINA */}
          {analisisTerminado && (
            <Animated.View
              entering={FadeInUp.duration(900)}
              className="mt-8 w-full max-w-[300px]"
            >
              <Pressable
                onPress={verPlan}
                className="
                  h-14
                  w-full
                  flex-row
                  items-center
                  rounded-2xl
                  bg-[#6594F4]
                  px-5
                  shadow-md
                "
              >
                {/* Texto del botón */}
                <Text
                  className="
                    flex-1
                    text-center
                    text-[15px]
                    text-white
                  "
                  style={{
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  Ver mi plan
                </Text>

                {/* Flecha del botón */}
                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}