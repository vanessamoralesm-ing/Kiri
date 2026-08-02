import { useState } from "react";

import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { seccionesEntrevista } from "./preguntas";

// Se mostrarán dos preguntas en cada pantalla.
const PREGUNTAS_POR_PANTALLA = 2;

// Opciones de respuesta.
const opciones = [
  {
    texto: "Nunca",
    emoji: "🙂",
    tipo: "verde",
  },
  {
    texto: "A veces",
    emoji: "😐",
    tipo: "azul",
  },
  {
    texto: "Frecuentemente",
    emoji: "🙁",
    tipo: "amarillo",
  },
  {
    texto: "Siempre",
    emoji: "☹️",
    tipo: "morado",
  },
];

export default function EntrevistaNinos() {
  // Sección actual:
  // 0 = Conociendo
  // 1 = Escuela
  // 2 = Emociones
  // 3 = Conductas
  // 4 = Síntomas
  const [numeroSeccion, setNumeroSeccion] = useState(0);

  // Página actual dentro de la sección.
  const [paginaActual, setPaginaActual] = useState(0);

  // Respuestas seleccionadas.
  const [respuestas, setRespuestas] = useState<{
    [clave: string]: string;
  }>({});

  const seccionActual = seccionesEntrevista[numeroSeccion];

  // Calculamos cuáles preguntas se mostrarán.
  const indiceInicial =
    paginaActual * PREGUNTAS_POR_PANTALLA;

  const indiceFinal =
    indiceInicial + PREGUNTAS_POR_PANTALLA;

  const preguntasVisibles =
    seccionActual.preguntas.slice(
      indiceInicial,
      indiceFinal
    );

  // Cantidad de páginas de la sección actual.
  const totalPaginas = Math.ceil(
    seccionActual.preguntas.length /
      PREGUNTAS_POR_PANTALLA
  );

  const esUltimaPagina =
    paginaActual === totalPaginas - 1;

  const esUltimaSeccion =
    numeroSeccion ===
    seccionesEntrevista.length - 1;

  function seleccionarRespuesta(
    indicePregunta: number,
    respuesta: string
  ) {
    const clave = `${numeroSeccion}-${indicePregunta}`;

    setRespuestas({
      ...respuestas,
      [clave]: respuesta,
    });
  }

  // Revisamos si las preguntas visibles tienen respuesta.
  const paginaCompleta = preguntasVisibles.every(
    (pregunta, indiceLocal) => {
      const indiceReal =
        indiceInicial + indiceLocal;

      const clave = `${numeroSeccion}-${indiceReal}`;

      return respuestas[clave] !== undefined;
    }
  );

  // Total de preguntas de toda la entrevista.
  const totalPreguntas = seccionesEntrevista.reduce(
    (total, seccion) =>
      total + seccion.preguntas.length,
    0
  );

  const totalRespondidas =
    Object.keys(respuestas).length;

  const porcentaje = Math.round(
    (totalRespondidas / totalPreguntas) * 100
  );

  function continuar() {
    if (!paginaCompleta) {
      Alert.alert(
        "Faltan respuestas",
        "Debe responder las preguntas antes de continuar."
      );

      return;
    }

    // Sigue en la misma sección.
    if (!esUltimaPagina) {
      setPaginaActual(paginaActual + 1);
      return;
    }

    // Pasa a la siguiente sección.
    if (!esUltimaSeccion) {
      setNumeroSeccion(numeroSeccion + 1);
      setPaginaActual(0);
      return;
    }

    Alert.alert(
      "Entrevista completada",
      "Todas las preguntas fueron respondidas."
    );

    console.log("Respuestas:", respuestas);
  }

  function regresar() {
    // Regresa a la página anterior.
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
      return;
    }

    // Regresa a la sección anterior.
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

    router.back();
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      {/*
        CUANDO TENGAS TU IMAGEN DE FONDO:

        Cambia este View:

        <View style={styles.contenido}>

        por:

        <ImageBackground
          source={require("../../assets/images/fondo-entrevista.png")}
          style={styles.contenido}
          resizeMode="cover"
        >

        Y al final cambia </View> por </ImageBackground>.
      */}

      <View style={styles.contenido}>
        {/* ENCABEZADO FIJO */}
        <View style={styles.encabezado}>
          <Pressable
            style={styles.botonRegresar}
            onPress={regresar}
          >
            <Text style={styles.flecha}>‹</Text>
          </Pressable>

          {/*
            ESPACIO PARA EL LOGO.

            Cuando tengas la imagen, reemplaza el View
            que dice LOGO por:

            <Image
              source={require("../../assets/images/logo-kiri.png")}
              style={styles.logoImagen}
              resizeMode="contain"
            />
          */}

          <View style={styles.logoEspacio}>
            <Text style={styles.logoMarcador}>
              LOGO
            </Text>
          </View>

          <View style={styles.perfil}>
            <Text style={styles.perfilTexto}>P</Text>
          </View>
        </View>

        {/* PROGRESO FIJO */}
        <View style={styles.progresoInformacion}>
          <Text style={styles.numeroSeccion}>
            {numeroSeccion + 1} de{" "}
            {seccionesEntrevista.length}
          </Text>

          <Text style={styles.porcentajeTexto}>
            {porcentaje}% completado
          </Text>
        </View>

        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraProgreso,
              {
                width: `${porcentaje}%`,
              },
            ]}
          />
        </View>

        {/* DOS PREGUNTAS */}
        <View style={styles.areaPreguntas}>
          {preguntasVisibles.map(
            (pregunta, indiceLocal) => {
              const indiceReal =
                indiceInicial + indiceLocal;

              const clave = `${numeroSeccion}-${indiceReal}`;

              const respuestaActual =
                respuestas[clave];

              return (
                <View
                  key={clave}
                  style={styles.tarjetaPregunta}
                >
                  {/* Número de la pregunta */}
                  <View style={styles.numeroCirculo}>
                    <Text style={styles.numeroTexto}>
                      {indiceReal + 1}.
                    </Text>
                  </View>

                  {/* Texto y avatar */}
                  <View style={styles.parteSuperior}>
                    <View style={styles.textosPregunta}>
                      <Text style={styles.pregunta}>
                        {pregunta}
                      </Text>

                      <Text style={styles.descripcion}>
                        Seleccione la opción que describa
                        mejor el comportamiento de su
                        hijo/a.
                      </Text>
                    </View>

                    {/*
                      ESPACIO PARA EL AVATAR.

                      Cuando tengas la imagen, reemplaza:

                      <View style={styles.avatarEspacio}>...</View>

                      por:

                      <Image
                        source={require("../../assets/avatars/avatar-feliz.png")}
                        style={styles.avatarImagen}
                        resizeMode="contain"
                      />

                      Después podremos colocar un avatar
                      diferente en cada pregunta.
                    */}

                    <View style={styles.avatarEspacio}>
                      <Text style={styles.avatarMarcador}>
                        AVATAR
                      </Text>
                    </View>
                  </View>

                  {/* Opciones */}
                  <View style={styles.opciones}>
                    {opciones.map((opcion) => {
                      const seleccionada =
                        respuestaActual === opcion.texto;

                      return (
                        <Pressable
                          key={opcion.texto}
                          onPress={() =>
                            seleccionarRespuesta(
                              indiceReal,
                              opcion.texto
                            )
                          }
                          style={[
                            styles.opcion,
                            opcion.tipo === "verde" &&
                              styles.opcionVerde,
                            opcion.tipo === "azul" &&
                              styles.opcionAzul,
                            opcion.tipo === "amarillo" &&
                              styles.opcionAmarilla,
                            opcion.tipo === "morado" &&
                              styles.opcionMorada,
                            seleccionada &&
                              styles.opcionSeleccionada,
                          ]}
                        >
                          <View
                            style={[
                              styles.emojiCirculo,
                              opcion.tipo === "verde" &&
                                styles.emojiVerde,
                              opcion.tipo === "azul" &&
                                styles.emojiAzul,
                              opcion.tipo === "amarillo" &&
                                styles.emojiAmarillo,
                              opcion.tipo === "morado" &&
                                styles.emojiMorado,
                            ]}
                          >
                            <Text style={styles.emoji}>
                              {opcion.emoji}
                            </Text>
                          </View>

                          <Text
                            style={[
                              styles.textoOpcion,
                              seleccionada &&
                                styles.textoSeleccionado,
                            ]}
                          >
                            {opcion.texto}
                          </Text>

                          {seleccionada && (
                            <Text style={styles.check}>
                              ✓
                            </Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            }
          )}
        </View>

        {/* BOTÓN FIJO */}
        <View style={styles.zonaBoton}>
          <Pressable
            onPress={continuar}
            style={[
              styles.botonContinuar,
              !paginaCompleta &&
                styles.botonDesactivado,
            ]}
          >
            <Text style={styles.textoBoton}>
              {esUltimaPagina && esUltimaSeccion
                ? "Finalizar entrevista"
                : "Continuar"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  contenido: {
    flex: 1,
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 10,
  },

  encabezado: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
  },

  botonRegresar: {
    width: 34,
    height: 38,
    justifyContent: "center",
  },

  flecha: {
    fontSize: 33,
    color: "#87909F",
    lineHeight: 35,
  },

  logoEspacio: {
    flex: 1,
    height: 34,
    justifyContent: "center",
  },

  logoMarcador: {
    fontSize: 12,
    color: "#8992A2",
    fontWeight: "600",
  },

  logoImagen: {
    width: 80,
    height: 35,
  },

  perfil: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E0E2E6",
    alignItems: "center",
    justifyContent: "center",
  },

  perfilTexto: {
    color: "#737C8B",
    fontWeight: "600",
  },

  progresoInformacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  numeroSeccion: {
    fontSize: 10,
    color: "#4A5364",
  },

  porcentajeTexto: {
    fontSize: 10,
    color: "#649BF7",
  },

  barraFondo: {
    height: 4,
    backgroundColor: "#E1E5EB",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 7,
    marginBottom: 8,
  },

  barraProgreso: {
    height: "100%",
    backgroundColor: "#7DA8F8",
    borderRadius: 5,
  },

  areaPreguntas: {
    flex: 1,
    justifyContent: "space-between",
  },

  tarjetaPregunta: {
    flex: 1,
    maxHeight: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EDF0F2",
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 12,
    marginVertical: 4,

    shadowColor: "#88919F",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.13,
    shadowRadius: 6,

    elevation: 3,
  },

  numeroCirculo: {
    position: "absolute",
    top: 12,
    left: 14,
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  numeroTexto: {
    color: "#30394D",
    fontSize: 16,
    fontWeight: "700",
  },

  parteSuperior: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 44,
  },

  textosPregunta: {
    flex: 1,
    paddingRight: 5,
  },

  pregunta: {
    fontSize: 15,
    lineHeight: 21,
    color: "#273448",
    fontWeight: "700",
  },

  descripcion: {
    fontSize: 9,
    lineHeight: 12,
    color: "#788296",
    marginTop: 7,
  },

  avatarEspacio: {
    width: 83,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CED4DD",
  },

  avatarMarcador: {
    fontSize: 9,
    color: "#98A0AC",
  },

  avatarImagen: {
    width: 83,
    height: 95,
  },

  opciones: {
    gap: 6,
    marginTop: 6,
  },

  opcion: {
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
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

  opcionSeleccionada: {
    borderWidth: 2,
    borderColor: "#7B9FE8",
  },

  emojiCirculo: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
    fontSize: 15,
  },

  textoOpcion: {
    flex: 1,
    fontSize: 11,
    color: "#354156",
  },

  textoSeleccionado: {
    fontWeight: "700",
    color: "#355FAD",
  },

  check: {
    fontSize: 15,
    color: "#5D8BDD",
    fontWeight: "700",
  },

  zonaBoton: {
    paddingTop: 8,
  },

  botonContinuar: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: "#6697EB",
    alignItems: "center",
    justifyContent: "center",
  },

  botonDesactivado: {
    backgroundColor: "#BCC5D1",
  },

  textoBoton: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});