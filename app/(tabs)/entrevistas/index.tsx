import {
  crearEntrevista,
} from "@/services/entrevista/entrevistaService";

import {
  EntrevistaHistorial,
  obtenerHistorialEntrevistas,
} from "@/services/entrevista/historialEntrevistaService";

import {
  styles,
} from "@/styles/entrevistas.styles";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";


// ==========================================================
// FECHA
// ==========================================================

const formatoFecha =
  new Intl.DateTimeFormat(
    "es-NI",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );


function formatearFecha(
  fecha: string | null
) {

  return fecha

    ? formatoFecha.format(
        new Date(fecha)
      )

    : "Sin fecha";

}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function MisEntrevistasScreen() {

  const router =
    useRouter();


  const {
    width,
  } =
    useWindowDimensions();


  const movil =
    width < 600;


  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );


  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );


  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  const textColor =
    useThemeColor(
      {},
      "text"
    );


  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary"
    );


  const textMutedColor =
    useThemeColor(
      {},
      "textMuted"
    );


  const iconColor =
    useThemeColor(
      {},
      "icon"
    );


  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );


  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft"
    );


  const secondaryColor =
    useThemeColor(
      {},
      "secondary"
    );


  const secondarySoftColor =
    useThemeColor(
      {},
      "secondarySoft"
    );


  // ========================================================
  // ESTADOS
  // ========================================================

  const [
    entrevistas,
    setEntrevistas,
  ] =
    useState<
      EntrevistaHistorial[]
    >([]);


  const [
    cargando,
    setCargando,
  ] =
    useState(
      true
    );


  const [
    creando,
    setCreando,
  ] =
    useState(
      false
    );


  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);


  // ========================================================
  // CARGAR HISTORIAL
  // ========================================================

  useFocusEffect(
    useCallback(
      () => {

        let activo =
          true;


        async function cargar() {

          try {

            setCargando(
              true
            );


            setError(
              null
            );


            const data =
              await obtenerHistorialEntrevistas();


            if (
              activo
            ) {

              setEntrevistas(
                data
              );

            }


          } catch (error) {

            console.error(
              "Error cargando historial:",
              error
            );


            if (
              activo
            ) {

              setError(
                "No pudimos cargar tus entrevistas."
              );

            }


          } finally {

            if (
              activo
            ) {

              setCargando(
                false
              );

            }

          }

        }


        cargar();


        return () => {

          activo =
            false;

        };

      },
      []
    )
  );


  // ========================================================
  // NUEVA ENTREVISTA
  // ========================================================

  async function nuevaEntrevista() {

    if (
      creando
    ) {
      return;
    }


    try {

      setCreando(
        true
      );


      setError(
        null
      );


      const entrevista =
        await crearEntrevista();


      router.push(
        `/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales` as any
      );


    } catch (error) {

      console.error(
        "Error creando entrevista:",
        error
      );


      setError(
        error instanceof Error

          ? error.message

          : "No pudimos iniciar una nueva entrevista."
      );


    } finally {

      setCreando(
        false
      );

    }

  }


  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const verResultado =
    (
      id: string
    ) =>
      router.push(
        `/(tabs)/entrevistas/${id}/resultado` as any
      );


  const verPlan =
    (
      id: string
    ) =>
      router.push(
        `/(tabs)/entrevistas/${id}/plan` as any
      );


  // ========================================================
  // DATOS
  // ========================================================

  const ultima =
    entrevistas[0];


  const anteriores =
    entrevistas.slice(
      1
    );


  // ========================================================
  // UI
  // ========================================================

  return (

    <SafeAreaView
      edges={[
        "top",
      ]}

      style={[
        styles.pantalla,

        {
          backgroundColor,
        },
      ]}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={[
          styles.scroll,

          movil &&
            styles.scrollMovil,
        ]}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={
            styles.header
          }
        >

          <TouchableOpacity
            activeOpacity={
              0.7
            }

            onPress={() =>
              router.replace(
                "/(tabs)/home"
              )
            }

            style={
              styles.volver
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={
                iconColor
              }
            />

          </TouchableOpacity>


          <View
            style={
              styles.headerInfo
            }
          >

            <Text
              style={[
                styles.titulo,

                {
                  color:
                    textColor,
                },
              ]}
            >
              Entrevista de bienestar
            </Text>


            <Text
              style={[
                styles.subtitulo,

                {
                  color:
                    textSecondaryColor,
                },
              ]}
            >
              Consulta tus evaluaciones anteriores o realiza una nueva.
            </Text>

          </View>

        </View>


        {/* =================================================
            NUEVA ENTREVISTA
        ================================================= */}

        <TouchableOpacity
          activeOpacity={
            0.82
          }

          disabled={
            creando
          }

          onPress={
            nuevaEntrevista
          }

          style={[
            styles.nuevaCard,

            movil &&
              styles.nuevaCardMovil,

            creando &&
              styles.deshabilitado,

            {
              backgroundColor:
                primaryColor,

              borderColor:
                primaryColor,
            },
          ]}
        >

          <View
            style={[
              styles.nuevaIcono,

              {
                backgroundColor:
                  surfaceColor,
              },
            ]}
          >

            {
              creando

                ? (

                  <ActivityIndicator
                    size="small"
                    color={
                      primaryColor
                    }
                  />

                )

                : (

                  <Ionicons
                    name="add"
                    size={26}
                    color={
                      primaryColor
                    }
                  />

                )
            }

          </View>


          <View
            style={
              styles.nuevaInfo
            }
          >

            <Text
              style={[
                styles.nuevaTitulo,

                {
                  color:
                    "#FFFFFF",
                },
              ]}
            >
              {
                creando

                  ? "Preparando evaluación..."

                  : "Nueva evaluación"
              }
            </Text>


            <Text
              numberOfLines={
                2
              }

              style={[
                styles.nuevaTexto,

                {
                  color:
                    "#EAF2FF",
                },
              ]}
            >
              {
                creando

                  ? "Estamos preparando una nueva entrevista."

                  : "Cuéntanos cómo te sientes actualmente."
              }
            </Text>

          </View>


          {
            !creando && (

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#FFFFFF"
              />

            )
          }

        </TouchableOpacity>


        {/* =================================================
            ESTADOS
        ================================================= */}

        {
          cargando

            ? (

              <View
                style={
                  styles.centro
                }
              >

                <ActivityIndicator
                  color={
                    primaryColor
                  }
                />


                <Text
                  style={[
                    styles.centroTexto,

                    {
                      color:
                        textSecondaryColor,
                    },
                  ]}
                >
                  Cargando tus entrevistas...
                </Text>

              </View>

            )

            : error

              ? (

                <EstadoVacio
                  movil={
                    movil
                  }

                  icono="alert-circle-outline"

                  titulo="No pudimos cargar tus entrevistas"

                  texto={
                    error
                  }
                />

              )

              : !entrevistas.length

                ? (

                  <EstadoVacio
                    movil={
                      movil
                    }

                    icono="heart-outline"

                    titulo="Aún no tienes evaluaciones"

                    texto="Realiza tu primera entrevista para comenzar a conocer mejor tu bienestar."
                  >

                    <TouchableOpacity
                      activeOpacity={
                        0.8
                      }

                      disabled={
                        creando
                      }

                      onPress={
                        nuevaEntrevista
                      }

                      style={[
                        styles.botonPrincipal,

                        {
                          backgroundColor:
                            primaryColor,
                        },
                      ]}
                    >

                      {
                        creando && (

                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                          />

                        )
                      }


                      <Text
                        style={[
                          styles.botonPrincipalTexto,

                          {
                            color:
                              "#FFFFFF",
                          },
                        ]}
                      >
                        {
                          creando

                            ? "Preparando..."

                            : "Realizar mi primera entrevista"
                        }
                      </Text>

                    </TouchableOpacity>

                  </EstadoVacio>

                )

                : (

                  <>

                    {/* =====================================
                        ÚLTIMA EVALUACIÓN
                    ===================================== */}

                    <Text
                      style={[
                        styles.seccionTitulo,

                        {
                          color:
                            textColor,
                        },
                      ]}
                    >
                      Última evaluación
                    </Text>


                    <View
                      style={[
                        styles.ultimaCard,

                        movil &&
                          styles.ultimaCardMovil,

                        {
                          backgroundColor:
                            surfaceColor,

                          borderColor,
                        },
                      ]}
                    >

                      {/* Fecha */}

                      <View
                        style={
                          styles.fechaFila
                        }
                      >

                        <View
                          style={[
                            styles.fechaIcono,

                            {
                              backgroundColor:
                                primarySoftColor,
                            },
                          ]}
                        >

                          <Ionicons
                            name="calendar-outline"
                            size={21}
                            color={
                              primaryColor
                            }
                          />

                        </View>


                        <View
                          style={
                            styles.fechaInfo
                          }
                        >

                          <Text
                            style={[
                              styles.fechaLabel,

                              {
                                color:
                                  textMutedColor,
                              },
                            ]}
                          >
                            Realizada el
                          </Text>


                          <Text
                            style={[
                              styles.fecha,

                              {
                                color:
                                  textColor,
                              },
                            ]}
                          >
                            {
                              formatearFecha(
                                ultima.fecha_fin
                              )
                            }
                          </Text>

                        </View>


                        <View
                          style={[
                            styles.completada,

                            {
                              backgroundColor:
                                secondarySoftColor,
                            },
                          ]}
                        >

                          <Text
                            style={[
                              styles.completadaTexto,

                              {
                                color:
                                  secondaryColor,
                              },
                            ]}
                          >
                            Completada
                          </Text>

                        </View>

                      </View>


                      {/* Área prioritaria */}

                      {
                        !!ultima
                          .areas_prioritarias
                          .length && (

                          <View
                            style={[
                              styles.area,

                              {
                                backgroundColor:
                                  surfaceSecondaryColor,

                                borderColor,
                              },
                            ]}
                          >

                            <Text
                              style={[
                                styles.areaLabel,

                                {
                                  color:
                                    textMutedColor,
                                },
                              ]}
                            >
                              Enfoque principal
                            </Text>


                            <View
                              style={
                                styles.areaFila
                              }
                            >

                              <Text
                                style={[
                                  styles.areaNombre,

                                  {
                                    color:
                                      textColor,
                                  },
                                ]}
                              >
                                {
                                  ultima
                                    .areas_prioritarias
                                    .join(
                                      " y "
                                    )
                                }
                              </Text>


                              {
                                ultima.porcentaje !==
                                  null && (

                                  <Text
                                    style={[
                                      styles.porcentaje,

                                      {
                                        color:
                                          primaryColor,
                                      },
                                    ]}
                                  >
                                    {
                                      Math.round(
                                        ultima.porcentaje
                                      )
                                    }
                                    %
                                  </Text>

                                )
                              }

                            </View>

                          </View>

                        )
                      }


                      {/* Acciones */}

                      <View
                        style={[
                          styles.acciones,

                          movil &&
                            styles.accionesMovil,
                        ]}
                      >

                        <BotonAccion
                          icono="analytics-outline"
                          texto="Ver resultados"

                          onPress={() =>
                            verResultado(
                              ultima.id_entrevista
                            )
                          }
                        />


                        {
                          ultima.tiene_plan && (

                            <BotonAccion
                              icono="clipboard-outline"
                              texto="Ver plan"

                              onPress={() =>
                                verPlan(
                                  ultima.id_entrevista
                                )
                              }
                            />

                          )
                        }

                      </View>

                    </View>


                    {/* =====================================
                        HISTORIAL
                    ===================================== */}

                    {
                      !!anteriores.length && (

                        <>

                          <Text
                            style={[
                              styles.seccionTitulo,
                              styles.historialTitulo,

                              {
                                color:
                                  textColor,
                              },
                            ]}
                          >
                            Historial
                          </Text>


                          <View
                            style={
                              styles.lista
                            }
                          >

                            {
                              anteriores.map(
                                entrevista => (

                                  <TouchableOpacity
                                    key={
                                      entrevista.id_entrevista
                                    }

                                    activeOpacity={
                                      0.75
                                    }

                                    onPress={() =>
                                      verResultado(
                                        entrevista.id_entrevista
                                      )
                                    }

                                    style={[
                                      styles.historialCard,

                                      movil &&
                                        styles.historialCardMovil,

                                      {
                                        backgroundColor:
                                          surfaceColor,

                                        borderColor,
                                      },
                                    ]}
                                  >

                                    <View
                                      style={[
                                        styles.historialIcono,

                                        {
                                          backgroundColor:
                                            primarySoftColor,
                                        },
                                      ]}
                                    >

                                      <Ionicons
                                        name="heart-outline"
                                        size={20}
                                        color={
                                          primaryColor
                                        }
                                      />

                                    </View>


                                    <View
                                      style={
                                        styles.historialInfo
                                      }
                                    >

                                      <Text
                                        style={[
                                          styles.historialFecha,

                                          {
                                            color:
                                              textColor,
                                          },
                                        ]}
                                      >
                                        {
                                          formatearFecha(
                                            entrevista.fecha_fin
                                          )
                                        }
                                      </Text>


                                      {
                                        !!entrevista
                                          .areas_prioritarias
                                          .length && (

                                          <Text
                                            numberOfLines={
                                              2
                                            }

                                            style={[
                                              styles.historialArea,

                                              {
                                                color:
                                                  textSecondaryColor,
                                              },
                                            ]}
                                          >
                                            {
                                              entrevista
                                                .areas_prioritarias
                                                .join(
                                                  " y "
                                                )
                                            }
                                          </Text>

                                        )
                                      }

                                    </View>


                                    <View
                                      style={
                                        styles.historialDerecha
                                      }
                                    >

                                      {
                                        entrevista.porcentaje !==
                                          null && (

                                          <Text
                                            style={[
                                              styles.historialPorcentaje,

                                              {
                                                color:
                                                  primaryColor,
                                              },
                                            ]}
                                          >
                                            {
                                              Math.round(
                                                entrevista.porcentaje
                                              )
                                            }
                                            %
                                          </Text>

                                        )
                                      }


                                      <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={
                                          primaryColor
                                        }
                                      />

                                    </View>

                                  </TouchableOpacity>

                                )
                              )
                            }

                          </View>

                        </>

                      )
                    }

                  </>

                )
        }

      </ScrollView>

    </SafeAreaView>

  );

}


// ==========================================================
// ESTADO VACÍO
// ==========================================================

function EstadoVacio({
  movil,
  icono,
  titulo,
  texto,
  children,
}: {
  movil: boolean;

  icono:
    keyof typeof Ionicons.glyphMap;

  titulo:
    string;

  texto:
    string;

  children?:
    React.ReactNode;
}) {

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );


  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft"
    );


  const textColor =
    useThemeColor(
      {},
      "text"
    );


  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary"
    );


  return (

    <View
      style={[
        styles.vacio,

        movil &&
          styles.vacioMovil,

        {
          backgroundColor:
            surfaceColor,

          borderColor,
        },
      ]}
    >

      <View
        style={[
          styles.vacioIcono,

          {
            backgroundColor:
              primarySoftColor,
          },
        ]}
      >

        <Ionicons
          name={
            icono
          }

          size={29}

          color={
            primaryColor
          }
        />

      </View>


      <Text
        style={[
          styles.vacioTitulo,

          {
            color:
              textColor,
          },
        ]}
      >
        {titulo}
      </Text>


      <Text
        style={[
          styles.vacioTexto,

          {
            color:
              textSecondaryColor,
          },
        ]}
      >
        {texto}
      </Text>


      {children}

    </View>

  );

}


// ==========================================================
// BOTÓN DE ACCIÓN
// ==========================================================

function BotonAccion({
  icono,
  texto,
  onPress,
}: {
  icono:
    keyof typeof Ionicons.glyphMap;

  texto:
    string;

  onPress:
    () => void;
}) {

  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );


  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  return (

    <TouchableOpacity
      activeOpacity={
        0.7
      }

      onPress={
        onPress
      }

      style={[
        styles.accion,

        {
          backgroundColor:
            primarySoftColor,

          borderColor,
        },
      ]}
    >

      <Ionicons
        name={
          icono
        }

        size={18}

        color={
          primaryColor
        }
      />


      <Text
        style={[
          styles.accionTexto,

          {
            color:
              primaryColor,
          },
        ]}
      >
        {texto}
      </Text>

    </TouchableOpacity>

  );

}