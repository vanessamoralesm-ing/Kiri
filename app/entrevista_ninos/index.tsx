import { useState } from "react";

import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { seccionesEntrevista } from "./preguntas";

// Respuestas que aparecerán en cada pregunta
const opciones = ["Nunca", "A veces", "Frecuentemente", "Siempre"];

// Cantidad de preguntas que se mostrarán en cada pantalla
const PREGUNTAS_POR_PANTALLA = 1;

export default function EntrevistaNinos() {

  const [numeroSeccion, setNumeroSeccion] = useState(0);

  // Página actual dentro de cada sección
  const [paginaActual, setPaginaActual] = useState(0);

  // Aquí se guardarán las respuestas
  const [respuestas, setRespuestas] = useState<{
    [clave: string]: string;
  }>({});

  // Obtenemos la sección actual
  const seccionActual = seccionesEntrevista[numeroSeccion];

  // Índice donde comienza la página actual
  const indiceInicial =
    paginaActual * PREGUNTAS_POR_PANTALLA;

  // Índice donde termina la página actual
  const indiceFinal =
    indiceInicial + PREGUNTAS_POR_PANTALLA;

  // Solo toma dos preguntas de la sección
  const preguntasVisibles =
    seccionActual.preguntas.slice(
      indiceInicial,
      indiceFinal
    );

  // Calcula cuántas páginas tiene la sección
  const totalPaginas = Math.ceil(
    seccionActual.preguntas.length /
      PREGUNTAS_POR_PANTALLA
  );

  // Revisa si estamos en la última página
  const esUltimaPagina =
    paginaActual === totalPaginas - 1;

  // Revisa si estamos en la última sección
  const esUltimaSeccion =
    numeroSeccion ===
    seccionesEntrevista.length - 1;

  // Guarda una respuesta
  function seleccionarRespuesta(
    indicePregunta: number,
    opcion: string
  ) {
    const clave = `${numeroSeccion}-${indicePregunta}`;

    setRespuestas({
      ...respuestas,
      [clave]: opcion,
    });
  }

  // Revisa si las dos preguntas visibles ya fueron respondidas
  const preguntasVisiblesCompletas =
    preguntasVisibles.every(
      (pregunta, indiceLocal) => {
        const indiceReal =
          indiceInicial + indiceLocal;

        const clave = `${numeroSeccion}-${indiceReal}`;

        return respuestas[clave] !== undefined;
      }
    );

  // Cuenta todas las preguntas del cuestionario
  const totalPreguntas = seccionesEntrevista.reduce(
    (total, seccion) =>
      total + seccion.preguntas.length,
    0
  );

  // Cuenta las respuestas guardadas
  const totalRespondidas =
    Object.keys(respuestas).length;

  // Porcentaje general de la entrevista
  const porcentaje = Math.round(
    (totalRespondidas / totalPreguntas) * 100
  );

  function continuar() {
    if (!preguntasVisiblesCompletas) {
      Alert.alert(
        "Faltan respuestas",
        "Debe responder las preguntas mostradas antes de continuar."
      );

      return;
    }

    // Si quedan más páginas en la misma sección
    if (!esUltimaPagina) {
      setPaginaActual(paginaActual + 1);
      return;
    }

    // Si termina la sección, pasa a la siguiente
    if (!esUltimaSeccion) {
      setNumeroSeccion(numeroSeccion + 1);
      setPaginaActual(0);
      return;
    }

    // Si terminó todas las secciones
    Alert.alert(
      "Entrevista completada",
      "Todas las preguntas fueron respondidas."
    );

    console.log("Respuestas:", respuestas);
  }

  function regresar() {
    // Regresa a la página anterior de la misma sección
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
      return;
    }

    // Regresa a la sección anterior
    if (numeroSeccion > 0) {
      const seccionAnterior =
        seccionesEntrevista[numeroSeccion - 1];

      const paginasSeccionAnterior = Math.ceil(
        seccionAnterior.preguntas.length /
          PREGUNTAS_POR_PANTALLA
      );

      setNumeroSeccion(numeroSeccion - 1);
      setPaginaActual(paginasSeccionAnterior - 1);

      return;
    }

    // Sale de la entrevista
    router.back();
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        {/* ENCABEZADO FIJO */}
        <View style={styles.encabezado}>
          <Pressable
            style={styles.botonRegresar}
            onPress={regresar}
          >
            <Text style={styles.flecha}>‹</Text>
          </Pressable>

          <View style={styles.logoContenedor}>
            <Text style={styles.corazon}>♡</Text>
            <Text style={styles.logoTexto}>kiri</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>P</Text>
          </View>
        </View>

        {/* PROGRESO FIJO */}
        <View style={styles.progresoInformacion}>
          <Text style={styles.numeroSeccion}>
            {numeroSeccion + 1} de{" "}
            {seccionesEntrevista.length}
          </Text>

          <Text style={styles.porcentaje}>
            {porcentaje}% completado
          </Text>
        </View>

        {/* BARRA FIJA */}
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

        <Text style={styles.tituloSeccion}>
          {seccionActual.titulo}
        </Text>

        <Text style={styles.numeroPagina}>
          Preguntas {indiceInicial + 1} a{" "}
          {Math.min(
            indiceFinal,
            seccionActual.preguntas.length
          )}{" "}
          de {seccionActual.preguntas.length}
        </Text>

        {/* SOLO SE MUEVE ESTA PARTE */}
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
                  style={styles.bloquePregunta}
                >
                  <Text style={styles.pregunta}>
                    {indiceReal + 1}. {pregunta}
                  </Text>

                  <Text style={styles.descripcion}>
                    Seleccione una respuesta.
                  </Text>

                  <View style={styles.opciones}>
                    {opciones.map((opcion) => {
                      const seleccionada =
                        respuestaActual === opcion;

                      return (
                        <Pressable
                          key={opcion}
                          onPress={() =>
                            seleccionarRespuesta(
                              indiceReal,
                              opcion
                            )
                          }
                          style={[
                            styles.opcion,
                            seleccionada &&
                              styles.opcionSeleccionada,
                          ]}
                        >
                          <Text
                            style={[
                              styles.textoOpcion,
                              seleccionada &&
                                styles.textoSeleccionado,
                            ]}
                          >
                            {opcion}
                          </Text>

                          {seleccionada && (
                            <View style={styles.check}>
                              <Text
                                style={styles.checkTexto}
                              >
                                ✓
                              </Text>
                            </View>
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

        {/* BOTÓN FIJO ABAJO */}
        <View style={styles.zonaBoton}>
          <Pressable
            onPress={continuar}
            style={[
              styles.botonContinuar,
              !preguntasVisiblesCompletas &&
                styles.botonDesactivado,
            ]}
          >
            <Text style={styles.textoBoton}>
              {esUltimaPagina && esUltimaSeccion
                ? "Finalizar entrevista"
                : "Continuar"}
            </Text>
          </Pressable>

          {!preguntasVisiblesCompletas && (
            <Text style={styles.mensaje}>
              Responda las preguntas para continuar.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F8FAFD",
  },

  contenido: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },

  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
  },

  botonRegresar: {
    width: 35,
    height: 40,
    justifyContent: "center",
  },

  flecha: {
    fontSize: 36,
    color: "#7D8797",
    lineHeight: 38,
  },

  logoContenedor: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  corazon: {
    fontSize: 27,
    color: "#64C6CB",
    marginRight: 3,
  },

  logoTexto: {
    fontSize: 20,
    fontWeight: "700",
    color: "#31394D",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D8DDE5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#677084",
  },

  progresoInformacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  numeroSeccion: {
    fontSize: 11,
    color: "#4C5568",
  },

  porcentaje: {
    fontSize: 11,
    color: "#4F96FF",
  },

  barraFondo: {
    height: 4,
    backgroundColor: "#E1E6ED",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },

  barraProgreso: {
    height: "100%",
    backgroundColor: "#4F96FF",
    borderRadius: 5,
  },

  tituloSeccion: {
    fontSize: 14,
    color: "#4F96FF",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },

  numeroPagina: {
    fontSize: 10,
    color: "#7A8495",
    textAlign: "center",
    marginTop: 3,
    marginBottom: 6,
  },

  areaPreguntas: {
    flex: 1,
    justifyContent: "space-evenly",
  },

  bloquePregunta: {
    marginVertical: 3,
  },

  pregunta: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#31394D",
    textAlign: "center",
    paddingHorizontal: 4,
  },

  descripcion: {
    fontSize: 10,
    color: "#5C6473",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 7,
  },

  opciones: {
    gap: 5,
  },

  opcion: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: "#687386",
    borderRadius: 8,
    backgroundColor: "#FAFBFD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
  },

  opcionSeleccionada: {
    borderWidth: 2,
    borderColor: "#4F96FF",
    backgroundColor: "#EAF3FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoOpcion: {
    fontSize: 11,
    color: "#40495C",
  },

  textoSeleccionado: {
    color: "#2876D2",
    fontWeight: "600",
  },

  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4F96FF",
    alignItems: "center",
    justifyContent: "center",
  },

  checkTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },

  zonaBoton: {
    minHeight: 70,
    justifyContent: "flex-end",
  },

  botonContinuar: {
    minHeight: 46,
    backgroundColor: "#4F96FF",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  botonDesactivado: {
    backgroundColor: "#B8C0CC",
  },

  textoBoton: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  mensaje: {
    fontSize: 10,
    color: "#737B89",
    textAlign: "center",
    marginTop: 4,
  },
});