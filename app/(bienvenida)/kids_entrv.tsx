import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRef, useState } from "react";

import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { seccionesEntrevista } from "./preguntas_kids";

// Mostramos solamente una pregunta en cada pantalla.
const PREGUNTAS_POR_PANTALLA = 1;

// Estos colores se asignan dependiendo
// de la posición de cada respuesta.
const tiposOpciones = [
  "verde",
  "azul",
  "amarillo",
  "morado",
];

// Usamos el mismo emoji para todas las respuestas
const emojiOpcion = "🤔";

export default function EntrevistaNinos() {
  // Obtiene el ancho actual de la pantalla.
  // Esto nos permite adaptar únicamente algunos elementos cuando el teléfono tiene una pantalla más pequeña.
  const { width } = useWindowDimensions();

  // Detecta teléfonos con una pantalla más pequeña.
  // Esto evita que elementos como el avatar se vean grandes en algunos dispositivos
  const esTelefonoPequeno = width < 380;

  const scrollEntrevistaRef = useRef<ScrollView>(null);

  // Lleva inmediatamente el contenido desplazable al inicio de la pregunta actual.
  // animated: false hace que la siguiente pregunta aparezca directamente arriba,
  function volverAlInicioPregunta() {
    scrollEntrevistaRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }

  // Carga la fuentes guardadas en assets/fonts.
  const [fontsLoaded] = useFonts({
    "Nunito-Medium": require(
      "../../assets/fonts/Nunito-Medium.ttf"
    ),
    "Nunito-SemiBold": require(
      "../../assets/fonts/Nunito-SemiBold.ttf"
    ),
    "Nunito-Bold": require(
      "../../assets/fonts/Nunito-Bold.ttf"
    ),
  });

  // Guarda el número de la sección actual:
  const [numeroSeccion, setNumeroSeccion] = useState(0);

  // Guarda la pregunta actual dentro de la sección.
  const [paginaActual, setPaginaActual] = useState(0);

  // Guarda todas las respuestas seleccionadas
  // en las opciones de cada pregunta.
  const [respuestas, setRespuestas] = useState<{
    [clave: string]: string;
  }>({});

  // No muestra la interfaz hasta que la fuente esté cargada.
  if (!fontsLoaded) {
    return null;
  }
  // Obtiene la sección que se está mostrando actualmente.
  const seccionActual =
    seccionesEntrevista[numeroSeccion];

  // Como mostramos una pregunta por pantalla,
  // este índice corresponde a la pregunta actual.
  const indiceInicial =
    paginaActual * PREGUNTAS_POR_PANTALLA;

  const indiceFinal =
    indiceInicial + PREGUNTAS_POR_PANTALLA;

  // Extrae solamente la pregunta que debe aparecer.
  const preguntasVisibles =
    seccionActual.preguntas.slice(
      indiceInicial,
      indiceFinal
    );

  // Calcula cuántas pantallas tiene la sección actual.
  const totalPaginas = Math.ceil(
    seccionActual.preguntas.length /
      PREGUNTAS_POR_PANTALLA
  );

  // Indica si estamos en la última pregunta de la sección.
  const esUltimaPagina =
    paginaActual === totalPaginas - 1;

  // Indica si estamos en la última sección.
  const esUltimaSeccion =
    numeroSeccion ===
    seccionesEntrevista.length - 1;

  // Guarda la respuesta seleccionada.
  function seleccionarRespuesta(
    indicePregunta: number,
    respuesta: string
  ) {
    // Creamos una clave combinando:
    // número de sección + número de pregunta.
    //significa sección 0, pregunta 1.
    const clave =
      `${numeroSeccion}-${indicePregunta}`;

    // Conservamos las respuestas anteriores
    // y agregamos o cambiamos la respuesta actual.
    setRespuestas({
      ...respuestas,
      [clave]: respuesta,
    });
  }

  // Verifica si la pregunta actual tiene respuesta.
  const paginaCompleta =
    preguntasVisibles.every(
      (pregunta, indiceLocal) => {
        const indiceReal =
          indiceInicial + indiceLocal;

        const clave =
          `${numeroSeccion}-${indiceReal}`;

        const respuesta = respuestas[clave];

        return (
          respuesta !== undefined &&
          respuesta.trim() !== ""
        );
      }
    );

  // Suma todas las preguntas de las cinco secciones.
  const totalPreguntas =
    seccionesEntrevista.reduce(
      (total, seccion) =>
        total + seccion.preguntas.length,
      0
    );

  // Cuenta cuántas respuestas se han guardado
  // y que realmente tengan contenido.
  const totalRespondidas =
    Object.values(respuestas).filter(
      (respuesta) => respuesta.trim() !== ""
    ).length;

  // Calcula el porcentaje general de la entrevista.
  const porcentaje = Math.round(
    (totalRespondidas / totalPreguntas) * 100
  );

  // Avanza a la siguiente pregunta o sección.
  function continuar() {
    // Verifica que la pregunta que aparece actualmente
    // tenga una respuesta antes de permitir avanzar.
    if (!paginaCompleta) {
      Alert.alert(
        "Falta una respuesta",
        "Debe responder la pregunta antes de continuar."
      );

      // Detiene la función para que el usuario
      // permanezca en la misma pregunta.
      return;
    }

    // Si todavía existen más preguntas dentro
    // de la sección actual, avanza a la siguiente.
    if (!esUltimaPagina) {
      // Antes de mostrar la siguiente pregunta,
      // regresamos el ScrollView hasta arriba. Así, aunque el usuario haya bajado hasta
      // el botón Continuar, la nueva pregunta aparecerá inmediatamente desde el inicio.
      volverAlInicioPregunta();

      setPaginaActual(paginaActual + 1);
      return;
    }

    if (!esUltimaSeccion) {
      // También regresamos el ScrollView arriba
      // cuando comienza una sección nueva.
      volverAlInicioPregunta();

      // Cambia a la siguiente sección.
      setNumeroSeccion(numeroSeccion + 1);

      // Comienza desde la primera pregunta
      // de la nueva sección.
      setPaginaActual(0);

      return;
    }
    
    console.log("Respuestas:", respuestas);

    // Al terminar toda la entrevista, aparecera analizando...
    router.replace("/(bienvenida)/analizando");
  }

  // Regresa a la pregunta anterior.
  function regresar() {
    // Regresa dentro de la misma sección.
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
      return;
    }

    // Regresa a la última pregunta
    // de la sección anterior.
    if (numeroSeccion > 0) {
      const seccionAnterior =
        seccionesEntrevista[numeroSeccion - 1];

      const paginasAnteriores = Math.ceil(
        seccionAnterior.preguntas.length /
          PREGUNTAS_POR_PANTALLA
      );

      setNumeroSeccion(numeroSeccion - 1);
      setPaginaActual(paginasAnteriores - 1);

      return;
    }
    // Si estamos en la primera pregunta,
    // regresa a la pantalla anterior de la aplicación.
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      {/* Imagen que ocupa todo el fondo de la pantalla */}
      <ImageBackground
        source={require(
          "../../assets/images_kids/fondo_niños.png"
        )}
        className="flex-1 w-full bg-[#FAFBFD]"
        // Conservamos este style porque imageStyle controla
        // directamente la imagen interna del ImageBackground.
        imageStyle={{
          transform: [
            {
              translateY: -3,
            },
            {
              scale: 1.06,
            },
          ],
        }}
        resizeMode="cover"
      >
        {/*
          ZONA SUPERIOR FIJA.

        */}
        <View className="w-full px-[18px] pt-1">
            {/* ENCABEZADO */}

            <View className="h-16 flex-row items-center">
              {/* Botón para regresar */}
              <Pressable
                className="h-11 w-[30px] justify-center"
                onPress={regresar}
              >
                <Ionicons
                  name="arrow-back"
                  size={30}
                  // Mantenemos style en el icono porque Ionicons
                  // recibe directamente color y márgenes desde React Native.
                  style={{
                    color: "#135CE4",
                    marginLeft: -5,
                    marginTop: -14,
                  }}
                />
              </Pressable>

              {/* Logo superior izquierdo */}

              {/*
                Aquí usamos style para fijar el tamaño del logo.
               
              */}
              <Image
                source={require(
                  "../../assets/images_kids/logo_horizontal.png"
                )}
                style={{
                  width: 105,
                  height: 105,
                  marginLeft: 12,
                  marginTop: -15,
                }}
                resizeMode="contain"
              />
            </View>

            {/* INFORMACION DEL PROGRESO */}

            <View className="mt-[-5px] flex-row items-center justify-between">
              {/* Sección actual de cinco secciones */}
              <Text
                maxFontSizeMultiplier={1}
                className="text-[13px] text-[#135CE4]"
                // Conservamos fontFamily en style porque
                // las fuentes Nunito se cargan con useFonts.
                style={{
                  fontFamily: "Nunito-Bold",
                }}
              >
                {numeroSeccion + 1} de{" "}
                {seccionesEntrevista.length}
              </Text>

              {/* Porcentaje general completado */}
              <Text
                maxFontSizeMultiplier={1}
                className="text-[13px] text-[#135CE4]"
                style={{
                  fontFamily: "Nunito-Bold",
                }}
              >
                {porcentaje}% completado
              </Text>
            </View>

            {/* Barra de progreso */}
            {/* w-[115%] hace que la barra se extienda mas hacia la derecha */}
            <View
              className={`
                mt-[10px]
                mb-[5px]
                w-[115%] 
                flex-row
                items-center
                px-0.5
              `}
            >
              {seccionesEntrevista.map(
                (seccion, indice) => {
                  //Comprueba si este circulo corresponde a la seccion en la que estamos actualmente.
                  const estaActivo =
                    indice === numeroSeccion;

                  //Comprueba si esta seccion ya fue completada.
                  const estacompletado =
                    indice < numeroSeccion;

                  return (
                    <View
                      key={seccion.titulo}
                      className="flex-1 flex-row items-center"
                    >
                      {/*ciruclo de cada seccion*/}
                      <View
                        className={`
                          h-6 w-6
                          items-center justify-center
                          rounded-full
                          border-[3px]
                          ${
                            estacompletado
                              ? "border-[#A78BFA] bg-[#A78BFA]"
                              : estaActivo
                                ? "border-[#A78BFA] bg-white"
                                : "border-[#E1E1E6] bg-white"
                          }
                        `}
                      >
                        {/*Punto interior del circulo activo*/}
                        {estaActivo && !estacompletado && (
                          <View className="h-[10px] w-[10px] rounded-full bg-[#A78BFA]" />
                        )}

                        {/*Check para secciones ya completadas*/}
                        {estacompletado && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        )}
                      </View>

                      {/*Linea que conecta con el otro circulo*/}
                      {indice <
                        seccionesEntrevista.length -
                          1 && (
                        <View
                          className={`
                            mx-[7px]
                            h-0.5
                            flex-1
                            ${
                              estacompletado
                                ? "bg-[#A78BFA]"
                                : "bg-[#E1E1E6]"
                            }
                          `}
                        />
                      )}
                    </View>
                  );
                }
              )}
            </View>

        </View>

        {/*
          //ZONA DESPLAZABLE//

          style={{ flex: 1 }} hace que el ScrollView use
          todo el espacio restante debajo de la zona fija.
        */}
        <ScrollView
          // Esta referencia permite que la función volverAlInicioPregunta controle el scroll
          // cuando el usuario presiona Continuar.
          ref={scrollEntrevistaRef}

          style={{
            flex: 1,
            width: "100%",
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            {/* ÁREA DE LA PREGUNTA */}

            {/*
              Esta área tampoco usa flex-1. De esta manera la tarjeta puede crecer
              naturalmente y ScrollView puede calcular correctamente la altura total.
            */}
            <View className="w-full pt-[10px] pb-3">
              {preguntasVisibles.map(
                (pregunta, indiceLocal) => {
                  // Número real de la pregunta dentro de la sección.
                  const indiceReal =
                    indiceInicial + indiceLocal;

                  // Clave que identifica la respuesta.
                  const clave =
                    `${numeroSeccion}-${indiceReal}`;

                  // Respuesta seleccionada para esta pregunta.
                  const respuestaActual =
                    respuestas[clave] || "";

                  return (
                    <View
                      key={clave}
                      className="
                        relative
                        min-h-[590px]
                        w-full
                        rounded-[26px]
                        border
                        border-[#EDF0F2]
                        bg-white/95
                        px-5
                        pt-[22px]
                        pb-[125px]
                        shadow-md
                      "
                    >
                      {/* Círculo con el número de la pregunta */}
                      <View
                        className="
                          absolute
                          left-3
                          top-3
                          z-10
                          h-[38px]
                          w-[38px]
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EEE9FF]
                        "
                      >
                        <Text
                          maxFontSizeMultiplier={1}
                          className="text-[16px] text-[#30394D]"
                          style={{
                            fontFamily: "Nunito-Bold",
                          }}
                        >
                          {indiceReal + 1}.
                        </Text>
                      </View>

                      {/* Texto principal de la pregunta */}
                      <View className="mt-[-10px] min-h-[100px] justify-center pl-10 pr-[5px]">
                        <Text
                          maxFontSizeMultiplier={1}
                          className="text-[20px] leading-6 tracking-[-0.2px] text-[#273448]"
                          style={{
                            fontFamily: "Nunito-SemiBold",
                          }}
                        >
                          {pregunta.texto}
                        </Text>

                        <Text
                          maxFontSizeMultiplier={1}
                          className="mt-[10px] text-[14px] leading-[17px] text-[#788296]"
                          style={{
                            fontFamily: "Nunito-Medium",
                          }}
                        >
                          Elija la opción que mejor se ajuste al proceder de su hijo/a.
                        </Text>
                      </View>

                      {/* OPCIONES DE RESPUESTA */}

                      <View className="mt-[10px] w-full gap-[10px]">
                        {pregunta.opciones?.map(
                          (
                            opcion,
                            indiceOpcion
                          ) => {
                            // Comprueba si esta opción está seleccionada.
                            const seleccionada =
                              respuestaActual ===
                              opcion;

                            // Elegimos un color según la posición.
                            const tipo =
                              tiposOpciones[
                                indiceOpcion
                              ] || "azul";

                            // Usamos el mismo emoji en todas las opciones
                            // para evitar sugerir si una respuesta es buena o mala.
                            const emoji = emojiOpcion;

                            const claseColor =
                              tipo === "verde"
                                ? "border-[#D6ECD9] bg-[#FAFFFB]"
                                : tipo === "azul"
                                  ? "border-[#D6E6FA] bg-[#FAFCFF]"
                                  : tipo === "amarillo"
                                    ? "border-[#F7E6B8] bg-[#FFFDF8]"
                                    : "border-[#E6DDF9] bg-[#FCFAFF]";

                            // Estas clases cambian el fondo del círculo
                            // que contiene el emoji según la opción.
                            const claseEmoji =
                              tipo === "verde"
                                ? "bg-[#BEE3C2]"
                                : tipo === "azul"
                                  ? "bg-[#C9E0FC]"
                                  : tipo === "amarillo"
                                    ? "bg-[#FFE39B]"
                                    : "bg-[#D8CCFA]";

                            return (
                              <Pressable
                                key={opcion}

                                // onPressIn responde desde el momento
                                // en que el dedo toca la opción.
                                onPressIn={() =>
                                  seleccionarRespuesta(
                                    indiceReal,
                                    opcion
                                  )
                                }

                                // Amplía ligeramente el área táctil
                                // sin cambiar el tamaño visual del botón.
                                hitSlop={4}

                                className={`
                                  min-h-[52px]
                                  w-full
                                  flex-row
                                  items-center
                                  rounded-[15px]
                                  border
                                  px-[13px]
                                  ${claseColor}
                                  ${
                                    seleccionada
                                      ? "border-2 border-[#7B9FE8]"
                                      : ""
                                  }
                                `}
                              >
                                {/* Círculo de color que contiene el emoji */}
                                <View
                                  className={`
                                    mr-3
                                    h-[37px]
                                    w-[37px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    ${claseEmoji}
                                  `}
                                >
                                  <Text
                                    maxFontSizeMultiplier={1}
                                    className="text-[22px]"
                                  >
                                    {emoji}
                                  </Text>
                                </View>

                                {/* Texto de la respuesta */}
                                <Text
                                  maxFontSizeMultiplier={1}
                                  className={`
                                    flex-1
                                    text-[15px]
                                    leading-[18px]
                                    ${
                                      seleccionada
                                        ? "text-[#355FAD]"
                                        : "text-[#354156]"
                                    }
                                  `}
                                  style={{
                                    fontFamily:
                                      "Nunito-SemiBold",
                                  }}
                                >
                                  {opcion}
                                </Text>

                                {/* Marca que aparece al seleccionar */}
                                {seleccionada && (
                      
                                  <Ionicons
                                    name="checkmark"
                                    size={21}
                                    color="#5D8BDD"
                                  />
                                )}
                              </Pressable>
                            );
                          }
                        )}
                      </View>

                      {/* AVATAR INFERIOR DERECHO */}

                      {/*
                        Este View mantiene el avatar en la parte
                        inferior derecha de la tarjeta.

                        Al usar position: "absolute", el avatar
                        no empuja ni modifica las respuestas.
                      */}

                      <View
                        style={{
                          position: "absolute",

                          // En teléfonos pequeños reducimos el tamanio del avatar
                          right: esTelefonoPequeno
                            ? -22
                            : -40,

                          bottom: esTelefonoPequeno
                            ? -10
                            : -20,

                          width: esTelefonoPequeno
                            ? 190
                            : 250,

                          height: esTelefonoPequeno
                            ? 160
                            : 200,

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={require(
                            "../../assets/gifs/kiri_pensando.gif"
                          )}

                          style={{
                            width: esTelefonoPequeno
                              ? "125%"  //telefono pequeno
                              : "135%", //telefono grande

                            height: esTelefonoPequeno
                              ? "115%" //telefono pequeno
                              : "130%", //telefono grande

                            marginTop:
                              esTelefonoPequeno
                                ? -10 //telefono pequeno
                                : -20, //telefono grande
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* BOTÓN INFERIOR */}

            {/*
              El botón permanece dentro del ScrollView.
            */}
            <View className="mt-3 w-full pb-3">
              <Pressable
                onPress={continuar}
                className={`
                  min-h-[52px]
                  w-full
                  items-center
                  justify-center
                  rounded-[15px]
                  ${
                    paginaCompleta
                      ? "bg-[#6697EB]"
                      : "bg-[#BCC5D1]"
                  }
                `}
              >
                <Text
                  maxFontSizeMultiplier={1}
                  className="text-[17px] text-white"
                  style={{
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {esUltimaPagina &&
                  esUltimaSeccion
                    ? "Finalizar entrevista"
                    : "Continuar"}
                </Text>
              </Pressable>
            </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
