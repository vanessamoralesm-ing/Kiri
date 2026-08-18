import { useFonts } from "expo-font";
import { useState } from "react";

import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { seccionesEntrevista } from "./preguntas";

// Mostramos solamente una pregunta en cada pantalla.
const PREGUNTAS_POR_PANTALLA = 1;

// Estos colores e iconos se asignan dependiendo
// de la posición de cada respuesta.
const tiposOpciones = ["verde", "azul", "amarillo", "morado"];

const emojisOpciones = ["😊", "🙂", "😐", "🤔"];

export default function EntrevistaNinos() {
  // Carga la fuentes guardadas en assets/fonts.
  const [fontsLoaded] = useFonts({
    "Outfit-Regular": require("../../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("../../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../../assets/fonts/Outfit-Bold.ttf"),
  });

  // Guarda el número de la sección actual:
  const [numeroSeccion, setNumeroSeccion] = useState(0);

  // Guarda la pregunta actual dentro de la sección.
  const [paginaActual, setPaginaActual] = useState(0);

  // Guarda todas las respuestas seleccionadas.
  // Aquí se guardan tanto respuestas de botones
  // como respuestas escritas.
  const [respuestas, setRespuestas] = useState<{
    [clave: string]: string;
  }>({});

  // No muestra la interfaz hasta que la fuente esté cargada.
  if (!fontsLoaded) {
    return null;
  }

  // Obtiene la sección que se está mostrando actualmente.
  const seccionActual = seccionesEntrevista[numeroSeccion];

  // Como mostramos una pregunta por pantalla,
  // este índice corresponde a la pregunta actual.
  const indiceInicial = paginaActual * PREGUNTAS_POR_PANTALLA;

  const indiceFinal = indiceInicial + PREGUNTAS_POR_PANTALLA;

  // Extrae solamente la pregunta que debe aparecer.
  const preguntasVisibles = seccionActual.preguntas.slice(
    indiceInicial,
    indiceFinal,
  );

  // Calcula cuántas pantallas tiene la sección actual.
  const totalPaginas = Math.ceil(
    seccionActual.preguntas.length / PREGUNTAS_POR_PANTALLA,
  );

  // Indica si estamos en la última pregunta de la sección.
  const esUltimaPagina = paginaActual === totalPaginas - 1;

  // Indica si estamos en la última sección.
  const esUltimaSeccion = numeroSeccion === seccionesEntrevista.length - 1;

  // Guarda la respuesta seleccionada.
  function seleccionarRespuesta(indicePregunta: number, respuesta: string) {
    // Creamos una clave combinando:
    // número de sección + número de pregunta.
    //
    // "0-1" significa sección 0, pregunta 1.
    const clave = `${numeroSeccion}-${indicePregunta}`;

    // Conservamos las respuestas anteriores
    // y agregamos o cambiamos la respuesta actual.
    setRespuestas({
      ...respuestas,
      [clave]: respuesta,
    });
  }

  // Verifica si la pregunta actual tiene respuesta.
  const paginaCompleta = preguntasVisibles.every((pregunta, indiceLocal) => {
    const indiceReal = indiceInicial + indiceLocal;

    const clave = `${numeroSeccion}-${indiceReal}`;

    const respuesta = respuestas[clave];

    // También verifica que una respuesta abierta
    // no esté vacía.
    return respuesta !== undefined && respuesta.trim() !== "";
  });

  // Suma todas las preguntas de las cinco secciones.
  const totalPreguntas = seccionesEntrevista.reduce(
    (total, seccion) => total + seccion.preguntas.length,
    0,
  );

  // Cuenta cuántas respuestas se han guardado
  // y que realmente tengan contenido.
  const totalRespondidas = Object.values(respuestas).filter(
    (respuesta) => respuesta.trim() !== "",
  ).length;

  // Calcula el porcentaje general de la entrevista.
  const porcentaje = Math.round((totalRespondidas / totalPreguntas) * 100);

  // Avanza a la siguiente pregunta o sección.
  function continuar() {
    // No permite continuar sin responder.
    if (!paginaCompleta) {
      Alert.alert(
        "Falta una respuesta",
        "Debe responder la pregunta antes de continuar.",
      );

      return;
    }

    // Avanza a la siguiente pregunta
    // dentro de la misma sección.
    if (!esUltimaPagina) {
      setPaginaActual(paginaActual + 1);
      return;
    }

    // Cuando termina una sección,
    // comienza la siguiente desde su primera pregunta.
    if (!esUltimaSeccion) {
      setNumeroSeccion(numeroSeccion + 1);
      setPaginaActual(0);
      return;
    }

    // Mensaje que aparece al terminar toda la entrevista.
    Alert.alert(
      "Entrevista completada",
      "Todas las preguntas fueron respondidas.",
    );

    // Por ahora las respuestas aparecen en la consola.
    // Más adelante aquí se podrán enviar a la base de datos, mientras se construye//.
    console.log("Respuestas:", respuestas);
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
      const seccionAnterior = seccionesEntrevista[numeroSeccion - 1];

      const paginasAnteriores = Math.ceil(
        seccionAnterior.preguntas.length / PREGUNTAS_POR_PANTALLA,
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
    <SafeAreaView style={styles.pantalla}>
      {/* Imagen que ocupa todo el fondo de la pantalla */}
      <ImageBackground
        source={require("../../assets/images_kids/fondo_niños.png")}
        style={styles.contenido}
        imageStyle={styles.imagenFondo}
        resizeMode="cover"
      >
        {/* ENCABEZADO FIJO */}

        <View style={styles.encabezado}>
          {/* Botón para regresar */}
          <Pressable style={styles.botonRegresar} onPress={regresar}>
            <Text style={styles.flecha}>‹</Text>
          </Pressable>

          {/* Logo superior izquierdo */}
          <Image
            source={require("../../assets/images_kids/logo_horizontal.png")}
            style={styles.logoImagen}
            resizeMode="contain"
          />

          {/* Perfil superior derecho */}
          <View style={styles.perfil}>
            <Text style={styles.perfilTexto}>P</Text>
          </View>
        </View>

        {/* INFORMACION DEL PROGRESO */}

        <View style={styles.progresoInformacion}>
          {/* Sección actual de cinco secciones */}
          <Text style={styles.numeroSeccion}>
            {numeroSeccion + 1} de {seccionesEntrevista.length}
          </Text>

          {/* Porcentaje general completado */}
          <Text style={styles.porcentajeTexto}>{porcentaje}% completado</Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraProgreso,
              {
                // El ancho cambia segun el porcentaje.
                width: `${porcentaje}%`,
              },
            ]}
          />
        </View>

        {/* AREA DE LA PREGUNTA */}

        <View style={styles.areaPregunta}>
          {preguntasVisibles.map((pregunta, indiceLocal) => {
            // Número real de la pregunta dentro de la sección.
            const indiceReal = indiceInicial + indiceLocal;

            // Clave que identifica la respuesta.
            const clave = `${numeroSeccion}-${indiceReal}`;

            // Respuesta seleccionada para esta pregunta.
            const respuestaActual = respuestas[clave] || "";

            return (
              <View key={clave} style={styles.tarjetaPregunta}>
                {/* Circulo con el numero de la pregunta */}
                <View style={styles.numeroCirculo}>
                  <Text style={styles.numeroTexto}>{indiceReal + 1}.</Text>
                </View>

                {/* Texto principal de la pregunta */}
                <View style={styles.contenidoPregunta}>
                  <Text style={styles.pregunta}>{pregunta.texto}</Text>

                  <Text style={styles.descripcion}>
                    {pregunta.tipoRespuesta === "abierta"
                      ? "Escriba una respuesta según lo que ha observado en su hijo/a."
                      : "Elija la opción que mejor describa el comportamiento de su hijo/a."}
                  </Text>
                </View>

                {/* RESPUESTA ABIERTA */}

                {pregunta.tipoRespuesta === "abierta" ? (
                  <View style={styles.contenedorRespuestaAbierta}>
                    <TextInput
                      style={styles.respuestaAbierta}
                      placeholder="Escriba su respuesta aquí..."
                      placeholderTextColor="#9BA4B4"
                      value={respuestaActual}
                      onChangeText={(texto) =>
                        seleccionarRespuesta(indiceReal, texto)
                      }
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                ) : (
                  <>
                    {/* OPCIONES DE RESPUESTA */}

                    <View style={styles.opciones}>
                      {pregunta.opciones?.map((opcion, indiceOpcion) => {
                        // Comprueba si esta opción está seleccionada.
                        const seleccionada = respuestaActual === opcion;

                        // Elegimos un color según la posición.
                        const tipo = tiposOpciones[indiceOpcion] || "azul";

                        // Elegimos un emoji según la posición.
                        const emoji = emojisOpciones[indiceOpcion] || "🙂";

                        return (
                          <Pressable
                            key={opcion}
                            onPress={() =>
                              seleccionarRespuesta(indiceReal, opcion)
                            }
                            style={[
                              styles.opcion,

                              // Aplica un color diferente
                              // dependiendo del tipo de respuesta.
                              tipo === "verde" && styles.opcionVerde,

                              tipo === "azul" && styles.opcionAzul,

                              tipo === "amarillo" && styles.opcionAmarilla,

                              tipo === "morado" && styles.opcionMorada,

                              // Resalta la opción seleccionada.
                              seleccionada && styles.opcionSeleccionada,
                            ]}
                          >
                            {/* Círculo de color que contiene el emoji */}
                            <View
                              style={[
                                styles.emojiCirculo,

                                tipo === "verde" && styles.emojiVerde,

                                tipo === "azul" && styles.emojiAzul,

                                tipo === "amarillo" && styles.emojiAmarillo,

                                tipo === "morado" && styles.emojiMorado,
                              ]}
                            >
                              <Text style={styles.emoji}>{emoji}</Text>
                            </View>

                            {/* Texto de la respuesta */}
                            <Text
                              style={[
                                styles.textoOpcion,

                                seleccionada && styles.textoSeleccionado,
                              ]}
                            >
                              {opcion}
                            </Text>

                            {/* Marca que aparece al seleccionar */}
                            {seleccionada && (
                              <Text style={styles.check}>✓</Text>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* AVATAR INFERIOR DERECHO */}

                {/*
                    Este View mantiene el avatar en la parte
                    inferior derecha de la tarjeta.

                    Al usar position: "absolute", el avatar
                    no empuja ni modifica las respuestas.
                  */}

                <View style={styles.avatarInferior}>
                  <Image
                    source={require("../../assets/images_kids/avatar_pregunta.png")}
                    style={styles.avatarImagen}
                    resizeMode="contain"
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* BOTÓN INFERIOR */}

        <View style={styles.zonaBoton}>
          <Pressable
            onPress={continuar}
            style={[
              styles.botonContinuar,

              // Cambia el color cuando todavía
              // no se ha seleccionado una respuesta.
              !paginaCompleta && styles.botonDesactivado,
            ]}
          >
            <Text style={styles.textoBoton}>
              {esUltimaPagina && esUltimaSeccion
                ? "Finalizar entrevista"
                : "Continuar"}
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // PANTALLA GENERAL

  pantalla: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  contenido: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 12,
  },

  // Mueve la imagen de fondo ligeramente hacia arriba
  // y la aumenta un poco para evitar espacios vacíos.
  imagenFondo: {
    transform: [
      {
        translateY: -25,
      },
      {
        scale: 1.06,
      },
    ],
  },

  // ENCABEZADO

  encabezado: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
  },

  botonRegresar: {
    width: 32,
    height: 44,
    justifyContent: "center",
  },

  flecha: {
    fontSize: 36,
    lineHeight: 38,
    color: "#87909F",
    fontFamily: "Outfit-Regular",
  },

  logoImagen: {
    width: 105,
    height: 43,
    marginLeft: 0,
    marginRight: "auto",
  },

  perfil: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: "#C7DAFF",
    alignItems: "center",
    justifyContent: "center",
  },

  perfilTexto: {
    color: "#4C72B4",
    fontSize: 14,
    fontFamily: "Outfit-SemiBold",
  },

  // PROGRESO

  progresoInformacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  numeroSeccion: {
    fontSize: 13,
    color: "#135CE4",
    fontFamily: "Outfit-SemiBold",
  },

  porcentajeTexto: {
    fontSize: 13,
    color: "#135CE4",
    fontFamily: "Outfit-SemiBold",
  },

  barraFondo: {
    height: 8,
    backgroundColor: "#E1E5EB",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 12,
  },

  barraProgreso: {
    height: "100%",
    backgroundColor: "#7DA8F8",
    borderRadius: 8,
  },

  // ÁREA PRINCIPAL

  areaPregunta: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 12,
  },

  tarjetaPregunta: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.96)",

    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#EDF0F2",

    paddingHorizontal: 20,
    paddingTop: 22,

    //
    paddingBottom: 125,

    shadowColor: "#88919F",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 7,

    elevation: 4,
  },

  // NÚMERO DE PREGUNTA

  numeroCirculo: {
    position: "absolute",
    top: 12,
    left: 12,

    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: "#EEE9FF",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  numeroTexto: {
    color: "#30394D",
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },

  // TEXTO DE LA PREGUNTA

  contenidoPregunta: {
    paddingLeft: 40,
    paddingRight: 5,
    marginTop: -10,

    minHeight: 100,

    justifyContent: "center",
  },

  pregunta: {
    fontSize: 20,
    lineHeight: 24,
    color: "#273448",
    fontFamily: "Outfit-SemiBold",
    letterSpacing: -0.2,
  },

  descripcion: {
    fontSize: 14,
    lineHeight: 17,
    color: "#788296",
    marginTop: 10,
    fontFamily: "Outfit-Regular",
  },

  // RESPUESTAS

  opciones: {
    gap: 10,

    // baja las respuestas
    marginTop: 30,
  },

  opcion: {
    minHeight: 52,

    borderRadius: 15,
    borderWidth: 1,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
  },

  opcionVerde: {
    backgroundColor: "#FAFFFB",
    borderColor: "#D6ECD9",
  },

  opcionAzul: {
    backgroundColor: "#FAFCFF",
    borderColor: "#D6E6FA",
  },

  opcionAmarilla: {
    backgroundColor: "#FFFDF8",
    borderColor: "#F7E6B8",
  },

  opcionMorada: {
    backgroundColor: "#FCFAFF",
    borderColor: "#E6DDF9",
  },

  // Estilo que se activa al seleccionar una respuesta.
  opcionSeleccionada: {
    borderWidth: 2,
    borderColor: "#7B9FE8",
  },

  emojiCirculo: {
    width: 34,
    height: 34,
    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  emojiVerde: {
    backgroundColor: "#BEE3C2",
  },

  emojiAzul: {
    backgroundColor: "#C9E0FC",
  },

  emojiAmarillo: {
    backgroundColor: "#FFE39B",
  },

  emojiMorado: {
    backgroundColor: "#D8CCFA",
  },

  emoji: {
    fontSize: 19,
  },

  // texto de las opciones o respuestas
  textoOpcion: {
    flex: 1,

    fontSize: 14,
    lineHeight: 18,

    color: "#354156",
    fontFamily: "Outfit-SemiBold",
  },

  textoSeleccionado: {
    color: "#355FAD",
    fontFamily: "Outfit-SemiBold",
  },

  check: {
    fontSize: 18,
    color: "#5D8BDD",
    fontFamily: "Outfit-Regular",
  },

  // RESPUESTA ABIERTA

  contenedorRespuestaAbierta: {
    marginTop: 30,
  },

  respuestaAbierta: {
    minHeight: 150,

    borderWidth: 1,
    borderColor: "#D6E0EF",
    borderRadius: 18,

    backgroundColor: "#FAFCFF",

    paddingHorizontal: 16,
    paddingVertical: 14,

    fontSize: 15,
    lineHeight: 22,

    color: "#354156",
    fontFamily: "Outfit-Regular",
  },

  // AVATAR INFERIOR DE LAS PREGUNTAS

  avatarInferior: {
    // position absolute permite moverlo
    // dentro de la tarjeta sin empujar los demás elementos.
    position: "absolute",

    // Distancia desde el lado derecho.
    right: -40,

    // Distancia desde la parte inferior.
    bottom: -20,

    width: 250,
    height: 200,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarImagen: {
    width: "130%",
    height: "130%",
  },

  // BOTÓN CONTINUAR

  zonaBoton: {
    paddingTop: 2,
  },

  botonContinuar: {
    minHeight: 52,
    borderRadius: 15,

    backgroundColor: "#6697EB",

    alignItems: "center",
    justifyContent: "center",
  },

  // Color del botón cuando falta responder.
  botonDesactivado: {
    backgroundColor: "#BCC5D1",
  },

  textoBoton: {
    fontSize: 17,
    color: "#FFFFFF",
    fontFamily: "Outfit-Bold",
  },
});
